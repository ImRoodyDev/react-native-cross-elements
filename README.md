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
- Quick start
- Spatial navigation overview
- Components
- Usage snippets
- API and types reference
- Recipes
- Contributing and license

## 📦 Installation

1) Install the package and required peers

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
import {Text} from 'react-native';
import {
	SpatialNavigationDeviceTypeProvider,
	SpatialNavigationRoot,
	SpatialNavigationFocusableView,
	SpatialNavigationView,
	SpatialNavigation,
} from 'react-native-elements';

export default function App() {
	// Optional: wire up keyboard/remote once
	React.useEffect(() => {
		SpatialNavigation.configureRemoteControl();
	}, []);

	return (
		<SpatialNavigationDeviceTypeProvider>
			<SpatialNavigationRoot>
				<SpatialNavigationFocusableView style={{padding: 12, backgroundColor: '#222', borderRadius: 8}}>
					<Text style={{color: 'white'}}>Focusable card</Text>
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
				style={({focused, pressed}) => ([
					{
						paddingHorizontal: 16,
						paddingVertical: 12,
						borderRadius: 12,
						borderWidth: focused ? 2 : 1,
						borderColor: focused ? '#60A5FA' : 'transparent',
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
				sliderItemButtonStyle={({focused}) => ({
					backgroundColor: 'transparent',
				})}
				sliderItemTextStyle={({focused}) => ({
					color: focused ? '#111827' : '#111827',
					fontWeight: focused ? '700' : '500',
				})}
				textProps={{numberOfLines: 1}}
				style={{width: 420, height: 44}}
			/>

			{/* AutoDetectButtonsSlider: auto horizontal/vertical based on container */}
			<AutoDetectButtonsSlider
				options={["One", "Two", "Three", "Four"]}
				initialIndex={0}
				onSelect={(i) => console.log('auto slider selected', i)}
				sliderContainerStyle={{backgroundColor: '#00000022', borderRadius: 9999, padding: 4}}
				sliderStyle={{backgroundColor: '#111827'}}
				sliderItemButtonStyle={{backgroundColor: 'transparent'}}
				sliderItemTextStyle={{color: '#111827', fontWeight: '600'}}
				textProps={{numberOfLines: 1}}
				style={{width: 420, height: 44}}
			/>
		</View>
	);
}
```

### Dropdown

```tsx
import React from 'react';
import {Text, View} from 'react-native';
import {Dropdown, type SelectDropdownProps, type SelectDropdownRef} from 'react-native-elements';

const options = [
	{label: 'One', value: 1},
	{label: 'Two', value: 2},
	{label: 'Three', value: 3},
	{label: 'Four', value: 4},
];

export default function MyDropdown() {
	const ref = React.useRef<SelectDropdownRef>(null);

	const onSelect: SelectDropdownProps<typeof options[number]>['onSelect'] = (item, index) => {
		console.log('selected', {item, index});
	};

	return (
		<View style={{gap: 12}}>
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
				animationConfig={{duration: 280}}
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
					<View style={{padding: 12, borderRadius: 8, backgroundColor: focused ? '#222' : '#333'}}>
						<Text style={{color: 'white'}}>
							{selectedItem ? selectedItem.label : 'Select an option'} {isVisible ? '▲' : '▼'}
						</Text>
					</View>
				)}
				renderItemContent={(item, index, isSelected) => (
					<View style={{padding: 12, backgroundColor: isSelected ? '#222' : 'transparent'}}>
						<Text style={{color: 'white'}}>{index + 1}. {item.label}</Text>
					</View>
				)}
			/>

			<Text onPress={() => ref.current?.openDropdown()} style={{color: '#4EA8DE'}}>Open programmatically</Text>
			<Text onPress={() => ref.current?.selectIndex(0)} style={{color: '#4EA8DE'}}>Select first option</Text>
		</View>
	);
}
```

### Switch

```tsx
import React from 'react';
import {Switch} from 'react-native-cross-elements';

export default function MySwitch() {
	const [on, setOn] = React.useState(false);
	return <Switch value={on} onValueChange={setOn}/>;
}
```

### FlatLabelInput

```tsx
import React from 'react';
import {FlatLabelInput} from 'react-native-cross-elements';
import {Text} from 'react-native';

export default function MyInput() {
	const [text, setText] = React.useState('');
	const [focused, setFocused] = React.useState(false);

	return (
		<FlatLabelInput
			onChange={setText}
			// Visuals
			textColor="#E5E7EB"
			focusedTextColor="#FFFFFF"
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
			leftComponent={(state) => (
				<Text style={{marginRight: 8}}>{state.focused ? '✉️' : '📧'}</Text>
			)}
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
import {View} from 'react-native';
import {PortalHost} from 'react-native-cross-elements';

export default function RootLayout() {
	return (
		<View style={{flex: 1}}>
			{/* Top-level host. Name is optional; default is 'root_ui_portal'. */}
			<PortalHost/>
			{/* Your app screens */}
			{/* <AppNavigator /> */}
		</View>
	);
}
```

#### Example: global toast

```tsx
import React from 'react';
import {Text, View} from 'react-native';
import {Portal} from 'react-native-cross-elements';

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
					<View style={{
						paddingVertical: 10,
						paddingHorizontal: 16,
						borderRadius: 10,
						backgroundColor: '#111827'
					}}>
						<Text style={{color: 'white'}}>{toast}</Text>
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
import {Text, View, Pressable} from 'react-native';
import {Portal} from 'react-native-cross-elements';

export function PopoverDemo() {
	const [visible, setVisible] = React.useState(false);

	return (
		<View style={{padding: 24}}>
			<Pressable onPress={() => setVisible((v) => !v)}>
				<Text>Toggle popover</Text>
			</Pressable>

			<Portal>
				{visible && (
					<View style={{position: 'absolute', top: 120, left: 24, pointerEvents: 'auto'}}>
						<View style={{padding: 8, backgroundColor: '#222', borderRadius: 8}}>
							<Text style={{color: 'white'}}>I'm a popover</Text>
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

## Components details

### <a id="spatialnavigationview"></a>SpatialNavigationView

Container that participates in spatial (D‑Pad) navigation when a SpatialNavigationRoot is present. Falls back to a plain
View otherwise.

Props

| Prop        | Type                       | Default      | Description                                                                 |
|-------------|----------------------------|--------------|-----------------------------------------------------------------------------|
| children    | React.ReactNode            | —            | Content to render. Can include focusable descendants.                       |
| direction   | 'horizontal' \| 'vertical' | 'horizontal' | Layout direction; applies flexDirection row/column on the inner View.       |
| alignInGrid | boolean                    | false        | Hint to align focusable children as a virtual grid; ignored without a root. |

### <a id="spatialnavigationscrollview"></a>SpatialNavigationScrollView

ScrollView that keeps the focused child in view when navigating with a remote/keyboard, with optional hover arrows for
pointer devices.

Props

| Prop                           | Type         | Default | Description                                                               |
|--------------------------------|--------------|---------|---------------------------------------------------------------------------|
| horizontal                     | boolean      | false   | Horizontal scroll direction.                                              |
| offsetFromStart                | number       | 0       | Extra margin from the start edge when auto-scrolling to focused elements. |
| pointerScrollSpeed             | number       | 10      | Pixels scrolled every 10ms when hovering arrow areas (remote pointer).    |
| useNativeScroll                | boolean      | false   | Use native ScrollView instead of CSS-based custom scroll (web).           |
| scrollDuration (web CSS only)  | number       | 200     | Duration for CSS-based smooth scroll on web.                              |
| ascendingArrow/descendingArrow | ReactElement | —       | Optional arrow elements.                                                  |
| ascendingArrowContainerStyle   | ViewStyle    | —       | Style for the up/left hover area.                                         |
| descendingArrowContainerStyle  | ViewStyle    | —       | Style for the down/right hover area.                                      |

### <a id="spatialnavigationfocusableview"></a>SpatialNavigationFocusableView

Focusable wrapper that renders a View and exposes node state to children. See FocusableViewProps for the full API.

- See: [FocusableViewProps](#focusableviewprops)

### <a id="spatialnavigationroot"></a>SpatialNavigationRoot

Top-level provider that enables spatial navigation, remote handling, and focus management.

Props

| Prop                              | Type       | Default | Description                                                                                                 |
|-----------------------------------|------------|---------|-------------------------------------------------------------------------------------------------------------|
| isActive                          | boolean    | true    | Locks/unlocks the root. Set false to disable focus handling for a screen while keeping another root active. |
| onDirectionHandledWithoutMovement | (dir: 'up' | 'down'  | 'left'                                                                                                      |'right') => void  | —       | Called when a border is reached without moving focus; useful to switch focus between sibling roots (e.g., side menu).  |

### <a id="spatialnavigationnode"></a>SpatialNavigationNode

Low-level focusable node used internally by SpatialNavigationFocusableView. Exposes focus lifecycle events and can be
referenced via SpatialNavigationNodeRef.

- See: [SpatialNavigationNodeRef](#spatialnavigationnoderef)

### <a id="spatialnavigationvirtualizedlist"></a>SpatialNavigationVirtualizedList

Virtualized list integrated with spatial navigation. Provides focus(index) and scrollTo(index) via ref.

- See: [SpatialNavigationVirtualizedListRef](#spatialnavigationvirtualizedlistref)

### <a id="spatialnavigationvirtualizedgrid"></a>SpatialNavigationVirtualizedGrid

Virtualized grid version exposing the same ref API as the list.

- See: [SpatialNavigationVirtualizedListRef](#spatialnavigationvirtualizedlistref)

### <a id="defaultfocus"></a>DefaultFocus

Marks a node as initially focused within a subtree when the root activates.

### <a id="spatialnavigationdevicetypeprovider"></a>SpatialNavigationDeviceTypeProvider

Provider that detects device type (pointer/remote) and adapts focus interactions accordingly.

### <a id="labeledinputfieldweb"></a>LabeledInputFieldWeb

Web-optimized labeled input variant. Accepts the same InputConfig as FlatLabelInput and adds web-specific className
styling hooks.

### <a id="ripple"></a>Ripple

Visual press feedback effect available in BaseButton and other interactables. Enable via enableRipple and configure
color/duration.

### Dropdown (component)

- See: [SelectDropdownProps](#selectdropdownprops)

---

## 📚 API and types reference

Below are the key public types exported by the library. Use them for strong typing and better DX.

### Interactables types

#### AnimationConfig (for Switch, Dropdown, etc.)

| Property     | Type           | Default | Description                      |
|--------------|----------------|--------:|----------------------------------|
| duration     | number         |       - | Duration of the animation in ms. |
| easing       | EasingFunction |       - | Easing used for the transition.  |
| reduceMotion | ReduceMotion   |       - | Reduce motion for accessibility. |

#### PressableStyle

- Either a style object for animated Pressable, or a function receiving Pressable state including `focused` and
  returning the style. Useful for focus/press/hover visual states.

#### BaseButtonProps

| Property                | Type                                                                    |  Default | Description                                           |
|-------------------------|-------------------------------------------------------------------------|---------:|-------------------------------------------------------|
| orientation             | 'horizontal' \| 'vertical'                                              |        - | Orientation for spatial navigation.                   |
| onPress                 | (event: GestureResponderEvent) => any                                   |        - | Called when a single tap gesture is detected.         |
| enableRipple            | boolean                                                                 |    false | Enables ripple effect on press (Native and Web).      |
| className               | string                                                                  |        - | Optional classname for styling (web compatibility).   |
| children                | ReactNode \| ({currentTextColor, isFocused}) => ReactNode               | required | Button content or render function with state.         |
| pressedScale            | number                                                                  |        - | Scale value when the button is pressed.               |
| animationConfig         | AnimationConfig                                                         |        - | Animation configuration for button state transitions. |
| style                   | PressableStyle                                                          |        - | Custom style for the button.                          |
| textColor               | ColorValue                                                              |  'black' | Text color when not focused.                          |
| focusedTextColor        | ColorValue                                                              |  'black' | Text color when focused.                              |
| backgroundColor         | ColorValue                                                              |  'white' | Button background color (default state).              |
| selectedBackgroundColor | ColorValue                                                              |  'white' | Background color when the button is selected/focused. |
| pressedBackgroundColor  | ColorValue                                                              |  'white' | Background color when the button is pressed.          |
| rippleColor             | ColorValue                                                              |        - | RippleConfig color for the button press effect.       |
| centerRipple            | boolean                                                                 |    false | If true, ripple starts at the center of the button.   |
| rippleDuration          | number                                                                  |        - | Duration of the ripple animation in milliseconds.     |
| ...PressableProps       | Omit<PressableProps, 'onPress' \| 'children' \| 'style' \| 'className'> |        - | All other React Native Pressable props.               |

#### FlatInputProps

| Property                                | Type                                                     | Default | Description                         |
|-----------------------------------------|----------------------------------------------------------|--------:|-------------------------------------|
| All LabeledInputProps except labelStyle | -                                                        |       - | Inherits all except labelStyle.     |
| labelStyle                              | { labelFilledFontSize?, labelFilledColor?, ...TextStyle} |       - | Label style and filled state props. |
| inputStyle                              | ViewStyle (partial)                                      |       - | Style for the input view component. |

#### SpatialNavigationNodeDefaultProps

| Property         | Type                       |    Default | Description                                            |
|------------------|----------------------------|-----------:|--------------------------------------------------------|
| orientation      | 'horizontal' \| 'vertical' | 'vertical' | Orientation for spatial navigation direction.          |
| onFocus          | () => void                 |          - | Called when the node receives focus.                   |
| onBlur           | () => void                 |          - | Called when the node loses focus.                      |
| onSelect         | () => void                 |          - | Called when the node is selected/pressed.              |
| onLongSelect     | () => void                 |          - | Called when the node is long pressed.                  |
| onActive         | () => void                 |          - | Called when the node becomes active.                   |
| onInactive       | () => void                 |          - | Called when the node becomes inactive.                 |
| alignInGrid      | boolean                    |      false | Whether to align in grid layout.                       |
| indexRange       | [number, number]           |          - | Index range for virtualized components.                |
| additionalOffset | number                     |          - | Additional offset for spatial navigation calculations. |

#### LabeledInputProps

| Property                | Type                                                                        |  Default | Description                                              |
|-------------------------|-----------------------------------------------------------------------------|---------:|----------------------------------------------------------|
| onChange                | (text: string) => void                                                      |        - | Called when the input text changes.                      |
| style                   | LabelInputStyle \| (state: LabelInputState) => LabelInputStyle              |        - | Container style (layout properties).                     |
| labelStyle              | {labelFilledOffset?, labelFilledFontSize?, labelFilledColor?, ...TextStyle} |        - | Label style and filled state props.                      |
| textStyle               | TextStyle                                                                   |        - | Typography for label/placeholder (fontSize, color, etc.) |
| className               | string                                                                      |        - | Container CSS class (web).                               |
| inputConfig             | InputConfig                                                                 | required | Native TextInput props + classes.                        |
| leftComponent           | ReactElement \| (state: LabelInputState) => ReactElement                    |        - | Optional leading icon.                                   |
| rightComponent          | ReactElement \| (state: LabelInputState) => ReactElement                    |        - | Optional trailing icon.                                  |
| textColor               | ColorValue                                                                  |        - | Text color (unfocused).                                  |
| focusedTextColor        | ColorValue                                                                  |        - | Text color when focused.                                 |
| backgroundColor         | ColorValue                                                                  |        - | Background color.                                        |
| selectedBackgroundColor | ColorValue                                                                  |        - | Background when selected.                                |
| pressedBackgroundColor  | ColorValue                                                                  |        - | Background when pressed.                                 |
| focusOutline            | { type: 'border' &#124; 'outline'; width: number }                          |        - | Focus indicator style.                                   |

#### InputConfig (used by LabeledInputProps.inputConfig)

| Property             | Type                                                                                                                   | Description                      |
|----------------------|------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| className            | string                                                                                                                 | CSS class for the input (web).   |
| placeholderClassName | string                                                                                                                 | CSS class for placeholder (web). |
| ...TextInputProps    | All standard React Native TextInput props except style, onFocus, onBlur, onPointerEnter, onPointerLeave, onChangeText. |

#### <a id="selectdropdownprops"></a>SelectDropdownProps<T>

| Property                     | Type                                                            |  Default | Description                                             |
|------------------------------|-----------------------------------------------------------------|---------:|---------------------------------------------------------|
| data                         | T[]                                                             | required | Items to render in the dropdown.                        |
| onSelect                     | (item: T, index: number) => void                                |        - | Called on item selection.                               |
| onDropdownWillShow           | (willShow: boolean) => void                                     |        - | Called before opening/closing.                          |
| defaultValue                 | T                                                               |        - | Pre-selected value.                                     |
| defaultValueByIndex          | number                                                          |        - | Pre-selected index (zero-based).                        |
| disabled                     | boolean                                                         |    false | Disable the entire dropdown.                            |
| disabledIndexes              | number[]                                                        |        - | Disable specific rows.                                  |
| disableAutoScroll            | boolean                                                         |    false | Prevent auto scroll to selection.                       |
| testID                       | string                                                          |        - | Test id for the list.                                   |
| onFocus / onBlur             | () => void                                                      |        - | Focus lifecycle callbacks.                              |
| onScrollEndReached           | () => void                                                      |        - | Fired at end of list.                                   |
| onChangeSearchInputText      | (text: string) => void                                          |        - | Use your own search handler (disables internal filter). |
| dropDownSpacing              | number                                                          |        - | Space between trigger button and the dropdown window.   |
| dropdownStyle                | ViewStyle                                                       |        - | Container style.                                        |
| statusBarTranslucent         | boolean                                                         |        - | Show under Android status bar.                          |
| dropdownOverlayColor         | string                                                          |        - | Backdrop color.                                         |
| showsVerticalScrollIndicator | boolean                                                         |        - | Show vertical scroll bar.                               |
| animateDropdown              | boolean                                                         |        - | Enable opening/closing animation.                       |
| animationConfig              | AnimationConfig                                                 |        - | Timing config (if timing).                              |
| springConfig                 | WithSpringConfig                                                |        - | Spring config (if spring).                              |
| animationType                | 'spring' &#124; 'timing'                                        | 'spring' | Choose animation driver.                                |
| search                       | boolean                                                         |        - | Enable built-in search input.                           |
| searchInputStyle             | ViewStyle                                                       |        - | Search container style.                                 |
| searchInputTxtColor          | string                                                          |        - | Search input text color.                                |
| searchInputTxtStyle          | ViewStyle                                                       |        - | Search input text style.                                |
| searchPlaceHolder            | string                                                          |        - | Search placeholder text.                                |
| searchPlaceHolderColor       | string                                                          |        - | Search placeholder color.                               |
| renderSearchInputLeftIcon    | () => ReactElement                                              |        - | Left icon renderer.                                     |
| renderSearchInputRightIcon   | () => ReactElement                                              |        - | Right icon renderer.                                    |
| renderButton                 | ({ selectedItem, isVisible, disabled, onPress }) => JSX.Element |        - | Custom trigger button.                                  |
| renderButtonContent          | (selectedItem, isVisible, focused) => JSX.Element               |        - | Custom content inside trigger.                          |
| renderItemButton             | ({ item, index, isSelected, disabled, onPress }) => JSX.Element |        - | Custom item button.                                     |
| renderItemContent            | (item, index, isSelected) => JSX.Element                        |        - | Custom item content.                                    |

#### SelectDropdownRef

| Method        | Signature               | Description                 |
|---------------|-------------------------|-----------------------------|
| reset         | () => void              | Clear selection and search. |
| openDropdown  | () => void              | Open programmatically.      |
| closeDropdown | () => void              | Close programmatically.     |
| selectIndex   | (index: number) => void | Select item by index.       |

### Navigation types

#### FocusableViewProps

| Property                           | Type                                                        | Description                                                                                                                            |
|------------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| children                           | ReactElement or (state: FocusableNodeState) => ReactElement | Content or render-prop with node state.                                                                                                |
| …ViewProps                         | React Native View props                                     | All View props except children.                                                                                                        |
| …SpatialNavigationNodeDefaultProps | -                                                           | Focus handlers: onFocus, onBlur, onSelect, onLongSelect, onActive, onInactive; orientation, alignInGrid, indexRange, additionalOffset. |

#### InnerFocusableViewProps (internal)

- Same as FocusableViewProps plus a `nodeState` object injected by SpatialNavigationNode. Exposed here for completeness
  but not typically used directly.

#### SpatialNavigationNodeRef

| Method | Signature  | Description                  |
|--------|------------|------------------------------|
| focus  | () => void | Imperatively focus the node. |

#### SpatialNavigationVirtualizedListRef

| Property/Method           | Signature               | Description              |
|---------------------------|-------------------------|--------------------------|
| focus                     | (index: number) => void | Focus item at index.     |
| scrollTo                  | (index: number) => void | Scroll to item at index. |
| currentlyFocusedItemIndex | number                  | Current focused index.   |

#### SpatialNavigationVirtualizedGridRef

- Alias of SpatialNavigationVirtualizedListRef.

#### CustomScrollViewRef and CustomScrollViewProps

| Name             | Type                           | Description              |
|------------------|--------------------------------|--------------------------|
| getInnerViewNode | () => any                      | Underlying node handle.  |
| scrollTo         | ({ x?, y?, animated }) => void | Scroll programmatically. |

CustomScrollViewProps (extends ScrollViewProps)

| Property       | Type                                                                        | Description                           |
|----------------|-----------------------------------------------------------------------------|---------------------------------------|
| horizontal     | boolean                                                                     | Horizontal scroll.                    |
| scrollDuration | number                                                                      | Duration for CSS-based scroll on web. |
| onScroll       | (event: { nativeEvent: { contentOffset: { x: number; y: number }}}) => void | Scroll event handler.                 |

#### NodeOrientation

- 'horizontal' | 'vertical'

#### TypeVirtualizedListAnimation

| Signature                                                                      | Returns                               | Description                                  |
|--------------------------------------------------------------------------------|---------------------------------------|----------------------------------------------|
| ({ currentlyFocusedItemIndex, vertical?, scrollDuration, scrollOffsetsArray }) | Animated.WithAnimatedValue<ViewStyle> | Compute animated style for list transitions. |

## 📜 Contributing and license

PRs and issues are welcome. See LICENSE for details (MIT).

Author: ImRoodyDev (https://github.com/imroodydev)
