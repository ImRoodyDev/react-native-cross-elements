import Animated, {Extrapolation, interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import React from "react";
import {ColorValue} from "react-native";

/**
 * Represents a single ripple effect.
 * @property {number} id - A unique identifier for the ripple.
 * @property {number} x - The x-coordinate of the ripple's center.
 * @property {number} y - The y-coordinate of the ripple's center.
 * @property {number} size - The diameter of the ripple.
 * @property {number} duration - The duration of the ripple animation in milliseconds.
 * @property {SharedValue<number>} animatedValue - The shared value that drives the ripple's animation, ranging from 0 to 1.
 */
export interface RippleConfig {
	id: number;
	/**
	 * The x-coordinate of the ripple's center.
	 */
	x: number;
	/**
	 * The y-coordinate of the ripple's center.
	 */
	y: number;
	/**
	 * The diameter of the ripple.
	 */
	size: number;
	/**
	 * The duration of the ripple animation in milliseconds.
	 */
	duration: number;
	/**
	 * A shared value that drives the ripple's animation.
	 * It typically ranges from 0 to 1, where 0 represents the start of the animation
	 * and 1 represents the end of the animation.
	 */
	animatedValue: SharedValue<number>;
}

export type RippleProps = {
	ripple: RippleConfig;
	color: ColorValue;
};

/**
 * A component that renders a single ripple animation.
 * It uses `react-native-reanimated` to create a smooth and performant animation.
 * The ripple scales up and fades out based on the `animatedValue` of the ripple prop.
 *
 * @param {object} props - The component props.
 * @param {RippleConfig} props.ripple - The ripple object containing the data for the ripple effect.
 * @param {ColorValue} props.color - The color of the ripple.
 * @returns {React.ReactElement} A single animated ripple view.
 */
export const Ripple: React.FC<RippleProps> = ({ripple, color}: RippleProps): React.ReactElement => {
	const animatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(
			ripple.animatedValue.value,
			[0, 1],
			[0.1, 1],
			Extrapolation.CLAMP
		);

		const opacity = interpolate(
			ripple.animatedValue.value,
			[0, 0.3, 1],
			[0.5, 1, 0],
			Extrapolation.CLAMP
		);

		return {
			transform: [
				{translateX: -ripple.size / 2},
				{translateY: -ripple.size / 2},
				{scale},
			],
			opacity,
		};
	});

	return (
		<Animated.View
			style={[
				{position: 'absolute'},
				{
					left: ripple.x,
					top: ripple.y,
					width: ripple.size,
					height: ripple.size,
					backgroundColor: color,
					borderRadius: ripple.size / 2,
				},
				animatedStyle,
			]}
		/>
	);
};
