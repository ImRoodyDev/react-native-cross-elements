import {StyleSheet, View, ViewProps} from 'react-native';
import {SpatialNavigationNode} from './FocusableNode';
import React, {forwardRef} from 'react';
import {SpatialNavigationNodeRef} from '../types/SpatialNavigationNodeRef';

type Props = {
	children: React.ReactNode;
	direction: 'horizontal' | 'vertical';
	alignInGrid?: boolean;
} & Omit<ViewProps, 'children' | 'accessibilityState' | 'accessibilityRole'>;

export const SpatialNavigationView = forwardRef<SpatialNavigationNodeRef, Props>((props, ref) => {
		const {
			children,
			style,
			direction = 'horizontal',
			alignInGrid = false,
			...rest
		} = props;

		return (
			<SpatialNavigationNode ref={ref} orientation={direction} alignInGrid={alignInGrid}>
				<View
					style={[style, direction === 'horizontal' ? styles.viewHorizontal : styles.viewVertical]}
					{...rest}
				>
					{children}
				</View>
			</SpatialNavigationNode>
		);
	},
);
SpatialNavigationView.displayName = 'SpatialNavigationView';

const styles = StyleSheet.create({
	viewVertical: {
		display: 'flex',
		flexDirection: 'column',
	},
	viewHorizontal: {
		display: 'flex',
		flexDirection: 'row',
	},
});
