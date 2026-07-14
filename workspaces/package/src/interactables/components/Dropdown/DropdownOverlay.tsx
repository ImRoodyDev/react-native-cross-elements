import { ColorValue, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

type Props = {
	onPress: () => void;
	backgroundColor?: ColorValue;
};

const DropdownOverlay = ({ onPress, backgroundColor }: Props) => {
	const defaults = {
		backgroundColor: backgroundColor || 'rgba(0,0,0,0.4)',
	};
	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={onPress}
			// TV: a full-screen Touchable is a focusable candidate, and it sits in front of the whole
			// dropdown — the D-pad would land here and appear dead. Tap-to-dismiss still works (focusable
			// only affects the focus engine); on TV the dismiss affordance is the BACK button.
			focusable={!Platform.isTV}
			style={{
				...StyleSheet.absoluteFillObject,
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
		pointerEvents: 'auto',
	},
});
