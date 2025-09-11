import {StyleSheet, View, ViewProps} from 'react-native';
import {SpatialNavigationNode} from './FocusableNode';
import React, {forwardRef} from 'react';
import {SpatialNavigationNodeRef} from '../types/SpatialNavigationNodeRef';
import {useSpatialNavigatorExist} from "../context/SpatialNavigatorContext";

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
		const spatialNavigatorExist = useSpatialNavigatorExist();
		console.log('Falling back to regular View because no SpatialNavigator found in the tree') // Debug line

		if (!spatialNavigatorExist)
			// If there is no spatial navigator, we just return a regular view
			return (<View
				style={[style, direction === 'horizontal' ? styles.viewHorizontal : styles.viewVertical]}
				{...rest}
			>
				{children}
			</View>);
		else
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
