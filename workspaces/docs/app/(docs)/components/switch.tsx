import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Switch } from 'react-native-cross-elements';
import { DocPage } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropControls } from '../../../components/PropControls';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { Switch, type SwitchProps, type SwitchRef } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { Switch } from 'react-native-cross-elements';

export default function Example() {
  const [on, setOn] = React.useState(false);
  return <Switch defaultValue={on} onValueChange={setOn} />;
}`;

const REF_EXAMPLE = `import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Switch, type SwitchRef } from 'react-native-cross-elements';

export default function Example() {
  const [on, setOn] = React.useState(false);
  const switchRef = React.useRef<SwitchRef>(null);

  return (
    <View style={{ gap: 12 }}>
      <Switch ref={switchRef} defaultValue={on} onValueChange={setOn} />
      <Pressable onPress={() => switchRef.current?.switch()}>
        <Text style={{ color: '#6366f1' }}>Toggle programmatically</Text>
      </Pressable>
    </View>
  );
}`;

const STYLED_EXAMPLE = `<Switch
  defaultValue={on}
  onValueChange={setOn}
  trackColors={{ off: '#27272a', on: '#6366f1', disabled: '#3f3f46' }}
  thumbStyle={{ backgroundColor: on ? '#ffffff' : '#71717a' }}
/>`;

const PROPS: PropRow[] = [
	{ name: 'defaultValue', type: 'boolean', description: 'Initial state of the switch.' },
	{ name: 'onValueChange', type: '(value: boolean) => void', description: 'Called when the switch is toggled.' },
	{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
	{ name: 'trackColors', type: '{ off?: ColorValue; on?: ColorValue; disabled?: ColorValue }', description: 'Track colors for each state.' },
	{ name: 'thumbStyle', type: 'ViewStyle', description: 'Thumb (circle) style.' },
	{
		name: 'animationConfig',
		type: 'AnimationConfig',
		description: 'Reanimated timing config for the slide animation.',
	},
	{ name: 'style', type: 'ViewStyle', description: 'Container style.' },
];

const TRACK_COLORS: Record<string, string> = {
	indigo: '#6366f1',
	green: '#22c55e',
	rose: '#f43f5e',
	amber: '#f59e0b',
};

function SwitchSection() {
	const [on, setOn] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [colorKey, setColorKey] = useState('indigo');

	return (
		<View>
			<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="switch.tsx">
				<View style={{ alignItems: 'center', gap: 16 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
						<Text style={{ color: '#a1a1aa', fontSize: 14 }}>Airplane Mode</Text>
						<Switch
							defaultValue={on}
							onValueChange={setOn}
							disabled={disabled}
							trackColors={{ off: '#27272a', on: TRACK_COLORS[colorKey], disabled: '#3f3f46' }}
							thumbStyle={{ backgroundColor: on ? '#ffffff' : '#71717a' }}
						/>
					</View>
					<Text style={{ color: on ? TRACK_COLORS[colorKey] : '#52525b', fontSize: 13, fontWeight: '500' }}>
						{on ? 'ON' : 'OFF'}
					</Text>
				</View>
			</ComponentPreview>
			<PropControls
				controls={[
					{ type: 'boolean', label: 'disabled', value: disabled, onChange: setDisabled },
					{
						type: 'select',
						label: 'trackColor (true)',
						value: colorKey,
						options: Object.keys(TRACK_COLORS),
						onChange: setColorKey,
					},
				]}
			/>
		</View>
	);
}

export default function SwitchPage() {
	return (
		<DocPage
			title="Switch"
			description="An animated toggle switch with a smooth slide animation. Works as a drop-in replacement for React Native's Switch with additional style control and a programmatic ref API."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: <SwitchSection />,
				},
				{
					title: 'Programmatic control via ref',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use a ref to call <Text className="text-amber-300 font-mono">toggle()</Text> programmatically.
							</Text>
							<CodeBlock code={REF_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Custom track & thumb colors',
					content: <CodeBlock code={STYLED_EXAMPLE} language="tsx" />,
				},
				{
					title: 'Props',
					content: <PropsTable props={PROPS} />,
				},
			]}
		/>
	);
}
