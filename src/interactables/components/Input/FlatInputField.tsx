// External imports
import {StyleSheet, TextInput, View} from 'react-native';
import React, {forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {SpatialNavigationNode} from '../../../navigation';

// Internal imports
import {useButtonAnimation} from '../../hooks/useButtonAnimation';
import {FlatInputProps} from '../../types/InputField';
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";

export const FlatLabelInput = memo(
	forwardRef<TextInput, FlatInputProps>((props, ref) => {
		// Default values for optional props
		const {
			orientation,
			onChange,
			className,
			style,
			labelStyle,
			textStyle,
			inputStyle,
			inputConfig,
			leftComponent,
			rightComponent,

			backgroundColor = '#f5f5f5',
			pressedBackgroundColor = '#f5f5f5',
			selectedBackgroundColor = '#f5f5f5',
		} = props;

		const {
			defaultValue = '',
			placeholder = '',
			maxLength = 75,
			className: inputClassName,
			placeholderClassName,
			...restInputProps
		} = inputConfig ?? {};

		// Text trackStyle defaults
		const {
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
				color: hasValue ? (labelFilledColor ?? labelColor) : labelColor,
			},
		];

		// Button animation hook
		const {animatedStyles, currentTextColor, isFocused, handleFocus, handleBlur} = useButtonAnimation({
			backgroundColor,
			pressedBackgroundColor,
			selectedBackgroundColor,
		});

		const labelSizeAnim = useSharedValue(hasValue ? labelFilledFontSize : labelFontSize);

		useEffect(() => {
			labelSizeAnim.value = withTiming(hasValue ? labelFilledFontSize : labelFontSize, {
				duration: 200,
				easing: Easing.out(Easing.ease),
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [hasValue]);

		//  Create animated trackStyle for the placeholder
		const placeholderAnimatedStyle = useAnimatedStyle(() => ({
			fontSize: labelSizeAnim.value,
		}));

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
			}
		}, [onChange, hasValue]);
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
				placeholder={placeholder}
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
			placeholder,
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
			<View
				className={className}
				style={[LabelInputStyles.inputParent, memoizedStyle]}
				onPointerDown={onParentClick}
			>
				<Animated.Text
					className={placeholderClassName}
					style={[
						LabelInputStyles.label,
						...placeholderStyle,
						placeholderAnimatedStyle,
					]}
					selectable={false}
				>
					{placeholder}
				</Animated.Text>

				<Animated.View style={[LabelInputStyles.inputContainer, inputStyle, animatedStyles]}>
					{
						leftComponent &&
						<View style={[LabelInputStyles.iconParent]}>
							{typeof leftComponent === 'function' ? leftComponent({filled: hasValue, focused: isFocused}) : leftComponent}
						</View>
					}

					{
						spatialNavigatorExist ?
							<SpatialNavigationNode
								orientation={orientation}
								isFocusable
								onSelect={onPressHandler}
								onFocus={() => handleFocus({} as any)}
								onBlur={() => handleBlur({} as any)}
							>
								{() => memoizedInput}
							</SpatialNavigationNode>
							:
							memoizedInput
					}

					{
						rightComponent &&
						<View style={[LabelInputStyles.iconParent]}>
							{typeof rightComponent === 'function' ? rightComponent({filled: hasValue, focused: isFocused}) : rightComponent}
						</View>
					}
				</Animated.View>
			</View>
		);
	})
);
FlatLabelInput.displayName = 'FlatLabelInput';

const LabelInputStyles = StyleSheet.create({
	inputParent: {
		width: '100%',
		height: 60,

		flexDirection: 'column',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		gap: 12,
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
	label: {
		height: 'auto',
		width: '100%',
		textAlign: 'left',
		verticalAlign: 'middle',
	},
	inputContainer: {
		width: 'auto',
		height: '100%',

		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		padding: 8,
		borderWidth: 0,
		outlineWidth: 0,
		borderRadius: 8,
		borderStyle: 'solid',
		outlineStyle: 'solid',
	},
	input: {
		flex: 1,
		width: 'auto',
		height: '100%',

		borderWidth: 0,
		outlineWidth: 0,
		backgroundColor: 'transparent',
	},
	iconParent: {
		width: 'auto',
		height: '100%',

		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
});
