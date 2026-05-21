import React from "react";
import {ViewProps} from "react-native";
import {FocusableNodeState, SpatialNavigationNodeDefaultProps} from "../components/FocusableNode";

/**
 * Props for a view that becomes focusable within the spatial navigation tree.
 *
 * - children can be a React element or a render function receiving the current node state
 *   ({ isFocused, isActive, isRootActive }).
 * - Inherits spatial-navigation node props (focus handlers, orientation, grid alignment, etc.).
 */
export type FocusableViewProps = {
	/**
	 * Render content. If a function is provided, it receives the live focus/active state of the node.
	 */
	children: React.ReactElement | ((props: FocusableNodeState) => React.ReactElement);
} & Omit<ViewProps, 'children'> & SpatialNavigationNodeDefaultProps;

/**
 * Internal props used by the inner view wrapper to forward node state to children.
 */
export type InnerFocusableViewProps = FocusableViewProps & { nodeState: FocusableNodeState; };
