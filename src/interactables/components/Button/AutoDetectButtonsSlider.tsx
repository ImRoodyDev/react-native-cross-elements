// Internal imports
import React, {memo, useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, Platform, StyleSheet, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationView} from '../../../navigation';
import clsx from 'clsx';
import {ButtonSliderProps} from "./ButtonsSlider";
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";
import {SliderButton} from "./SliderButton";


/**
 * A button slider component that automatically detects its orientation (horizontal or vertical)
 * based on its container dimensions. It displays a series of buttons and an animated slider
 * background that moves to the selected button.
 *
 * The orientation can be explicitly set via props, or it will be determined by comparing
 * the container's width and height.
 *
 * @see {@link ButtonSliderProps}
 */
export const AutoDetectButtonsSlider = memo((props: ButtonSliderProps): React.ReactElement => {
	const {
		options,
		initialIndex = 0,
		onSelect,
		orientation,

		className,
		textClassName,
		buttonClassName,
		sliderRoundClassName,

		style,
		sliderStyle,
		sliderContainerStyle,
		sliderItemTextStyle,
		sliderItemButtonStyle,
		viewProps
	} = props;

	const spatialNavigatorExist = useSpatialNavigatorExist();
	const [selectedIndex, setSelectedIndex] = useState(initialIndex);
	const [containerWidth, setContainerWidth] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
	const [detectedOrientation, setDetectedOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
	const sliderWrapperRef = useRef(null);

	// Animated defaultValue for slider position
	const sliderPosition = useSharedValue(initialIndex);

	// Determine the current orientation - explicit prop wins, otherwise auto-detected
	const currentOrientation = orientation != undefined ? orientation : detectedOrientation;
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
		const {width, height} = event.nativeEvent.layout;
		setContainerWidth(width);
		setContainerHeight(height);
	};

	const handlePress = (index: number) => {
		setSelectedIndex(index);
	};

	if (spatialNavigatorExist) {
		return (
			<SpatialNavigationView
				ref={sliderWrapperRef}
				onLayout={onLayout}
				direction={currentOrientation ?? detectedOrientation}
				className={clsx('slider-wrapper', className)}
				style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
				{...viewProps}
			>
				<Animated.View
					className="slider-container"
					style={[SliderStyles.sliderContainer, isHorizontal ? {height: '100%'} : {width: '100%'}, sliderContainerStyle, sliderAnimatedStyle]}
				>
					<View
						className={clsx("slider-item", sliderRoundClassName)}
						style={[SliderStyles.sliderItem, sliderStyle]}
					/>
				</Animated.View>

				{
					options.map((option, index) => {
							const config = typeof option === 'string' ? {label: option} : option;

							return <SliderButton
								key={index}
								onPress={() => handlePress(index)}
								textClassName={textClassName}
								className={buttonClassName}
								style={sliderItemButtonStyle}
								textStyle={sliderItemTextStyle}
								{...config}
							/>
						}
					)
				}
			</SpatialNavigationView>
		);
	} else {
		return (
			<View
				ref={sliderWrapperRef}
				onLayout={onLayout}
				className={clsx('slider-wrapper', className)}
				style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
				{...viewProps}
			>
				<Animated.View
					className="slider-container"
					style={[SliderStyles.sliderContainer, isHorizontal ? {height: '100%'} : {width: '100%'}, sliderContainerStyle, sliderAnimatedStyle]}
				>
					<View
						className="slider-item"
						style={[SliderStyles.sliderItem, sliderStyle]}
					/>
				</Animated.View>

				{
					options.map((option, index) => {
							const config = typeof option === 'string' ? {label: option} : option;

							return <SliderButton
								key={index}
								onPress={() => handlePress(index)}
								textClassName={textClassName}
								className={buttonClassName}
								style={sliderItemButtonStyle}
								textStyle={sliderItemTextStyle}
								{...config}
							/>
						}
					)
				}
			</View>
		);
	}
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
	}
});
