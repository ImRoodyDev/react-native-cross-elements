import SpatialNavigator from '../SpatialNavigator';
import {createContext, useContext} from 'react';

export const SpatialNavigatorContext = createContext<SpatialNavigator | null>(null);

export const useSpatialNavigator = () => {
	const spatialNavigator = useContext(SpatialNavigatorContext);
	if (!spatialNavigator)
		console.info("If you plan to use spatial navigation, you need to wrap your app with the <SpatialNavigationRoot /> component.");
	// throw new Error(
	//   'No registered spatial navigator on this page. Use the <SpatialNavigationRoot /> component.',
	// );

	const spatialNavigatorEnabled = spatialNavigator != null;

	return {spatialNavigator, spatialNavigatorEnabled};
};
