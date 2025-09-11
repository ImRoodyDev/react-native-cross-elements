// BaseButton.tsx
import React, {Ref, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ColorValue, DimensionValue, GestureResponderEvent, NativeSyntheticEvent, Pressable, PressableProps, StyleSheet, TargetedEvent, View} from 'react-native';
import Animated, {Easing, makeMutable, withTiming} from 'react-native-reanimated';
import {SpatialNavigationNode} from '../../navigation';
import {useButtonAnimation} from '../hooks/useButtonAnimation';
import {AnimationConfig, PressableStyle} from '../types/Button';
import {Ripple, RippleConfig} from '../components/Effects/Ripple';
import color from "color";
import {useSpatialNavigatorExist} from "../../navigation/context/SpatialNavigatorContext";
import {scheduleOnRN} from "react-native-worklets";

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
	 * Optional classname for styling (web compatibility).
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
const BaseButtonInner = React.forwardRef((props: BaseButtonProps, ref?: Ref<React.ComponentRef<typeof Pressable>>) => {
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

	const spatialNavigatorExist = useSpatialNavigatorExist();
	const rippleIds = useRef(0);
	const [pressed, setPressed] = useState(false);
	const [ripples, setRipples] = useState<RippleConfig[]>([]);
	const [layout, setLayout] = React.useState({width: 0, height: 0});

	useEffect(() => {
		return () => {
			// Clear any pending ripples on unmount
			setRipples([]);
		};
	}, []);

	const createRipple = useCallback(
		(e: GestureResponderEvent) => {
			if (!enableRipple || layout.width === 0 || layout.height === 0) return;

			let touchX: DimensionValue = layout.width / 2;
			let touchY: DimensionValue = layout.height / 2;

			if (!centerRipple && e.nativeEvent && e.nativeEvent.locationX !== undefined && e.nativeEvent.locationY !== undefined) {
				touchX = e.nativeEvent.locationX;
				touchY = e.nativeEvent.locationY;
			}

			const rippleSize: DimensionValue = centerRipple ? Math.min(layout.width, layout.height) * 1.5 : Math.max(layout.width, layout.height) * 2;

			// Check ripple count inside the function instead
			setRipples((prev) => {
				if (prev.length > 10) return prev;

				const newRipple: RippleConfig = {
					id: rippleIds.current++,
					x: touchX,
					y: touchY,
					size: rippleSize,
					duration: rippleDuration ?? Math.min(rippleSize * 1.5, 300) * 2,
					animatedValue: makeMutable(0),
				};

				// Start animation
				newRipple.animatedValue.value = withTiming(
					1,
					{
						duration: newRipple.duration,
						easing: Easing.out(Easing.quad),
					},
					(finished) => {
						if (finished) {
							// Remove ripple after animation completes
							// runOnJS(setRipples)(prev => prev.filter(ripple => ripple.id !== newRipple.id)); @deprecated: on new versions of reanimated
							scheduleOnRN(() => setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id)));
						}
					}
				);

				return [...prev, newRipple];
			});

			// // Add new ripple to state @fixed: Avoid too much ripples at once
			// const newRipple: RippleConfig = {
			// 	id: rippleIds.current++,
			// 	x: touchX,
			// 	y: touchY,
			// 	size: rippleSize,
			// 	duration: rippleDuration ?? Math.min(rippleSize * 1.5, 300) * 2,
			// 	animatedValue: makeMutable(0),
			// };
			// setRipples((prev) => [...prev, newRipple]);
			//
			// // Start ripple animation
			// newRipple.animatedValue.value = withTiming(
			// 	1,
			// 	{
			// 		duration: newRipple.duration,
			// 		easing: Easing.out(Easing.quad),
			// 	},
			// 	(finished) => {
			// 		if (finished) {
			// 			// Remove ripple after animation completes
			// 			// runOnJS(setRipples)(prev => prev.filter(ripple => ripple.id !== newRipple.id));
			// 			scheduleOnRN(() => setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id)));
			// 		}
			// 	}
			// );
		},
		[enableRipple, layout, centerRipple, rippleDuration]
	);
	const handlePressIn = useCallback(
		(e: GestureResponderEvent) => {
			setPressed(true);
			onPressIn?.(e);
			createRipple(e);
		},
		[onPressIn, createRipple]
	);
	const handlePressOut = useCallback(
		(e: GestureResponderEvent) => {
			setPressed(false);
			onPressOut?.(e);
		},
		[onPressOut]
	);

	// Button animation hook
	const {animatedStyles, currentTextColor, platformHandlers, isFocused, handleFocus, handleBlur} = useButtonAnimation({
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
		onPressOut: handlePressOut,
	});

	const memoizedStyle = useMemo(() => {
		return [baseStyle.button, typeof style === 'function' ? style({pressed, focused: isFocused}) : style];
	}, [style, isFocused, pressed]);

	const memoizedRippleColor = useMemo(() => {
		return rippleColor ?? (color('white').fade(0.32).rgb().string() as ColorValue);
	}, [rippleColor]);

	const innerChildren = (
		<AnimatedPressable
			accessibilityRole={'button'}
			{...restPressableProps}
			ref={ref}
			disabled={disabled}
			className={className}
			// @issue: NativeWind library causing that inline function not being invoked on state change
			// style={[
			// 	baseStyle.button,
			// 	typeof style === 'function' ? (e: PressableStateCallbackType) => style({...e, focused: isFocused}) : style,
			// 	animatedStyles
			// ]}
			style={[...memoizedStyle, animatedStyles]}
			onPress={onPress}
			onLayout={(e) => setLayout(e.nativeEvent.layout)}
			{...platformHandlers}
		>
			{enableRipple && (
				<View style={[baseStyle.rippleContainer]} pointerEvents="none">
					{ripples.map((ripple) => (
						<Ripple key={ripple.id} ripple={ripple} color={memoizedRippleColor}/>
					))}
				</View>
			)}
			{typeof children === 'function' ? children({currentTextColor, isFocused}) : children}
		</AnimatedPressable>
	);

	if (spatialNavigatorExist)
		return (
			<SpatialNavigationNode isFocusable={!disabled} onSelect={() => onPress?.({} as GestureResponderEvent)}
			                       onFocus={() => handleFocus({} as NativeSyntheticEvent<TargetedEvent>)} onBlur={() => handleBlur({} as NativeSyntheticEvent<TargetedEvent>)}>
				{() => innerChildren}
			</SpatialNavigationNode>
		)
	else
		return innerChildren;
});
BaseButtonInner.displayName = 'BaseButton';
export const BaseButton = React.memo(BaseButtonInner);

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
		zIndex: -1,
	},
	ripple: {
		position: 'absolute',
	},
});
