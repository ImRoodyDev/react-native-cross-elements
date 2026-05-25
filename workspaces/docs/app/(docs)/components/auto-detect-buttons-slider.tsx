import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { AutoDetectButtonsSlider } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import {
  AutoDetectButtonsSlider,
  type ButtonSliderProps,
  type SliderOption,
} from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { AutoDetectButtonsSlider, type SliderOption } from 'react-native-cross-elements';

const OPTIONS: SliderOption[] = [
  { label: 'One', textProps: { numberOfLines: 1 } },
  { label: 'Two', textProps: { numberOfLines: 1 } },
  { label: 'Three', textProps: { numberOfLines: 1 } },
  { label: 'Four', textProps: { numberOfLines: 1 } },
];

export default function Example() {
  return (
    <AutoDetectButtonsSlider
      options={OPTIONS}
      initialIndex={0}
      onSelect={(i) => console.log('selected', i)}
      sliderContainerStyle={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 9999,
        padding: 4,
      }}
      sliderStyle={{ backgroundColor: '#18181b' }}
      sliderItemButtonStyle={({ isSelected }) => ({
        backgroundColor: 'transparent',
      })}
      sliderItemTextStyle={({ isSelected, focused }) => ({
        color: isSelected ? '#fff' : '#71717a',
        fontWeight: isSelected ? '600' : '500',
      })}
      style={{ width: 360, height: 44 }}
    />
  );
}`;

const PROPS: PropRow[] = [
	{ name: 'options', type: 'SliderOption[]', required: true, description: 'Array of { label, textProps? } objects.' },
	{ name: 'initialIndex', type: 'number', required: true, description: 'Initially selected index.' },
	{ name: 'onSelect', type: '(index: number) => void', required: true, description: 'Called when selection changes.' },
	{
		name: 'style',
		type: 'ViewStyle',
		description: 'Container style — determines the orientation via width/height ratio.',
	},
	{ name: 'sliderContainerStyle', type: 'ViewStyle', description: 'Style for the outer track background.' },
	{ name: 'sliderStyle', type: 'ViewStyle', description: 'Style for the animated selection indicator.' },
	{
		name: 'sliderItemButtonStyle',
		type: '(state: SliderButtonStyle) => ViewStyle',
		description: 'Per-item button style callback.',
	},
	{
		name: 'sliderItemTextStyle',
		type: '(state: SliderTextStyle) => TextStyle',
		description: 'Per-item text style callback.',
	},
	{ name: 'buttonClassName', type: 'string', description: 'Web CSS class for item buttons.' },
	{ name: 'textClassName', type: 'string', description: 'Web CSS class for item labels.' },
	{ name: 'sliderRoundClassName', type: 'string', description: 'Web CSS class for the indicator.' },
];

function AutoSliderDemo() {
	const [selected, setSelected] = useState(0);
	const options = ['One', 'Two', 'Three', 'Four'];
	return (
		<View style={{ gap: 16, alignItems: 'center' }}>
			<AutoDetectButtonsSlider
				options={options}
				initialIndex={selected}
				onSelect={setSelected}
				sliderContainerStyle={{
					backgroundColor: '#18181b',
					borderRadius: 9999,
					padding: 4,
				}}
				sliderStyle={{ backgroundColor: '#6366f1' }}
				sliderItemButtonStyle={() => ({ backgroundColor: 'transparent' })}
				sliderItemTextStyle={({ isSelected }) => ({
					color: isSelected ? '#ffffff' : '#71717a',
					fontWeight: isSelected ? '600' : '400',
					fontSize: 14,
				})}
				style={{ width: 320, height: 44 }}
			/>
			<Text style={{ color: '#52525b', fontSize: 13 }}>Selected: {options[selected]}</Text>
		</View>
	);
}

export default function AutoDetectButtonsSliderPage() {
	return (
		<DocPage
			title="AutoDetectButtonsSlider"
			description="A segmented control that automatically detects its orientation from its container dimensions. Options accept a SliderOption object (label + optional textProps) instead of plain strings."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Usage',
					content: (
						<View className="gap-3">
							<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="auto-detect-slider.tsx" height={160}>
								<AutoSliderDemo />
							</ComponentPreview>
							<Callout type="info">
								Unlike ButtonsSlider, orientation is detected automatically from the rendered width/height of the
								container. A wider container becomes horizontal; a taller one becomes vertical.
							</Callout>
						</View>
					),
				},
				{
					title: 'SliderOption type',
					content: (
						<View className="gap-3">
							<CodeBlock
								code={`type SliderOption = {
  label: string;
  textProps?: TextProps; // any React Native TextInput props
};`}
								language="ts"
							/>
							<Text className="text-zinc-400 text-sm leading-6">
								Use <Text className="text-amber-300 font-mono">textProps</Text> to control text overflow, font, and
								other label characteristics per option.
							</Text>
						</View>
					),
				},
				{
					title: 'Props',
					content: <PropsTable props={PROPS} />,
				},
			]}
		/>
	);
}
