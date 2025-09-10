import {ColorValue, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

type Props = {
	onPress: () => void;
	backgroundColor?: ColorValue
}

const DropdownOverlay = ({onPress, backgroundColor}: Props) => {
	const defaults = {
		backgroundColor: backgroundColor || 'rgba(0,0,0,0.4)',
	};
	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={onPress}
			style={{
				...styles.dropdownOverlay,
				...{
					backgroundColor: defaults.backgroundColor,
				},
			}}
		/>
	);
};

export default DropdownOverlay;

const styles = StyleSheet.create({
	dropdownOverlay: {
		width: '100%',
		height: '100%',
	},
});
