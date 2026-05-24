// BaseButton documentation page
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BaseButton } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable, type PropRow } from '../../../components/PropsTable';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropControls } from '../../../components/PropControls';

const IMPORT_CODE = `import { BaseButton } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { BaseButton } from 'react-native-cross-elements';
import { Text } from 'react-native';

export default function Example() {
  return (
    <BaseButton
      onPress={() => console.log('pressed')}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
      pressedBackgroundColor="#3f3f46"
      textColor="#a1a1aa"
      focusedTextColor="#ffffff"
      style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
    >
      {({ currentTextColor }) => (
        <Text style={{ color: currentTextColor, fontWeight: '600' }}>Click me</Text>
      )}
    </BaseButton>
  );
}`;

const RIPPLE_EXAMPLE = `<BaseButton
  enableRipple
  rippleDuration={350}
  rippleColor="rgba(99,102,241,0.4)"
  pressedScale={0.96}
  animationConfig={{ duration: 180 }}
  backgroundColor="#6366f1"
  selectedBackgroundColor="#4f46e5"
  pressedBackgroundColor="#4338ca"
  textColor="#e0e7ff"
  focusedTextColor="#ffffff"
  style={({ focused, hovered, pressed }) => ([
    {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: focused || hovered ? 2 : 0,
      borderColor: focused ? '#a5b4fc' : 'transparent',
      opacity: pressed ? 0.9 : 1,
    },
  ])}
  onPress={() => console.log('pressed')}
>
  {({ currentTextColor, isFocused }) => (
    <Text style={{ color: currentTextColor, fontWeight: '700' }}>
      {isFocused ? '✦ Focused' : 'BaseButton with Ripple'}
    </Text>
  )}
</BaseButton>`;

const PROPS: PropRow[] = [
	{
		name: 'children',
		type: 'ReactNode | (state) => ReactNode',
		required: true,
		description: 'Content or render-prop with { currentTextColor, isFocused }.',
	},
	{ name: 'onPress', type: '(event) => any', description: 'Called on tap.' },
	{ name: 'backgroundColor', type: 'ColorValue', default: "'white'", description: 'Default background color.' },
	{
		name: 'selectedBackgroundColor',
		type: 'ColorValue',
		default: "'white'",
		description: 'Background when focused or hovered.',
	},
	{ name: 'pressedBackgroundColor', type: 'ColorValue', default: "'white'", description: 'Background when pressed.' },
	{ name: 'textColor', type: 'ColorValue', default: "'black'", description: 'Text color when not focused.' },
	{
		name: 'focusedTextColor',
		type: 'ColorValue',
		default: "'black'",
		description: 'Text color when focused or hovered.',
	},
	{
		name: 'style',
		type: 'PressableStyle',
		description: 'Style object or callback with { pressed, focused, hovered }.',
	},
	{ name: 'pressedScale', type: 'number', description: 'Scale applied when the button is pressed.' },
	{ name: 'animationConfig', type: 'AnimationConfig', description: 'Reanimated timing config for state transitions.' },
	{ name: 'enableRipple', type: 'boolean', default: 'false', description: 'Enable ripple press feedback.' },
	{ name: 'rippleColor', type: 'ColorValue', description: 'Ripple effect color.' },
	{ name: 'centerRipple', type: 'boolean', default: 'false', description: 'Start ripple from button center.' },
	{ name: 'rippleDuration', type: 'number', description: 'Ripple animation duration in ms.' },
	{ name: 'className', type: 'string', description: 'Web CSS class for NativeWind/Tailwind.' },
	{ name: 'orientation', type: "'horizontal' | 'vertical'", description: 'Spatial navigation orientation.' },
];

function BasicUsageDemo() {
	const [enableRipple, setEnableRipple] = useState(true);
	const [pressedScale, setPressedScale] = useState('0.96');
	const [pressCount, setPressCount] = useState(0);

	return (
		<View>
			<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="base-button.tsx">
				<View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
					<BaseButton
						onPress={() => setPressCount((count) => count + 1)}
						backgroundColor="#18181b"
						selectedBackgroundColor="#27272a"
						pressedBackgroundColor="#3f3f46"
						textColor="#a1a1aa"
						focusedTextColor="#ffffff"
						enableRipple={enableRipple}
						rippleColor="rgba(255,255,255,0.15)"
						pressedScale={parseFloat(pressedScale)}
						style={{
							paddingHorizontal: 20,
							paddingVertical: 11,
							borderRadius: 10,
							borderWidth: 1,
							borderColor: '#3f3f46',
						}}
					>
						{({ currentTextColor }) => (
							<Text style={{ color: currentTextColor, fontWeight: '600', fontSize: 14 }}>Click me</Text>
						)}
					</BaseButton>
					<BaseButton
						onPress={() => setPressCount((count) => count + 1)}
						backgroundColor="#6366f1"
						selectedBackgroundColor="#4f46e5"
						pressedBackgroundColor="#4338ca"
						textColor="#e0e7ff"
						focusedTextColor="#ffffff"
						enableRipple={enableRipple}
						rippleColor="rgba(99,102,241,0.5)"
						pressedScale={parseFloat(pressedScale)}
						style={{ paddingHorizontal: 20, paddingVertical: 11, borderRadius: 10 }}
					>
						{({ currentTextColor, isFocused }) => (
							<Text style={{ color: currentTextColor, fontWeight: '700', fontSize: 14 }}>
								{isFocused ? '✦ Focused' : 'Primary'}
							</Text>
						)}
					</BaseButton>
				</View>
				<Text style={{ color: '#52525b', fontSize: 13, marginTop: 14, textAlign: 'center' }}>
					Pressed {pressCount} {pressCount === 1 ? 'time' : 'times'}
				</Text>
			</ComponentPreview>
			<PropControls
				controls={[
					{ type: 'boolean', label: 'enableRipple', value: enableRipple, onChange: setEnableRipple },
					{
						type: 'select',
						label: 'pressedScale',
						value: pressedScale,
						options: ['1', '0.98', '0.96', '0.92'],
						onChange: setPressedScale,
					},
				]}
			/>
		</View>
	);
}

export default function BaseButtonPage() {
	return (
		<DocPage
			title="BaseButton"
			description="The foundational button primitive. Provides full control over layout, animation, ripple, and state via a render-prop children API. All other button components are built on top of BaseButton."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: <BasicUsageDemo />,
				},
				{
					title: 'With ripple & focused state',
					content: (
						<View style={{ gap: 12 }}>
							<Callout type="tip">
								The style prop accepts a function receiving the current pressable state (pressed, focused, hovered) so
								you can apply different styles without any JS state.
							</Callout>
							<ComponentPreview code={RIPPLE_EXAMPLE} language="tsx" label="ripple.tsx">
								<BaseButton
									enableRipple
									rippleDuration={350}
									rippleColor="rgba(99,102,241,0.4)"
									pressedScale={0.96}
									animationConfig={{ duration: 180 }}
									backgroundColor="#6366f1"
									selectedBackgroundColor="#4f46e5"
									pressedBackgroundColor="#4338ca"
									textColor="#e0e7ff"
									focusedTextColor="#ffffff"
									onPress={() => {}}
									style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
								>
									{({ currentTextColor, isFocused }) => (
										<Text style={{ color: currentTextColor, fontWeight: '700', fontSize: 14 }}>
											{isFocused ? '✦ Focused' : 'BaseButton with Ripple'}
										</Text>
									)}
								</BaseButton>
							</ComponentPreview>
						</View>
					),
				},
				{
					title: 'Props',
					content: <PropsTable props={PROPS} />,
				},
				{
					title: 'Accessibility',
					content: (
						<View style={{ gap: 8 }}>
							<Text style={{ color: '#71717a', fontSize: 14, lineHeight: 24 }}>
								BaseButton wraps a React Native{' '}
								<Text style={{ color: '#fcd34d', fontFamily: 'monospace' }}>Pressable</Text> and forwards all standard
								Pressable props. Add{' '}
								<Text style={{ color: '#fcd34d', fontFamily: 'monospace' }}>accessibilityLabel</Text> and{' '}
								<Text style={{ color: '#fcd34d', fontFamily: 'monospace' }}>accessibilityRole="button"</Text> for proper
								screen reader support.
							</Text>
						</View>
					),
				},
			]}
		/>
	);
}
