// portalRegistry.ts
import React from "react";

type PortalCallback = (name: string, id: string, element: React.ReactNode | null) => void;

let subscribers: PortalCallback[] = [];

export function mountPortal(name: string, id: string, element: React.ReactNode) {
	//  Call the callback to pus the element inside the targeted subscriber
	subscribers.forEach((sub) => sub(name, id, element));
}

export function unmountPortal(name: string, id: string) {
	// This need to delete the targeted subscriber element inside the subscriber
	subscribers.forEach((sub) => sub(name, id, null));
}

/**  Adds Portal Host in memory */
export function subscribePortalProvider(callback: PortalCallback) {
	subscribers.push(callback);

	// A cleanup call in the useEffect
	return () => {
		subscribers = subscribers.filter((sub) => sub !== callback);
	};
}

export function mountedPortalProviders(): number {
	return subscribers.length;
}