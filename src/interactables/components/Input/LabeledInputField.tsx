// External imports
import {StyleSheet, TextInput, View} from 'react-native';
import React, {forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Animated, {Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationNode} from '../../../navigation';

// Internal imports
import {useButtonAnimation} from '../../hooks/useButtonAnimation';
import {LabeledInputProps} from '../../types/InputField';
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";

export const LabeledInputField = memo(
	forwardRef<TextInput, LabeledInputProps>((props, ref) => {
		// Default values for optional props
		const {
			orientation,
			onChange,
			className,
			style,
			labelStyle,
			textStyle,
			inputConfig: {
				defaultValue = '',
				placeholder = '',
				maxLength = 75,
				className: inputClassName,
				placeholderClassName,
				...restInputProps
			},
			leftComponent,
			rightComponent,

			// Text Colors
			textColor,
			focusedTextColor,
			backgroundColor = 'white',
			pressedBackgroundColor = 'white',
			selectedBackgroundColor = 'white ',
		} = props;

		// Text trackStyle defaults
		const {
			labelFilledOffset = 0,
			labelFilledFontSize = 12,
			labelFilledColor,
			color: labelColor,
			fontSize: labelFontSize = 16,
			...restLabelStyle
		} = labelStyle ?? {};


		// State variables
		const inputRef = useRef<TextInput>(null);
		const spatialNavigatorExist = useSpatialNavigatorExist();
		const [hasValue, setHasValue] = useState(defaultValue.length > 0);

		// Text placeholder trackStyle
		const placeholderStyle = [
			restLabelStyle,
			{
				// fontSize: hasValue && labelFilledFontSize ? labelFilledFontSize : restLabelStyle.fontSize ?? 16,
				color: hasValue ? (labelFilledColor ?? labelColor) : labelColor,
			},
		];

		// Button animation hook
		const {animatedStyles, currentTextColor, isFocused, handleFocus, handleBlur} = useButtonAnimation({
			backgroundColor,
			pressedBackgroundColor,
			selectedBackgroundColor,
			textColor,
			focusedTextColor,
		});

		// Setup initialIndex state based on defaultValue prop
		useEffect(() => {
			if (defaultValue.length > 0) {
				movePlaceholder(false);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [defaultValue]);

		// Animation values
		const labelPositionAnim = useSharedValue(defaultValue.length > 0 ? 1 : 0);
		const labelSizeAnim = useSharedValue(hasValue ? labelFilledFontSize : labelFontSize);

		//  Create animated trackStyle for the placeholder
		const placeholderAnimatedStyle = useAnimatedStyle(() => ({
			fontSize: labelSizeAnim.value,
			transform: [{translateY: `${labelPositionAnim.value * -100}%`}],
			bottom: interpolate(labelPositionAnim.value, [0, 1], [0, labelFilledOffset], Extrapolation.CLAMP),
		}));

		// Animates the placeholder text position
		const movePlaceholder = useCallback(
			(hasContent?: boolean) => {
				// Check if should animate label
				if (hasContent && labelPositionAnim.value !== 1 || !hasContent && labelPositionAnim.value !== 0) {
					labelPositionAnim.value = withTiming(hasContent ? 1 : 0, {
						duration: 200,
						easing: Easing.out(Easing.ease),
					});
				}

				// Check if should animate size
				if (hasContent && labelSizeAnim.value !== labelFilledFontSize || !hasContent && labelSizeAnim.value !== labelFontSize) {
					labelSizeAnim.value = withTiming(hasContent ? labelFilledFontSize : labelFontSize, {
						duration: 200,
						easing: Easing.out(Easing.ease),
					});
				}
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[]
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
		const onChangeText = useCallback((text: string) => {
			// Trigger parent onChange callback if provided
			if (onChange) {
				onChange(text);
			}
			// Update local state and animate placeholder based on text content
			const hasContent = text.length > 0;
			if (hasContent != hasValue) {
				setHasValue(hasContent);
				movePlaceholder(hasContent);
			}
		}, [onChange, movePlaceholder, hasValue]);
		const onParentClick = useCallback(() => {
			// Focus the input when the parent is clicked
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, []);

		// Memoized style
		const memoizedStyle = useMemo(() => {
			return [typeof style === 'function' ? style({filled: hasValue, focused: isFocused}) : style];
		}, [style, isFocused, hasValue]);
		const memoizedInput = useMemo(() => {
			return (<TextInput
				ref={setRefs}
				className={inputClassName}
				maxLength={maxLength}
				defaultValue={defaultValue}
				placeholder={''}
				onChangeText={onChangeText}
				onFocus={() => handleFocus({} as any)}
				onBlur={() => handleBlur({} as any)}
				onPointerEnter={() => handleFocus({} as any)}
				onPointerLeave={() => handleBlur({} as any)}
				style={[LabelInputStyles.input, textStyle, {color: currentTextColor}]}
				{...restInputProps}
			/>);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [
			inputClassName,
			maxLength,
			defaultValue,
			onChangeText,
			handleFocus,
			handleBlur,
			textStyle,
			currentTextColor,
			restInputProps
		]);

		// Render component
		return (
			<Animated.View
				id={'rn-label-input'}
				className={className}
				style={[LabelInputStyles.inputParent, memoizedStyle, animatedStyles]}
				onPointerDown={onParentClick}
			>
				{
					leftComponent &&
					<View style={[LabelInputStyles.iconParent]}>
						{typeof leftComponent === 'function' ? leftComponent({filled: hasValue, focused: isFocused}) : leftComponent}
					</View>
				}

				<View style={LabelInputStyles.inputContainer}>
					{
						spatialNavigatorExist ?
							<SpatialNavigationNode
								orientation={orientation}
								isFocusable onSelect={onPressHandler}
								onFocus={() => handleFocus({} as any)}
								onBlur={() => handleBlur({} as any)}>
								{() => memoizedInput}
							</SpatialNavigationNode>
							:
							memoizedInput
					}

					<Animated.Text
						id={'rn-label-placeholder'}
						className={placeholderClassName}
						style={[
							LabelInputStyles.placeHolderText,
							...placeholderStyle,
							placeholderAnimatedStyle,
						]}
						selectable={false}
					>
						{placeholder}
					</Animated.Text>
				</View>

				{
					rightComponent &&
					<View style={[LabelInputStyles.iconParent]}>
						{typeof rightComponent === 'function' ? rightComponent({filled: hasValue, focused: isFocused}) : rightComponent}
					</View>
				}
			</Animated.View>
		);
	})
);
LabeledInputField.displayName = 'LabeledInputField';

const LabelInputStyles = StyleSheet.create({
	inputParent: {
		width: '100%',
		minHeight: 62,

		flexDirection: 'row',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		gap: 12,
		paddingVertical: 12,
		paddingHorizontal: 18,

		borderRadius: 8,
		outlineWidth: 0,
		borderWidth: 0,
		borderStyle: 'solid',
		outlineStyle: 'solid',
		backgroundColor: '#f5f5f5',
		overflow: 'hidden',
	},
	inputContainer: {
		width: 'auto',
		height: '100%',

		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	input: {
		width: '100%',
		height: '100%',

		position: 'absolute',

		borderWidth: 0,
		outlineWidth: 0,
		backgroundColor: 'transparent',
		zIndex: 1,
	},
	iconParent: {
		width: 'auto',
		height: '100%',

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	placeHolderText: {
		height: 'auto',
		width: '100%',

		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',

		textAlign: 'left',
		verticalAlign: 'middle',
		zIndex: 3,
		backgroundColor: 'transparent',
		pointerEvents: 'none',
		margin: 'auto',
		transformOrigin: 'top left'
	},
});
