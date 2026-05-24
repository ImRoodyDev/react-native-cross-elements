import React, {forwardRef, ReactElement, RefObject, useCallback, useRef} from 'react';
import {Platform, ScrollView, View, ViewStyle} from 'react-native';
import {SpatialNavigatorParentScrollContext, useSpatialNavigatorParentScroll,} from '../context/ParentScrollContext';
import {scrollToNewlyFocusedElement} from '../helpers/scrollToNewlyfocusedElement';
import {mergeRefs} from '../../utils/mergeRefs';
import {useRemotePointerScrollviewScrollProps} from '../hooks/useRemotePointerScrollviewScrollProps';
import {PointerScrollArrows} from './PointerScrollArrows';
import {CustomScrollViewProps, CustomScrollViewRef} from '../types/ScrollView';
import {NativeScrollView} from './ScrollView/NativeScrollView';

type Props = {
	/**
	 * Use this offset to prevent the element from sticking too closely to the edges of the screen during scrolling.
	 * This is a margin in pixels.
	 */
	offsetFromStart?: number;
	/** Arrow that will show up inside the arrowContainer */
	descendingArrow?: ReactElement;
	/** Arrow that will show up inside the arrowContainer */
	ascendingArrow?: ReactElement;
	/** Style props for the arrow container, basically the area hoverable that triggers a scroll  */
	descendingArrowContainerStyle?: ViewStyle;
	/** Style props for the arrow container, basically the area hoverable that triggers a scroll  */
	ascendingArrowContainerStyle?: ViewStyle;
	/**
	 * Number of pixels scrolled every 10ms when using a remote pointer (web cursor hover).
	 * @default 10
	 */
	pointerScrollSpeed?: number;
	/** Toggles the native scrolling version of the scroll view instead of the CSS scroll */
	useNativeScroll?: boolean;
} & CustomScrollViewProps;

const getNodeRef = (node: CustomScrollViewRef | null | undefined) => {
	if (Platform.OS === 'web') {
		return node?.getInnerViewNode();
	}

	return node;
};

export const SpatialNavigationScrollView = forwardRef<ScrollView, Props>((props, ref) => {
		// Extract from props
		const {
			children,
			horizontal = false,
			offsetFromStart = 0,
			ascendingArrow,
			ascendingArrowContainerStyle,
			descendingArrow,
			descendingArrowContainerStyle,
			pointerScrollSpeed = 10,
			useNativeScroll = false,
			scrollDuration = 200,
			...rest
		} = props;

		const {scrollToNodeIfNeeded} = useSpatialNavigatorParentScroll();

		const scrollY = useRef<number>(0);
		const scrollViewRef = useRef<CustomScrollViewRef>(null);

		const {ascendingArrowProps, descendingArrowProps, deviceType, deviceTypeRef} = useRemotePointerScrollviewScrollProps({pointerScrollSpeed, scrollY, scrollViewRef});

		const scrollToNode = useCallback((newlyFocusedElementRef: RefObject<View | null>, additionalOffset = 0) => {
			try {
				if (deviceTypeRef.current === 'remoteKeys') {
					newlyFocusedElementRef?.current?.measureLayout(
						getNodeRef(scrollViewRef?.current),
						(left, top) =>
							scrollToNewlyFocusedElement({
								newlyFocusedElementDistanceToLeftRelativeToLayout: left,
								newlyFocusedElementDistanceToTopRelativeToLayout: top,
								horizontal,
								offsetFromStart: offsetFromStart + additionalOffset,
								scrollViewRef,
							}),
						() => {
						},
					);
				}
			} catch {
				// A crash can happen when calling measureLayout when a page unmounts. No impact on focus detected in regular use cases.
			}
			scrollToNodeIfNeeded(newlyFocusedElementRef, additionalOffset); // We need to propagate the scroll event for parents if we have nested ScrollViews/VirtualizedLists.
		}, [scrollToNodeIfNeeded, horizontal, offsetFromStart, deviceTypeRef]);
		const onScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number; x: number } } }) => {
			scrollY.current = event.nativeEvent.contentOffset.y;
		}, [scrollY]);

		return (
			<SpatialNavigatorParentScrollContext.Provider value={scrollToNode}>
				<NativeScrollView
					ref={mergeRefs([ref, scrollViewRef])}
					useNativeScroll={useNativeScroll}
					scrollDuration={scrollDuration}
					horizontal={horizontal}
					onScroll={onScroll}
					{...rest}
				>
					{children}
				</NativeScrollView>

				{
					deviceType === 'remotePointer' ? (
						<PointerScrollArrows
							descendingArrow={descendingArrow}
							ascendingArrow={ascendingArrow}
							descendingArrowContainerStyle={descendingArrowContainerStyle}
							ascendingArrowContainerStyle={ascendingArrowContainerStyle}
							ascendingArrowProps={ascendingArrowProps}
							descendingArrowProps={descendingArrowProps}
						/>
					) : undefined
				}
			</SpatialNavigatorParentScrollContext.Provider>
		);
	},
);
SpatialNavigationScrollView.displayName = 'SpatialNavigationScrollView';
