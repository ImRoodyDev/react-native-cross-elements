import React from 'react';
import {ScrollView} from 'react-native';
import {CustomScrollView} from './CustomScrollView';
import {CustomScrollViewProps, CustomScrollViewRef} from '../../types/ScrollView';

type Props = { useNativeScroll: boolean; } & CustomScrollViewProps;

export const NativeScrollView = React.forwardRef<CustomScrollViewRef, Props>((props, ref) => {
		const {useNativeScroll, ...rest} = props;

		if (useNativeScroll) {
			return (
				<ScrollView
					ref={ref as React.RefObject<ScrollView>}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					scrollEnabled={false}
					scrollEventThrottle={16}
					{...rest}
				/>
			);
		}

		return <CustomScrollView ref={ref} {...rest} />;
	},
);

// For debugging purpose
NativeScrollView.displayName = 'NativeScrollView';
