import {PressableStateCallbackType, ViewStyle} from 'react-native';
import type {AnimatedStyle, EasingFunction, EasingFunctionFactory} from 'react-native-reanimated';
import {ReduceMotion} from 'react-native-reanimated';

export type ButtonAllowedStyle = Omit<ViewStyle, 'backgroundColor' | 'transform'>;
export type PressableState = PressableStateCallbackType & { focused: boolean };
export type PressableStyle = AnimatedStyle<ButtonAllowedStyle> | ((state: PressableState) => ButtonAllowedStyle);

// export type PressableStyle = StyleProp<AnimatedStyle<StyleProp< ButtonAllowedStyle>>
// 	| ((state: PressableStateCallbackType & { focused: boolean }) =>
// 	StyleProp<AnimatedStyle<StyleProp<Omit<ViewStyle, 'backgroundColor' | 'transform'>>>>);

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
