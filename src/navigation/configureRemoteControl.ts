import {Direction} from '@bam.tech/lrud';

type SubscriberType = any;

export interface RemoteControlConfiguration<Keys extends Record<any, Direction | null>> {
	mappedDirection: Keys;
	remoteControlSubscriber: (lrudCallback: (remoteKey: keyof Keys) => boolean) => SubscriberType;
	remoteControlUnsubscriber: (subscriber: SubscriberType) => void;
}

export let mappedDirection: Record<string, Direction | null> | undefined;
export let remoteControlSubscriber: ((callback: (remoteKey: any) => boolean) => SubscriberType) | undefined;
export let remoteControlUnsubscriber: ((subscriber: SubscriberType) => void) | undefined;


/**
 * Configure the remote control integration.
 * You need to provide a subscriber and an unsubscriber function.
 * The subscriber function should accept a callback that will be called with the direction of the key press.
 * The unsubscriber function should accept the subscriber returned by the subscriber function.
 */
export function configureRemoteControl<E extends Record<any, Direction | null>>(
	options: RemoteControlConfiguration<E>
): void {
	mappedDirection = options.mappedDirection;
	remoteControlSubscriber = options.remoteControlSubscriber;
	remoteControlUnsubscriber = options.remoteControlUnsubscriber;
}