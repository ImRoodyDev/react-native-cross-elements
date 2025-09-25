// copy-paste from react-merge-refs lib
import type * as React from 'react';

export function mergeRefs<T>(refs: Array<React.RefObject<T> | React.Ref<T> | undefined | null>): React.RefCallback<T> {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref != null) {
				(ref as React.RefObject<T | null>).current = value;
			}
		});
	};
}
