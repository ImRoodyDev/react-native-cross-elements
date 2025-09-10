import React, {forwardRef, useCallback} from 'react';
import {
	DimensionValue,
	I18nManager,
	NativeSyntheticEvent,
	StyleProp,
	StyleSheet,
	TextInput,
	TextInputEndEditingEventData,
	TextInputSubmitEditingEventData,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';

type InputProps = {
	searchViewWidth?: DimensionValue | undefined;
	inputStyle?: StyleProp<ViewStyle>;
	inputTextStyle?: StyleProp<TextStyle>;
	value?: string;
	valueColor?: string;
	placeholder?: string;
	placeholderTextColor?: string;
	textAlign?: 'left' | 'right' | 'center';
	onChangeText?: (text: string) => void;
	onEndEditing?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;
	onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
	renderLeft?: () => React.ReactNode;
	renderRight?: () => React.ReactNode;
	testID?: string;
};

const voidFunction = () => {
};

const Input = (
	{
		searchViewWidth,
		inputStyle,
		inputTextStyle,
		value,
		valueColor,
		placeholder,
		placeholderTextColor,
		textAlign,
		onChangeText,
		onEndEditing,
		onSubmitEditing,
		renderLeft,
		renderRight,
		testID,
	}: InputProps,
	ref: React.Ref<TextInput>
) => {
	const defaults = {
		inputStyle,
		inputTextStyle,
		value: value ?? '',
		valueColor: valueColor ?? '#000000',
		placeholder: placeholder ?? '',
		placeholderTextColor: placeholderTextColor ?? '#CACACA',
		textAlign: textAlign || (I18nManager.isRTL ? 'right' : 'left'),
		onChangeText: onChangeText ?? voidFunction,
		onEndEditing: onEndEditing ?? voidFunction,
		onSubmitEditing: onSubmitEditing ?? voidFunction,
		renderLeft,
		renderRight,
		testID,
	};

	// ✅ Wrapped in useCallback so it won't be recreated unless defaults.onChangeText changes
	const onChangeTextValidator = useCallback(
		(txt: string) => {
			if (txt.length === 1 && txt === ' ') return;
			if (txt.length > 1 && txt.slice(-2) === '  ') return;
			defaults.onChangeText(txt);
		},
		[defaults.onChangeText] // eslint-disable-line react-hooks/exhaustive-deps
	);

	return (
		<View style={{...styles.searchViewStyle, width: searchViewWidth}}>
			<View style={[styles.defaultInputStyle, defaults.inputStyle]}>
				{defaults.renderLeft && <View style={styles.pressableLeft}>{defaults.renderLeft()}</View>}

				<TextInput
					testID={defaults.testID}
					ref={ref}
					value={defaults.value}
					placeholder={defaults.placeholder}
					placeholderTextColor={defaults.placeholderTextColor}
					textAlign={defaults.textAlign}
					onChangeText={onChangeTextValidator}
					onEndEditing={defaults.onEndEditing}
					onSubmitEditing={defaults.onSubmitEditing}
					style={[{
						...styles.inputField,
						color: defaults.valueColor,
					}, defaults.inputTextStyle]}
					returnKeyType="done"
					textContentType="oneTimeCode"
					allowFontScaling={false}
					autoComplete="off"
					autoCorrect={false}
					autoCapitalize="none"
					autoFocus
				/>

				{defaults.renderRight && <View style={styles.pressableRight}>{defaults.renderRight()}</View>}
			</View>
		</View>
	);
};

export default forwardRef<TextInput, InputProps>(Input);

const styles = StyleSheet.create({
	searchViewStyle: {
		height: 50,
		paddingHorizontal: 0,
	},
	defaultInputStyle: {
		width: '100%',
		height: '100%',
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: '4%',
	},
	inputField: {
		flex: 1,
		height: '100%',
		backgroundColor: '#0000',
		textAlignVertical: 'center',
		paddingVertical: 0,
	},
	pressableLeft: {
		height: '100%',
		marginRight: '4%',
		justifyContent: 'center',
	},
	pressableRight: {
		height: '100%',
		marginLeft: '4%',
		justifyContent: 'center',
	},
});
