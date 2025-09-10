import React from "react";
import {ViewProps} from "react-native";
import {FocusableNodeState, SpatialNavigationNodeDefaultProps} from "../components/FocusableNode";

export type FocusableViewProps = {
	children: React.ReactElement | ((props: FocusableNodeState) => React.ReactElement);
} & Omit<ViewProps, 'children'> & SpatialNavigationNodeDefaultProps;

export type InnerFocusableViewProps = FocusableViewProps & { nodeState: FocusableNodeState; };
