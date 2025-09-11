// PortalHost.tsx
import React, {useEffect, useState} from 'react';
import {subscribePortalProvider} from '../controllers/portalRegistry';
import {StyleSheet, View} from 'react-native';

interface PortalHostProps {
	/**
	 * Optional name for the portal host to differentiate between multiple hosts.
	 * Defaults to 'root_ui_portal'.
	 */
	name?: string;
}

/**
 * PortalHost component that renders elements provided by PortalProvider.
 * It listens for updates from the portal registry and displays the elements
 * in an absolutely positioned view with high z-index.
 *
 */
export function PortalHost({name = 'root_ui_portal'}: PortalHostProps) {
	const [elements, setElements] = useState<Record<string, React.ReactNode>>({});

	useEffect(() => {
		return subscribePortalProvider((portalName: string, id: string, element) => {
			if (portalName !== name) return;

			setElements((prev) => {
				if (element) {
					return {...prev, [id]: element};
				} else {
					const next = {...prev};
					delete next[id];
					return next;
				}
			});
		});
	}, [name]);

	return (
		<View
			style={[StyleSheet.absoluteFill, {zIndex: 1000, pointerEvents: 'none'}]}
			// ts-expect-error TODO: accept classname if Tailwind or Nativewind is in the user enviroment
			className="portal-host"
		>
			{Object.entries(elements).map(([, element], index) => (
				<React.Fragment key={index}>{element}</React.Fragment>
			))}
		</View>
	);
}
