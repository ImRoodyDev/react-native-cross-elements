import { Direction } from '@bam.tech/lrud';

 
type SubscriberType = any;

export interface RemoteControlConfiguration {
  remoteControlSubscriber: (lrudCallback: (direction: Direction | null) => void) => SubscriberType;
  remoteControlUnsubscriber: (subscriber: SubscriberType) => void;
}

export let remoteControlSubscriber:
  | RemoteControlConfiguration['remoteControlSubscriber']
  | undefined = undefined;
export let remoteControlUnsubscriber:
  | RemoteControlConfiguration['remoteControlUnsubscriber']
  | undefined = undefined;

export const configureRemoteControl = (options: RemoteControlConfiguration) => {
  remoteControlSubscriber = options.remoteControlSubscriber;
  remoteControlUnsubscriber = options.remoteControlUnsubscriber;
};
