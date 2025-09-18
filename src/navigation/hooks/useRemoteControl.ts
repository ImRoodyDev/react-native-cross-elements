import SpatialNavigator from '../SpatialNavigator';
import {useEffect} from 'react';
import {mappedDirection, remoteControlSubscriber, remoteControlUnsubscriber} from '../configureRemoteControl';
import {useSpatialNavigationDeviceType} from '../context/DeviceContext';

export const useRemoteControl = ({spatialNavigator, isActive,}: {
	spatialNavigator: SpatialNavigator;
	isActive: boolean;
}) => {
	const {setDeviceType, setScrollingIntervalId: setScrollingId} = useSpatialNavigationDeviceType();

	useEffect(() => {
		if (!mappedDirection) {
			console.warn(
				'[React Spatial Navigation] You probably forgot to configure the remote control mapped keys. Please call the configuration function.',
			);
			return;
		}
		if (!remoteControlSubscriber) {
			console.warn(
				'[React Spatial Navigation] You probably forgot to configure the remote control. Please call the configuration function.',
			);

			return;
		}

		if (!isActive) {
			return () => undefined;
		}

		// Subscriber to trigger when a remote control key is pressed
		const listener = remoteControlSubscriber(
			(remoteKey) => {
				setDeviceType('remoteKeys');
				const direction = mappedDirection?.[remoteKey as keyof typeof mappedDirection];
				if (!direction) {
					console.warn(
						`[React Spatial Navigation] The key "${remoteKey}" is not mapped to any direction. Please check your configuration.`,
					);
					return false;
				}
				// Direction translated for the spatial navigator
				spatialNavigator.handleKeyDown(direction);
				setScrollingId(null);
				return false; // We always return false to avoid blocking the event propagation
			}
		);

		return () => {
			if (!remoteControlUnsubscriber) {
				console.warn(
					'[React Spatial Navigation] You did not provide a remote control unsubscriber. Are you sure you called configuration correctly?',
				);

				return;
			}
			remoteControlUnsubscriber(listener);
		};
	}, [spatialNavigator, isActive, setDeviceType, setScrollingId]);
};
