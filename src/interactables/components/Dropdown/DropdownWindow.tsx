import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

type Props = {
	layoutStyle: AnimatedStyle<ViewStyle>;
	children: React.ReactNode;
};

const DropdownWindow = ({ layoutStyle, children }: Props) => {
	return (
		<Animated.View
			// ts-expect-error TODO: accept classname if Tailwind or Nativewind is in the user environment
			className={'DropdownWindow'}
			style={{
				...styles.dropdownOverlayView, //..
				...styles.shadow,
				...layoutStyle,
			}}
		>
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
