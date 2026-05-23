import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FlatLabelInput } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import {
  FlatLabelInput,
  type FlatInputProps,
  type InputConfig,
  type LabelInputStyle,
} from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { FlatLabelInput } from 'react-native-cross-elements';

export default function Example() {
  const [text, setText] = React.useState('');

  return (
    <FlatLabelInput
      onChange={setText}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
      pressedBackgroundColor="#3f3f46"
      labelStyle={{
        color: '#71717a',
        fontSize: 15,
        labelFilledColor: '#52525b',
        labelFilledFontSize: 11,
      }}
      textStyle={{ color: '#e4e4e7' }}
      inputStyle={{ width: '100%' }}
      inputConfig={{
        placeholder: 'Email address',
        inputMode: 'email',
        className: 'docs-flat-input',
        maxLength: 120,
        autoCapitalize: 'none',
      }}
      style={{ height: 56 }}
    />
  );
}`;

const ICON_EXAMPLE = `import { Text } from 'react-native';

<FlatLabelInput
  onChange={setText}
  backgroundColor="#18181b"
  selectedBackgroundColor="#27272a"
  pressedBackgroundColor="#3f3f46"
  labelStyle={{
    color: '#71717a',
    fontSize: 15,
    labelFilledColor: '#52525b',
    labelFilledFontSize: 11,
  }}
  textStyle={{ color: '#e4e4e7' }}
  inputStyle={{ width: '100%' }}
  inputConfig={{
    placeholder: 'Password',
    secureTextEntry: true,
    className: 'docs-flat-input',
  }}
  rightComponent={(state) => (
    <Text style={{ marginLeft: 8, opacity: state.focused ? 1 : 0.5 }}>👁</Text>
  )}
  style={{ height: 56 }}
/>`;

const FLAT_INPUT_PROPS: PropRow[] = [
	{ name: 'onChange', type: '(text: string) => void', required: true, description: 'Called when text changes.' },
	{ name: 'inputConfig', type: 'InputConfig', required: true, description: 'TextInput props plus web className.' },
	{
		name: 'labelStyle',
		type: '{ labelFilledFontSize?, labelFilledColor?, ...TextStyle }',
		description: 'Label styling plus filled-state overrides.',
	},
	{ name: 'textStyle', type: 'TextStyle', description: 'Typography for the input text.' },
	{ name: 'style', type: 'LabelInputStyle | (state) => LabelInputStyle', description: 'Container style or callback.' },
	{
		name: 'leftComponent',
		type: 'ReactElement | (state: LabelInputState) => ReactElement',
		description: 'Leading icon or element.',
	},
	{
		name: 'rightComponent',
		type: 'ReactElement | (state: LabelInputState) => ReactElement',
		description: 'Trailing icon or element.',
	},
	{ name: 'backgroundColor', type: 'ColorValue', description: 'Default background.' },
	{ name: 'selectedBackgroundColor', type: 'ColorValue', description: 'Background when focused/hovered.' },
	{ name: 'pressedBackgroundColor', type: 'ColorValue', description: 'Background when pressed.' },
	{ name: 'className', type: 'string', description: 'Container CSS class on web.' },
];

const INPUT_CONFIG_PROPS: PropRow[] = [
	{ name: 'className', type: 'string', description: 'CSS class for the input element on web.' },
	{ name: 'placeholderClassName', type: 'string', description: 'CSS class for the placeholder on web.' },
	{
		name: '...TextInputProps',
		type: 'TextInputProps',
		description:
			'All standard RN TextInput props except style, onFocus, onBlur, onPointerEnter, onPointerLeave, onChangeText.',
	},
];

function FlatLabelInputDemo() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<View style={{ width: 280, gap: 12 }}>
			<FlatLabelInput
				onChange={setEmail}
				backgroundColor="#18181b"
				selectedBackgroundColor="#27272a"
				pressedBackgroundColor="#3f3f46"
				labelStyle={{
					color: '#71717a',
					fontSize: 15,
					labelFilledColor: '#52525b',
					labelFilledFontSize: 11,
				}}
				textStyle={{ color: '#e4e4e7' }}
				inputStyle={{ width: '100%' }}
				inputConfig={{
					placeholder: 'Email address',
					inputMode: 'email',
					className: 'docs-flat-input',
					maxLength: 120,
					autoCapitalize: 'none',
				}}
				style={{ height: 56 }}
			/>
			<FlatLabelInput
				onChange={setPassword}
				backgroundColor="#18181b"
				selectedBackgroundColor="#27272a"
				pressedBackgroundColor="#3f3f46"
				labelStyle={{
					color: '#71717a',
					fontSize: 15,
					labelFilledColor: '#52525b',
					labelFilledFontSize: 11,
				}}
				textStyle={{ color: '#e4e4e7' }}
				inputStyle={{ width: '100%' }}
				inputConfig={{
					placeholder: 'Password',
					secureTextEntry: true,
					className: 'docs-flat-input',
				}}
				style={{ height: 56 }}
			/>
		</View>
	);
}

export default function FlatLabelInputPage() {
	return (
		<DocPage
			title="FlatLabelInput"
			description="An animated floating-label text input. The label smoothly transitions from placeholder position to a smaller filled label when text is entered or the field is focused."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="flat-label-input.tsx">
							<FlatLabelInputDemo />
						</ComponentPreview>
					),
				},
				{
					title: 'With icons',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use <Text className="text-amber-300 font-mono">leftComponent</Text> and{' '}
								<Text className="text-amber-300 font-mono">rightComponent</Text> as render-props that receive the
								current <Text className="text-amber-300 font-mono">LabelInputState</Text> (focused, hovered, filled).
							</Text>
							<CodeBlock code={ICON_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Label fill animation',
					content: (
						<Callout type="tip">
							Control the filled-state label appearance with{' '}
							<Text className="text-amber-300 font-mono">labelFilledFontSize</Text> and{' '}
							<Text className="text-amber-300 font-mono">labelFilledColor</Text> inside labelStyle. These override the
							base label style only when the field has content.
						</Callout>
					),
				},
				{
					title: 'Web notes',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use <Text className="text-amber-300 font-mono">LabeledInputFieldWeb</Text> for a web-optimized variant
								that accepts additional <Text className="text-amber-300 font-mono">className</Text> hooks on the
								container and input element.
							</Text>
						</View>
					),
				},
				{
					title: 'FlatInputProps',
					content: <PropsTable props={FLAT_INPUT_PROPS} />,
				},
				{
					title: 'InputConfig',
					content: <PropsTable props={INPUT_CONFIG_PROPS} />,
				},
			]}
		/>
	);
}
