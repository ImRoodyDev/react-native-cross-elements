import SpatialNavigator from '../SpatialNavigator';
import {createContext, useContext} from 'react';

export const SpatialNavigatorContext = createContext<SpatialNavigator | null>(null);

export const useSpatialNavigator = () => {
	const spatialNavigator = useContext(SpatialNavigatorContext);
	if (!spatialNavigator)
		throw new Error(
			'No registered spatial navigator on this page. Use the <SpatialNavigationRoot /> component.',
		);
	// console.info("If you plan to use spatial navigation, you need to wrap your app with the <SpatialNavigationRoot /> component.");
	return spatialNavigator;
};

/** Hook to check if the SpatialNavigatorContext exists */
export const useSpatialNavigatorExist = () => {
	const spatialNavigator = useContext(SpatialNavigatorContext);
	return spatialNavigator !== null;
}