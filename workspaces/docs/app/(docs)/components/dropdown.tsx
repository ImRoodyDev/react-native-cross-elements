import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown, type DropdownProps } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropControls } from '../../../components/PropControls';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import {
  Dropdown,
  type DropdownProps,
  type DropdownRef,
} from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import React from 'react';
import { View, Text } from 'react-native';
import { Dropdown, type DropdownProps } from 'react-native-cross-elements';

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export default function Example() {
  const onSelect: DropdownProps<typeof OPTIONS[number]>['onSelect'] = (item, index) => {
    console.log('selected', item, index);
  };

  return (
    <Dropdown
      data={OPTIONS}
      defaultValueByIndex={0}
      onSelect={onSelect}
      renderButtonContent={(selectedItem, isVisible) => (
        <View
          style={{
            padding: 12,
            borderRadius: 10,
            backgroundColor: '#18181b',
            borderWidth: 1,
            borderColor: isVisible ? '#6366f1' : '#3f3f46',
          }}
        >
          <Text style={{ color: '#e4e4e7' }}>
            {selectedItem?.label ?? 'Select...'} {isVisible ? '▲' : '▼'}
          </Text>
        </View>
      )}
      renderItemContent={(item, _, isSelected) => (
        <View
          style={{
            padding: 12,
            backgroundColor: isSelected ? '#27272a' : 'transparent',
          }}
        >
          <Text style={{ color: isSelected ? '#fff' : '#a1a1aa' }}>{item.label}</Text>
        </View>
      )}
    />
  );
}`;

const REF_EXAMPLE = `import React from 'react';
import { Text } from 'react-native';
import { Dropdown, type DropdownRef } from 'react-native-cross-elements';

export default function Example() {
  const ref = React.useRef<DropdownRef>(null);

  return (
    <>
      <Dropdown ref={ref} data={OPTIONS} onSelect={onSelect} /* ...other props */ />
      <Text onPress={() => ref.current?.openDropdown()}>Open</Text>
      <Text onPress={() => ref.current?.closeDropdown()}>Close</Text>
      <Text onPress={() => ref.current?.selectIndex(0)}>Select first</Text>
      <Text onPress={() => ref.current?.reset()}>Reset</Text>
    </>
  );
}`;

const SEARCH_EXAMPLE = `<Dropdown
  data={OPTIONS}
  onSelect={onSelect}
  search
  searchPlaceHolder="Search..."
  renderSearchInputLeftIcon={() => <Text>🔎</Text>}
  animateDropdown
  animationType="spring"
  dropDownSpacing={8}
  dropdownOverlayColor="rgba(0,0,0,0.5)"
  /* ...button/item renderers */
/>`;

const DROPDOWN_PROPS: PropRow[] = [
	{ name: 'data', type: 'T[]', required: true, description: 'Items to render.' },
	{ name: 'onSelect', type: '(item: T, index: number) => void', description: 'Called on selection.' },
	{ name: 'defaultValue', type: 'T', description: 'Pre-selected item.' },
	{ name: 'defaultValueByIndex', type: 'number', description: 'Pre-selected index (zero-based).' },
	{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the entire dropdown.' },
	{ name: 'disabledIndexes', type: 'number[]', description: 'Disable specific items by index.' },
	{ name: 'search', type: 'boolean', description: 'Enable built-in search input.' },
	{ name: 'searchPlaceHolder', type: 'string', description: 'Placeholder for search input.' },
	{ name: 'renderSearchInputLeftIcon', type: '() => ReactElement', description: 'Left icon inside search input.' },
	{ name: 'renderSearchInputRightIcon', type: '() => ReactElement', description: 'Right icon inside search input.' },
	{ name: 'animateDropdown', type: 'boolean', description: 'Enable open/close animation.' },
	{ name: 'animationType', type: "'spring' | 'timing'", default: "'spring'", description: 'Animation driver.' },
	{ name: 'animationConfig', type: 'AnimationConfig', description: 'Timing config when using timing driver.' },
	{ name: 'springConfig', type: 'WithSpringConfig', description: 'Spring config when using spring driver.' },
	{ name: 'dropDownSpacing', type: 'number', description: 'Gap between trigger and dropdown window.' },
	{ name: 'dropdownOverlayColor', type: 'string', description: 'Backdrop overlay color.' },
	{ name: 'dropdownStyle', type: 'ViewStyle', description: 'Container style for the dropdown.' },
	{
		name: 'renderButtonContent',
		type: '(item, isVisible, focused) => JSX.Element',
		description: 'Custom trigger button content.',
	},
	{
		name: 'renderButton',
		type: '({ selectedItem, isVisible, disabled, onPress }) => JSX.Element',
		description: 'Full custom trigger button.',
	},
	{ name: 'renderItemContent', type: '(item, index, isSelected) => JSX.Element', description: 'Custom row content.' },
	{
		name: 'renderItemButton',
		type: '({ item, index, isSelected, disabled, onPress }) => JSX.Element',
		description: 'Full custom row button.',
	},
	{ name: 'onDropdownWillShow', type: '(willShow: boolean) => void', description: 'Called before opening or closing.' },
	{ name: 'onScrollEndReached', type: '() => void', description: 'Fired at the end of the list.' },
	{ name: 'onChangeSearchInputText', type: '(text: string) => void', description: 'Override search handler.' },
];

const REF_PROPS: PropRow[] = [
	{ name: 'reset()', type: '() => void', description: 'Clear selection and search text.' },
	{ name: 'openDropdown()', type: '() => void', description: 'Open the dropdown.' },
	{ name: 'closeDropdown()', type: '() => void', description: 'Close the dropdown.' },
	{ name: 'selectIndex(index)', type: '(index: number) => void', description: 'Select item by index.' },
];

const DEMO_OPTIONS = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
	{ label: 'Mango', value: 'mango' },
];

type DemoOption = (typeof DEMO_OPTIONS)[number];

function DropdownSection() {
	const [disabled, setDisabled] = useState(false);
	const [animate, setAnimate] = useState(true);

	const onSelect: DropdownProps<DemoOption>['onSelect'] = () => {};

	return (
		<View>
			<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="dropdown.tsx" height={220}>
				<View style={{ width: 220, zIndex: 100 }}>
					<Dropdown
						data={DEMO_OPTIONS}
						defaultValueByIndex={0}
						onSelect={onSelect}
						disabled={disabled}
						animateDropdown={animate}
						animationType="spring"
						dropDownSpacing={6}
						dropdownStyle={{
							backgroundColor: '#18181b',
							borderRadius: 10,
							borderWidth: 1,
							borderColor: '#3f3f46',
							overflow: 'hidden',
						}}
						renderButtonContent={(selectedItem, isVisible) => (
							<View
								style={{
									padding: 12,
									borderRadius: 10,
									backgroundColor: '#18181b',
									borderWidth: 1,
									borderColor: isVisible ? '#6366f1' : '#3f3f46',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<Text style={{ color: '#e4e4e7', fontSize: 14 }}>
									{(selectedItem as DemoOption | null)?.label ?? 'Select...'}
								</Text>
								<Text style={{ color: '#6366f1', fontSize: 11 }}>{isVisible ? '▲' : '▼'}</Text>
							</View>
						)}
						renderItemContent={(item, _, isSelected) => (
							<View
								style={{
									padding: 12,
									backgroundColor: isSelected ? '#27272a' : 'transparent',
								}}
							>
								<Text style={{ color: isSelected ? '#ffffff' : '#a1a1aa', fontSize: 14 }}>
									{(item as DemoOption).label}
								</Text>
							</View>
						)}
					/>
				</View>
			</ComponentPreview>
			<PropControls
				controls={[
					{ type: 'boolean', label: 'disabled', value: disabled, onChange: setDisabled },
					{ type: 'boolean', label: 'animateDropdown', value: animate, onChange: setAnimate },
				]}
			/>
		</View>
	);
}

export default function DropdownPage() {
	return (
		<DocPage
			title="Dropdown"
			description="An animated dropdown selector with built-in search, portal overlay, and full render customization. Accepts a generic type parameter T for your data items."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Basic usage',
					content: <DropdownSection />,
				},
				{
					title: 'With search & animation',
					content: <CodeBlock code={SEARCH_EXAMPLE} language="tsx" />,
				},
				{
					title: 'Programmatic control (ref)',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Pass a ref typed as <Text className="text-amber-300 font-mono">DropdownRef</Text> to open, close,
								select, or reset the dropdown from outside.
							</Text>
							<CodeBlock code={REF_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Portal fallback',
					content: (
						<Callout type="info">
							When a <Text className="text-amber-300 font-mono">PortalHost</Text> is mounted at the root, Dropdown
							automatically renders its window into it. Otherwise it falls back to a native Modal. Mount{' '}
							<Text className="text-amber-300 font-mono">{'<PortalHost />'}</Text> at your app root for the best web
							experience.
						</Callout>
					),
				},
				{
					title: 'DropdownProps',
					content: <PropsTable props={DROPDOWN_PROPS} />,
				},
				{
					title: 'DropdownRef',
					content: <PropsTable props={REF_PROPS} />,
				},
			]}
		/>
	);
}
