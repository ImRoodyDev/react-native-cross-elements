// BaseButton.tsx
import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { ColorValue, DimensionValue, Easing, GestureResponderEvent, Pressable, PressableProps, PressableStateCallbackType, StyleSheet, View } from 'react-native';
import Animated, { makeMutable, withTiming } from 'react-native-reanimated';
import { SpatialNavigationNode } from '../../navigation';
import { useButtonAnimation } from '../hooks/useButtonAnimation';
import { AnimationConfig, PressableStyle } from '../types/Button';
import color from 'color';
import { scheduleOnRN } from 'react-native-worklets';
import { Ripple, RippleConfig } from '../components/Effects/Ripple';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const _defaultColor: ColorValue = 'black';
const _defaultBgColor: ColorValue = 'white';

/**
 * Base props for the BaseButton component, extending PressableProps.
 * Includes properties for handling press events, ripple effects, styles, and colors.
 * Also supports animation configurations and accessibility features.
 * @see PressableProps
 */
export type BaseButtonProps = {
	/**
	 * Called when a single tap gesture is detected.
	 */
	onPress?: (event: GestureResponderEvent) => any | null | undefined;
	/**
	 * Enables ripple effect on press (Native and Web).
	 */
	enableRipple?: boolean;

	/**
	 * Optional class portalName for styling (web compatibility).
	 */
	className?: string;
	/**
	 * Button content or a render function that receives state.
	 */
	children: React.ReactNode | ((state: { currentTextColor: ColorValue | undefined; isFocused: boolean }) => React.ReactNode);

	/**
	 * Scale value when the button is pressed.
	 */
	pressedScale?: number;
	/**
	 * Animation configuration for button state transitions.
	 */
	animationConfig?: AnimationConfig;

	/**
	 * Custom style for the button.
	 */
	style?: PressableStyle;
	/**
	 * Text color when not focused.
	 */
	textColor?: ColorValue;
	/**
	 * Text color when focused.
	 */
	focusedTextColor?: ColorValue;
	/**
	 * Button background color (default state).
	 */
	backgroundColor?: ColorValue;
	/**
	 * Background color when the button is selected/focused.
	 */
	selectedBackgroundColor?: ColorValue;
	/**
	 * Background color when the button is pressed.
	 */
	pressedBackgroundColor?: ColorValue;
	/**
	 * RippleConfig color for the button press effect (if enabled).
	 */
	rippleColor?: ColorValue;
	/**
	 * If true, ripple starts at the center of the button.
	 */
	centerRipple?: boolean;
	/**
	 * Duration of the ripple animation in milliseconds.
	 */
	rippleDuration?: number;
} & Omit<PressableProps, 'onPress' | 'children' | 'style' | 'className'>;

/**
 * BaseButton component providing animated button functionality with focus and press states.
 * Supports ripple effects, customizable styles, and accessibility features.
 *
 */
export const BaseButton = React.forwardRef((props: BaseButtonProps, ref?: Ref<React.ComponentRef<typeof Pressable>>) => {
	// Destructure props with default values
	const {
		children,
		disabled,
		enableRipple,
		className,
		animationConfig,
		rippleDuration,

		onPress,
		onBlur,
		onFocus,
		onHoverIn,
		onHoverOut,
		onPressIn,
		onPressOut,

		style,
		pressedScale,
		rippleColor,
		centerRipple,
		textColor = _defaultColor,
		focusedTextColor = _defaultColor,
		backgroundColor = _defaultBgColor,
		selectedBackgroundColor = _defaultBgColor,
		pressedBackgroundColor = _defaultBgColor,
		...restPressableProps
	} = props;

	const [ripples, setRipples] = useState<RippleConfig[]>([]);
	const calculatedRippleColor = useRef<ColorValue>('transparent');
	const [layout, setLayout] = React.useState({ width: 0, height: 0 });

	const createRipple = useCallback(
		(e: GestureResponderEvent) => {
			if (!enableRipple) return;

			let touchX: DimensionValue = layout.width / 2;
			let touchY: DimensionValue = layout.height / 2;

			if (!centerRipple && e.nativeEvent && e.nativeEvent.locationX !== undefined && e.nativeEvent.locationY !== undefined) {
				touchX = e.nativeEvent.locationX;
				touchY = e.nativeEvent.locationY;
			}

			const rippleSize: DimensionValue = centerRipple ? Math.min(layout.width, layout.height) * 1.5 : Math.max(layout.width, layout.height) * 2;

			const newRipple: RippleConfig = {
				id: ripples.length,
				x: touchX,
				y: touchY,
				size: rippleSize,
				duration: rippleDuration ?? Math.min(rippleSize * 1.5, 300) * 2,
				animatedValue: makeMutable(0),
			};

			// Add new ripple to state
			setRipples((prev) => [...prev, newRipple]);

			// Start ripple animation
			newRipple.animatedValue.value = withTiming(
				1,
				{
					duration: newRipple.duration,
					easing: Easing.out(Easing.quad),
				},
				(finished) => {
					if (finished) {
						// Remove ripple after animation completes
						// runOnJS(setRipples)(prev => prev.filter(ripple => ripple.id !== newRipple.id));
						scheduleOnRN(() => setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id)));
					}
				}
			);
		},
		[enableRipple, layout, centerRipple, ripples, rippleDuration]
	);
	const handlePressIn = (e: GestureResponderEvent) => {
		onPressIn?.(e);
		createRipple(e);
	};

	// Button animation hook
	const { animatedStyles, currentTextColor, platformHandlers, isFocused, handleFocus, handleBlur } = useButtonAnimation({
		backgroundColor,
		pressedBackgroundColor,
		selectedBackgroundColor,
		textColor,
		focusedTextColor,
		pressedScale,
		animationConfig,
		onBlur,
		onFocus,
		onHoverIn,
		onHoverOut,
		onPressIn: handlePressIn,
		onPressOut,
	});

	useEffect(() => {
		if (calculatedRippleColor.current !== rippleColor) {
			calculatedRippleColor.current = rippleColor ?? (color('white').fade(0.32).rgb().string() as ColorValue);
		}
	}, [rippleColor]);

	return (
		<SpatialNavigationNode isFocusable={!disabled} onSelect={() => onPress?.({} as any)} onFocus={() => handleFocus({} as any)} onBlur={() => handleBlur({} as any)}>
			{() => (
				<AnimatedPressable
					ref={ref}
					disabled={disabled}
					accessibilityRole={'button'}
					{...restPressableProps}
					// ts-expect-error TODO: accept classname if Tailwind or Nativewind is in the user enviroment
					className={className}
					style={[baseStyle.button, typeof style === 'function' ? (e: PressableStateCallbackType) => style({ ...e, focused: isFocused }) : style, animatedStyles]}
					onPress={onPress}
					onLayout={(e) => setLayout(e.nativeEvent.layout)}
					{...platformHandlers}
				>
					{typeof children === 'function' ? children({ currentTextColor, isFocused }) : children}
					{enableRipple && (
						<View style={[baseStyle.rippleContainer]} pointerEvents="none">
							{ripples.map((ripple) => (
								<Ripple key={ripple.id} ripple={ripple} color={calculatedRippleColor.current} />
							))}
						</View>
					)}
				</AnimatedPressable>
			)}
		</SpatialNavigationNode>
	);
});
BaseButton.displayName = 'BaseButton';

const baseStyle = StyleSheet.create({
	button: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 6,
		outlineColor: 'transparent',
		borderColor: 'transparent',
		overflow: 'hidden',
	},
	rippleContainer: {
		...StyleSheet.absoluteFillObject,
		overflow: 'hidden',
	},
	ripple: {
		position: 'absolute',
	},
});
