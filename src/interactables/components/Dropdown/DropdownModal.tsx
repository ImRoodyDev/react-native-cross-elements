import React from 'react';
import {Modal, NativeSyntheticEvent} from 'react-native';

/**
 * Props for the platform Modal wrapper used by Dropdown when no PortalHost is present.
 */
type Props = {
	/** Dropdown content to render inside the modal. */
	children: React.ReactNode;
	/** Whether the modal is visible. */
	visible?: boolean;
	/** Android status bar translucency. */
	statusBarTranslucent?: boolean;
	/** Called when the user requests to close the modal (Android back). */
	onRequestClose?: (event: NativeSyntheticEvent<unknown>) => void;
}

/**
 * Thin wrapper around React Native Modal for the Dropdown fallback.
 */
const DropdownModal = ({visible, statusBarTranslucent, onRequestClose, children}: Props) => {
	const defaults = {
		statusBarTranslucent: statusBarTranslucent || false,
	};
	return (
		<Modal
			onRequestClose={onRequestClose}
			supportedOrientations={['portrait', 'landscape']}
			animationType="none"
			transparent={true}
			statusBarTranslucent={defaults.statusBarTranslucent}
			visible={visible}
		>
			{children}
		</Modal>
	);
};

export default DropdownModal;
