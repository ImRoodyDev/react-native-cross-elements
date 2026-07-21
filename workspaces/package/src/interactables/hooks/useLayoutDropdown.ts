import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { I18nManager, Platform, useWindowDimensions, ViewStyle } from 'react-native';
import { getDropdownHeight } from '../utils/getDropdownHeight';
import { useKeyboardHeight } from './useKeyboardHeight';
import type { WithSpringConfig } from 'react-native-reanimated';
import {
	cancelAnimation,
	Extrapolation,
	interpolate,
	ReduceMotion,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { AnimationConfig } from '../types/Button';

type Props<T> = {
	data: readonly T[] | undefined;
	dropdownStyle?: ViewStyle;
	animationType?: 'spring' | 'timing';
	animationConfig?: AnimationConfig;
	springConfig?: WithSpringConfig;
	animateDropdown?: boolean;
	dropDownSpacing?: number;
};

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
	const { height } = useWindowDimensions();

	// Listen for keyboard height
	const { keyboardHeight } = useKeyboardHeight();

	// Dropdown visibility state
	const [isVisible, setIsVisible] = useState(false);

	// Layout info of the button triggering the dropdown
	const [buttonLayout, setButtonLayout] = useState({ w: 0, h: 0, px: 0, py: 0 });

	// Style calculated dynamically based on position and keyboard
	const [dropdownCalculatedStyle, setDropdownCalculatedStyle] = useState<ViewStyle>({});

	// Height the dropdown expands to. Derived rather than stored in a ref-plus-effect so that
	// styles reading it are computed from the same render's value instead of trailing it by one.
	const dropdownHeight = useMemo(
		() => getDropdownHeight(dropdownStyle, Math.min((data?.length || 0) * 50, height / 4)),
		[dropdownStyle, data?.length, height],
	);

	// Mirrored into a ref for the callbacks below, which must not be re-created when the height
	// changes (setDropdownVisible is a dependency of the whole open/close path).
	const dropdownHeightRef = useRef(dropdownHeight);
	dropdownHeightRef.current = dropdownHeight;

	// Ref for callback to execute after the close animation finishes
	const pendingCloseCallback = useRef<(() => void) | null>(null);

	// Animated value for dropdown open/close state
	const animatedDropdownState = useSharedValue(0);
	const animatedDropdownHeight = useSharedValue(0);

	/**
	 * Whether the open/close animation may run. Never on TV, for two independent reasons.
	 *
	 * Focus: Android refuses focus to zero-sized views for any app targeting API 28+
	 * (View.canTakeFocus() requires hasSize(), i.e. right > left && bottom > top). The animation
	 * starts maxHeight at 0, so the list had no focusable geometry at the one moment it matters:
	 * when the Modal's dialog window opens and the platform picks a view to focus. It found no
	 * candidate, left focus in the window behind, and the D-pad went dead — no focus guide can
	 * rescue a subtree the focus finder is structurally forbidden to enter.
	 *
	 * Correctness: the Modal unmounts and remounts this view on every open, and a remounted view
	 * gets useAnimatedStyle's initial snapshot — captured once at the hook's first render, when
	 * the state is 0, i.e. opacity 0.5 and maxHeight 0. Delivering the real values then depends
	 * on Reanimated re-applying from the UI thread, which is a race the window loses often enough
	 * to render visibly half-transparent.
	 *
	 * Both vanish if the style is a plain object, so TV takes the static path below: full height
	 * and full opacity on the first painted frame, with no animation. The same conflict is why
	 * position was moved out of the animated style — see dropdownPositionStyle.
	 */
	const shouldAnimate = animateDropdown; /*&& !Platform.isTV*/

	// Executes and clears the pending close callback on the JS thread.
	// Kept stable (no deps) so it can safely be passed to runOnJS.
	const executeCloseCallback = useCallback(() => {
		const cb = pendingCloseCallback.current;
		pendingCloseCallback.current = null;
		cb?.();
	}, []);

	// Re-run the open animation against the new height when it changes while open
	useEffect(() => {
		if (isVisible) {
			setDropdownVisible(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropdownHeight]);

	/**
	 * Handles button layout measurement and positions dropdown accordingly.
	 * @param w - Button width
	 * @param h - Button height
	 * @param px - The absolute screen coordinates (left) of the component (pageX)
	 * @param py - The absolute screen coordinates (top) of the component (pageY)
	 */
	const onDropdownButtonLayout = useCallback(
		(w: number, h: number, px: number, py: number) => {
			// Bail out when the measurement is unchanged. Both of these used to store a freshly
			// built object unconditionally (`buttonLayout != e` compares identity, so it was always
			// true), which re-rendered the whole dropdown subtree on every open for nothing.
			setButtonLayout((prev) =>
				prev.w === w && prev.h === h && prev.px === px && prev.py === py ? prev : { w, h, px, py },
			);

			// If dropdown overflowed bottom, position it above; otherwise below.
			const overflowsBottom = py + h > height - dropdownHeightRef.current;
			const next: ViewStyle = {
				transformOrigin: overflowsBottom ? 'bottom' : 'top',
				...(overflowsBottom
					? { top: 'auto', bottom: height - (py + h) + h + dropDownSpacing }
					: { bottom: 'auto', top: py + h + dropDownSpacing }),
				width: (dropdownStyle as ViewStyle)?.width || w,
				...(I18nManager.isRTL ? { right: dropdownStyle?.right || px } : { left: dropdownStyle?.left || px }),
			};

			setDropdownCalculatedStyle((prev) => (shallowEqualStyle(prev, next) ? prev : next));
		},
		[dropDownSpacing, dropdownStyle, height],
	);

	const cancelAnimations = useCallback(() => {
		cancelAnimation(animatedDropdownState);
		cancelAnimation(animatedDropdownHeight);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Opens or closes the dropdown with animation.
	 * @param open - True to open, false to close.
	 * @param onClose - Optional callback invoked after the close animation finishes.
	 *                  Use this to defer state-updating logic (e.g. onSelect) so it
	 *                  does not interrupt the closing animation.
	 */
	const setDropdownVisible = useCallback(
		(open: boolean, onClose?: () => void) => {
			cancelAnimations();

			if (open) {
				// Discard any stale close callback when re-opening
				pendingCloseCallback.current = null;
				setIsVisible(true); // Show immediately when opening

				// If animations are disabled (or this is TV), set to final state immediately
				if (!shouldAnimate) {
					animatedDropdownState.value = 1;
					animatedDropdownHeight.value = dropdownHeightRef.current;
					return;
				}

				// Animate to open state
				animatedDropdownState.value = withTiming(1, animationConfig ?? { duration: 250 });

				// Animate height with spring for a bouncy effect
				animatedDropdownHeight.value = (animationType === 'spring' ? withSpring : withTiming)?.(
					dropdownHeightRef.current,
					animationType === 'spring'
						? (springConfig ??
								({
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
								} as any))
						: (animationConfig ??
								({
									duration: 250,
								} as AnimationConfig)),
				);
			} else {
				// Store the callback so executeCloseCallback can retrieve it from the
				// UI-thread animation completion handler (refs are not worklet-safe).
				if (onClose !== undefined) {
					pendingCloseCallback.current = onClose;
				}

				// If animations are disabled (or this is TV), apply final state and fire callback
				// immediately
				if (!shouldAnimate) {
					animatedDropdownState.value = 0;
					animatedDropdownHeight.value = 0;
					setIsVisible(false);
					executeCloseCallback();
					return;
				}

				// Animate to closed state; fire callback only after animation fully completes
				animatedDropdownState.value = withTiming(
					0,
					{
						duration: 350,
						...animationConfig,
					},
					(finished) => {
						if (finished) {
							runOnJS(setIsVisible)(false);
							runOnJS(executeCloseCallback)();
						}
					},
				);
				// Collapse height
				animatedDropdownHeight.value = withTiming(0, {
					duration: 350,
					...animationConfig,
				});
			}
		},
		[
			shouldAnimate,
			animationConfig,
			springConfig,
			animationType,
			animatedDropdownHeight,
			animatedDropdownState,
			cancelAnimations,
			executeCloseCallback,
		],
	);

	/**
	 * Closes the dropdown.
	 */
	const onRequestClose = useCallback(() => {
		setDropdownVisible(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				return { top: height - (keyboardHeight + minDropdownHeight), minHeight: minDropdownHeight };
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

			return { minHeight: minDropdownHeight };
		};

		return {
			position: 'absolute',
			height: 'auto',
			pointerEvents: 'auto',
			borderTopWidth: 0,
			...dropdownStyle,
			...getPositionIfKeyboardIsOpened(),
		};
	}, [dropdownCalculatedStyle.bottom, dropdownCalculatedStyle.top, dropdownStyle, height, keyboardHeight]);

	/**
	 * Where the dropdown sits: everything derived from the button measurement, the keyboard and
	 * the caller's own dropdownStyle.
	 *
	 * This deliberately does NOT go through useAnimatedStyle. Reanimated snapshots a worklet's
	 * initial value on the hook's first render — when the button has not been measured yet, so
	 * there is no top/left/width — and applies every later value from the UI thread, a frame
	 * behind. The Modal unmounts its children while closed, so the window remounted with that
	 * unmeasured snapshot on every single open: one or more frames pinned at the top of the
	 * screen before it snapped down to the button. As a plain style it is applied by React in
	 * the same commit that mounts the view, so the first painted frame is already in place.
	 */
	const dropdownPositionStyle: ViewStyle = useMemo(
		() => ({ ...defaultDropdownStyle, ...dropdownCalculatedStyle }),
		[defaultDropdownStyle, dropdownCalculatedStyle],
	);

	/**
	 * Animated style for the dropdown container: only the values that actually animate.
	 */
	const animatedDropdownStyle = useAnimatedStyle(() => {
		const opacity = interpolate(animatedDropdownState.value, [0, 1], [0.5, 1], Extrapolation.CLAMP);

		// On web, use 'auto' to enable scrolling when content overflows @info: used any to bypass type issue
		const overflow = opacity >= 1 ? (Platform.OS == 'web' ? ('auto' as any) : 'scroll') : 'hidden';

		return {
			opacity: opacity,
			maxHeight: animatedDropdownHeight.value,
			overflow,
		};
	});

	/**
	 * Plain style for the dropdown when animations are disabled.
	 */
	const staticDropdownStyle: ViewStyle = useMemo(() => {
		return {
			opacity: 1,
			maxHeight: dropdownHeight,
			overflow: Platform.OS == 'web' ? ('auto' as any) : 'scroll',
		};
	}, [dropdownHeight]);

	return {
		isVisible,
		setDropdownVisible,
		buttonLayout,
		onDropdownButtonLayout,
		dropdownPositionStyle,
		animatedDropdownStyle: shouldAnimate ? animatedDropdownStyle : staticDropdownStyle,
		onRequestClose,
	};
}

/**
 * Shallow compare two style objects so an identical re-measure does not create new state.
 */
const shallowEqualStyle = (a: ViewStyle, b: ViewStyle) => {
	const aKeys = Object.keys(a) as (keyof ViewStyle)[];
	const bKeys = Object.keys(b) as (keyof ViewStyle)[];
	if (aKeys.length !== bKeys.length) return false;
	return aKeys.every((k) => a[k] === b[k]);
};
