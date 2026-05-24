import chunk from 'lodash/chunk';
import {GridRowType} from '../SpatialNavigationVirtualizedGrid';

import {NodeOrientation} from '../../../types/Orientation';
import {JSX} from "react";

export const convertToGrid = <T>(
	data: T[],
	numberOfColumns: number,
	header?: JSX.Element,
): GridRowType<T>[] => {
	const rows: T[][] = chunk(data, numberOfColumns);

	return rows.map((items, index) => {
		//We do this to have index taking into account the header
		const computedIndex = header ? index + 1 : index;
		return {items, index: computedIndex};
	});
};

export const invertOrientation = (orientation: NodeOrientation): NodeOrientation =>
	orientation === 'vertical' ? 'horizontal' : 'vertical';
