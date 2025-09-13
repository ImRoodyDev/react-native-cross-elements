import React from 'react';
import {StyleSheet, TextProps, TouchableOpacity, TouchableOpacityProps} from "react-native";
import Animated from "react-native-reanimated";
import clsx from "clsx";
import {joinClsx} from "../../../utils/stringJoiner";
import {SliderButtonStyle, SliderTextStyle} from "../../types/Button";
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";
import {SpatialNavigationFocusableView} from "../../../navigation";

/**
 *  An option for the slider, which can be a simple label or include additional button props.
 */
export type SliderOption = {
	/** The label to display on the button. */
	label: string;
	/** Style or style factory for the button container (receives focused state). */
	buttonProps?: Omit<TouchableOpacityProps,
		'style' | 'children' | 'className' |
		'onFocus' | 'onBlur' | 'onPress' | 'onPressIn' | 'onPressOut'
	>
	/** Additional props passed to each button text element. */
	textProps?: Omit<TextProps, 'style' | 'className'>;
};

/**
 * Props for SliderButton.
 */
type Props = {
	/** Invoked when the option is selected/pressed. */
	onPress: () => void;
	/** Optional container className (web). A `focused` modifier is appended when focused. */
	className?: string;
	/** Optional text className (web). A `focused` modifier is appended when focused. */
	textClassName?: string;
	/** Style or style factory for the option button container. */
	style?: SliderButtonStyle;
	/** Style or style factory for the option text. */
	textStyle?: SliderTextStyle;
	/** Orientation of the parent slider (layout and height tweaks). */
	sliderOrientation: 'horizontal' | 'vertical';
} & SliderOption;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Focusable option button used inside ButtonSlider/AutoDetectButtonsSlider.
 * If a spatial navigator exists in the tree, it becomes focusable and reacts to D‑Pad keys.
 */
export const SliderButton = (
	{
		sliderOrientation,
		label,
		onPress,
		className,
		textClassName,
		style,
		textStyle,
		textProps,
		buttonProps
	}: Props) => {

	const spatialNavigatorExist = useSpatialNavigatorExist();
	const [focused, setFocused] = React.useState(false);

	const handleNodeFocus = () => {
		setFocused(true);
	};

	const handleNodeBlur = () => {
		setFocused(false);
	};

	const innerChild = (
		<AnimatedTouchableOpacity
			{...buttonProps}
			className={
				clsx(
					className, focused && joinClsx(className, 'focused')
				)
			}
			onFocus={handleNodeFocus}
			onBlur={handleNodeBlur}
			onPress={onPress}
			style={[
				SliderStyles.sliderItemButton,
				sliderOrientation === 'vertical' && {height: 60},
				typeof style === 'function' ?
					style({focused}) : style
			]}
		>
			<Animated.Text
				{...textProps}
				className={
					clsx(
						textClassName, focused && joinClsx(textClassName, 'focused')
					)
				}
				style={[
					SliderStyles.sliderItemText,
					typeof textStyle === 'function' ?
						textStyle({focused}) : textStyle
				]
				}
			>
				{label}
			</Animated.Text>
		</AnimatedTouchableOpacity>
	);

	if (spatialNavigatorExist)
		return (
			<SpatialNavigationFocusableView
				onSelect={onPress}
				onFocus={handleNodeFocus}
				onBlur={handleNodeBlur}
			>
				{
					() => innerChild
				}
			</SpatialNavigationFocusableView>
		);
	else return innerChild;
};

const SliderStyles = StyleSheet.create({
	sliderItemButton: {
		width: 140,
		height: 'auto',
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
