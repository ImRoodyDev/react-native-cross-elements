// Internal imports
import React, {memo, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationView} from '../../../navigation';
import {SliderButton, SliderOption} from "./SliderButton";
import {SliderButtonStyle, SliderTextStyle} from "../../types/Button";
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";

/**
 * Props for the ButtonsSlider component.
 */
export type ButtonSliderProps = {
	/** The initially selected option index. */
	initialIndex?: number;
	/** List of option labels to render as buttons. */
	options: string[] | SliderOption[];
	/** Callback invoked when selection changes with the selected index. */
	onSelect?: (index: number) => void;
	/** Orientation of the slider - horizontal (default) or vertical. */
	orientation?: 'horizontal' | 'vertical';

	/** Optional class portalName applied to the wrapper (web compatibility). */
	className?: string;
	buttonClassName?: string;
	textClassName?: string;
	sliderRoundClassName?: string;

	/** Styles for the outer wrapper; width/height/flex layout keys are managed internally. */
	style?: Omit<ViewStyle, 'flexWrap' | 'flexDirection' | 'justifyContent' | 'alignItems'>;
	/** Styles applied to the animated slider container (the moving background). */
	sliderContainerStyle?: Pick<ViewStyle, 'padding' | 'paddingBottom' | 'paddingTop' | 'paddingLeft' | 'paddingRight' | 'paddingHorizontal' | 'paddingVertical' | 'backgroundColor' | 'borderRadius' | 'shadowColor' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;
	/** Styles for the inner slider item shape; size/position/background are managed internally. */
	sliderStyle?: Omit<ViewStyle, 'width' | 'height' | 'position' | 'top' | 'left' | 'borderRadius' | 'backgroundColor'>;
	/** Style or style factory for each button container (receives focused state). */
	sliderItemButtonStyle?: SliderButtonStyle;
	/** Style or style factory for each button text (receives focused state). */
	sliderItemTextStyle?: SliderTextStyle;
	/** Additional view props for the wrapped container. For example, accessibility props. */
	viewProps?: Omit<ViewStyle, 'className' | 'style' | 'onLayout' | 'direction'>;
};

/**
 * A button slider component that displays a series of buttons and an animated slider
 * background that moves to the selected button.
 *
 * The orientation can be set to horizontal or vertical via props.
 *
 * @see {@link ButtonSliderProps}
 */
export const ButtonsSlider = memo((props: ButtonSliderProps) => {
	const {
		options,
		initialIndex = 0,
		onSelect,
		orientation = 'horizontal',

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
	// const [containerWidth, setContainerWidth] = useState(0);
	// const [containerHeight, setContainerHeight] = useState(0);
	const sliderWrapperRef = useRef(null);

	// Animated defaultValue for slider position
	const sliderPosition = useSharedValue(initialIndex);

	// Calculate button dimensions based on orientation
	const isHorizontal = orientation === 'horizontal';
	const buttonSize = 100 / options.length;
	// const buttonWidth = containerWidth / options.length;
	// const buttonHeight = containerHeight / options.length;

	// Update animation when selection changes
	useEffect(() => {
		sliderPosition.value = withTiming(selectedIndex, {
			duration: 250,
			easing: Easing.out(Easing.quad),
		});

		// Call the onSelect callback if provided
		if (onSelect) onSelect(selectedIndex);
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
		// if (Platform.OS === 'web') {
		// 	if (isHorizontal) {
		// 		return {
		// 			left: `${(100 / options.length) * sliderPosition.value}%`,
		// 			top: 0,
		// 			width: `${buttonWidthPercent}%`,
		// 			height: '100%',
		// 		};
		// 	} else {
		// 		return {
		// 			top: `${(100 / options.length) * sliderPosition.value}%`,
		// 			left: 0,
		// 			height: `${buttonWidthPercent}%`,
		// 			width: '100%',
		// 		};
		// 	}
		// } else {
		// 	// Use absolute pixel positioning for native platforms
		// 	if (isHorizontal) {
		// 		return {
		// 			left: (containerWidth / options.length) * sliderPosition.value,
		// 			top: 0,
		// 			width: buttonWidth,
		// 			height: '100%',
		// 		};
		// 	} else {
		// 		return {
		// 			top: (containerHeight / options.length) * sliderPosition.value,
		// 			left: 0,
		// 			height: buttonHeight,
		// 			width: '100%',
		// 		};
		// 	}
		// }
	});

	// Handle layout measurement to get container dimensions
	// const onLayout = (_event: LayoutChangeEvent) => {
	// 	const {width, height} = event.nativeEvent.layout;
	// 	setContainerWidth(width);
	// 	setContainerHeight(height);
	// };

	const handlePress = (index: number) => {
		setSelectedIndex(index);
	};


	const sliderInnerContent = (
		<>
			<Animated.View
				style={[
					SliderStyles.sliderContainer,
					sliderContainerStyle,
					sliderAnimatedStyle
				]}
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
							sliderOrientation={orientation}
							{...config}
						/>
					}
				)
			}
		</>
	);

	// Render with SpatialNavigationView if context is available
	if (spatialNavigatorExist) {
		return (
			<SpatialNavigationView
				ref={sliderWrapperRef}
				// onLayout={onLayout}
				direction={orientation}
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
				ref={sliderWrapperRef}
				// onLayout={onLayout}
				className={className}
				style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
				{...viewProps}
			>
				{sliderInnerContent}
			</View>
		);
	}
});
ButtonsSlider.displayName = 'ButtonsSlider';

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
