import {ScrollViewProps} from "react-native";

export type CustomScrollViewRef = {

	getInnerViewNode: () => any;
	scrollTo: (args: { x?: number; y?: number; animated: boolean }) => void;
};

export interface CustomScrollViewProps extends Omit<ScrollViewProps, 'onScroll' | 'onLayout'> {
	horizontal?: boolean;
	/** Configures the scroll duration in the case of CSS scroll */
	scrollDuration?: number;
	onScroll?: (event: { nativeEvent: { contentOffset: { y: number; x: number } } }) => void;
}
