import {ColorValue, TextInputProps, TextStyle, ViewStyle} from "react-native";
import React from "react";

export type InputConfig = {
	/** CSS class for the input */
	className?: string;
	placeholderClassName?: string;
} & Pick<TextInputProps, 'style' |
	'textContentType' |
	'accessibilityRole' |
	'placeholder' |
	'secureTextEntry' |
	'passwordRules' |
	'inputMode' |
	'maxLength' |
	'editable' |
	'defaultValue' |
	'readOnly' |
	'autoFocus' |
	'onEndEditing'>;

export type LabelInputStyle = {} & Omit<ViewStyle, 'overflow' | 'display' | 'alignItems' | 'justifyContent' | 'color' | 'backgroundColor'>;

export type LabeledInputProps = {
	/** Callback when text changes */
	onChange?: (text: string) => any;

	style?: LabelInputStyle;
	textStyle?: {
		placeholderLabelOffset?: number;
		filledPlaceholderFontSize?: number;
		filledPlaceholderColor?: ColorValue;
		placeholderTextColor?: ColorValue;
	} & Pick<TextStyle, 'fontSize' | 'fontWeight' | 'fontFamily' | 'color' | 'letterSpacing' | 'textTransform' | 'textDecorationLine' | 'textShadowColor' | 'textShadowOffset' | 'textShadowRadius'>;

	className?: string;
	inputConfig: InputConfig;
	iconElement?: ((focused: boolean) => React.JSX.Element) | React.JSX.Element;

	// Colors
	textColor?: ColorValue;
	focusedTextColor?: ColorValue;
	backgroundColor?: ColorValue;
	selectedBackgroundColor?: ColorValue;
	pressedBackgroundColor?: ColorValue;
	focusOutline?: { type: 'border' | 'outline', width: number }
};
