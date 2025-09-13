// External imports
import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {forwardRef, memo, useCallback, useMemo, useRef, useState} from 'react';
import Animated from 'react-native-reanimated';
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
			labelFilledFontSize = 12,
			labelFilledColor,
			color: labelColor,
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
				fontSize: hasValue && labelFilledFontSize ? labelFilledFontSize : restLabelStyle.fontSize ?? 16,
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
				<Text
					className={placeholderClassName}
					style={[
						LabelInputStyles.label,
						...placeholderStyle,
					]}
					selectable={false}
				>
					{placeholder}
				</Text>

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
		minHeight: 62,

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

		borderWidth: 0,
		outlineWidth: 0,
		borderRadius: 8,
		borderStyle: 'solid',
		outlineStyle: 'solid',
		backgroundColor: '#f5f5f5',
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
