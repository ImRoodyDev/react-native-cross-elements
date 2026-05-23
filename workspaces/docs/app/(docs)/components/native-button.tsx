import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NativeButton } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropControls } from '../../../components/PropControls';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { NativeButton } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { NativeButton } from 'react-native-cross-elements';

export default function Example() {
  return (
    <NativeButton
      text="Continue"
      onPress={() => console.log('pressed')}
      backgroundColor="#6366f1"
      selectedBackgroundColor="#4f46e5"
      pressedBackgroundColor="#4338ca"
      textColor="#e0e7ff"
      focusedTextColor="#ffffff"
      style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
    />
  );
}`;

const LOADING_EXAMPLE = `// Async onPress automatically shows a loading indicator
<NativeButton
  text="Save changes"
  onPress={async () => {
    await api.save();
  }}
  showIndicator
  backgroundColor="#18181b"
  selectedBackgroundColor="#27272a"
  pressedBackgroundColor="#3f3f46"
  textColor="#a1a1aa"
  focusedTextColor="#ffffff"
  style={{ paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 }}
/>`;

const ICONS_EXAMPLE = `<NativeButton
  text="Open"
  onPress={() => {}}
  leftIconComponent={(color) => (
    <Text style={{ color, marginRight: 8 }}>🔓</Text>
  )}
  rightIconComponent={(color) => (
    <Text style={{ color, marginLeft: 8 }}>→</Text>
  )}
  backgroundColor="#0f766e"
  selectedBackgroundColor="#115e59"
  pressedBackgroundColor="#134e4a"
  textColor="#ccfbf1"
  focusedTextColor="#ffffff"
  style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
/>`;

const PROPS: PropRow[] = [
	{ name: 'text', type: 'string', required: true, description: 'Button label text.' },
	{
		name: 'onPress',
		type: '(event) => any',
		description: 'Called on tap. If async, a loading indicator is shown while pending.',
	},
	{
		name: 'showIndicator',
		type: 'boolean',
		default: 'false',
		description: 'Show loading spinner while async onPress is running.',
	},
	{
		name: 'leftIconComponent',
		type: '(color: ColorValue) => ReactNode',
		description: 'Icon rendered before the text.',
	},
	{
		name: 'rightIconComponent',
		type: '(color: ColorValue) => ReactNode',
		description: 'Icon rendered after the text.',
	},
	{ name: 'backgroundColor', type: 'ColorValue', default: "'white'", description: 'Default background.' },
	{
		name: 'selectedBackgroundColor',
		type: 'ColorValue',
		default: "'white'",
		description: 'Background when focused or hovered.',
	},
	{ name: 'pressedBackgroundColor', type: 'ColorValue', default: "'white'", description: 'Background when pressed.' },
	{ name: 'textColor', type: 'ColorValue', default: "'black'", description: 'Label color when not focused.' },
	{
		name: 'focusedTextColor',
		type: 'ColorValue',
		default: "'black'",
		description: 'Label color when focused or hovered.',
	},
	{ name: 'style', type: 'PressableStyle', description: 'Style or callback with pressed/focused/hovered state.' },
	{ name: 'enableRipple', type: 'boolean', default: 'false', description: 'Enable ripple press feedback.' },
	{ name: 'pressedScale', type: 'number', description: 'Scale on press.' },
	{ name: 'animationConfig', type: 'AnimationConfig', description: 'Reanimated timing config.' },
];

function NativeButtonSection() {
	const [showIndicator, setShowIndicator] = useState(false);
	const [enableRipple, setEnableRipple] = useState(true);
	const [action, setAction] = useState('Waiting for a press');

	return (
		<View>
			<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="native-button.tsx">
				<View style={{ gap: 12, alignItems: 'center' }}>
					<NativeButton
						text="Continue"
						onPress={async () => {
							if (showIndicator) await new Promise((r) => setTimeout(r, 1500));
							setAction('Continue pressed');
						}}
						showIndicator={showIndicator}
						backgroundColor="#6366f1"
						selectedBackgroundColor="#4f46e5"
						pressedBackgroundColor="#4338ca"
						textColor="#e0e7ff"
						focusedTextColor="#ffffff"
						enableRipple={enableRipple}
						rippleColor="rgba(255,255,255,0.2)"
						pressedScale={0.97}
						style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
					/>
					<NativeButton
						text="Open"
						onPress={() => setAction('Open pressed')}
						leftIconComponent={(color) => <Text style={{ color, marginRight: 8 }}>🔓</Text>}
						rightIconComponent={(color) => <Text style={{ color, marginLeft: 8 }}>→</Text>}
						backgroundColor="#0f766e"
						selectedBackgroundColor="#115e59"
						pressedBackgroundColor="#134e4a"
						textColor="#ccfbf1"
						focusedTextColor="#ffffff"
						enableRipple={enableRipple}
						rippleColor="rgba(255,255,255,0.2)"
						style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}
					/>
					<Text style={{ color: '#52525b', fontSize: 13 }}>{action}</Text>
				</View>
			</ComponentPreview>
			<PropControls
				controls={[
					{ type: 'boolean', label: 'showIndicator', value: showIndicator, onChange: setShowIndicator },
					{ type: 'boolean', label: 'enableRipple', value: enableRipple, onChange: setEnableRipple },
				]}
			/>
		</View>
	);
}

export default function NativeButtonPage() {
	return (
		<DocPage
			title="NativeButton"
			description="A text-based button with optional leading/trailing icons and an async loading indicator. Built on BaseButton — supports all BaseButton props."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: <NativeButtonSection />,
				},
				{
					title: 'Async loading',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								When <Text className="text-amber-300 font-mono">onPress</Text> returns a Promise and{' '}
								<Text className="text-amber-300 font-mono">showIndicator</Text> is true, a spinner replaces the text
								while the promise is pending.
							</Text>
							<CodeBlock code={LOADING_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'With icons',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use <Text className="text-amber-300 font-mono">leftIconComponent</Text> and{' '}
								<Text className="text-amber-300 font-mono">rightIconComponent</Text> to render icons that automatically
								receive the current text color.
							</Text>
							<CodeBlock code={ICONS_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Props',
					content: (
						<View className="gap-3">
							<Callout type="info">NativeButton extends BaseButton — all BaseButton props are also accepted.</Callout>
							<PropsTable props={PROPS} />
						</View>
					),
				},
			]}
		/>
	);
}
