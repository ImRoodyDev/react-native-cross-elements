// Deep import: `import lodash from 'lodash'` pulls the whole library in for this one function,
// and Dropdown depends on this file, so every consumer paid for it.
import isEqual from 'lodash/isEqual';

/**
 * Finds the index of `obj` in `arr` by deep equality for objects
 * and strict equality for primitives.
 *
 * @param obj - The object or primitive to search for
 * @param arr - The array to search within
 * @returns The index if found, otherwise -1
 */
export function findIndexInArr<T>(obj: T, arr: T[]): number {
	let defaultValueIndex = -1;

	if (typeof obj === 'object' && obj !== null) {
		for (let i = 0; i < arr.length; i++) {
			if (isEqual(arr[i], obj)) {
				defaultValueIndex = i;
				break; // stop at first match
			}
		}
	} else {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === obj) {
				defaultValueIndex = i;
				break;
			}
		}
	}

	return defaultValueIndex;
}
