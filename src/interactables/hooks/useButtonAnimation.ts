// hooks/useButtonAnimation.ts
import {useCallback, useEffect, useState} from 'react';
import {ColorValue, GestureResponderEvent, MouseEvent, NativeSyntheticEvent, Platform, PressableProps, TargetedEvent} from 'react-native';
import {useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import {AnimationConfig} from "../types/Button";

// Animation constants
const _animDuration = 100;

/**
 * Configuration properties for the button animation hook.
 */
type UseButtonAnimationProps = {
	/**
	 * Configuration for focus outline styling.
	 * @property type - Whether to use 'border' or 'outline' for focus indication
	 * @property width - The width of the focus outline in pixels
	 */
	focusOutline?: { type: 'border' | 'outline', width: number }

	/**
	 * Scale factor applied to the button when pressed (e.g., 0.95 for 5% reduction).
	 * If undefined, no scale animation will be applied.
	 */
	pressedScale?: number;

	/**
	 * Default text color when the button is in normal state.
	 */
	textColor?: ColorValue;

	/**
	 * Text color when the button is focused or hovered.
	 */
	focusedTextColor?: ColorValue;

	/**
	 * Custom animation configuration for timing and spring animations.
	 * Overrides default animation settings if provided.
	 */
	animationConfig?: AnimationConfig;

	/**
	 * Default background color of the button in normal state.
	 */
	backgroundColor: ColorValue;

	/**
	 * Background color when the button is being pressed.
	 */
	pressedBackgroundColor: ColorValue;

	/**
	 * Background color when the button is focused, hovered, or selected.
	 */
	selectedBackgroundColor: ColorValue;
} & Pick<PressableProps, 'onPressIn' | 'onPressOut' | 'onFocus' | 'onBlur' | 'onHoverIn' | 'onHoverOut'>;

/**
 * Custom hook to manage button animations and states.
 * @param props Configuration properties for the button animation.
 * @returns Animated styles, current text color, platform-specific handlers, focus state, and focus/blur handlers.
 */
export const useButtonAnimation = (props: UseButtonAnimationProps) => {
	const {
		onFocus,
		onBlur,
		onHoverIn,
		onHoverOut,
		onPressIn,
		onPressOut,

		backgroundColor,
		textColor,
		pressedBackgroundColor,
		selectedBackgroundColor,
		focusedTextColor,
		focusOutline,
		pressedScale,
		animationConfig
	} = props;

	// State
	const [isFocused, setIsFocused] = useState(false);
	const [currentTextColor, setTextColor] = useState(textColor);

	// Animated values
	const scaleAnim = useSharedValue(1);
	const lineWidthAnim = useSharedValue(0);
	const backgroundColorAnim = useSharedValue(backgroundColor);

	// Update colors when props change
	useEffect(() => {
		backgroundColorAnim.value = backgroundColor;
	}, [backgroundColor, textColor, backgroundColorAnim]);

	// Animated styles
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{scale: scaleAnim.value}],
		backgroundColor: backgroundColorAnim.value,
		// Outline or border for focus state
		...(focusOutline && focusOutline.type === 'border' ? {
			borderWidth: lineWidthAnim.value,
			borderColor: focusedTextColor,
		} : {}),
		...(focusOutline && focusOutline.type === 'outline' ? {
			outlineWidth: lineWidthAnim.value,
			outlineColor: focusedTextColor,
		} : {}),

	}));

	// Generic animation handler
	const animateState = useCallback((newBgColor: ColorValue, newTextColor?: ColorValue, scaleAction?: 'press' | 'release') => {
		backgroundColorAnim.value = withTiming(newBgColor as string, {duration: _animDuration});
		setTextColor(newTextColor);

		// Handle scaling animation
		if (pressedScale !== undefined && scaleAction) {
			scaleAnim.value = scaleAction === 'press' ?
				withTiming(pressedScale, animationConfig ?? {duration: 160})
				: withSpring(1, {damping: 10, stiffness: 100});
		}

		// Handle focus outline animation
		if (focusOutline && focusOutline.width) {
			lineWidthAnim.value = isFocused ?
				withTiming(focusOutline.width, animationConfig ?? {duration: _animDuration})
				: withTiming(0, animationConfig ?? {duration: _animDuration});
		}
	}, [pressedScale, scaleAnim, backgroundColorAnim, animationConfig, focusOutline, isFocused, lineWidthAnim]);

	// Event handlers
	const handlePressIn = useCallback((e: GestureResponderEvent) => {
		onPressIn?.(e);
		animateState(pressedBackgroundColor, focusedTextColor, 'press');
	}, [pressedBackgroundColor, focusedTextColor, animateState, onPressIn]);
	const handlePressOut = useCallback((e: GestureResponderEvent) => {
		onPressOut?.(e);
		// If the button is still focused, return to the focused state, otherwise return to the default state
		const newBgColor = isFocused ? selectedBackgroundColor : backgroundColor;
		const newTextColor = isFocused ? focusedTextColor : textColor;
		animateState(newBgColor, newTextColor, 'release');
	}, [isFocused, selectedBackgroundColor, backgroundColor, focusedTextColor, textColor, animateState, onPressOut]);

	const handleFocus = useCallback((e: NativeSyntheticEvent<TargetedEvent>) => {
		onFocus?.(e);
		setIsFocused(true);
		animateState(selectedBackgroundColor, focusedTextColor);
	}, [selectedBackgroundColor, focusedTextColor, animateState, onFocus]);
	const handleBlur = useCallback((e: NativeSyntheticEvent<TargetedEvent>) => {
		onBlur?.(e);
		setIsFocused(false);
		animateState(backgroundColor, textColor);
	}, [backgroundColor, textColor, animateState, onBlur]);

	const handleHoverIn = useCallback((e: MouseEvent) => {
		onHoverIn?.(e);
		setIsFocused(true);
		animateState(selectedBackgroundColor, focusedTextColor);
	}, [selectedBackgroundColor, focusedTextColor, animateState, onHoverIn]);
	const handleHoverOut = useCallback((e: MouseEvent) => {
		onHoverOut?.(e);
		setIsFocused(false);
		animateState(backgroundColor, textColor);
	}, [backgroundColor, textColor, animateState, onHoverOut]);

	// Platform-specific handlers
	const platformHandlers = Platform.select({
		default: {
			onPressIn: handlePressIn,
			onPressOut: handlePressOut,
			onFocus: handleFocus,
			onBlur: handleBlur,
			onHoverIn: handleHoverIn,
			onHoverOut: handleHoverOut,
		}
	});

	return {
		animatedStyles,
		currentTextColor,
		platformHandlers,
		isFocused,
		handleFocus,
		handleBlur
	};
};