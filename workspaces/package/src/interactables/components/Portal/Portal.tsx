// Portal.tsx
import React, {useEffect} from "react";
import {mountPortal, unmountPortal} from "../../controllers/portalRegistry";

interface PortalProps {
	/** Content to render inside the portal host. */
	children?: React.ReactNode;
	/** Name of the portal host to target. */
	portalName?: string;
}

export function Portal({portalName = 'root_ui_portal', children}: PortalProps) {
	const id = React.useId();

	useEffect(() => {
		mountPortal(portalName, id, children);

		return () => {
			// console.log(`Unmounting portal: ${portalName}`);
			unmountPortal(portalName, id);
		};
	}, [id, portalName, children]);

	return <></>
}

