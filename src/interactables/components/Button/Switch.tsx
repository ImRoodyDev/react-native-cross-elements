// External imports
import React, { forwardRef, memo, Ref, useCallback, useImperativeHandle } from 'react';
import { ColorValue, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle, Easing, interpolate, interpolateColor, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AnimationConfig } from '../../types/Button';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SwitchProps = {
	/**
	 * If true, the switch is disabled and cannot be interacted with.
	 */
	disabled?: boolean;
	/**
	 * The initialIndex value of the switch (on/off).
	 */
	defaultValue?: boolean;
	/**
	 * Callback called when the switch value changes.
	 */
	onValueChange?: (state: boolean) => void;
	/**
	 * Callback called when the switch receives focus.
	 */
	onFocus?: () => void;
	/**
	 * Callback called when the switch loses focus.
	 */
	onBlur?: () => void;
	/**
	 * Animation configuration for the switch transitions.
	 */
	animationConfig?: AnimationConfig;
	/**
	 * Optional class portalName for the switch track (for web compatibility).
	 */
	className?: string;
	/**
	 * Optional class portalName for the switch thumb (for web compatibility).
	 */
	thumbClassName?: string;
	/**
	 * Custom style for the switch track.
	 */
	trackStyle?: Omit<AnimatedStyle<ViewStyle>, 'display' | 'flexDirection' | 'justifyContent' | 'alignItems'>;
	/**
	 * Custom style for the switch thumb.
	 */
	thumbStyle?: AnimatedStyle<ViewStyle>;
	/**
	 * Colors for the track in different states.
	 */
	trackColors?: {
		/**
		 * Track color when switch is ON.
		 */
		on?: ColorValue;
		/**
		 * Track color when switch is OFF.
		 */
		off?: ColorValue;
		/**
		 * Track color when switch is DISABLED.
		 */
		disabled?: ColorValue;
	};
};

/**
 * Ref methods for controlling the Switch programmatically.
 */
export type SwitchRef = {
	/**
	 * Toggle the switch value.
	 */
	switch: () => void;
	/**
	 * Set the switch to a specific value (on/off).
	 */
	switchTo: (value: boolean) => void;
};

/**
 * A customizable Switch component with animated transitions and accessibility support.
 */
export const Switch = memo(
	forwardRef((props: SwitchProps, ref?: Ref<SwitchRef>) => {
		const {
			onValueChange,
			onBlur,
			onFocus,

			defaultValue = false,
			disabled = false,
			trackColors = { on: '#00BC7DFF', off: '#FF2056FF', disabled: '#a8a29e' },

			className,
			thumbClassName,
			trackStyle,
			thumbStyle,
			animationConfig,
		} = props;

		const [state, setState] = React.useState(defaultValue);
		const trackHeight = useSharedValue(0);
		const trackWidth = useSharedValue(0);
		const thumbWidth = useSharedValue(0);

		const trackAnimatedStyle = useAnimatedStyle(() => {
			if (disabled) {
				return {
					backgroundColor: trackColors.disabled,
				};
			}

			// Interpolate background color based on state
			const color = interpolateColor(state ? 1 : 0, [0, 1], [trackColors.off as string, trackColors.on as string]);
			const colorValue = withTiming(
				color,
				animationConfig ?? {
					duration: 400,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
					reduceMotion: ReduceMotion.System,
				}
			);

			return {
				backgroundColor: colorValue,
			};
		});
		const thumbAnimatedStyle = useAnimatedStyle(() => {
			const moveValue = interpolate(Number(state), [0, 1], [0, trackWidth.value - thumbWidth.value]);
			const translateValue = withTiming(
				moveValue,
				animationConfig ?? {
					duration: 300,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
					reduceMotion: ReduceMotion.System,
				}
			);

			return {
				transform: [{ translateX: translateValue }],
			};
		});
		const onPressHandler = useCallback(() => {
			const newState = !state;
			setState(newState);
			onValueChange?.(newState);
		}, [state, onValueChange]);

		useImperativeHandle(
			ref,
			() => {
				return {
					switch: onPressHandler,
					switchTo: (value: boolean) => {
						setState(value);
						onValueChange?.(value);
					},
				};
			},
			[onPressHandler, onValueChange]
		);

		return (
			<AnimatedPressable
				disabled={disabled}
				onPress={onPressHandler}
				// ts-expect-error RN + web
				className={className}
				onLayout={(e) => {
					trackHeight.value = e.nativeEvent.layout.height;
					trackWidth.value = e.nativeEvent.layout.width;
				}}
				style={[switchStyles.track, trackStyle, trackAnimatedStyle]}
				onFocus={onFocus}
				onBlur={onBlur}
				onHoverIn={onFocus}
				onHoverOut={onBlur}
			>
				<Animated.View
					// ts-expect-error RN + web
					className={thumbClassName}
					style={[switchStyles.thumb, thumbStyle, thumbAnimatedStyle]}
					onLayout={(e) => {
						thumbWidth.value = e.nativeEvent.layout.width;
					}}
				></Animated.View>
			</AnimatedPressable>
		);
	})
);
Switch.displayName = 'Switch';

const switchStyles = StyleSheet.create({
	track: {
		width: 100,
		height: 40,

		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		padding: 5,
		borderRadius: 9999999,
	},
	thumb: {
		height: '100%',
		aspectRatio: 1,
		backgroundColor: 'white',
		borderRadius: 9999999,
	},
});
