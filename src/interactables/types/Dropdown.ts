import {ViewStyle} from "react-native";
import type {WithSpringConfig} from "react-native-reanimated";
import {AnimationConfig} from "./Button";
import React, {ReactElement} from "react";

/**
 * The public API of the dropdown when accessed via ref
 */
export interface SelectDropdownRef {
	/** Clear selection and search. */
	reset: () => void;
	/** Programmatically open the dropdown. */
	openDropdown: () => void;
	/** Programmatically close the dropdown. */
	closeDropdown: () => void;
	/** Select item by zero-based index. */
	selectIndex: (index: number) => void;
}

/**
 * Generic props for the SelectDropdown.
 * T will automatically infer from the `data` array type.
 */
export interface SelectDropdownProps<T> {
	/** The array of items to show in the dropdown */
	data: T[];
	/** Callback when an item is selected */
	onSelect?: (selectedItem: T, index: number) => void;
	/** Called before dropdown is shown or hidden */
	onDropdownWillShow?: (willShow: boolean) => void;
	/** Default selected defaultValue */
	defaultValue?: T;
	/** Default selected index */
	defaultValueByIndex?: number;
	/** Disable the entire dropdown */
	disabled?: boolean;
	/** Disable specific items by index */
	disabledIndexes?: number[];
	/** Prevent auto-scrolling to selected item */
	disableAutoScroll?: boolean;
	/** FlatList test ID */
	testID?: string;
	/** Focus and blur callbacks */
	onFocus?: () => void;
	onBlur?: () => void;
	/** Called when scroll reaches end */
	onScrollEndReached?: () => void;
	/** Custom external search handler — disables internal filtering */
	onChangeSearchInputText?: (text: string) => void;

	/** Space between button and dropdown */
	dropDownSpacing?: number;
	/** Style for the dropdown container. */
	dropdownStyle?: ViewStyle;
	/** Whether modal is shown under status bar (Android). */
	statusBarTranslucent?: boolean;
	/** Color of the backdrop behind the dropdown. */
	dropdownOverlayColor?: string;
	/** Show the list's vertical scrollbar. */
	showsVerticalScrollIndicator?: boolean;
	/** Enable opening/closing animation. */
	animateDropdown?: boolean;
	/** Animation config for timing/spring. */
	animationConfig?: AnimationConfig;
	/** Spring animation config when using spring. */
	springConfig?: WithSpringConfig;
	/** Animation driver to use. */
	animationType?: 'spring' | 'timing';

	/** Show a search input above the list. */
	search?: boolean;
	/** Container style for search input. */
	searchInputStyle?: ViewStyle;
	/** Text color for search input. */
	searchInputTxtColor?: string;
	/** Text style for search input. */
	searchInputTxtStyle?: ViewStyle;
	/** Placeholder text for search input. */
	searchPlaceHolder?: string;
	/** Placeholder color for search input. */
	searchPlaceHolderColor?: string;
	/** Render a left icon inside search input. */
	renderSearchInputLeftIcon?: () => ReactElement;
	/** Render a right icon inside search input. */
	renderSearchInputRightIcon?: () => ReactElement;

	/** Custom button renderer */
	renderButton?: (params: {
		/** Handler to open/close the dropdown. */
		onPress: () => void;
		/** Currently selected item or null. */
		selectedItem: T | null;
		/** Whether dropdown is open. */
		isVisible: boolean;
		/** Whether the button is disabled. */
		disabled: boolean;
	}) => React.JSX.Element;
	/** Custom button renderer */
	renderButtonContent?: (
		/** Currently selected item or null. */
		selectedItem: T | null,
		/** Whether dropdown is open. */
		isVisible: boolean,
		/** Whether the button node is focused. */
		focused: boolean
	) => React.JSX.Element;
	/** Custom button renderer for the dropdown buttons*/
	renderItemButton?: (params: {
		/** Item to render. */
		item: T;
		/** Item index in the filtered list. */
		index: number;
		/** Whether this item is currently selected. */
		isSelected: boolean;
		/** Disable this item. */
		disabled?: boolean;
		/** Select this item. */
		onPress: () => void;
	}) => React.JSX.Element;
	/** Custom item renderer */
	renderItemContent?: (
		/** Item to render. */
		item: T,
		/** Item index in the filtered list. */
		index: number,
		/** Whether this item is selected. */
		isSelected: boolean
	) => React.JSX.Element;
}