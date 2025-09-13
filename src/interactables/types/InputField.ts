import {ColorValue, TextInputProps, TextStyle, ViewStyle} from "react-native";
import React from "react";

export type InputConfig = {
	/** CSS class for the input */
	className?: string;
	placeholderClassName?: string;
} & Omit<TextInputProps, 'style' | 'onFocus' | 'onBlur' | 'onPointerEnter' | 'onPointerLeave' | 'onChangeText'>;

export type LabelInputState = { readonly focused: boolean, readonly filled: boolean };
export type LabelInputStyle = Omit<ViewStyle, 'overflow' | 'display' | 'flexDirection' | 'alignItems' | 'justifyContent' | 'color' | 'backgroundColor'>;

export type LabeledInputProps = {
	/**
	 * Orientation of the button for spatial navigation.
	 */
	orientation?: 'horizontal' | 'vertical';

	/** Callback when text changes */
	onChange?: (text: string) => any;

	/**
	 * Styling for the component
	 */
	style?: LabelInputStyle | ((state: LabelInputState) => LabelInputStyle);
	/**
	 * Style for the label text
	 * - labelFilledOffset: number - Offset for the label when the input is filled (default: 0)
	 * - labelFilledFontSize: number - Font size for the label when the input is filled (default: 12)
	 * - labelFilledColor: ColorValue - Color for the label when the input is filled (default: '#000' or '#fff')
	 */
	labelStyle?: {
		labelFilledOffset?: number;
		labelFilledFontSize?: number;
		labelFilledColor?: ColorValue;
	} & Omit<TextStyle, 'bottom'>;
	/**
	 * Styling for the input text
	 * Support : fontSize, fontFamily, fontWeight, color, textAlign...etc
	 * Check React Native InputStyle for more details
	 */
	textStyle?: TextStyle;

	/**
	 * Class name for the outer wrapper
	 */
	className?: string;
	/**
	 * Additional configuration for the TextInput element
	 * Support : Accessibility
	 */
	inputConfig: InputConfig;
	/**
	 * Left component or function that returns a component
	 */
	leftComponent?: ((state: LabelInputState) => React.JSX.Element) | React.JSX.Element;

	/**
	 * Right component or function that returns a component
	 */
	rightComponent?: ((state: LabelInputState) => React.JSX.Element) | React.JSX.Element;

	// Colors
	textColor?: ColorValue;
	focusedTextColor?: ColorValue;
	backgroundColor?: ColorValue;
	selectedBackgroundColor?: ColorValue;
	pressedBackgroundColor?: ColorValue;
};

export type FlatInputProps = Omit<LabeledInputProps, 'labelStyle'> & {
	/**
	 * Style for the label text
	 * - labelFilledFontSize: number - Font size for the label when the input is filled (default: 12)
	 * - labelFilledColor: ColorValue - Color for the label when the input is filled (default: '#000' or '#fff')
	 */
	labelStyle?: {
		labelFilledFontSize?: number;
		labelFilledColor?: ColorValue;
	} & Omit<TextStyle, 'bottom'>;

	/**
	 * Style the input view component
	 */
	inputStyle?: Omit<ViewStyle, 'backgroundColor' | 'flexDirection' | 'flex'>;
};