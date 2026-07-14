<img width="3000" height="1454" alt="# react-native-cross-elements"
src="https://github.com/user-attachments/assets/9520856e-b059-4e1d-b5f9-0a3ef229700c"/>

Beautiful, Web, Native and TV friendly interactable components and spatial navigation for React Native (iOS, Android,
Web, TV) with accessibility for voice and screen reader support.

[![npm version](https://img.shields.io/npm/v/react-native-cross-elements.svg?style=for-the-badge)](https://www.npmjs.com/package/react-native-cross-elements)
[![npm downloads](https://img.shields.io/npm/dm/react-native-cross-elements.svg?style=for-the-badge&color=blue)](https://www.npmjs.com/package/react-native-cross-elements)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Reanimated](https://img.shields.io/badge/Reanimated-%E2%89%A53.0-000?style=for-the-badge)

---

## ✨ Features

- Cross Platform Ready interactable UI: Buttons (native/custom), Switch, Dropdown, FlatLabelInput, Ripple, Portal.
- Spatial navigation primitives: Root, Focusable views, ScrollView, Virtualized List/Grid, hooks, and refs.
- Cross-platform pointer/remote support powered by @bam.tech/lrud for LRUD navigation and React Native Reanimated for
  silky animations.

## 🗂️ Table of contents

- Installation
- Requirements
- Components
- Setup spatial navigation
- Spatial navigation overview
- Usage snippets
- Performance
- API and types reference
- Components details
- Contributing and license

## 📦 Installation

1. Install the package and required peers

```bash
# with npm
npm i react-native-cross-elements

# or yarn
yarn add react-native-cross-elements
```

#### 2) Configure Reanimated (v3.0+)

Follow the official Reanimated installation guide for your RN version:

- React Native Reanimated docs: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/

Typical steps include:

- Add 'react-native-reanimated/plugin' as the last plugin in babel.config.js.
- Enable Hermes (recommended).
- Rebuild the native app after installing.

#### 3) iOS/Android native rebuild

After installation and Babel config, fully rebuild the app (npx pod-install && run).

## ⚙️ Requirements

- react-native
- react
- react-native-reanimated >= 3.0.0 (installation
  guide: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started#installation)

## 🧩 Components

- Buttons
  - [NativeButton](#nativebutton), [CustomButton](#custombutton), [BaseButton](#basebutton)
  - [ButtonsSlider](#buttonsslider), [AutoDetectButtonsSlider](#autodetectbuttonsslider)
  - [Switch](#switch)
- Inputs
  - [FlatLabelInput](#flatlabelinput), [LabeledInputFieldWeb](#labeledinputfieldweb)
  - [Dropdown](#dropdown)
- Effects & Portal
  - [Ripple](#ripple), [Portal](#portal), [PortalHost](#portalhost)
- Navigation primitives
  - [SpatialNavigationRoot](#spatialnavigationroot), [SpatialNavigationView](#spatialnavigationview), [SpatialNavigationScrollView](#spatialnavigationscrollview)
  - [SpatialNavigationFocusableView](#spatialnavigationfocusableview), [SpatialNavigationNode](#spatialnavigationnode)
  - [SpatialNavigationVirtualizedList](#spatialnavigationvirtualizedlist), [SpatialNavigationVirtualizedGrid](#spatialnavigationvirtualizedgrid)
  - [DefaultFocus](#defaultfocus), [DeviceType provider](#spatialnavigationdevicetypeprovider), hooks

## ⚡ Setup Spatial Navigation

<span style="color:green">This setup is optional if you want to use spatial navigation (TV, remote, keyboard).  
Otherwise, no need to wrap your app in a SpatialNavigationRoot.</span>

Wrap your apps if you want to use spatial navigation (smart navigating with arrows button).

```tsx
import React from 'react';
import { Text } from 'react-native';
import {
	SpatialNavigationDeviceTypeProvider,
	SpatialNavigationRoot,
	SpatialNavigationFocusableView,
	SpatialNavigationView,
	SpatialNavigation,
	BaseRemoteControl,
	Directions,
} from 'react-native-cross-elements';

// Example: Custom remote control implementation
class MyRemoteControl extends BaseRemoteControl<string> {
	constructor() {
		super();
		// Set up your platform-specific key listeners here
		// For example, on web you might listen to keyboard events
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', this.handleKeyDown);
		}
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		this.emitKeyDown(event.key);
	};
}

const remoteControl = new MyRemoteControl();

export default function App() {
	// Optional: configure keyboard/remote control once
	React.useEffect(() => {
		SpatialNavigation.configureRemoteControl({
			mappedDirection: {
				ArrowUp: Directions.UP,
				ArrowDown: Directions.DOWN,
				ArrowLeft: Directions.LEFT,
				ArrowRight: Directions.RIGHT,
				Enter: null, // null for select action
			},
			remoteControlSubscriber: (callback) => {
				return remoteControl.addKeydownListener(callback);
			},
			remoteControlUnsubscriber: (subscriber) => {
				remoteControl.removeKeydownListener(subscriber);
			},
		});
	}, []);

	return (
		<SpatialNavigationDeviceTypeProvider>
			<SpatialNavigationRoot>
				<SpatialNavigationFocusableView style={{ padding: 12, backgroundColor: '#222', borderRadius: 8 }}>
					<Text style={{ color: 'white' }}>Focusable card</Text>
				</SpatialNavigationFocusableView>
			</SpatialNavigationRoot>
		</SpatialNavigationDeviceTypeProvider>
	);
}
```

## 🧭 Spatial navigation

- Engine: LRUD navigation is powered by @bam.tech/lrud.
- Root: SpatialNavigationRoot provides the navigation context and remote handling.
- Focusable: SpatialNavigationFocusableView turns a View into a focusable node with proper accessibility props.
- Views: SpatialNavigationView and SpatialNavigationScrollView help layout focusable children, with scrolling support.
- Virtualized: SpatialNavigationVirtualizedList/Grid expose focus and scroll APIs via refs.
- Events: onFocus, onBlur, onSelect, onLongSelect, onActive, onInactive handlers are available on focusable nodes.

More in-depth spatial navigation concepts:

- LRUD docs (BAM): https://github.com/bam-tech/lrud
- React TV Space Navigation (Bamlab): https://github.com/bamlab/react-tv-space-navigation

## 🧪 Usage snippets

### Buttons (Base, Native, Custom, Sliders)

#### <a id="basebutton"></a>BaseButton

#### <a id="nativebutton"></a>NativeButton

#### <a id="custombutton"></a>CustomButton

#### <a id="buttonsslider"></a>ButtonsSlider

#### <a id="autodetectbuttonsslider"></a>AutoDetectButtonsSlider

- See: [BaseButtonProps](#basebuttonprops)
- See: [PressableStyle](#pressablestyle)
- See: [AnimationConfig](#animationconfig)
- See: [Ripple](#ripple)

```tsx
import React from 'react';
import {
	BaseButton,
	NativeButton,
	CustomButton,
	ButtonSlider,
	AutoDetectButtonsSlider,
} from 'react-native-cross-elements';
import {Text, View} from 'react-native';

export default function ButtonsShowcase() {
	const [choice, setChoice] = React.useState(0);

	return (
		<View style={{gap: 16}}>
			{/* BaseButton: full control with render-prop */}
			<BaseButton
				enableRipple
				rippleDuration={350}
				pressedScale={0.96}
				backgroundColor="#111827"
				selectedBackgroundColor="#1F2937"
				pressedBackgroundColor="#0B1220"
				textColor="#E5E7EB"
				focusedTextColor="#FFFFFF"
				animationConfig={{duration: 220}}
				style={({focused, hovered, pressed}) => ([
					{
						paddingHorizontal: 16,
						paddingVertical: 12,
						borderRadius: 12,
						borderWidth: focused || hovered ? 2 : 1,
						borderColor: focused ? '#60A5FA' : hovered ? '#93C5FD' : 'transparent',
						opacity: pressed ? 0.92 : 1,
					},
				])}
				onPress={() => console.log('BaseButton pressed')}
			>
				{({currentTextColor, isFocused}) => (
					<Text style={{color: currentTextColor}}>
						{isFocused ? 'Focused' : 'Not focused'} BaseButton
					</Text>
				)}
			</BaseButton>

			{/* NativeButton: text + optional icons + pending indicator */}
			<NativeButton
				text="Continue"
				onPress={async () => new Promise(r => setTimeout(r, 500))}
				showIndicator
				leftIconComponent={(color) => <Text style={{color, marginRight: 8}}>➡️</Text>}
				rightIconComponent={(color) => <Text style={{color, marginLeft: 8}}>⏩</Text>}
				backgroundColor="#0F766E"
				selectedBackgroundColor="#115E59"
				pressedBackgroundColor="#0D4D4A"
				textColor="#ECFDF5"
				focusedTextColor="#FFFFFF"
				style={{paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12}}
			/>

			{/* CustomButton: bring your own content with pending state */}
			<CustomButton
				onPress={async () => new Promise(r => setTimeout(r, 400))}
				showIndicator
				backgroundColor="#1D4ED8"
				selectedBackgroundColor="#1E40AF"
				pressedBackgroundColor="#1C3D99"
				textColor="#DBEAFE"
				focusedTextColor="#FFFFFF"
				style={{paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12}}
			>
				{({currentTextColor}) => (
					<View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
						<Text style={{color: currentTextColor}}>Custom content</Text>
						<Text style={{color: currentTextColor}}>🎨</Text>
					</View>
				)}
			</CustomButton>

			{/* ButtonSlider: fixed orientation */}
			<ButtonSlider
				options={["Low", "Medium", "High"]}
				initialIndex={choice}
				onSelect={(i) => setChoice(i)}
				orientation="horizontal"
				sliderContainerStyle={{backgroundColor: '#00000022', borderRadius: 9999, padding: 4}}
				sliderStyle={{backgroundColor: '#111827'}}
				sliderItemButtonStyle={({focused, isSelected}) => ({
					backgroundColor: 'transparent',
				})}
				sliderItemTextStyle={({focused, isSelected}) => ({
					color: isSelected ? '#FFFFFF' : '#111827',
					fontWeight: focused ? '700' : '500',
				})}
				style={{width: 420, height: 44}}
			/>

			{/* AutoDetectButtonsSlider: auto horizontal/vertical based on container */}
			<AutoDetectButtonsSlider
				options={[
					{label: "One", textProps: {numberOfLines: 1}},
					{label: "Two", textProps: {numberOfLines: 1}},
					{label: "Three", textProps: {numberOfLines: 1}},
					{label: "Four", textProps: {numberOfLines: 1}}
				]}
				initialIndex={0}
				onSelect={(i) => console.log('auto slider selected', i)}
				sliderContainerStyle={{backgroundColor: '#00000022', borderRadius: 9999, padding: 4}}
				sliderStyle={{backgroundColor: '#111827'}}
				sliderItemButtonStyle={({focused, isSelected}) => ({
					backgroundColor: isSelected ? '#11182720' : 'transparent'
				})}
				sliderItemTextStyle={({focused, isSelected}) => ({
					color: isSelected ? '#FFFFFF' : '#111827',
					fontWeight: isSelected ? '700' : '600'
				})}
				buttonClassName="slider-button"
				textClassName="slider-text"
				sliderRoundClassName="slider-round"
				style={{width: 420, height: 44}}
			/>
		</View>
	);
	/>
</View>
)
	;
}
```

### Dropdown

- See: [DropdownProps](#selectdropdownprops)
- See: [DropdownRef](#selectdropdownref)

```tsx
import React from 'react';
import { Text, View } from 'react-native';
import { Dropdown, type DropdownProps, type DropdownRef } from 'react-native-cross-elements';

const options = [
	{ label: 'One', value: 1 },
	{ label: 'Two', value: 2 },
	{ label: 'Three', value: 3 },
	{ label: 'Four', value: 4 },
];

export default function MyDropdown() {
	const ref = React.useRef<DropdownRef>(null);

	const onSelect: DropdownProps<(typeof options)[number]>['onSelect'] = (item, index) => {
		console.log('selected', { item, index });
	};

	return (
		<View style={{ gap: 12 }}>
			<Dropdown
				ref={ref}
				data={options}
				defaultValueByIndex={1}
				disabledIndexes={[2]}
				onSelect={onSelect}
				onDropdownWillShow={(willShow) => console.log('dropdown will show?', willShow)}
				// Animations
				animateDropdown
				animationType={'spring'}
				animationConfig={{ duration: 280 }}
				// Search
				search
				searchPlaceHolder="Search options..."
				renderSearchInputLeftIcon={() => <Text>🔎</Text>}
				// Window & overlay
				dropDownSpacing={8}
				dropdownOverlayColor="rgba(0,0,0,0.45)"
				showsVerticalScrollIndicator={false}
				// Custom UI
				renderButtonContent={(selectedItem, isVisible, focused) => (
					<View style={{ padding: 12, borderRadius: 8, backgroundColor: focused ? '#222' : '#333' }}>
						<Text style={{ color: 'white' }}>
							{selectedItem ? selectedItem.label : 'Select an option'} {isVisible ? '▲' : '▼'}
						</Text>
					</View>
				)}
				renderItemContent={(item, index, isSelected) => (
					<View style={{ padding: 12, backgroundColor: isSelected ? '#222' : 'transparent' }}>
						<Text style={{ color: 'white' }}>
							{index + 1}. {item.label}
						</Text>
					</View>
				)}
			/>

			<Text onPress={() => ref.current?.openDropdown()} style={{ color: '#4EA8DE' }}>
				Open programmatically
			</Text>
			<Text onPress={() => ref.current?.selectIndex(0)} style={{ color: '#4EA8DE' }}>
				Select first option
			</Text>
		</View>
	);
}
```

### Switch

```tsx
import React from 'react';
import { Switch } from 'react-native-cross-elements';

export default function MySwitch() {
	const [on, setOn] = React.useState(false);
	return <Switch value={on} onValueChange={setOn} />;
}
```

### FlatLabelInput, LabeledInputField, LabeledInputFieldWeb

Info: Web-optimized labeled input variant. Accepts the same InputConfig as FlatLabelInput and adds web-specific
className
styling hooks.

- See: [InputConfig](#inputconfig)
- See: [LabeledInputProps](#labeledinputprops)
- See: [LabelInputState](#labelinputstate)
- See: [LabelInputStyle](#labelinputstyle)
- See: [FlatInputProps](#flatinputprops)

```tsx
import React from 'react';
import { FlatLabelInput } from 'react-native-cross-elements';
import { Text } from 'react-native';

export default function MyInput() {
	const [text, setText] = React.useState('');
	const [focused, setFocused] = React.useState(false);

	return (
		<FlatLabelInput
			onChange={setText}
			// Visuals
			backgroundColor="#111827"
			selectedBackgroundColor="#1F2937"
			pressedBackgroundColor="#0B1220"
			labelStyle={{
				labelFilledColor: '#9CA3AF',
				labelFilledFontSize: 12,
				color: '#9CA3AF',
				fontSize: 16,
				fontWeight: '600',
			}}
			textStyle={{
				color: '#E5E7EB',
			}}
			inputConfig={{
				placeholder: 'Email',
				inputMode: 'email',
				maxLength: 120,
				autoFocus: false,
				secureTextEntry: false,
				onEndEditing: () => console.log('end editing'),
				className: 'my-input',
				placeholderClassName: 'my-input-placeholder',
			}}
			leftComponent={(state) => <Text style={{ marginRight: 8 }}>{state.focused ? '✉️' : '📧'}</Text>}
		/>
	);
}
```

### Portal & PortalHost

Use a PortalHost to render UI outside the normal view hierarchy. It's perfect for overlays that must escape clipping (
overflow: hidden) or stack above everything (modals, dropdowns, tooltips, toasts).

#### How it works

- PortalHost subscribes to a central registry and renders any mounted portals into an absolute, top-layer container (
  zIndex 1000, pointerEvents: 'none').
- Portal registers its children into the named host on mount and removes them on unmount.
- Components like Dropdown auto-detect a PortalHost; if none is mounted, they fall back to a native modal.

#### Setup (root)

```tsx
import React from 'react';
import { View } from 'react-native';
import { PortalHost } from 'react-native-cross-elements';

export default function RootLayout() {
	return (
		<View style={{ flex: 1 }}>
			{/* Top-level host. Name is optional; default is 'root_ui_portal'. */}
			<PortalHost />
			{/* Your app screens */}
			{/* <AppNavigator /> */}
		</View>
	);
}
```

#### Example: global toast

```tsx
import React from 'react';
import { Text, View } from 'react-native';
import { Portal } from 'react-native-cross-elements';

export function ToastDemo() {
	const [toast, setToast] = React.useState<string | null>(null);

	React.useEffect(() => {
		const t = setInterval(() => setToast('Saved successfully ✅'), 5000);
		const c = setInterval(() => setToast(null), 6500);
		return () => {
			clearInterval(t);
			clearInterval(c);
		};
	}, []);

	return (
		<Portal>
			{toast && (
				<View
					style={{
						position: 'absolute',
						bottom: 24,
						left: 0,
						right: 0,
						alignItems: 'center',
						// Important: enable interactions for overlays in the portal.
						pointerEvents: 'auto',
					}}
				>
					<View
						style={{
							paddingVertical: 10,
							paddingHorizontal: 16,
							borderRadius: 10,
							backgroundColor: '#111827',
						}}
					>
						<Text style={{ color: 'white' }}>{toast}</Text>
					</View>
				</View>
			)}
		</Portal>
	);
}
```

#### Example: anchored overlay/popover

```tsx
import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Portal } from 'react-native-cross-elements';

export function PopoverDemo() {
	const [visible, setVisible] = React.useState(false);

	return (
		<View style={{ padding: 24 }}>
			<Pressable onPress={() => setVisible((v) => !v)}>
				<Text>Toggle popover</Text>
			</Pressable>

			<Portal>
				{visible && (
					<View style={{ position: 'absolute', top: 120, left: 24, pointerEvents: 'auto' }}>
						<View style={{ padding: 8, backgroundColor: '#222', borderRadius: 8 }}>
							<Text style={{ color: 'white' }}>I'm a popover</Text>
						</View>
					</View>
				)}
			</Portal>
		</View>
	);
}
```

#### Multiple hosts

You can mount several hosts with different names and target them via the Portal's portalName.

```tsx
// Root
<PortalHost name="top_layer"/>
<PortalHost name="hud"/>

// Later
<Portal portalName="hud">{/* Heads-up messages */}</Portal>
```

#### Notes

- **Interactivity**: The host sets pointerEvents: 'none'. Give your top overlay container pointerEvents: 'auto' to
  receive touches/clicks.
- **Stacking**: Host uses zIndex 1000. You can stack additional layers inside using absolute positioning and zIndex.
- **Fallbacks**: Some components (e.g., Dropdown) use Portal when a host is mounted; otherwise they fall back to a
  modal.

---

## ⚡ Performance

`BaseButton` and `CustomButton` are wrapped in `memo()`, so a screen re-render should not touch buttons that did not change. But memo compares **prop identity, not value** — one inline object, array or arrow function defeats it entirely.

This matters most on TV: every focus move re-renders two buttons (the one losing focus and the one gaining it), each carrying its icon and text subtree. With unstable props, a single D-pad press turns into dropped frames.

**Bad — `style`, `children` and `onPress` are rebuilt on every render:**

```tsx
export function Screen() {
  const [count, setCount] = useState(0);

  return (
    <CustomButton
      onPress={() => setCount((c) => c + 1)}
      style={({ focused }) => ({ borderRadius: 12, opacity: focused ? 1 : 0.8 })}
      backgroundColor="#18181b"
    >
      {({ currentTextColor }) => <Text style={{ color: currentTextColor }}>Count: {count}</Text>}
    </CustomButton>
  );
}
```

**Good — stable identities:**

```tsx
const BUTTON_STYLE = ({ focused }) => ({ borderRadius: 12, opacity: focused ? 1 : 0.8 });

export function Screen() {
  const [count, setCount] = useState(0);

  const onPress = useCallback(() => setCount((c) => c + 1), []);
  const renderChildren = useCallback(
    ({ currentTextColor }) => <Text style={{ color: currentTextColor }}>Count: {count}</Text>,
    [count],
  );

  return (
    <CustomButton onPress={onPress} style={BUTTON_STYLE} backgroundColor="#18181b">
      {renderChildren}
    </CustomButton>
  );
}
```

The same applies to `Dropdown` — hoist static `data`, `useCallback` the `onSelect`:

```tsx
const LANGUAGES = ['English', 'French', 'Spanish'];
const onSelect = useCallback((item) => setLanguage(item), []);

<Dropdown data={LANGUAGES} onSelect={onSelect} />
```

| Prop | Inline is… |
| --- | --- |
| `children` (render prop) | **Bad** — `useCallback` it, keyed on what it reads. |
| `style` (function form) | **Bad** — hoist to module scope, or `useCallback`. |
| `data` / `items` | **Bad** — hoist static lists; `useMemo` derived ones. |
| `onPress` / `onSelect` / `onFocus` / `onBlur` | **Bad** — `useCallback` them. |
| `backgroundColor`, `textColor`, `iconSize`, … | **Fine** — strings and numbers compare by value. |

> **Rule of thumb:** strings and numbers are safe to inline. Objects, arrays, functions and JSX elements are not.

**Profiling:** measure on a **release** build via [`@callstack/inspector`](https://github.com/callstackincubator/inspector). React DevTools attaches to dev builds, where every render is far slower than production — dev timings will point you at problems that do not exist in a shipped app. In a slow commit, a button listed as `props changed: children` or `props changed: style` is an inline prop from your screen.

## 📚 API and types reference

Below are the key public types exported by the library. Use them for strong typing and better DX.

### Interactables types

#### AnimationConfig (for Switch, Dropdown, etc.)

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>duration</td>
			<td>number</td>
			<td>-</td>
			<td>Duration of the animation in ms.</td>
		</tr>
		<tr>
			<td>easing</td>
			<td>EasingFunction</td>
			<td>-</td>
			<td>Easing used for the transition.</td>
		</tr>
		<tr>
			<td>reduceMotion</td>
			<td>ReduceMotion</td>
			<td>-</td>
			<td>Reduce motion for accessibility.</td>
		</tr>
	</tbody>
</table>

#### PressableStyle

- Either a style object for animated Pressable, or a function receiving a `PressableState` object and returning the style.
- `PressableState` includes the default React Native pressable state plus `focused` and `hovered`.
- Use it to render distinct focus, hover, and press visuals from a single callback.

```ts
type PressableState = PressableStateCallbackType & {
	readonly focused: boolean;
	readonly hovered: boolean;
};
```

#### <a id="basebuttonprops"></a>BaseButtonProps

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>orientation</td>
			<td>'horizontal' | 'vertical'</td>
			<td>-</td>
			<td>Orientation for spatial navigation.</td>
		</tr>
		<tr>
			<td>onPress</td>
			<td>(event: GestureResponderEvent) =&gt; any</td>
			<td>-</td>
			<td>Called when a single tap gesture is detected.</td>
		</tr>
		<tr>
			<td>enableRipple</td>
			<td>boolean</td>
			<td>false</td>
			<td>Enables ripple effect on press on native and web.</td>
		</tr>
		<tr>
			<td>className</td>
			<td>string</td>
			<td>-</td>
			<td>Optional classname for styling on web.</td>
		</tr>
		<tr>
			<td>children</td>
			<td><code>ReactNode | ((state: { currentTextColor: ColorValue | undefined; isFocused: boolean }) =&gt; ReactNode)</code></td>
			<td>required</td>
			<td>Button content or render function with state.</td>
		</tr>
		<tr>
			<td>pressedScale</td>
			<td>number</td>
			<td>-</td>
			<td>Scale value when the button is pressed.</td>
		</tr>
		<tr>
			<td>animationConfig</td>
			<td>AnimationConfig</td>
			<td>-</td>
			<td>Animation configuration for button state transitions.</td>
		</tr>
		<tr>
			<td>style</td>
			<td>PressableStyle</td>
			<td>-</td>
			<td>Custom style for the button. Callback state exposes <code>pressed</code>, <code>focused</code>, and <code>hovered</code>.</td>
		</tr>
		<tr>
			<td>textColor</td>
			<td>ColorValue</td>
			<td>'black'</td>
			<td>Text color when not focused.</td>
		</tr>
		<tr>
			<td>focusedTextColor</td>
			<td>ColorValue</td>
			<td>'black'</td>
			<td>Text color when focused or hovered.</td>
		</tr>
		<tr>
			<td>backgroundColor</td>
			<td>ColorValue</td>
			<td>'white'</td>
			<td>Button background color for the default state.</td>
		</tr>
		<tr>
			<td>selectedBackgroundColor</td>
			<td>ColorValue</td>
			<td>'white'</td>
			<td>Background color when the button is focused or hovered.</td>
		</tr>
		<tr>
			<td>pressedBackgroundColor</td>
			<td>ColorValue</td>
			<td>'white'</td>
			<td>Background color when the button is pressed.</td>
		</tr>
		<tr>
			<td>rippleColor</td>
			<td>ColorValue</td>
			<td>-</td>
			<td>Ripple color for the button press effect.</td>
		</tr>
		<tr>
			<td>centerRipple</td>
			<td>boolean</td>
			<td>false</td>
			<td>If true, the ripple starts at the center of the button.</td>
		</tr>
		<tr>
			<td>rippleDuration</td>
			<td>number</td>
			<td>-</td>
			<td>Duration of the ripple animation in milliseconds.</td>
		</tr>
		<tr>
			<td>...PressableProps</td>
			<td>Omit&lt;PressableProps, 'onPress' | 'children' | 'style' | 'className'&gt;</td>
			<td>-</td>
			<td>All other React Native Pressable props.</td>
		</tr>
	</tbody>
</table>

#### FlatInputProps

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>All LabeledInputProps except labelStyle</td>
			<td>-</td>
			<td>-</td>
			<td>Inherits all labeled input props except <code>labelStyle</code>.</td>
		</tr>
		<tr>
			<td>labelStyle</td>
			<td><code>{ labelFilledFontSize?, labelFilledColor?, ...TextStyle }</code></td>
			<td>-</td>
			<td>Label style and filled state props.</td>
		</tr>
		<tr>
			<td>inputStyle</td>
			<td>ViewStyle (partial)</td>
			<td>-</td>
			<td>Style for the input view component.</td>
		</tr>
	</tbody>
</table>

#### LabeledInputProps

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>onChange</td>
			<td>(text: string) =&gt; void</td>
			<td>-</td>
			<td>Called when the input text changes.</td>
		</tr>
		<tr>
			<td>style</td>
			<td>LabelInputStyle | (state: LabelInputState) =&gt; LabelInputStyle</td>
			<td>-</td>
			<td>Container style for layout properties.</td>
		</tr>
		<tr>
			<td>labelStyle</td>
			<td><code>{ labelFilledOffset?, labelFilledFontSize?, labelFilledColor?, ...TextStyle }</code></td>
			<td>-</td>
			<td>Label style and filled state props.</td>
		</tr>
		<tr>
			<td>textStyle</td>
			<td>TextStyle</td>
			<td>-</td>
			<td>Typography for label and placeholder text.</td>
		</tr>
		<tr>
			<td>className</td>
			<td>string</td>
			<td>-</td>
			<td>Container CSS class on web.</td>
		</tr>
		<tr>
			<td>inputConfig</td>
			<td>InputConfig</td>
			<td>required</td>
			<td>Native TextInput props plus web classes.</td>
		</tr>
		<tr>
			<td>leftComponent</td>
			<td>ReactElement | (state: LabelInputState) =&gt; ReactElement</td>
			<td>-</td>
			<td>Optional leading icon.</td>
		</tr>
		<tr>
			<td>rightComponent</td>
			<td>ReactElement | (state: LabelInputState) =&gt; ReactElement</td>
			<td>-</td>
			<td>Optional trailing icon.</td>
		</tr>
		<tr>
			<td>backgroundColor</td>
			<td>ColorValue</td>
			<td>-</td>
			<td>Background color.</td>
		</tr>
		<tr>
			<td>selectedBackgroundColor</td>
			<td>ColorValue</td>
			<td>-</td>
			<td>Background when selected.</td>
		</tr>
		<tr>
			<td>pressedBackgroundColor</td>
			<td>ColorValue</td>
			<td>-</td>
			<td>Background when pressed.</td>
		</tr>
	</tbody>
</table>

#### InputConfig (used by LabeledInputProps.inputConfig)

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>className</td>
			<td>string</td>
			<td>CSS class for the input on web.</td>
		</tr>
		<tr>
			<td>placeholderClassName</td>
			<td>string</td>
			<td>CSS class for the placeholder on web.</td>
		</tr>
		<tr>
			<td>...TextInputProps</td>
			<td>All standard React Native TextInput props except style, onFocus, onBlur, onPointerEnter, onPointerLeave, onChangeText</td>
			<td>Pass-through native input props.</td>
		</tr>
	</tbody>
</table>

#### <a id="selectdropdownprops"></a>DropdownProps<T>

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>data</td><td>T[]</td><td>required</td><td>Items to render in the dropdown.</td></tr>
		<tr><td>onSelect</td><td>(item: T, index: number) =&gt; void</td><td>-</td><td>Called on item selection.</td></tr>
		<tr><td>onDropdownWillShow</td><td>(willShow: boolean) =&gt; void</td><td>-</td><td>Called before opening or closing.</td></tr>
		<tr><td>defaultValue</td><td>T</td><td>-</td><td>Pre-selected value.</td></tr>
		<tr><td>defaultValueByIndex</td><td>number</td><td>-</td><td>Pre-selected index, zero-based.</td></tr>
		<tr><td>disabled</td><td>boolean</td><td>false</td><td>Disable the entire dropdown.</td></tr>
		<tr><td>disabledIndexes</td><td>number[]</td><td>-</td><td>Disable specific rows.</td></tr>
		<tr><td>disableAutoScroll</td><td>boolean</td><td>false</td><td>Prevent auto scroll to selection.</td></tr>
		<tr><td>testID</td><td>string</td><td>-</td><td>Test id for the list.</td></tr>
		<tr><td>onFocus / onBlur</td><td>() =&gt; void</td><td>-</td><td>Focus lifecycle callbacks.</td></tr>
		<tr><td>onScrollEndReached</td><td>() =&gt; void</td><td>-</td><td>Fired at the end of the list.</td></tr>
		<tr><td>onChangeSearchInputText</td><td>(text: string) =&gt; void</td><td>-</td><td>Use your own search handler and disable internal filtering.</td></tr>
		<tr><td>dropDownSpacing</td><td>number</td><td>-</td><td>Space between the trigger button and the dropdown window.</td></tr>
		<tr><td>dropdownStyle</td><td>ViewStyle</td><td>-</td><td>Container style.</td></tr>
		<tr><td>statusBarTranslucent</td><td>boolean</td><td>-</td><td>Show under the Android status bar.</td></tr>
		<tr><td>dropdownOverlayColor</td><td>string</td><td>-</td><td>Backdrop color.</td></tr>
		<tr><td>showsVerticalScrollIndicator</td><td>boolean</td><td>-</td><td>Show the vertical scroll bar.</td></tr>
		<tr><td>animateDropdown</td><td>boolean</td><td>-</td><td>Enable opening and closing animation.</td></tr>
		<tr><td>animationConfig</td><td>AnimationConfig</td><td>-</td><td>Timing config when using timing animation.</td></tr>
		<tr><td>springConfig</td><td>WithSpringConfig</td><td>-</td><td>Spring config when using spring animation.</td></tr>
		<tr><td>animationType</td><td>'spring' | 'timing'</td><td>'spring'</td><td>Choose the animation driver.</td></tr>
		<tr><td>search</td><td>boolean</td><td>-</td><td>Enable the built-in search input.</td></tr>
		<tr><td>searchInputStyle</td><td>ViewStyle</td><td>-</td><td>Search container style.</td></tr>
		<tr><td>searchInputTxtColor</td><td>string</td><td>-</td><td>Search input text color.</td></tr>
		<tr><td>searchInputTxtStyle</td><td>ViewStyle</td><td>-</td><td>Search input text style.</td></tr>
		<tr><td>searchPlaceHolder</td><td>string</td><td>-</td><td>Search placeholder text.</td></tr>
		<tr><td>searchPlaceHolderColor</td><td>string</td><td>-</td><td>Search placeholder color.</td></tr>
		<tr><td>renderSearchInputLeftIcon</td><td>() =&gt; ReactElement</td><td>-</td><td>Left icon renderer.</td></tr>
		<tr><td>renderSearchInputRightIcon</td><td>() =&gt; ReactElement</td><td>-</td><td>Right icon renderer.</td></tr>
		<tr><td>renderButton</td><td><code>({ selectedItem, isVisible, disabled, onPress }) =&gt; JSX.Element</code></td><td>-</td><td>Custom trigger button.</td></tr>
		<tr><td>renderButtonContent</td><td>(selectedItem, isVisible, focused) =&gt; JSX.Element</td><td>-</td><td>Custom content inside the trigger.</td></tr>
		<tr><td>renderItemButton</td><td><code>({ item, index, isSelected, disabled, onPress }) =&gt; JSX.Element</code></td><td>-</td><td>Custom item button.</td></tr>
		<tr><td>renderItemContent</td><td>(item, index, isSelected) =&gt; JSX.Element</td><td>-</td><td>Custom item content.</td></tr>
	</tbody>
</table>

#### DropdownRef

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Signature</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>reset</td><td>() =&gt; void</td><td>Clear selection and search.</td></tr>
		<tr><td>openDropdown</td><td>() =&gt; void</td><td>Open programmatically.</td></tr>
		<tr><td>closeDropdown</td><td>() =&gt; void</td><td>Close programmatically.</td></tr>
		<tr><td>selectIndex</td><td>(index: number) =&gt; void</td><td>Select item by index.</td></tr>
	</tbody>
</table>

### Navigation types

Spatial navigation types and component APIs now live in [SPATIAL_NAVIGATION_API.md](./SPATIAL_NAVIGATION_API.md).

- Types: `FocusableViewProps`, `SpatialNavigationNodeDefaultProps`, `SpatialNavigationNodeRef`, `SpatialNavigationVirtualizedListRef`, `CustomScrollViewProps`, `NodeOrientation`, `TypeVirtualizedListAnimation`
- Components: `SpatialNavigationRoot`, `SpatialNavigationView`, `SpatialNavigationScrollView`, `SpatialNavigationFocusableView`, `SpatialNavigationNode`, `SpatialNavigationVirtualizedList`, `SpatialNavigationVirtualizedGrid`, `DefaultFocus`, `SpatialNavigationDeviceTypeProvider`

## Components details

### <a id="ripple"></a>Ripple

Visual press feedback effect available in BaseButton and other interactables. Enable via enableRipple and configure
color/duration.

### <a id="spatialnavigationview"></a>SpatialNavigationView

Container that participates in spatial (D‑Pad) navigation when a SpatialNavigationRoot is present. Falls back to a plain
View otherwise.

Full props and usage notes: [SPATIAL_NAVIGATION_API.md#spatialnavigationview](./SPATIAL_NAVIGATION_API.md#spatialnavigationview)

### <a id="spatialnavigationscrollview"></a>SpatialNavigationScrollView

ScrollView that keeps the focused child in view when navigating with a remote/keyboard, with optional hover arrows for
pointer devices.

Full props and usage notes: [SPATIAL_NAVIGATION_API.md#spatialnavigationscrollview](./SPATIAL_NAVIGATION_API.md#spatialnavigationscrollview)

### <a id="spatialnavigationfocusableview"></a>SpatialNavigationFocusableView

Focusable wrapper that renders a View and exposes node state to children. See FocusableViewProps for the full API.

- See: [SPATIAL_NAVIGATION_API.md#focusableviewprops](./SPATIAL_NAVIGATION_API.md#focusableviewprops)

### <a id="spatialnavigationroot"></a>SpatialNavigationRoot

Top-level provider that enables spatial navigation, remote handling, and focus management.

Full props and usage notes: [SPATIAL_NAVIGATION_API.md#spatialnavigationroot](./SPATIAL_NAVIGATION_API.md#spatialnavigationroot)

### <a id="spatialnavigationnode"></a>SpatialNavigationNode

Low-level focusable node used internally by SpatialNavigationFocusableView. Exposes focus lifecycle events and can be
referenced via SpatialNavigationNodeRef.

- See: [SPATIAL_NAVIGATION_API.md#spatialnavigationnoderef](./SPATIAL_NAVIGATION_API.md#spatialnavigationnoderef)

### <a id="spatialnavigationvirtualizedlist"></a>SpatialNavigationVirtualizedList

Virtualized list integrated with spatial navigation. Provides focus(index) and scrollTo(index) via ref.

- See: [SPATIAL_NAVIGATION_API.md#spatialnavigationvirtualizedlistref](./SPATIAL_NAVIGATION_API.md#spatialnavigationvirtualizedlistref)

### <a id="spatialnavigationvirtualizedgrid"></a>SpatialNavigationVirtualizedGrid

Virtualized grid version exposing the same ref API as the list.

- See: [SPATIAL_NAVIGATION_API.md#spatialnavigationvirtualizedlistref](./SPATIAL_NAVIGATION_API.md#spatialnavigationvirtualizedlistref)

### <a id="defaultfocus"></a>DefaultFocus

Marks a node as initially focused within a subtree when the root activates.

### <a id="spatialnavigationdevicetypeprovider"></a>SpatialNavigationDeviceTypeProvider

Provider that detects device type (pointer/remote) and adapts focus interactions accordingly.

---

## 📜 Contributing and license

PRs and issues are welcome. See LICENSE for details (MIT).

Author: ImRoodyDev (https://github.com/imroodydev)
