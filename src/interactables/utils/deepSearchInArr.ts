/**
 * Checks if the given `searchTxt` exists anywhere inside the `item`.
 * Supports nested objects and primitive values.
 *
 * @template T - Type of the item being searched.
 * @param item - The item to search in (can be object, array, or primitive).
 * @param searchTxt - The text or defaultValue to search for.
 * @returns True if the search text is found, otherwise false.
 */
function contains<T>(item: T, searchTxt: string | number | boolean): boolean {
	// Handle objects and arrays recursively
	if (typeof item === 'object' && item !== null) {
		for (const key in item as object) {
			if (Object.prototype.hasOwnProperty.call(item, key)) {
				const value = (item as any)[key];
				if (contains(value, searchTxt)) {
					return true;
				}
			}
		}
	}

	// Handle primitive values
	if (typeof item !== 'object' && item != null) {
		const itemStringified = String(item).toLowerCase();
		const searchTxtStringified = String(searchTxt).toLowerCase();
		if (itemStringified.includes(searchTxtStringified)) {
			return true;
		}
	}

	return false;
}

/**
 * Filters an array by checking if each item contains the search query.
 *
 * @template T - Type of the items in the array.
 * @param query - The defaultValue to search for (string, number, or boolean).
 * @param arr - The array to search in.
 * @returns An array of items that contain the search query.
 */
export function deepSearchInArr<T>(
	query: string | number | boolean,
	arr: T[]
): T[] {
	const results: T[] = [];
	for (let i = 0; i < arr.length; i++) {
		if (contains(arr[i], query)) {
			results.push(arr[i]);
		}
	}
	return results;
}
