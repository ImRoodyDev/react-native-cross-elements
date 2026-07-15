import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout, BadPractice, GoodPractice } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const BAD_BUTTON = `// BAD — style, children and onPress are all rebuilt on every render of Screen,
// so memo() on the button can never bail out.
export function Screen() {
  const [count, setCount] = useState(0);

  return (
    <CustomButton
      onPress={() => setCount((c) => c + 1)}
      style={({ focused }) => ({ borderRadius: 12, opacity: focused ? 1 : 0.8 })}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
    >
      {({ currentTextColor }) => <Text style={{ color: currentTextColor }}>Count: {count}</Text>}
    </CustomButton>
  );
}`;

const GOOD_BUTTON = `// GOOD — stable identities. The button re-renders only when it actually needs to.
const BUTTON_STYLE = ({ focused }) => ({ borderRadius: 12, opacity: focused ? 1 : 0.8 });

export function Screen() {
  const [count, setCount] = useState(0);

  const onPress = useCallback(() => setCount((c) => c + 1), []);
  const renderChildren = useCallback(
    ({ currentTextColor }) => <Text style={{ color: currentTextColor }}>Count: {count}</Text>,
    [count],
  );

  return (
    <CustomButton
      onPress={onPress}
      style={BUTTON_STYLE}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
    >
      {renderChildren}
    </CustomButton>
  );
}`;

const BAD_DROPDOWN = `// BAD — a new data array and a new onSelect on every render.
<Dropdown
  data={['English', 'French', 'Spanish']}
  onSelect={(item, index) => setLanguage(item)}
/>`;

const GOOD_DROPDOWN = `// GOOD — hoist static data, memoise the callback.
const LANGUAGES = ['English', 'French', 'Spanish'];

const onSelect = useCallback((item) => setLanguage(item), []);

<Dropdown data={LANGUAGES} onSelect={onSelect} />`;

const RULES: PropRow[] = [
	{
		name: 'children (render prop)',
		type: '(state) => ReactNode',
		description: 'Inline arrow functions are a new reference every render, which defeats memo on the button. useCallback it, keyed on what it reads.',
	},
	{
		name: 'style (function form)',
		type: '(state) => ButtonAllowedStyle',
		description: 'Same problem. Hoist it to module scope when it only depends on the state argument, otherwise useCallback.',
	},
	{
		name: 'data / items',
		type: 'T[]',
		description: 'Array literals are new every render. Hoist static lists to module scope; useMemo derived ones.',
	},
	{
		name: 'onPress / onSelect / onFocus / onBlur',
		type: 'function',
		description: 'Not read through a ref here — an inline arrow changes identity and re-renders the button. useCallback them.',
	},
	{
		name: 'backgroundColor / textColor / … (strings)',
		type: 'ColorValue',
		description: 'Safe to pass inline. String and number props compare by value, so they never break memoisation.',
	},
];

export default function PerformancePage() {
	return (
		<DocPage
			title="Performance"
			description="Bad practices that quietly break memoisation — and what to do instead."
			platforms={['ios', 'android', 'web', 'tv']}
			sections={[
				{
					title: 'Why this matters',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								<Text className="text-amber-300 font-mono">BaseButton</Text> and{' '}
								<Text className="text-amber-300 font-mono">CustomButton</Text> are wrapped in{' '}
								<Text className="text-amber-300 font-mono">memo()</Text>, so a screen re-render should not touch buttons
								that did not change. But memo compares <Text className="text-zinc-200">prop identity, not value</Text> —
								one inline object, array or arrow function defeats it entirely.
							</Text>
							<Text className="text-zinc-400 text-sm leading-6">
								This matters most on TV. Every focus move re-renders two buttons (the one losing focus and the one gaining
								it), and each carries its icon and text subtree with it. With unstable props that turns a single D-pad
								press into dropped frames.
							</Text>
						</View>
					),
				},
				{
					title: 'Buttons: inline props',
					content: (
						<View className="gap-3">
							<BadPractice
								why={
									<>
										Arrow functions and object literals create a new value on every render, so{' '}
										<Text className="text-amber-300 font-mono">memo()</Text> sees three changed props and re-renders the
										button — including its icon and text — every time <Text className="text-zinc-200">count</Text>{' '}
										changes, or anything else in the screen does. Nothing about the button actually changed.
									</>
								}
							>
								<CodeBlock code={BAD_BUTTON} language="tsx" />
							</BadPractice>

							<GoodPractice
								why={
									<>
										<Text className="text-amber-300 font-mono">BUTTON_STYLE</Text> never closes over state, so it lives at
										module scope and is created once. <Text className="text-amber-300 font-mono">onPress</Text> only uses
										the setter, so its dependency list is empty and it stays stable forever. Only{' '}
										<Text className="text-amber-300 font-mono">renderChildren</Text> depends on{' '}
										<Text className="text-zinc-200">count</Text> — so a count change re-renders the label, and nothing else.
									</>
								}
							>
								<CodeBlock code={GOOD_BUTTON} language="tsx" />
							</GoodPractice>
						</View>
					),
				},
				{
					title: 'Dropdown: inline data',
					content: (
						<View className="gap-3">
							<BadPractice
								why={
									<>
										The <Text className="text-amber-300 font-mono">data</Text> array is rebuilt on every render, so the
										Dropdown re-renders its whole list — every row is a button. The list contents never changed; only the
										array&apos;s identity did.
									</>
								}
							>
								<CodeBlock code={BAD_DROPDOWN} language="tsx" />
							</BadPractice>

							<GoodPractice
								why={
									<>
										A static list has no reason to live inside the component. Hoisting it means there is nothing to
										memoise and nothing to get wrong.
									</>
								}
							>
								<CodeBlock code={GOOD_DROPDOWN} language="tsx" />
							</GoodPractice>
						</View>
					),
				},
				{
					title: 'Quick reference',
					content: (
						<View className="gap-3">
							<PropsTable props={RULES} />
							<Callout type="info">
								Rule of thumb: strings and numbers are safe to inline. Objects, arrays, functions and JSX elements are
								not.
							</Callout>
						</View>
					),
				},
				{
					title: 'Profiling',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Measure on a release build — React DevTools attaches to dev builds, where every render is far slower than
								production, so dev timings will point you at problems that do not exist in a shipped app. Use
								@callstack/inspector to attach the profiler to a release build.
							</Text>
							<Callout type="info">
								Open a slow commit in the profiler and check why each component rendered. A button listed as
								&quot;props changed: children&quot; or &quot;props changed: style&quot; is an inline prop from your screen.
							</Callout>
						</View>
					),
				},
			]}
		/>
	);
}
