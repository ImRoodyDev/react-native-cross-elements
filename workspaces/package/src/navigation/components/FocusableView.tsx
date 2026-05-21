import {SpatialNavigationNode,} from './FocusableNode';
import {View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {SpatialNavigationNodeRef} from '../types/SpatialNavigationNodeRef';
import {useSpatialNavigationDeviceType} from '../context/DeviceContext';
import {useSpatialNavigatorFocusableAccessibilityProps} from '../hooks/useSpatialNavigatorFocusableAccessibilityProps';
import {FocusableViewProps, InnerFocusableViewProps} from "../types/FocusableView";

const InnerFocusableView = forwardRef<View, InnerFocusableViewProps>(({children, nodeState, style}, ref) => {
		const accessibilityProps = useSpatialNavigatorFocusableAccessibilityProps();
		const accessibilityState = useMemo(
			() => ({selected: nodeState.isFocused}),
			[nodeState.isFocused]);

		return (
			<View
				ref={ref}
				style={style}
				{...accessibilityProps}
				accessibilityState={accessibilityState}
			>
				{typeof children === 'function' ? children(nodeState) : children}
			</View>
		);
	},
);
InnerFocusableView.displayName = 'InnerFocusableView';

const SpatialNavigationFocusableView = forwardRef<SpatialNavigationNodeRef, FocusableViewProps>((props, ref) => {
		const {
			children,
			onPointerEnter,
			onFocus,
			onBlur,
			onSelect,
			onLongSelect,
			onActive,
			onInactive,
			orientation,
			alignInGrid,
			indexRange,
			additionalOffset,
			...rest
		} = props;

		const {deviceTypeRef} = useSpatialNavigationDeviceType();
		const nodeRef = useRef<SpatialNavigationNodeRef>(null);

		useImperativeHandle(ref, () => ({
			focus: () => nodeRef.current?.focus(),
		}), [nodeRef]);

		// Props to handle pointer on cross platform
		// TODO: not using onMouseEnter because its not cross-platform and only acceptable on web
		const viewProps = {
			onPointerEnter: (e: any) => {
				if (onPointerEnter) {
					onPointerEnter(e);
				}
				if (deviceTypeRef.current === 'remotePointer') {
					nodeRef.current?.focus();
				}
			},
			onClick: () => {
				onSelect?.();
			}
		}
		const nodeProps = {
			onFocus,
			onBlur,
			onSelect,
			onLongSelect,
			onActive,
			onInactive,
			orientation,
			alignInGrid,
			indexRange,
			additionalOffset,
		}

		return (
			<SpatialNavigationNode ref={nodeRef} isFocusable {...nodeProps}>
				{(nodeState) => (
					<InnerFocusableView nodeState={nodeState}{...rest}{...viewProps}>
						{children}
					</InnerFocusableView>
				)}
			</SpatialNavigationNode>
		);
	},
);

SpatialNavigationFocusableView.displayName = 'SpatialNavigationFocusableView';

export {SpatialNavigationFocusableView};
