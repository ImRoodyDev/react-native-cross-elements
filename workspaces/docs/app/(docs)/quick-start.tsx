import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../components/DocPage';
import { CodeBlock } from '../../components/CodeBlock';

const IMPORT_EXAMPLE = `import {
  NativeButton,
  CustomButton,
  BaseButton,
  ButtonsSlider,
  Switch,
  Dropdown,
  FlatLabelInput,
  Portal,
  PortalHost,
  SpatialNavigationRoot,
  SpatialNavigationFocusableView,
} from 'react-native-cross-elements';`;

const BUTTON_EXAMPLE = `import React from 'react';
import { View, Text } from 'react-native';
import { NativeButton, CustomButton } from 'react-native-cross-elements';

export default function ButtonsExample() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      {/* Simple native button */}
      <NativeButton
        text="Press me"
        onPress={() => console.log('pressed')}
        backgroundColor="#6366f1"
        selectedBackgroundColor="#4f46e5"
        pressedBackgroundColor="#4338ca"
        textColor="#ffffff"
        focusedTextColor="#ffffff"
        style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
      />

      {/* Custom content button */}
      <CustomButton
        onPress={() => console.log('custom pressed')}
        backgroundColor="#18181b"
        selectedBackgroundColor="#27272a"
        pressedBackgroundColor="#3f3f46"
        textColor="#e4e4e7"
        focusedTextColor="#ffffff"
        style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
      >
        {({ currentTextColor }) => (
          <Text style={{ color: currentTextColor, fontWeight: '600' }}>
            Custom content 🎨
          </Text>
        )}
      </CustomButton>
    </View>
  );
}`;

const SWITCH_EXAMPLE = `import React from 'react';
import { Switch } from 'react-native-cross-elements';

export default function SwitchExample() {
  const [on, setOn] = React.useState(false);
  return <Switch value={on} onValueChange={setOn} />;
}`;

const DROPDOWN_EXAMPLE = `import React from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-cross-elements';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export default function DropdownExample() {
  return (
    <Dropdown
      data={options}
      defaultValueByIndex={0}
      onSelect={(item, index) => console.log(item, index)}
      renderButtonContent={(selectedItem, isVisible) => (
        <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#18181b' }}>
          <Text style={{ color: 'white' }}>
            {selectedItem?.label ?? 'Select...'} {isVisible ? '▲' : '▼'}
          </Text>
        </View>
      )}
      renderItemContent={(item, _, isSelected) => (
        <View style={{ padding: 12, backgroundColor: isSelected ? '#27272a' : 'transparent' }}>
          <Text style={{ color: 'white' }}>{item.label}</Text>
        </View>
      )}
    />
  );
}`;

const SPATIAL_NAV_EXAMPLE = `import React from 'react';
import { Text, View } from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationDeviceTypeProvider,
  SpatialNavigationRoot,
  SpatialNavigationView,
  SpatialNavigationFocusableView,
  SpatialNavigation,
  BaseRemoteControl,
  Directions,
} from 'react-native-cross-elements';

enum SupportedKeys {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Enter = 'Enter',
  LongEnter = 'LongEnter',
}

const MapSupportedKeys = {
  [SupportedKeys.ArrowUp]: Directions.UP,
  [SupportedKeys.ArrowDown]: Directions.DOWN,
  [SupportedKeys.ArrowLeft]: Directions.LEFT,
  [SupportedKeys.ArrowRight]: Directions.RIGHT,
  [SupportedKeys.Enter]: Directions.ENTER,
  [SupportedKeys.LongEnter]: Directions.LONG_ENTER,
};

class KeyboardRemote extends BaseRemoteControl<SupportedKeys> {
  constructor() {
    super();
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        if (event.code in MapSupportedKeys) {
          this.emitKeyDown(event.code as SupportedKeys);
        }
      });
    }
  }
}
const remote = new KeyboardRemote();

export default function SpatialExample() {
  React.useEffect(() => {
    SpatialNavigation.configureRemoteControl({
      mappedDirection: MapSupportedKeys,
      remoteControlSubscriber: (cb) => remote.addKeydownListener(cb),
      remoteControlUnsubscriber: (sub) => remote.removeKeydownListener(sub),
    });
  }, []);

  return (
    <SpatialNavigationDeviceTypeProvider>
      <SpatialNavigationRoot>
        <SpatialNavigationView direction="horizontal">
          {['Home', 'Movies', 'Shows'].map((label, index) => {
            const item = (
              <SpatialNavigationFocusableView
                key={label}
                onSelect={() => console.log('Selected', label)}
              >
                {({ isFocused }) => (
                  <View
                    style={{
                      marginRight: 8,
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: isFocused ? '#6366f1' : '#18181b',
                    }}
                  >
                    <Text style={{ color: 'white' }}>{label}</Text>
                  </View>
                )}
              </SpatialNavigationFocusableView>
            );

            return index === 0 ? <DefaultFocus key={label}>{item}</DefaultFocus> : item;
          })}
        </SpatialNavigationView>
      </SpatialNavigationRoot>
    </SpatialNavigationDeviceTypeProvider>
  );
}`;

export default function QuickStartPage() {
	return (
		<DocPage
			title="Quick Start"
			description="Start using react-native-cross-elements in your project in under 5 minutes."
			sections={[
				{
					title: 'Import components',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								All components are exported from a single entry point:
							</Text>
							<CodeBlock code={IMPORT_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Buttons',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use <Text className="text-amber-300 font-mono">NativeButton</Text> for a text-based button or{' '}
								<Text className="text-amber-300 font-mono">CustomButton</Text> for fully custom content. Both support
								async <Text className="text-amber-300 font-mono">onPress</Text> with a loading indicator.
							</Text>
							<CodeBlock code={BUTTON_EXAMPLE} language="tsx" />
							<Callout type="tip">
								Use BaseButton for complete control over layout and render logic via the children render-prop.
							</Callout>
						</View>
					),
				},
				{
					title: 'Switch',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">Drop-in animated toggle:</Text>
							<CodeBlock code={SWITCH_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Dropdown',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								A fully custom dropdown with animation, search, and programmatic control via ref.
							</Text>
							<CodeBlock code={DROPDOWN_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Spatial Navigation (TV / Keyboard)',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Wrap your app in <Text className="text-amber-300 font-mono">SpatialNavigationRoot</Text> and use{' '}
								<Text className="text-amber-300 font-mono">SpatialNavigationFocusableView</Text> to make elements
								navigable by remote or keyboard.
							</Text>
							<CodeBlock code={SPATIAL_NAV_EXAMPLE} language="tsx" />
							<Callout type="info">
								Spatial navigation is optional — only add it when targeting TV, keyboard, or remote-controlled
								platforms.
							</Callout>
						</View>
					),
				},
			]}
		/>
	);
}
