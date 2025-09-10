import {useEffect, useMemo, useState} from 'react';
import {deepSearchInArr} from '../utils/deepSearchInArr';
import {findIndexInArr} from '../utils/findIndexInArr';
import {isExist} from '../../utils/isExist';

/**
 * Custom hook for managing a selectable dropdown list with optional search.
 *
 * @template T - The type of items in the dropdown array.
 * @param data - Array of dropdown items.
 * @param defaultValueByIndex - Optional default selected index.
 * @param defaultValue - Optional default selected defaultValue.
 * @param disabledInternalSearch - If true, disables built-in search filtering.
 */
export function useSelectDropdown<T>(
	data: T[] = [],
	defaultValueByIndex?: number,
	defaultValue?: T,
	disabledInternalSearch?: boolean
) {
	/** Selected item from dropdown */
	const [selectedItem, setSelectedItem] = useState<T | null>(null);

	/** Index of the selected item in the dropdown */
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);

	/** Search text entered by the user */
	const [searchTxt, setSearchTxt] = useState<string>('');

	// Reset state when `data` changes to an empty array
	useEffect(() => {
		if (!data || data.length === 0) {
			reset();
		}
	}, [data]);

	// Update selection if `defaultValueByIndex` changes
	useEffect(() => {
		if (isExist(defaultValueByIndex)) {
			if (data && isExist(data[defaultValueByIndex!])) {
				selectItem(defaultValueByIndex!);
			}
		}
	}, [defaultValueByIndex, data]); // eslint-disable-line react-hooks/exhaustive-deps

	// Update selection if `defaultValue` changes
	useEffect(() => {
		if (isExist(defaultValue)) {
			const index = findIndexInArr(defaultValue, data);
			if (data && index && index >= 0) {
				selectItem(index);
			}
		}
	}, [defaultValue, data]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Filtered dropdown data based on search text.
	 * If `disabledInternalSearch` is true, returns full data.
	 */
	const dataArr = useMemo<T[]>(() => {
		if (disabledInternalSearch) {
			return data;
		}
		return searchTxt ? deepSearchInArr(searchTxt, data) : data;
	}, [data, searchTxt, disabledInternalSearch]);

	/**
	 * Selects an item by index.
	 * @param index - Index of the item to select.
	 */
	const selectItem = (index: number) => {
		setSelectedItem(data[index]);
		setSelectedIndex(index);
	};

	/**
	 * Resets selection state.
	 */
	const reset = () => {
		setSelectedItem(null);
		setSelectedIndex(-1);
	};

	return {
		dataArr,
		selectedItem,
		selectedIndex,
		selectItem,
		reset,
		searchTxt,
		setSearchTxt,
	};
}
