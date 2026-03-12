import { PressableStateCallbackType, TextStyle, ViewStyle } from 'react-native';
import type { AnimatedStyle, EasingFunction, EasingFunctionFactory } from 'react-native-reanimated';
import { ReduceMotion } from 'react-native-reanimated';

export type ButtonAllowedStyle = Omit<ViewStyle, 'backgroundColor' | 'transform'>;
export type PressableState = PressableStateCallbackType & { readonly focused: boolean; readonly hovered: boolean };
export type PressableStyle = ButtonAllowedStyle | AnimatedStyle<ButtonAllowedStyle> | ((state: PressableState) => ButtonAllowedStyle);

export type SliderButtonStyle = AnimatedStyle<ViewStyle> | ((state: { focused: boolean; isSelected: boolean }) => AnimatedStyle<ViewStyle>);
export type SliderTextStyle = AnimatedStyle<TextStyle> | ((state: { focused: boolean; isSelected: boolean }) => AnimatedStyle<TextStyle>);

/**
 * Animation configuration for the switch transitions.
 */
export type AnimationConfig = {
	/**
	 * Duration of the animation in milliseconds.
	 */
	duration?: number;
	/**
	 * Easing function for the animation.
	 */
	easing?: EasingFunction | EasingFunctionFactory;
	/**
	 * Whether to reduce motion for accessibility.
	 */
	reduceMotion?: ReduceMotion;
};
