// External imports
import {StyleSheet, TextInput, View} from 'react-native';
import React, {forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationNode} from '../../../navigation';

// Internal imports
import {useButtonAnimation} from '../../hooks/useButtonAnimation';
import {extractPadding, stripPaddingStyle} from '../../utils/extractor';
import {LabeledInputProps} from '../../types/LabeledInput';
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";

export const LabeledInput = memo(
	forwardRef<TextInput, LabeledInputProps>((props, ref) => {
		// Default values for optional props
		const {
			onChange,
			className,
			style,
			inputConfig: {
				placeholder = '',
				defaultValue = '',
				maxLength = 75,
				className: inputClassName,
				placeholderClassName,
				...restInputProps
			},
			iconElement,

			// Text Colors
			textColor,
			focusedTextColor,
			backgroundColor = 'white',
			pressedBackgroundColor = 'white',
			selectedBackgroundColor = 'white ',
			focusOutline,
		} = props;

		// Spatial navigation context
		const spatialNavigatorExist = useSpatialNavigatorExist();

		// Text trackStyle defaults
		const {placeholderLabelOffset = -16, filledPlaceholderFontSize = 12, filledPlaceholderColor, placeholderTextColor, ...restTextStyle} = props.textStyle ?? {};

		// Button animation hook
		const {animatedStyles, currentTextColor, isFocused, handleFocus, handleBlur} = useButtonAnimation({
			backgroundColor,
			pressedBackgroundColor,
			selectedBackgroundColor,
			textColor,
			focusedTextColor,
			focusOutline,
		});

		// State variables
		const inputRef = useRef<TextInput>(null);
		const [hasValue, setHasValue] = useState(defaultValue.length > 0);
		const [iconWidth, setIconWidth] = useState<number>(0);

		// @ts Setup initialIndex state based on defaultValue prop
		useEffect(() => {
			if (defaultValue.length > 0) {
				movePlaceholder(false);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		// Animation values
		const placeholderYposAnim = useSharedValue(defaultValue.length > 0 ? -16 : 0);

		//  Create animated trackStyle for the placeholder
		const placeholderAnimatedStyle = useAnimatedStyle(() => ({
			transform: [{translateY: placeholderYposAnim.value}],
		}));

		// Animates the placeholder text position
		const movePlaceholder = useCallback(
			(normalLocation?: boolean) => {
				placeholderYposAnim.value = withTiming(normalLocation ? 0 : placeholderLabelOffset, {
					duration: 200,
					easing: Easing.out(Easing.ease),
				});
			},
			[placeholderLabelOffset, placeholderYposAnim]
		);

		// Input handler
		const setRefs = (el: TextInput | null) => {
			if (el == null) return;
			inputRef.current = el;
			if (typeof ref === 'function') {
				ref(el);
			} else if (ref && 'current' in (ref as any)) {
				(ref as React.RefObject<TextInput | null>).current = el;
			}
		};
		const onPressHandler = useCallback(() => {
			if (!inputRef.current) return;
			if (!isFocused) {
				inputRef.current.blur();
			} else {
				inputRef.current.focus();
			}
		}, [isFocused]);
		const onChangeText = useCallback(
			(text: string) => {
				// Trigger parent onChange callback if provided
				if (onChange) {
					onChange(text);
				}
				// Update local state and animate placeholder based on text content
				const hasContent = text.length > 0;
				if (hasContent != hasValue) {
					setHasValue(hasContent);
					movePlaceholder(!hasContent);
				}
			},
			[onChange, hasValue, movePlaceholder]
		);

		// Extract parent styles without padding
		const parentStyle = useMemo(() => {
			if (style) {
				return stripPaddingStyle(style);
			}
			return undefined;
		}, [style]);

		// Extract padding styles
		const computedPaddingStyle = useMemo(() => {
			const extractedPadding = extractPadding(style);

			return {
				paddingLeft: extractedPadding.left,
				paddingRight: extractedPadding.right,
				paddingTop: extractedPadding.top,
				paddingBottom: extractedPadding.bottom,
			};
		}, [style]);

		// Text placeholder trackStyle
		const placeholderStyle = [
			restTextStyle,
			{
				fontSize: hasValue && filledPlaceholderFontSize ? filledPlaceholderFontSize : restTextStyle.fontSize ?? 16,
				color: hasValue ? filledPlaceholderColor ?? placeholderTextColor : placeholderTextColor,
			},
			computedPaddingStyle,
			iconElement && {paddingRight: iconWidth},
		];


		const inputElement = (<TextInput
			ref={setRefs}
			// ts-expect-error React Native Web support
			className={inputClassName}
			maxLength={maxLength}
			defaultValue={defaultValue}
			placeholder={''}
			onChangeText={onChangeText}
			onFocus={() => handleFocus({} as any)}
			onBlur={() => handleBlur({} as any)}
			onPointerEnter={() => handleFocus({} as any)}
			onPointerLeave={() => handleBlur({} as any)}
			style={[LabelInputStyles.input, restTextStyle, computedPaddingStyle, {color: currentTextColor, paddingLeft: iconWidth}]}
			{...restInputProps}
		/>);

		// Render component
		return (
			<Animated.View
				className={className}
				style={[LabelInputStyles.inputParent, parentStyle, animatedStyles]}
			>
				{
					spatialNavigatorExist ?
						<SpatialNavigationNode isFocusable onSelect={onPressHandler} onFocus={() => handleFocus({} as any)} onBlur={() => handleBlur({} as any)}>
							{() => inputElement}
						</SpatialNavigationNode>
						:
						inputElement
				}

				<Animated.Text
					className={placeholderClassName}
					style={[LabelInputStyles.iconParent, ...placeholderStyle, placeholderAnimatedStyle]}
					selectable={false}
				>
					{placeholder}
				</Animated.Text>

				<View
					style={[LabelInputStyles.iconParent, computedPaddingStyle, !iconElement && {paddingRight: 0}]}
					onLayout={(event) => {
						if (iconElement == null) return;
						// Get icon width for padding adjustment
						const {width} = event.nativeEvent.layout;
						setIconWidth(width);
					}}
				>
					{iconElement ? typeof iconElement === 'function' ? iconElement(isFocused) : iconElement : <></>}
				</View>
			</Animated.View>
		);
	})
);
LabeledInput.displayName = 'LabeledInput';

const LabelInputStyles = StyleSheet.create({
	inputParent: {
		width: '100%',
		minHeight: 62,

		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		borderRadius: 8,
		outlineWidth: 0,
		borderWidth: 0,
		borderStyle: 'solid',
		outlineStyle: 'solid',
		backgroundColor: '#f5f5f5',
		overflow: 'hidden',
	},
	input: {
		width: '100%',
		height: '100%',
		alignSelf: 'stretch',

		borderWidth: 0,
		outlineWidth: 0,
		backgroundColor: 'transparent',
		zIndex: 2,
	},
	inputPlaceholder: {
		width: '100%',
		position: 'absolute',

		paddingLeft: 40,
		paddingRight: 12,

		textAlign: 'center',
		color: 'black',
		backgroundColor: 'transparent',
		pointerEvents: 'none',
		zIndex: 3,
	},
	iconParent: {
		width: 'auto',
		height: '100%',

		position: 'absolute',
		left: 0,

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		paddingLeft: 12,

		pointerEvents: 'none',
		zIndex: 2,
	},
});

export type {LabeledInputProps};
