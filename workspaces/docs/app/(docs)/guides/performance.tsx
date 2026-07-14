import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
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
					title: 'Bad practice: inline props',
					content: (
						<View className="gap-3">
							<CodeBlock code={BAD_BUTTON} language="tsx" />
							<Callout type="warning">
								Every one of those props is a new value on each render, so the button re-renders whenever anything in the
								screen changes — even something completely unrelated to the button.
							</Callout>
						</View>
					),
				},
				{
					title: 'Good practice: stable identities',
					content: (
						<View className="gap-3">
							<CodeBlock code={GOOD_BUTTON} language="tsx" />
							<Callout type="tip">
								Anything that does not close over component state belongs at module scope, where there is nothing to
								memoise in the first place.
							</Callout>
						</View>
					),
				},
				{
					title: 'The same applies to Dropdown',
					content: (
						<View className="gap-3">
							<CodeBlock code={BAD_DROPDOWN} language="tsx" />
							<CodeBlock code={GOOD_DROPDOWN} language="tsx" />
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
