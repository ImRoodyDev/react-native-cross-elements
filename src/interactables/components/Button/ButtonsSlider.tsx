// Internal imports
import React, {memo, useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, Platform, StyleProp, StyleSheet, TextProps, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import Animated, {AnimatedStyle, Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationFocusableView, SpatialNavigationView} from '../../../navigation';
import clsx from 'clsx';
import {joinClsx} from "../../../utils/stringJoiner";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Props for the ButtonsSlider component.
 */
export type ButtonSliderProps = {
	/** The initially selected option index. */
	initialIndex?: number;
	/** List of option labels to render as buttons. */
	options: string[];
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
	style?: Omit<ViewStyle, 'width' | 'height' | 'flexWrap' | 'flexDirection' | 'justifyContent' | 'alignItems'>;
	/** Styles applied to the animated slider container (the moving background). */
	sliderContainerStyle?: ViewStyle;
	/** Styles for the inner slider item shape; size/position/background are managed internally. */
	sliderStyle?: Omit<ViewStyle, 'width' | 'height' | 'position' | 'top' | 'left' | 'borderRadius' | 'backgroundColor'>;
	/** Style or style factory for each button container (receives focused state). */
	sliderItemButton?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>> | ((state: { focused: boolean }) => StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>);
	/** Style or style factory for each button text (receives focused state). */
	sliderItemTextStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>> | ((state: { focused: boolean }) => StyleProp<AnimatedStyle<StyleProp<TextStyle>>>);
	/** Additional props passed to each button text element. */
	textProps?: Omit<TextProps, 'style' | 'className'>;
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
		sliderItemButton,
		textProps,
	} = props;

	const [selectedIndex, setSelectedIndex] = useState(initialIndex);
	const [containerWidth, setContainerWidth] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
	const sliderWrapperRef = useRef(null);

	// Animated defaultValue for slider position
	const sliderPosition = useSharedValue(initialIndex);

	// Calculate button dimensions based on orientation
	const isHorizontal = orientation === 'horizontal';
	const buttonWidthPercent = 100 / options.length;
	const buttonWidth = containerWidth / options.length;
	const buttonHeight = containerHeight / options.length;

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

	return (
		<SpatialNavigationView
			ref={sliderWrapperRef}
			onLayout={onLayout}
			direction={orientation}
			// ts-expect-error RN + Web support
			className={clsx('slider-wrapper', className)}
			style={[SliderStyles.sliderWrapper, isHorizontal ? SliderStyles.horizontal : SliderStyles.vertical, style]}
		>
			<Animated.View
				// ts-expect-error RN + Web support
				className="slider-container"
				style={[SliderStyles.sliderContainer, isHorizontal ? {height: '100%'} : {width: '100%'}, sliderContainerStyle, sliderAnimatedStyle]}
			>
				<View
					// ts-expect-error RN + Web support
					className={clsx("slider-item", sliderRoundClassName)}
					style={[SliderStyles.sliderItem, sliderStyle]}
				/>
			</Animated.View>

			{options.map((option, index) => (
				<SpatialNavigationFocusableView key={index} onSelect={() => handlePress(index)}>
					{({isFocused: focused}) => (
						<AnimatedTouchableOpacity
							// ts-expect-error RN + Web support
							className={clsx('slider-btn', focused && 'slider-btn-focused', buttonClassName, focused && joinClsx(buttonClassName, 'focused'))}
							onPress={() => handlePress(index)}
							style={[SliderStyles.sliderItemButton, typeof sliderItemButton === 'function' ? sliderItemButton({focused}) : sliderItemButton]}
						>
							<Animated.Text
								// ts-expect-error RN + Web support
								className={clsx('slider-btn-text', focused && 'slider-btn-focused', textClassName, focused && joinClsx(textClassName, 'focused'))}
								style={[SliderStyles.sliderItemText, typeof sliderItemTextStyle === 'function' ? sliderItemTextStyle({focused}) : sliderItemTextStyle]}
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
ButtonsSlider.displayName = 'ButtonsSlider';

// Styles for the ButtonsSlider component
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
