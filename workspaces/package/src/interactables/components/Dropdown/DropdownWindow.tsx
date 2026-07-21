import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

type Props = {
	/**
	 * Position and size derived from the button measurement. Applied as a plain style so it lands
	 * in the mount commit — routing it through layoutStyle makes the window appear at the top of
	 * the screen for a frame before snapping into place. See useLayoutDropdown.
	 */
	positionStyle: ViewStyle;
	layoutStyle: AnimatedStyle<ViewStyle>;
	children: React.ReactNode;
};

const DropdownWindow = ({ positionStyle, layoutStyle, children }: Props) => {
	return (
		<Animated.View style={[styles.dropdownOverlayView, styles.shadow, positionStyle, layoutStyle]}>
			{children}
		</Animated.View>
	);
};

export default DropdownWindow;

const styles = StyleSheet.create({
	dropdownOverlayView: {
		backgroundColor: '#EFEFEF',
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 10,
	},
});
