// Internal imports
import React, {Ref, useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationView} from '../../../navigation';
import {ButtonSliderProps} from "./ButtonsSlider";
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";
import {SliderButton} from "./SliderButton";
import {mergeRefs} from "../../../utils/mergeRefs";


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
const InnerAutoDetectButtonsSlider = React.forwardRef((props: ButtonSliderProps, ref?: Ref<React.ComponentRef<typeof View>>): React.ReactElement => {
	const {
		options,
		initialIndex = 0,
		onSelect,
		orientation,

		className,
		textClassName,
		buttonClassName,
		sliderRoundClassName,
		animationConfig,

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
	const buttonSize = 100 / options.length;

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
		sliderPosition.value = withTiming(selectedIndex, animationConfig ?? {
			duration: 250,
			easing: Easing.out(Easing.quad),
		});

		// Call the onSelect callback if provided
		if (onSelect) {
			onSelect(selectedIndex);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedIndex, sliderPosition, onSelect]);

	// Animated style for slider background
	const sliderAnimatedStyle = useAnimatedStyle(() => {
		if (isHorizontal) {
			return {
				left: `${(100 / options.length) * sliderPosition.value}%`,
				width: `${buttonSize}%`,
				top: 0,
				bottom: 0,
			};
		} else {
			return {
				top: `${(100 / options.length) * sliderPosition.value}%`,
				height: `${buttonSize}%`,
				left: 0,
				right: 0
			};
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


	const sliderInnerContent = (
		<React.Fragment>
			<Animated.View
				style={[SliderStyles.sliderContainer,
					isHorizontal ? {height: '100%'} : {width: '100%'},
					sliderContainerStyle,
					sliderAnimatedStyle]}
			>
				<View
					className={sliderRoundClassName}
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
							sliderOrientation={currentOrientation}
							{...config}
						/>
					}
				)
			}
		</React.Fragment>
	);


	if (spatialNavigatorExist) {
		return (
			<SpatialNavigationView
				ref={mergeRefs([sliderWrapperRef, ref])}
				onLayout={onLayout}
				direction={currentOrientation ?? detectedOrientation}
				className={className}
				style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
				{...viewProps}
			>
				{sliderInnerContent}
			</SpatialNavigationView>
		);
	} else {
		return (
			<View
				ref={mergeRefs([sliderWrapperRef, ref])}
				onLayout={onLayout}
				className={className}
				style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
				{...viewProps}
			>
				{sliderInnerContent}
			</View>
		);
	}
});
InnerAutoDetectButtonsSlider.displayName = 'AutoDetectButtonsSlider';
export const AutoDetectButtonsSlider = React.memo(InnerAutoDetectButtonsSlider);

// Styles for the ButtonsSlider component
const SliderStyles = StyleSheet.create({
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	vertical: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	sliderWrapper: {
		width: 'auto',

		display: 'flex',
		flexWrap: 'nowrap',

		backgroundColor: '#FAFAFAFF',
		borderRadius: 9999999,
		padding: 0,
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
		boxShadow: [{
			offsetX: 0,
			offsetY: 2,
			blurRadius: 6.65,
			spreadDistance: 0,
			color: '#00000044',
		}],
	},
});

