import {Direction} from '@bam.tech/lrud';


type SubscriberType = any;

export interface RemoteControlConfiguration {
	remoteControlSubscriber: (lrudCallback: (direction: Direction | null) => void) => SubscriberType;
	remoteControlUnsubscriber: (subscriber: SubscriberType) => void;
}

export let remoteControlSubscriber: RemoteControlConfiguration['remoteControlSubscriber'] | undefined = undefined;
export let remoteControlUnsubscriber: | RemoteControlConfiguration['remoteControlUnsubscriber'] | undefined = undefined;

/**
 * Configure the remote control integration.
 * You need to provide a subscriber and an unsubscriber function.
 * The subscriber function should accept a callback that will be called with the direction of the key press.
 * The unsubscriber function should accept the subscriber returned by the subscriber function.
 */
export const configureRemoteControl = (options: RemoteControlConfiguration) => {
	remoteControlSubscriber = options.remoteControlSubscriber;
	remoteControlUnsubscriber = options.remoteControlUnsubscriber;
};
