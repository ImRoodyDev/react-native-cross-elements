// hooks/useButtonAnimation.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	ColorValue,
	GestureResponderEvent,
	MouseEvent,
	NativeSyntheticEvent,
	Platform,
	PressableProps,
	TargetedEvent,
} from 'react-native';
import { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { AnimationConfig } from '../types/Button';

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
	focusOutline?: { type: 'border' | 'outline'; width: number };

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

		textColor,
		focusedTextColor = textColor,
		backgroundColor,
		pressedBackgroundColor = backgroundColor,
		selectedBackgroundColor = backgroundColor,
		focusOutline,
		pressedScale,
		animationConfig,
	} = props;

	// State
	const [isFocused, setIsFocused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [currentTextColor, setTextColor] = useState(textColor);

	// Refs to track latest values without re-renders
	const isFocusedRef = useRef(isFocused);
	const isHoveredRef = useRef(isHovered);
	const propsRef = useRef(props);
	propsRef.current = props;

	// Animated values
	const scaleAnim = useSharedValue(1);
	const lineWidthAnim = useSharedValue(0);
	const backgroundColorAnim = useSharedValue(backgroundColor);

	// Update colors when props change
	useEffect(() => {
		cancelAnimation(backgroundColorAnim);
		backgroundColorAnim.value = withTiming(backgroundColor as string, { duration: _animDuration });
		setTextColor(textColor);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [backgroundColor, textColor]);

	// Keep ref in sync with state
	useEffect(() => {
		isFocusedRef.current = isFocused;
	}, [isFocused]);

	useEffect(() => {
		isHoveredRef.current = isHovered;
	}, [isHovered]);

	// Animated styles
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ scale: scaleAnim.value }],
		backgroundColor: backgroundColorAnim.value,
		// Outline or border for focus state
		...(focusOutline && focusOutline.type === 'border'
			? {
					borderWidth: lineWidthAnim.value,
					borderColor: focusedTextColor,
				}
			: {}),
		...(focusOutline && focusOutline.type === 'outline'
			? {
					outlineWidth: lineWidthAnim.value,
					outlineColor: focusedTextColor,
				}
			: {}),
	}));

	// Generic animation handler
	const animateState = useCallback(
		(newBgColor: ColorValue, newTextColor?: ColorValue, scaleAction?: 'press' | 'release') => {
			// Use the latest textColor from props to avoid stale closures
			const latestTextColor = propsRef.current.textColor;

			setTextColor(newTextColor ?? latestTextColor);

			backgroundColorAnim.value = withTiming(newBgColor as string, { duration: _animDuration });

			// Handle scaling animation
			if (pressedScale !== undefined && scaleAction) {
				scaleAnim.value =
					scaleAction === 'press'
						? withTiming(pressedScale, animationConfig ?? { duration: 160 })
						: withSpring(1, { damping: 10, stiffness: 100 });
			}

			// Handle focus outline animation
			if (focusOutline && focusOutline.width) {
				lineWidthAnim.value = isFocusedRef.current
					? withTiming(focusOutline.width, animationConfig ?? { duration: _animDuration })
					: withTiming(0, animationConfig ?? { duration: _animDuration });
			}
		},
		[pressedScale, animationConfig, focusOutline, backgroundColorAnim, scaleAnim, lineWidthAnim],
	);

	// Event handlers
	const handlePressIn = useCallback(
		(e: GestureResponderEvent) => {
			onPressIn?.(e);
			animateState(pressedBackgroundColor, focusedTextColor, 'press');
		},
		[pressedBackgroundColor, focusedTextColor, animateState, onPressIn],
	);

	const handlePressOut = useCallback(
		(e: GestureResponderEvent) => {
			onPressOut?.(e);
			// On web we consider hovered state as selected, on native we consider focused state as selected
			// This because when pressout is triggered the button should go to its normal state
			const isSelected = (Platform.OS !== 'web' && isFocusedRef.current) || isHoveredRef.current;
			const newBgColor = isSelected ? selectedBackgroundColor : backgroundColor;
			const newTextColor = isSelected ? focusedTextColor : textColor;
			animateState(newBgColor, newTextColor, 'release');
		},
		[selectedBackgroundColor, backgroundColor, focusedTextColor, textColor, animateState, onPressOut],
	);

	const handleFocus = useCallback(
		(e: NativeSyntheticEvent<TargetedEvent>) => {
			onFocus?.(e);
			setIsFocused(true);
			animateState(selectedBackgroundColor, focusedTextColor);
		},
		[selectedBackgroundColor, focusedTextColor, animateState, onFocus],
	);

	const handleBlur = useCallback(
		(e: NativeSyntheticEvent<TargetedEvent>) => {
			onBlur?.(e);
			setIsFocused(false);
			const newBgColor = isHoveredRef.current ? selectedBackgroundColor : backgroundColor;
			const newTextColor = isHoveredRef.current ? focusedTextColor : textColor;
			animateState(newBgColor, newTextColor);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[backgroundColor, textColor, animateState, onBlur],
	);

	const handleHoverIn = useCallback(
		(e: MouseEvent) => {
			onHoverIn?.(e);
			setIsHovered(true);
			animateState(selectedBackgroundColor, focusedTextColor);
		},
		[selectedBackgroundColor, focusedTextColor, animateState, onHoverIn],
	);

	const handleHoverOut = useCallback(
		(e: MouseEvent) => {
			onHoverOut?.(e);
			setIsHovered(false);
			// On web we consider hovered state as selected, on native we consider focused state as selected
			// This because when pressout is triggered the button should go to its normal state
			const newBgColor =
				Platform.OS !== 'web' && isFocusedRef.current ? selectedBackgroundColor : propsRef.current.backgroundColor;
			const newTextColor =
				Platform.OS !== 'web' && isFocusedRef.current ? focusedTextColor : propsRef.current.textColor;
			animateState(newBgColor, newTextColor);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[animateState, onHoverOut],
	);

	// Platform-specific handlers
	const platformHandlers = Platform.select({
		default: {
			onPressIn: handlePressIn,
			onPressOut: handlePressOut,
			onFocus: handleFocus,
			onBlur: handleBlur,
			onHoverIn: handleHoverIn,
			onHoverOut: handleHoverOut,
		},
	});

	return {
		animatedStyles,
		currentTextColor,
		platformHandlers,
		isFocused,
		isHovered,
		handleFocus,
		handleBlur,
	};
};
