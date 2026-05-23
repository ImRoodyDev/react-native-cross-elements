import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { CustomButton } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropControls } from '../../../components/PropControls';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { CustomButton } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { CustomButton } from 'react-native-cross-elements';
import { View, Text } from 'react-native';

export default function Example() {
  return (
    <CustomButton
      onPress={() => console.log('pressed')}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
      pressedBackgroundColor="#3f3f46"
      textColor="#a1a1aa"
      focusedTextColor="#ffffff"
      style={{ paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 }}
    >
      {({ currentTextColor }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: currentTextColor, fontSize: 18 }}>🎨</Text>
          <Text style={{ color: currentTextColor, fontWeight: '600' }}>Custom Content</Text>
        </View>
      )}
    </CustomButton>
  );
}`;

const ASYNC_EXAMPLE = `<CustomButton
  onPress={async () => {
    await uploadFile();
  }}
  showIndicator
  backgroundColor="#1d4ed8"
  selectedBackgroundColor="#1e40af"
  pressedBackgroundColor="#1e3a8a"
  textColor="#dbeafe"
  focusedTextColor="#ffffff"
  style={{ paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 }}
>
  {({ currentTextColor }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ color: currentTextColor }}>Upload</Text>
      <Text style={{ color: currentTextColor }}>⬆️</Text>
    </View>
  )}
</CustomButton>`;

const PROPS: PropRow[] = [
	{
		name: 'children',
		type: '(state: { currentTextColor, isFocused }) => ReactNode',
		required: true,
		description: 'Render-prop for button content.',
	},
	{ name: 'onPress', type: '(event) => any', description: 'Called on tap. Async onPress triggers loading state.' },
	{
		name: 'showIndicator',
		type: 'boolean',
		default: 'false',
		description: 'Show loading spinner while async onPress is pending.',
	},
	{ name: 'backgroundColor', type: 'ColorValue', default: "'white'", description: 'Default background.' },
	{
		name: 'selectedBackgroundColor',
		type: 'ColorValue',
		default: "'white'",
		description: 'Background when focused or hovered.',
	},
	{ name: 'pressedBackgroundColor', type: 'ColorValue', default: "'white'", description: 'Background when pressed.' },
	{
		name: 'textColor',
		type: 'ColorValue',
		default: "'black'",
		description: 'Color passed to children when not focused.',
	},
	{
		name: 'focusedTextColor',
		type: 'ColorValue',
		default: "'black'",
		description: 'Color passed to children when focused.',
	},
	{ name: 'style', type: 'PressableStyle', description: 'Style or callback with pressed/focused/hovered.' },
	{ name: 'enableRipple', type: 'boolean', default: 'false', description: 'Enable ripple feedback.' },
	{ name: 'pressedScale', type: 'number', description: 'Scale on press.' },
	{ name: 'animationConfig', type: 'AnimationConfig', description: 'Reanimated timing config.' },
];

function CustomButtonSection() {
	const [showIndicator, setShowIndicator] = useState(false);
	const [enableRipple, setEnableRipple] = useState(true);
	const [action, setAction] = useState('Waiting for a press');

	return (
		<View>
			<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="custom-button.tsx">
				<View style={{ gap: 12, alignItems: 'center' }}>
					<CustomButton
						onPress={() => setAction('Custom content pressed')}
						showIndicator={showIndicator}
						backgroundColor="#27272a"
						selectedBackgroundColor="#3f3f46"
						pressedBackgroundColor="#52525b"
						textColor="#a1a1aa"
						focusedTextColor="#ffffff"
						enableRipple={enableRipple}
						rippleColor="rgba(255,255,255,0.1)"
						pressedScale={0.97}
						style={{
							paddingHorizontal: 20,
							paddingVertical: 14,
							borderRadius: 12,
							borderWidth: 1,
							borderColor: '#3f3f46',
						}}
					>
						{({ currentTextColor }) => (
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
								<Text style={{ fontSize: 18 }}>🎨</Text>
								<Text style={{ color: currentTextColor, fontWeight: '600' }}>Custom Content</Text>
							</View>
						)}
					</CustomButton>
					<CustomButton
						onPress={async () => {
							if (showIndicator) await new Promise((r) => setTimeout(r, 1200));
							setAction('Upload pressed');
						}}
						showIndicator={showIndicator}
						backgroundColor="#1d4ed8"
						selectedBackgroundColor="#1e40af"
						pressedBackgroundColor="#1e3a8a"
						textColor="#dbeafe"
						focusedTextColor="#ffffff"
						enableRipple={enableRipple}
						rippleColor="rgba(255,255,255,0.15)"
						style={{ paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 }}
					>
						{({ currentTextColor }) => (
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
								<Text style={{ color: currentTextColor }}>Upload</Text>
								<Text style={{ color: currentTextColor }}>⬆️</Text>
							</View>
						)}
					</CustomButton>
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

export default function CustomButtonPage() {
	return (
		<DocPage
			title="CustomButton"
			description="A fully custom-content button. Provide any layout as children via a render-prop and receive the current color and focus state. Supports async loading and all BaseButton features."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: <CustomButtonSection />,
				},
				{
					title: 'With async loading',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								When <Text className="text-amber-300 font-mono">onPress</Text> is async and{' '}
								<Text className="text-amber-300 font-mono">showIndicator</Text> is{' '}
								<Text className="text-amber-300 font-mono">true</Text>, the children are replaced with a spinner while
								the promise resolves.
							</Text>
							<CodeBlock code={ASYNC_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Props',
					content: (
						<View className="gap-3">
							<Callout type="info">CustomButton extends BaseButton — all BaseButton props are also valid.</Callout>
							<PropsTable props={PROPS} />
						</View>
					),
				},
			]}
		/>
	);
}
