import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {I18nManager, useWindowDimensions, ViewStyle} from 'react-native';
import {getDropdownHeight} from '../utils/getDropdownHeight';
import {useKeyboardHeight} from './useKeyboardHeight';
import type {WithSpringConfig} from "react-native-reanimated";
import {Extrapolation, interpolate, ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {scheduleOnRN} from "react-native-worklets";
import {AnimationConfig} from "../types/Button";

type Props<T> = {
	data: readonly T[] | undefined;
	dropdownStyle?: ViewStyle;
	animationType?: 'spring' | 'timing';
	animationConfig?: AnimationConfig;
	springConfig?: WithSpringConfig;
	animateDropdown?: boolean;
	dropDownSpacing?: number;
}

/**
 * Custom hook for positioning and sizing a dropdown menu
 * relative to its trigger button and keyboard state.
 */
export function useLayoutDropdown<T>(props: Props<T>) {
	const {
		data,
		dropdownStyle,
		animationType = 'spring',
		animationConfig,
		springConfig,
		animateDropdown = true,
		dropDownSpacing = 2,
	} = props;

	// Screen height for layout calculations
	const {height} = useWindowDimensions();

	// Listen for keyboard height
	const {keyboardHeight} = useKeyboardHeight();

	// Dropdown visibility state
	const [isVisible, setIsVisible] = useState(false);

	// Layout info of the button triggering the dropdown
	const [buttonLayout, setButtonLayout] = useState({w: 0, h: 0, px: 0, py: 0,});

	// Style calculated dynamically based on position and keyboard
	const [dropdownCalculatedStyle, setDropdownCalculatedStyle] = useState<ViewStyle>({});

	// Ref to track dropdown open direction (up/down)
	const openVerticalDirectionRef = useRef<'down' | 'up'>('down');

	// Ref to store calculated dropdown height
	const dropdownHeightRef = useRef(0);

	// Animated value for dropdown open/close state
	const animatedDropdownState = useSharedValue(0);
	const animatedDropdownHeight = useSharedValue(0);

	// Recalculate height if trackStyle or data changes
	useEffect(() => {
		const maxHeight = height / 4;
		dropdownHeightRef.current = getDropdownHeight(dropdownStyle, Math.min((data?.length || 0) * 50, maxHeight));

		// If dropdown is open, update animated height
		if (isVisible) {
			setDropdownVisible(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropdownStyle, height, data?.length]);

	/**
	 * Handles button layout measurement and positions dropdown accordingly.
	 * @param w - Button width
	 * @param h - Button height
	 * @param px - The absolute screen coordinates (left) of the component (pageX)
	 * @param py - The absolute screen coordinates (top) of the component (pageY)
	 */
	const onDropdownButtonLayout = useCallback((w: number, h: number, px: number, py: number) => {
		setButtonLayout({w, h, px, py});

		// If dropdown overflowed bottom, position it above
		if (py + h > height - dropdownHeightRef.current) {
			openVerticalDirectionRef.current = 'up';

			// Position above the button
			setDropdownCalculatedStyle({
				// Set transform origin to bottom
				transformOrigin: 'bottom',
				bottom: height - (py + h) + h + dropDownSpacing,
				width: (dropdownStyle as ViewStyle)?.width || w,
				...(I18nManager.isRTL ?
					{right: dropdownStyle?.right || px}
					: {left: dropdownStyle?.left || px}),
			});
			return;
		} else {
			openVerticalDirectionRef.current = 'down';

			// Otherwise, position below the button
			setDropdownCalculatedStyle({
				// Set transform origin to top
				transformOrigin: 'top',
				top: py + h + dropDownSpacing, //+ 2,
				width: (dropdownStyle as ViewStyle)?.width || w,
				...(I18nManager.isRTL ?
					{right: dropdownStyle?.right || px}
					: {left: dropdownStyle?.left || px}),
			});
		}
	}, [dropDownSpacing, dropdownStyle, height]);

	/**
	 * Opens or closes the dropdown with animation.
	 * @param open - True to open, false to close
	 */
	const setDropdownVisible = useCallback((open: boolean) => {
		if (open) {
			setIsVisible(open); // Show immediately when opening

			// If animations are disabled, set to final state immediately
			if (!animateDropdown) {
				animatedDropdownState.value = 1;
				animatedDropdownHeight.value = dropdownHeightRef.current;
				return;
			}

			// Animate to open state
			animatedDropdownState.value = withTiming(1, animationConfig ?? {
				duration: 250,
			});
			// Animate height with spring for a bouncy effect
			animatedDropdownHeight.value = (animationType === 'spring' ? withSpring : withTiming)?.(dropdownHeightRef.current,
				(
					animationType === 'spring' ?
						springConfig ?? ({
							damping: 15,
							// Reduced damping for faster motion
							stiffness: 180,
							// Increased stiffness for quicker response
							mass: 0.8,
							// Reduced mass for lighter feel
							overshootClamping: false,
							restDisplacementThreshold: 0.01,
							restSpeedThreshold: 0.01,
							reduceMotion: ReduceMotion.System,
						} as any)
						:
						animationConfig ?? ({
							duration: 250,
						} as AnimationConfig)
				)
			);
		} else {
			// If animations are disabled, set to final state immediately
			if (!animateDropdown) {
				animatedDropdownState.value = 0;
				animatedDropdownHeight.value = 0;
				setIsVisible(open);
				return;
			}

			// Animate to closed state
			animatedDropdownState.value = withTiming(0, {
				duration: 350,
				...animationConfig,
			}, (finished) => {
				if (finished && !open)
					scheduleOnRN(() => setIsVisible(open));
			});
			// Collapse height
			animatedDropdownHeight.value = withTiming(0, {
				duration: 350,
				...animationConfig,
			});
		}
	}, [animateDropdown, animationConfig, springConfig, animationType, animatedDropdownHeight, animatedDropdownState]);

	/**
	 * Closes the dropdown.
	 */
	const onRequestClose = useCallback(() => {
		setDropdownVisible(false);
	}, [setDropdownVisible]);

	/**
	 * Calculates final dropdown trackStyle including keyboard adjustments.
	 */
	const defaultDropdownStyle: ViewStyle = useMemo(() => {
		// Minimum visible dropdown height when keyboard is open
		const minDropdownHeight = 200;

		const getPositionIfKeyboardIsOpened = () => {
			if (!keyboardHeight) return {};

			// Case 1: dropdown bottom is blocked by keyboard → move up
			if (
				dropdownCalculatedStyle.top &&
				height - (dropdownCalculatedStyle.top as number) < keyboardHeight + minDropdownHeight
			) {
				return {top: height - (keyboardHeight + minDropdownHeight), minHeight: minDropdownHeight};
			}

			// Case 2: dropdown positioned above but still blocked → adjust
			if (
				dropdownCalculatedStyle.bottom &&
				(dropdownCalculatedStyle.bottom as number) < keyboardHeight - minDropdownHeight
			) {
				return {
					top: height - (keyboardHeight + minDropdownHeight),
					bottom: undefined,
					minHeight: minDropdownHeight,
				};
			}

			return {minHeight: minDropdownHeight};
		};

		return {
			position: 'absolute',
			height: 'auto',
			pointerEvents: 'auto',
			borderTopWidth: 0,
			// overflow: 'hidden', @fix: causing issue scroll not to be shown
			...dropdownStyle,
			...dropdownCalculatedStyle,
			...getPositionIfKeyboardIsOpened(),
		};
	}, [dropdownStyle, dropdownCalculatedStyle, height, keyboardHeight]);

	/**
	 * Animated style for the dropdown container.
	 * Handles height and opacity based on animation state.
	 */
	const animatedDropdownStyle = useAnimatedStyle(() => {
		const opacity = interpolate(animatedDropdownState.value,
			[0, 1],
			[0.5, 1],
			Extrapolation.CLAMP
		);
		return {
			...defaultDropdownStyle,
			opacity: opacity,
			maxHeight: animatedDropdownHeight.value,
		}
	})

	return {
		isVisible,
		setDropdownVisible,
		buttonLayout,
		onDropdownButtonLayout,
		animatedDropdownStyle,
		onRequestClose,
	};
}
