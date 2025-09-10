// Internal imports
import React, { memo, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleProp, StyleSheet, TextProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SpatialNavigationFocusableView, SpatialNavigationView } from '../../../navigation';
import clsx from 'clsx';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Props for the AutoDetectButtonsSlider component.
 */
export type AutoDetectButtonSliderProps = {
	/** The initially selected option index. */
	initialIndex: number;
	/** List of option labels to render as buttons. */
	options: string[];
	/** Callback invoked when selection changes with the selected index. */
	onSelect: (index: number) => void;
	/**
	 * Optional explicit orientation override. If not provided, orientation will be
	 * automatically determined by comparing container width and height.
	 */
	orientation?: 'horizontal' | 'vertical' | 'auto';

	/** Optional class portalName applied to the wrapper (web compatibility). */
	className?: string;
	/** Styles for the outer wrapper; width/height/flex layout keys are managed internally. */
	style: Omit<ViewStyle, 'width' | 'height' | 'flexWrap' | 'flexDirection' | 'justifyContent' | 'alignItems'>;
	/** Styles applied to the animated slider container (the moving background). */
	sliderContainerStyle: ViewStyle;
	/** Styles for the inner slider item shape; size/position/background are managed internally. */
	sliderStyle: Omit<ViewStyle, 'width' | 'height' | 'position' | 'top' | 'left' | 'borderRadius' | 'backgroundColor'>;
	/** Style or style factory for each button container (receives focused state). */
	sliderItemButton: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>> | ((state: { focused: boolean }) => StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>);
	/** Style or style factory for each button text (receives focused state). */
	sliderItemTextStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>> | ((state: { focused: boolean }) => StyleProp<AnimatedStyle<StyleProp<TextStyle>>>);
	/** Additional props passed to each button text element. */
	textProps: Omit<TextProps, 'style' | 'className'>;
};

/**
 * A button slider component that automatically detects its orientation (horizontal or vertical)
 * based on its container dimensions. It displays a series of buttons and an animated slider
 * background that moves to the selected button.
 *
 * The orientation can be explicitly set via props, or it will be determined by comparing
 * the container's width and height.
 *
 * @see {@link AutoDetectButtonSliderProps}
 */
export const AutoDetectButtonsSlider = memo((props: AutoDetectButtonSliderProps): React.ReactElement => {
	const {
		options,
		initialIndex,
		onSelect,
		orientation = 'auto',

		className,
		style,
		sliderStyle,
		sliderContainerStyle,
		sliderItemTextStyle,
		sliderItemButton,
		textProps,
	} = props;

	const [selectedIndex, setSelectedIndex] = useState(initialIndex);
	const [containerWidth, setContainerWidth] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
	const [detectedOrientation, setDetectedOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
	const sliderWrapperRef = useRef(null);

	// Animated defaultValue for slider position
	const sliderPosition = useSharedValue(initialIndex);

	// Determine the current orientation - either from props or auto-detected
	const currentOrientation = orientation === 'auto' ? detectedOrientation : orientation;
	const isHorizontal = currentOrientation === 'horizontal';

	// Calculate button dimensions based on orientation
	const buttonWidthPercent = 100 / options.length;
	const buttonWidth = containerWidth / options.length;
	const buttonHeight = containerHeight / options.length;

	// Update the detected orientation when container dimensions change
	useEffect(() => {
		if (containerWidth > 0 && containerHeight > 0) {
			// Only update if we have valid dimensions
			const newOrientation = containerWidth >= containerHeight ? 'horizontal' : 'vertical';
			if (newOrientation !== detectedOrientation) {
				setDetectedOrientation(newOrientation);
			}
		}
	}, [containerWidth, containerHeight, detectedOrientation]);

	// Update animation when selection changes
	useEffect(() => {
		sliderPosition.value = withTiming(selectedIndex, {
			duration: 250,
			easing: Easing.out(Easing.quad),
		});

		// Call the onSelect callback if provided
		if (onSelect) {
			onSelect(selectedIndex);
		}
	}, [selectedIndex, sliderPosition, onSelect]);

	// Animated style for slider background
	const sliderAnimatedStyle = useAnimatedStyle(() => {
		if (Platform.OS === 'web') {
			if (isHorizontal) {
				return {
					left: `${(100 / options.length) * sliderPosition.value}%`,
					top: 0,
					width: `${buttonWidthPercent}%`,
					height: '100%',
				};
			} else {
				return {
					top: `${(100 / options.length) * sliderPosition.value}%`,
					left: 0,
					height: `${buttonWidthPercent}%`,
					width: '100%',
				};
			}
		} else {
			// Use absolute pixel positioning for native platforms
			if (isHorizontal) {
				return {
					left: (containerWidth / options.length) * sliderPosition.value,
					top: 0,
					width: buttonWidth,
					height: '100%',
				};
			} else {
				return {
					top: (containerHeight / options.length) * sliderPosition.value,
					left: 0,
					height: buttonHeight,
					width: '100%',
				};
			}
		}
	});

	// Handle layout measurement to get container dimensions
	const onLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		setContainerWidth(width);
		setContainerHeight(height);
	};

	const handlePress = (index: number) => {
		setSelectedIndex(index);
	};

	return (
		<SpatialNavigationView
			ref={sliderWrapperRef}
			onLayout={onLayout}
			direction={currentOrientation}
			// ts-expect-error RN + Web support
			className={clsx('slider-wrapper', className)}
			style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
		>
			<Animated.View
				// ts-expect-error RN + Web support
				className="slider-container"
				style={[SliderStyles.sliderContainer, isHorizontal ? { height: '100%' } : { width: '100%' }, sliderContainerStyle, sliderAnimatedStyle]}
			>
				<View
					// ts-expect-error RN + Web support
					className="slider-item"
					style={[SliderStyles.sliderItem, sliderStyle]}
				/>
			</Animated.View>

			{options.map((option, index) => (
				<SpatialNavigationFocusableView key={index} onSelect={() => handlePress(index)}>
					{({ isFocused: focused }) => (
						<AnimatedTouchableOpacity
							// ts-expect-error RN + Web support
							className={clsx('slider-btn', focused && 'slider-btn-focused')}
							onPress={() => handlePress(index)}
							style={[SliderStyles.sliderItemButton, typeof sliderItemButton === 'function' ? sliderItemButton({ focused }) : sliderItemButton]}
						>
							<Animated.Text
								// ts-expect-error RN + Web support
								className={clsx('slider-btn-text', focused && 'slider-btn-focused')}
								style={[SliderStyles.sliderItemText, typeof sliderItemTextStyle === 'function' ? sliderItemTextStyle({ focused }) : sliderItemTextStyle]}
								{...textProps}
							>
								{option}
							</Animated.Text>
						</AnimatedTouchableOpacity>
					)}
				</SpatialNavigationFocusableView>
			))}
		</SpatialNavigationView>
	);
});
AutoDetectButtonsSlider.displayName = 'AutoDetectButtonsSlider';

const SliderStyles = StyleSheet.create({
	sliderWrapper: {
		position: 'relative',
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FAFAFAFF',
		borderRadius: 9999999,
	},

	horizontal: {
		flexDirection: 'row',
	},

	vertical: {
		flexDirection: 'column',
	},

	sliderContainer: {
		position: 'absolute',
		padding: 4,
	},
	sliderItem: {
		width: '100%',
		height: '100%',
		borderRadius: 9999999,
		backgroundColor: '#00000010',
		shadowColor: '#00000044',
		shadowOpacity: 0.21,
		shadowRadius: 6.65,
		elevation: 9,
	},

	sliderItemButton: {
		width: 140,
		height: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		backgroundColor: 'transparent',
		borderRadius: 99999,
		outlineWidth: 0,
		borderWidth: 0,
	},

	sliderItemText: {
		fontSize: 16,
		color: '#000000DD',
		fontWeight: '500',
		textAlign: 'center',
	},
});
