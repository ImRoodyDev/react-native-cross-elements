import {StyleSheet, View, ViewProps} from 'react-native';
import {SpatialNavigationNode} from './FocusableNode';
import React, {forwardRef} from 'react';
import {SpatialNavigationNodeRef} from '../types/SpatialNavigationNodeRef';
import {useSpatialNavigatorExist} from "../context/SpatialNavigatorContext";

/**
 * Props for SpatialNavigationView.
 */
type Props = {
	/**
	 * React children to render inside the container. Can include focusable descendants.
	 */
	children: React.ReactNode;
	/**
	 * Layout direction for arranging children.
	 * - horizontal -> flexDirection: 'row'
	 * - vertical -> flexDirection: 'column'
	 * @default horizontal
	 */
	direction: 'horizontal' | 'vertical';
	/**
	 * Hints the navigator to align focusable children as a grid to improve D‑Pad/remote navigation.
	 * Ignored when no SpatialNavigator exists in the tree.
	 * @default false
	 */
	alignInGrid?: boolean;
} & Omit<ViewProps, 'children' | 'accessibilityState' | 'accessibilityRole'>;

/**
 * SpatialNavigationView component.
 *
 * This component provides a view that can have spatial navigation capabilities
 * based on the existence of a SpatialNavigator in the component tree. It uses
 * SpatialNavigationNode to enable navigation features when available.
 *
 * - If a SpatialNavigator is present, children are arranged according to the
 *   specified direction ('horizontal' or 'vertical'), and alignInGrid hints are
 *   applied.
 * - If no SpatialNavigator is found, it falls back to a regular View, rendering
 *   children in the specified direction without spatial navigation features.
 */
export const SpatialNavigationView = forwardRef<SpatialNavigationNodeRef, Props>((props, ref) => {
		const {
			children,
			style,
			direction = 'horizontal',
			alignInGrid = false,
			...rest
		} = props;
		const spatialNavigatorExist = useSpatialNavigatorExist();

		if (!spatialNavigatorExist) {
			// If there is no spatial navigator, we just return a regular view
			return (<View
				style={[style, direction === 'horizontal' ? styles.viewHorizontal : styles.viewVertical]}
				{...rest}
			>
				{children}
			</View>);
		} else
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
