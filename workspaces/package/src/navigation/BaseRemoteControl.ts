import {CustomEventEmitter} from "./CustomEventEmitter";

/**
 * Base class for remote control managers
 * It implements the IRemoteControl interface
 * and provides a basic event emitter to handle key down events
 * @template SupportedKeys - The type of keys supported by the remote control
 */
export abstract class BaseRemoteControl<SupportedKeys> {
	protected eventEmitter = new CustomEventEmitter<{ keyDown: SupportedKeys }>();

	/**
	 * Used
	 * to pass the LRUD (react-tv-navigation) callbacks to the remote control manager emmit events
	 * So when user press a key on the remote control, the event is emitted triggering the LRUD navigation
	 * @param listener
	 */
	public addKeydownListener = (listener: (event: SupportedKeys) => boolean) => {
		this.eventEmitter.on('keyDown', listener);
		return listener;
	};

	/**
	 * Used to remove the LRUD (react-tv-navigation) callbacks from the remote control manager emmit events
	 * @param listener
	 */
	removeKeydownListener = (listener: (event: SupportedKeys) => boolean) => {
		this.eventEmitter.off('keyDown', listener);
	};
	emitKeyDown = (key: SupportedKeys) => {
		this.eventEmitter.emit('keyDown', key);
	};
}
