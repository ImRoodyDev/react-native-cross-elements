import { Animated, LayoutChangeEvent, View, ViewStyle } from 'react-native';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { CustomScrollViewProps, CustomScrollViewRef } from '../../types/ScrollView';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export const CustomScrollView = forwardRef<CustomScrollViewRef, CustomScrollViewProps>((props, ref) => {
	// Extract props
	const { style, contentContainerStyle, children, onScroll, horizontal = false, scrollDuration = 200, testID, ...rest } = props;

	const contentSize = useRef(0);
	const parentSize = useRef(0);
	const [scroll, setScroll] = useState(0);

	// Scroll Animation hook
	const scrollAnimation = useScrollAnimation(horizontal, scroll, scrollDuration);

	const onParentLayout = useCallback(
		(event: LayoutChangeEvent): void => {
			parentSize.current = event.nativeEvent.layout[horizontal ? 'width' : 'height'];
		},
		[horizontal]
	);
	const onContentContainerLayout = useCallback(
		(event: LayoutChangeEvent) => {
			contentSize.current = event.nativeEvent.layout[horizontal ? 'width' : 'height'];
		},
		[horizontal]
	);

	const scrollParentStyle: ViewStyle = { flex: 1, overflow: 'hidden', flexDirection: horizontal ? 'row' : 'column' };
	const updateRef = (currentRef: View | null) => {
		if (!currentRef) return;

		const newRef = currentRef as any as CustomScrollViewRef;
		newRef.getInnerViewNode = () => currentRef;
		newRef.scrollTo = ({ x, y }) => {
			let scrollValue = 0;
			if (parentSize.current < contentSize.current) {
				if (x !== undefined) {
					scrollValue = Math.min(Math.max(0, x), contentSize.current);
				} else if (y !== undefined) {
					scrollValue = Math.min(Math.max(0, y), contentSize.current);
				}
				// Prevent from scrolling too far when reaching the end
				scrollValue = Math.min(scrollValue, contentSize.current - parentSize.current);
			}
			setScroll(scrollValue);
			const event = { nativeEvent: { contentOffset: { y: scrollValue, x: scrollValue } } };
			onScroll?.(event);
		};

		if (typeof ref === 'function') ref?.(newRef);
		else if (ref) ref.current = newRef;
	};

	// Extract containerClassname if exist in user environment through Tailwind OR Nativewind
	const { contentContainerClassName, ...cleanRest } = rest as any; // Type assertion to handle untyped props

	return (
		<View style={[scrollParentStyle, style]} onLayout={onParentLayout} testID={testID} {...cleanRest}>
			<Animated.View
				onLayout={onContentContainerLayout}
				style={[contentContainerStyle, scrollAnimation]}
				ref={updateRef}
				testID={testID ? `${testID}-content` : undefined}
				// ts-expect-error TODO: accept classname if Tailwind or Nativewind is in the user environment
				className={contentContainerClassName}
			>
				{children}
			</Animated.View>
		</View>
	);
});
CustomScrollView.displayName = 'CustomScrollView';
