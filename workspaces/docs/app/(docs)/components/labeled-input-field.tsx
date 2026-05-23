import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LabeledInputField } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { LabeledInputField } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { LabeledInputField } from 'react-native-cross-elements';

export default function Example() {
  const [name, setName] = React.useState('');

  return (
    <LabeledInputField
      onChange={setName}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
      pressedBackgroundColor="#3f3f46"
      labelStyle={{
        color: '#71717a',
        fontSize: 15,
        labelFilledColor: '#818cf8',
        labelFilledFontSize: 11,
        labelFilledOffset: 4,
      }}
      textStyle={{ color: '#e4e4e7' }}
      inputConfig={{ placeholder: 'Full name' }}
      style={{ borderRadius: 12, borderWidth: 1, borderColor: '#3f3f46' }}
    />
  );
}`;

const PROPS: PropRow[] = [
	{ name: 'onChange', type: '(text: string) => void', required: true, description: 'Called when text changes.' },
	{ name: 'inputConfig', type: 'InputConfig', required: true, description: 'TextInput props and placeholder config.' },
	{ name: 'labelStyle', type: 'LabelInputStyle', description: 'Placeholder and filled-label styling.' },
	{ name: 'textStyle', type: 'TextStyle', description: 'Text input typography.' },
	{ name: 'leftComponent', type: 'ReactElement | (state) => ReactElement', description: 'Leading adornment.' },
	{ name: 'rightComponent', type: 'ReactElement | (state) => ReactElement', description: 'Trailing adornment.' },
	{ name: 'style', type: 'LabelInputStyle | (state) => LabelInputStyle', description: 'Container style or callback.' },
];

function LabeledInputDemo() {
	const [value, setValue] = useState('');

	return (
		<View style={{ width: 300, gap: 12 }}>
			<LabeledInputField
				onChange={setValue}
				backgroundColor="#18181b"
				selectedBackgroundColor="#27272a"
				pressedBackgroundColor="#3f3f46"
				labelStyle={{
					color: '#71717a',
					fontSize: 15,
					labelFilledColor: '#818cf8',
					labelFilledFontSize: 11,
					labelFilledOffset: 4,
				}}
				textStyle={{ color: '#e4e4e7' }}
				inputConfig={{ placeholder: 'Full name', autoCapitalize: 'words' }}
				leftComponent={() => <Text style={{ color: '#818cf8' }}>@</Text>}
				style={{ borderRadius: 12, borderWidth: 1, borderColor: '#3f3f46' }}
			/>
			<Text style={{ color: '#52525b', fontSize: 13 }}>Value: {value || 'empty'}</Text>
		</View>
	);
}

export default function LabeledInputFieldPage() {
	return (
		<DocPage
			title="LabeledInputField"
			description="An inline floating-label input with optional leading and trailing components. Use it when the label should live inside the input row."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="labeled-input-field.tsx" height={180}>
							<LabeledInputDemo />
						</ComponentPreview>
					),
				},
				{
					title: 'When to use it',
					content: (
						<Callout type="info">
							Use LabeledInputField for compact inline forms. Use FlatLabelInput when you want the label arranged
							above the input container.
						</Callout>
					),
				},
				{ title: 'Props', content: <PropsTable props={PROPS} /> },
			]}
		/>
	);
}
