import React, {ForwardedRef} from 'react';
import {SpatialNavigationNode} from '../FocusableNode';
import {PointerScrollProps, SpatialNavigationVirtualizedListWithScroll, SpatialNavigationVirtualizedListWithScrollProps,} from './SpatialNavigationVirtualizedListWithScroll';
import {typedMemo} from '../../../utils/TypedMemo';

import {typedForwardRef} from '../../../utils/TypedForwardRef';
import {SpatialNavigationVirtualizedListRef} from '../../types/SpatialNavigationVirtualizedListRef';

/**
 * Use this component to render horizontally or vertically virtualized lists with spatial navigation
 * This component wraps the virtualized list inside a parent navigation node.
 * */
export const SpatialNavigationVirtualizedList = typedMemo(
	typedForwardRef(
		<T, >(
			props: SpatialNavigationVirtualizedListWithScrollProps<T> & PointerScrollProps,
			ref: ForwardedRef<SpatialNavigationVirtualizedListRef>,
		) => {
			return (
				<SpatialNavigationNode
					alignInGrid={props.isGrid ?? false}
					orientation={props.orientation ?? 'horizontal'}
				>
					<SpatialNavigationVirtualizedListWithScroll<T> {...props} ref={ref}/>
				</SpatialNavigationNode>
			);
		},
	),
);
SpatialNavigationVirtualizedList.displayName = 'SpatialNavigationVirtualizedList';
