import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LabeledInputFieldWeb } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { LabeledInputFieldWeb } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { LabeledInputFieldWeb } from 'react-native-cross-elements';

export default function Example() {
  return (
    <LabeledInputFieldWeb
      onChange={(text) => console.log(text)}
      backgroundColor="#18181b"
      selectedBackgroundColor="#27272a"
      pressedBackgroundColor="#3f3f46"
      labelStyle={{
        color: '#71717a',
        fontSize: 15,
        labelFilledColor: '#14b8a6',
        labelFilledFontSize: 11,
        labelFilledOffset: 4,
      }}
      textStyle={{ color: '#e4e4e7' }}
      inputConfig={{ placeholder: 'Website' }}
      style={{ borderRadius: 12, borderWidth: 1, borderColor: '#3f3f46' }}
    />
  );
}`;

const PROPS: PropRow[] = [
	{ name: 'onChange', type: '(text: string) => void', required: true, description: 'Called when text changes.' },
	{ name: 'inputConfig', type: 'InputConfig', required: true, description: 'TextInput props and web class hooks.' },
	{ name: 'labelStyle', type: 'LabelInputStyle', description: 'Placeholder and filled-label styling.' },
	{ name: 'leftComponent', type: 'ReactElement | (state) => ReactElement', description: 'Leading adornment.' },
	{ name: 'rightComponent', type: 'ReactElement | (state) => ReactElement', description: 'Trailing adornment.' },
	{ name: 'className', type: 'string', description: 'Web className for the input parent.' },
];

function WebInputDemo() {
	const [value, setValue] = useState('');

	return (
		<View style={{ width: 300, gap: 12 }}>
			<LabeledInputFieldWeb
				onChange={setValue}
				backgroundColor="#18181b"
				selectedBackgroundColor="#27272a"
				pressedBackgroundColor="#3f3f46"
				labelStyle={{
					color: '#71717a',
					fontSize: 15,
					labelFilledColor: '#14b8a6',
					labelFilledFontSize: 11,
					labelFilledOffset: 4,
				}}
				textStyle={{ color: '#e4e4e7' }}
				inputConfig={{ placeholder: 'Website', inputMode: 'url' }}
				rightComponent={() => <Text style={{ color: '#14b8a6' }}>.com</Text>}
				style={{ borderRadius: 12, borderWidth: 1, borderColor: '#3f3f46' }}
			/>
			<Text style={{ color: '#52525b', fontSize: 13 }}>Value: {value || 'empty'}</Text>
		</View>
	);
}

export default function LabeledInputFieldWebPage() {
	return (
		<DocPage
			title="LabeledInputFieldWeb"
			description="A web-optimized variant of LabeledInputField that uses lower-cost measurement for placeholder positioning."
			platforms={['web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="labeled-input-field-web.tsx" height={180}>
							<WebInputDemo />
						</ComponentPreview>
					),
				},
				{
					title: 'Web note',
					content: (
						<Callout type="tip">
							Prefer this component for web-heavy forms where the inline label layout is needed and you want a lighter
							implementation than the animated native-first variant.
						</Callout>
					),
				},
				{ title: 'Props', content: <PropsTable props={PROPS} /> },
			]}
		/>
	);
}
