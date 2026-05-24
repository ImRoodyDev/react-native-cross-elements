import React, {createContext, useContext} from 'react';

const SpatialNavigatorDefaultFocusContext = createContext<boolean>(false);

export const useSpatialNavigatorDefaultFocus = () => {
	return useContext(SpatialNavigatorDefaultFocusContext);
};

type Props = {
	children: React.ReactNode;
	enable?: boolean;
};

export const DefaultFocus = ({children, enable = true}: Props) => {
	return (
		<SpatialNavigatorDefaultFocusContext.Provider value={enable}>
			{children}
		</SpatialNavigatorDefaultFocusContext.Provider>
	);
};
