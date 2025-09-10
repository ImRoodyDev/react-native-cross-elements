import React from 'react';
import {Modal, NativeSyntheticEvent} from 'react-native';

type Props = {
	children: React.ReactNode;
	visible?: boolean;
	statusBarTranslucent?: boolean;
	onRequestClose?: (event: NativeSyntheticEvent<unknown>) => void;
}

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
