import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,} from 'react';
import {Platform} from 'react-native';

type Device = 'remoteKeys' | 'remotePointer';
type ScrollingIntervalId = ReturnType<typeof setInterval>;

interface DeviceContextProps {
	/** Use `deviceType` only if you need a render, otherwise use `deviceTypeRef` */
	deviceType: Device;
	/** Use `deviceTypeRef` for user events or if you don't need render, otherwise use `deviceType` */
	deviceTypeRef: React.MutableRefObject<Device>;
	setDeviceType: (deviceType: Device) => void;
	getScrollingIntervalId: () => ScrollingIntervalId | null;
	setScrollingIntervalId: (scrollingId: ScrollingIntervalId | null) => void;
}

export const DeviceContext = createContext<DeviceContextProps>({
	deviceType: 'remoteKeys',
	deviceTypeRef: {current: 'remoteKeys'},
	setDeviceType: () => {
	},
	getScrollingIntervalId: () => null,
	setScrollingIntervalId: () => {
	},
});

interface DeviceProviderProps {
	children: React.ReactNode;
}

export const SpatialNavigationDeviceTypeProvider = ({children}: DeviceProviderProps) => {
	const [deviceType, setDeviceTypeWithoutRef] = useState<Device>('remoteKeys');

	const deviceTypeRef = useRef<Device>(deviceType);
	const scrollingId = useRef<ScrollingIntervalId | null>(null);

	const setDeviceType = useCallback((deviceType: Device) => {
		deviceTypeRef.current = deviceType;
		setDeviceTypeWithoutRef(deviceType);
	}, []);

	const setScrollingIntervalId = useCallback((id: ScrollingIntervalId | null) => {
		if (scrollingId.current) {
			clearInterval(scrollingId.current);
		}
		scrollingId.current = id;
	}, []);

	const getScrollingIntervalId = useCallback(() => scrollingId.current, []);

	useEffect(() => {
		if (deviceType === 'remotePointer' || Platform.OS !== 'web') return;

		const callback = () => {
			setDeviceType('remotePointer');
		};

		window.addEventListener('mousemove', callback);
		return () => window.removeEventListener('mousemove', callback);
	}, [deviceType, setDeviceType]);

	const value = useMemo(
		() => ({
			deviceType,
			deviceTypeRef,
			setDeviceType,
			getScrollingIntervalId,
			setScrollingIntervalId,
		}),
		[deviceType, setDeviceType, getScrollingIntervalId, setScrollingIntervalId],
	);

	return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useSpatialNavigationDeviceType = (): DeviceContextProps => useContext(DeviceContext);
