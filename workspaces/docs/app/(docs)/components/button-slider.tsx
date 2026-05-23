// ButtonsSlider documentation page
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ButtonsSlider } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropControls } from '../../../components/PropControls';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { ButtonsSlider, type ButtonSliderProps } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { ButtonsSlider } from 'react-native-cross-elements';

export default function Example() {
  const [index, setIndex] = React.useState(0);

  return (
    <ButtonsSlider
      options={['Low', 'Medium', 'High']}
      initialIndex={index}
      onSelect={setIndex}
      orientation="horizontal"
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
        color: isSelected ? '#ffffff' : '#71717a',
        fontWeight: focused ? '700' : isSelected ? '600' : '500',
      })}
      style={{ width: 300, height: 44 }}
    />
  );
}`;

const VERTICAL_EXAMPLE = `<ButtonsSlider
  options={['Option A', 'Option B', 'Option C']}
  initialIndex={0}
  onSelect={(i) => console.log('selected', i)}
  orientation="vertical"
  sliderContainerStyle={{ backgroundColor: '#18181b', borderRadius: 12, padding: 4 }}
  sliderStyle={{ backgroundColor: '#27272a' }}
  sliderItemButtonStyle={({ isSelected }) => ({
    backgroundColor: isSelected ? '#6366f1' : 'transparent',
  })}
  sliderItemTextStyle={({ isSelected }) => ({
    color: isSelected ? '#fff' : '#71717a',
    fontWeight: isSelected ? '600' : '400',
  })}
  style={{ width: 140, height: 132 }}
/>`;

const PROPS: PropRow[] = [
	{ name: 'options', type: 'string[]', required: true, description: 'Array of option labels.' },
	{ name: 'initialIndex', type: 'number', required: true, description: 'Initially selected index (zero-based).' },
	{ name: 'onSelect', type: '(index: number) => void', required: true, description: 'Called when selection changes.' },
	{
		name: 'orientation',
		type: "'horizontal' | 'vertical'",
		default: "'horizontal'",
		description: 'Layout direction of the slider.',
	},
	{ name: 'style', type: 'ViewStyle', description: 'Outer container style.' },
	{ name: 'sliderContainerStyle', type: 'ViewStyle', description: 'Style for the outer track background.' },
	{ name: 'sliderStyle', type: 'ViewStyle', description: 'Style for the animated selection indicator.' },
	{
		name: 'sliderItemButtonStyle',
		type: '(state: SliderButtonStyle) => ViewStyle',
		description: 'Style for each item button.',
	},
	{
		name: 'sliderItemTextStyle',
		type: '(state: SliderTextStyle) => TextStyle',
		description: 'Style for each item label.',
	},
	{ name: 'buttonClassName', type: 'string', description: 'Web CSS class for item buttons.' },
	{ name: 'textClassName', type: 'string', description: 'Web CSS class for item labels.' },
	{ name: 'sliderRoundClassName', type: 'string', description: 'Web CSS class for the animated indicator.' },
];

function ButtonSliderSection() {
	const [selected, setSelected] = useState(0);
	const [theme, setTheme] = useState('indigo');
	const options = ['Day', 'Week', 'Month'];
	const indicatorBg = theme === 'indigo' ? '#6366f1' : '#27272a';

	return (
		<View>
			<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="button-slider.tsx">
				<View style={{ alignItems: 'center', gap: 12 }}>
					<ButtonsSlider
						options={options}
						initialIndex={selected}
						onSelect={setSelected}
						orientation="horizontal"
						sliderContainerStyle={{
							backgroundColor: '#18181b',
							borderRadius: 9999,
							padding: 4,
						}}
						sliderStyle={{ backgroundColor: indicatorBg }}
						sliderItemButtonStyle={() => ({ backgroundColor: 'transparent' })}
						sliderItemTextStyle={({ isSelected }) => ({
							color: isSelected ? '#ffffff' : '#71717a',
							fontWeight: isSelected ? '600' : '400',
							fontSize: 14,
						})}
						style={{ width: 280, height: 44 }}
					/>
					<Text style={{ color: '#52525b', fontSize: 13 }}>Selected: {options[selected]}</Text>
				</View>
			</ComponentPreview>
			<PropControls
				controls={[
					{
						type: 'select',
						label: 'indicator color',
						value: theme,
						options: ['indigo', 'zinc'],
						onChange: setTheme,
					},
				]}
			/>
		</View>
	);
}

export default function ButtonSliderPage() {
	return (
		<DocPage
			title="ButtonsSlider"
			description="A segmented control with a smooth animated selection indicator. Set orientation to horizontal or vertical. Provides full style control over the track, indicator, and each item."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Horizontal slider',
					content: <ButtonSliderSection />,
				},
				{
					title: 'Vertical slider',
					content: <CodeBlock code={VERTICAL_EXAMPLE} language="tsx" />,
				},
				{
					title: 'Style callbacks',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								<Text className="text-amber-300 font-mono">sliderItemButtonStyle</Text> and{' '}
								<Text className="text-amber-300 font-mono">sliderItemTextStyle</Text> receive a state object with{' '}
								<Text className="text-amber-300 font-mono">focused</Text> and{' '}
								<Text className="text-amber-300 font-mono">isSelected</Text> so you can apply conditional styles.
							</Text>
							<Callout type="tip">
								For web styling, use buttonClassName / textClassName / sliderRoundClassName to apply Tailwind or custom
								CSS classes.
							</Callout>
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
