import {ViewStyle} from "react-native";

export const getDropdownHeight = (dropdownStyle: ViewStyle | undefined, fallback: number) => {
	if (typeof dropdownStyle?.height === 'string') {
		console.warn('[getDropdownHeight] Warning: dropdownStyle.height should be a number to ensure proper height calculation.');
	}

	if (dropdownStyle && dropdownStyle.height && (typeof dropdownStyle.height == 'number')) {
		return dropdownStyle.height;
	} else {
		return fallback;
	}
};

