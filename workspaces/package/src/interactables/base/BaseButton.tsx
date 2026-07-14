// BaseButton.tsx
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	ColorValue,
	DimensionValue,
	GestureResponderEvent,
	LayoutChangeEvent,
	NativeSyntheticEvent,
	Pressable,
	PressableProps,
	StyleSheet,
	TargetedEvent,
	View,
} from 'react-native';
import Animated, { Easing, makeMutable, runOnJS, withTiming } from 'react-native-reanimated';
import { SpatialNavigationNode } from '../../navigation';
import { useButtonAnimation } from '../hooks/useButtonAnimation';
import { AnimationConfig, PressableStyle } from '../types/Button';
import { Ripple, RippleConfig } from '../components/Effects/Ripple';
import { useSpatialNavigatorExist } from '../../navigation/context/SpatialNavigatorContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const _defaultColor: ColorValue = 'black';
const _defaultBgColor: ColorValue = 'white';
// Was `color('white').fade(0.32).rgb().string()`, which pulled in the whole `color` dependency
// (+color-string/color-convert) just to recompute this constant.
const _defaultRippleColor: ColorValue = 'rgba(255, 255, 255, 0.68)';

/**
 * Base props for the BaseButton component, extending PressableProps.
 * Includes properties for handling press events, ripple effects, styles, and colors.
 * Also supports animation configurations and accessibility features.
 * @see PressableProps
 */
export type BaseButtonProps = {
	/**
	 * Orientation of the button for spatial navigation.
	 */
	orientation?: 'horizontal' | 'vertical';
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
	children:
		| React.ReactNode
		| ((state: { currentTextColor: ColorValue | undefined; isFocused: boolean }) => React.ReactNode);

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
		orientation,
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
		onLayout,

		style,
		pressedScale,
		rippleColor,
		centerRipple,
		// If not specified, use default colors
		textColor = _defaultColor,
		focusedTextColor = textColor,
		backgroundColor = _defaultBgColor,
		selectedBackgroundColor = backgroundColor,
		pressedBackgroundColor = backgroundColor,
		...restPressableProps
	} = props;

	const spatialNavigatorExist = useSpatialNavigatorExist();
	const rippleIds = useRef(0);
	const [pressed, setPressed] = useState(false);
	const [ripples, setRipples] = useState<RippleConfig[]>([]);
	// Size lives in a ref, not state: only createRipple reads it, and onLayout hands back a fresh
	// object every time, so state re-rendered the whole button on every layout pass for nothing.
	const layoutRef = useRef({ width: 0, height: 0 });

	const handleLayout = useCallback(
		(e: LayoutChangeEvent) => {
			layoutRef.current = e.nativeEvent.layout;
			onLayout?.(e);
		},
		[onLayout],
	);

	// Cancel frames still queued by createRipple. `setRipples([])` on unmount (what this used to do)
	// is a no-op — the component is already going away; it's the pending rAF that actually needs
	// dropping so it can't start an animation against a torn-down button.
	const rippleFramesRef = useRef<Set<number>>(new Set());
	useEffect(() => {
		const frames = rippleFramesRef.current;
		return () => {
			frames.forEach(cancelAnimationFrame);
			frames.clear();
		};
	}, []);
	const removeRippleById = useCallback((id: number) => {
		setRipples((prev) => {
			const list = Array.isArray(prev) ? prev : [];
			return list.filter((ripple) => ripple.id !== id);
		});
	}, []);
	const createRipple = useCallback(
		(e: GestureResponderEvent) => {
			const layout = layoutRef.current;
			if (!enableRipple || layout.width === 0 || layout.height === 0) return;

			let touchX: DimensionValue = layout.width / 2;
			let touchY: DimensionValue = layout.height / 2;

			if (
				!centerRipple &&
				e.nativeEvent &&
				e.nativeEvent.locationX !== undefined &&
				e.nativeEvent.locationY !== undefined
			) {
				touchX = e.nativeEvent.locationX;
				touchY = e.nativeEvent.locationY;
			}

			const rippleSize: DimensionValue = centerRipple
				? Math.min(layout.width, layout.height) * 1.5
				: Math.max(layout.width, layout.height) * 2;

			// Create ripple object first
			const newRipple: RippleConfig = {
				id: rippleIds.current++,
				x: touchX,
				y: touchY,
				size: rippleSize,
				duration: rippleDuration ?? Math.min(rippleSize * 1.5, 300) * 2,
				animatedValue: makeMutable(0),
			};

			// Add ripple to state first
			setRipples((prev) => {
				const list = Array.isArray(prev) ? prev : [];
				if (list.length > 10) return prev;
				return [...list, newRipple];
			});

			// Start animation outside of state update to avoid render phase warning
			const frame = requestAnimationFrame(() => {
				rippleFramesRef.current.delete(frame);
				newRipple.animatedValue.value = withTiming(
					1,
					{
						duration: newRipple.duration,
						easing: Easing.out(Easing.quad),
					},
					(finished) => {
						if (finished) {
							// Only pass serializable data via runOnJS
							runOnJS(removeRippleById)(newRipple.id);
						}
					},
				);
			});
			rippleFramesRef.current.add(frame);
		},
		[enableRipple, centerRipple, rippleDuration, removeRippleById],
	);
	const handlePressIn = useCallback(
		(e: GestureResponderEvent) => {
			setPressed(true);
			onPressIn?.(e);
			createRipple(e);
		},
		[onPressIn, createRipple],
	);
	const handlePressOut = useCallback(
		(e: GestureResponderEvent) => {
			setPressed(false);
			onPressOut?.(e);
		},
		[onPressOut],
	);

	// Button animation hook
	const { animatedStyles, currentTextColor, platformHandlers, isFocused, isHovered, handleFocus, handleBlur } =
		useButtonAnimation({
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
		return [
			baseStyle.button,
			typeof style === 'function' ? style({ pressed, focused: isFocused, hovered: isHovered }) : style,
		];
	}, [style, isFocused, isHovered, pressed]);
	const memoizedRippleColor = rippleColor ?? _defaultRippleColor;
	// Spreading inline built a new array on every render (ripple/press updates included), so the
	// Pressable saw a changed `style` even when nothing about the style had changed.
	const pressableStyle = useMemo(() => [...memoizedStyle, animatedStyles], [memoizedStyle, animatedStyles]);

	const innerChildren = (
		<AnimatedPressable
			accessibilityRole={'button'}
			{...restPressableProps}
			ref={ref}
			disabled={disabled}
			className={className}
			style={pressableStyle}
			onPress={onPress}
			onLayout={handleLayout}
			{...platformHandlers}
			// @fixed: NativeWind library causing that inline function not being invoked on state change
			// style={[
			// 	baseStyle.button,
			// 	typeof style === 'function' ? (e: PressableStateCallbackType) => style({...e, focused: isFocused}) : style,
			// 	animatedStyles
			// ]}
		>
			{enableRipple && (
				<View style={baseStyle.rippleContainer}>
					{ripples.map((ripple) => (
						<Ripple key={ripple.id} ripple={ripple} color={memoizedRippleColor} />
					))}
				</View>
			)}
			{typeof children === 'function' ? children({ currentTextColor, isFocused }) : children}
		</AnimatedPressable>
	);

	if (spatialNavigatorExist)
		return (
			<SpatialNavigationNode
				orientation={orientation}
				isFocusable={!disabled}
				onSelect={() => onPress?.({} as GestureResponderEvent)}
				onFocus={() => handleFocus({} as NativeSyntheticEvent<TargetedEvent>)}
				onBlur={() => handleBlur({} as NativeSyntheticEvent<TargetedEvent>)}
			>
				{() => innerChildren}
			</SpatialNavigationNode>
		);
	else return innerChildren;
});
BaseButtonInner.displayName = 'BaseButton';
export const BaseButton = React.memo(BaseButtonInner);

const baseStyle = StyleSheet.create({
	button: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	rippleContainer: {
		...StyleSheet.absoluteFillObject,
		overflow: 'hidden',
		zIndex: -1,
		pointerEvents: 'none',
	},
	ripple: {
		position: 'absolute',
	},
});
