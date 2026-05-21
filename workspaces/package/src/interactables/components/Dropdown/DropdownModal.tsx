import React, {useCallback, useEffect} from 'react';
import {ColorValue, LayoutChangeEvent, Modal, Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {mountedPortalProviders} from "../../controllers/portalRegistry";
import {Portal} from "../Portal/Portal";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import DropdownOverlay from "./DropdownOverlay";

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
	/** Android navigation bar translucency. */
	navigationBarTranslucent?: boolean;
	/** Called when the user requests to close the modal (Android back). */
	onRequestClose: () => void;
	/** Overlay background color */
	dropdownOverlayColor?: ColorValue;
}

/**
 * Thin wrapper around React Native Modal for the Dropdown fallback.
 */
const DropdownModal = ({visible, dropdownOverlayColor, statusBarTranslucent, navigationBarTranslucent, onRequestClose, children}: Props) => {
	const {width, height} = useWindowDimensions();
	const {top, bottom} = useSafeAreaInsets();
	const [fixedHeight, setFixedHeight] = React.useState(0);
	const [parentHeight, setParentHeight] = React.useState(0);

	useEffect(() => {
		// Fix for android notch status bar causing dropdown wrong position
		const WINDOW_HEIGHT = height;

		if (parentHeight < WINDOW_HEIGHT)
			setFixedHeight(WINDOW_HEIGHT);
	}, [height, parentHeight]);

	// Check if a Portal is present
	const portalMounted = mountedPortalProviders() > 0;

	const onLayoutView = useCallback((event: LayoutChangeEvent) => {
		const _height = event.nativeEvent.layout.height;
		setParentHeight(_height);
	}, []);

	if (portalMounted)
		return (
			<Portal>
				{visible && <DropdownOverlay onPress={onRequestClose} backgroundColor={dropdownOverlayColor}/>}
				<View
					onLayout={onLayoutView}
					style={[
						StyleSheet.absoluteFill,
						{
							display: visible ? 'flex' : 'none',
							overflow: "visible",
							pointerEvents: visible ? 'box-none' : 'none',
							zIndex: 1000
						},
						// TODO: fix for android notch status bar causing dropdown wrong position
						Platform.OS == 'android' && {
							width,
							height: fixedHeight,
							marginTop: top,
							marginBottom: bottom
						}
					]}
					onPointerUp={onRequestClose}
					onTouchStart={onRequestClose}
				>
					{children}
				</View>
			</Portal>
		);

	return (
		<Modal
			onRequestClose={onRequestClose}
			supportedOrientations={['portrait', 'landscape']}
			animationType="none"
			transparent={true}
			navigationBarTranslucent={navigationBarTranslucent ?? false}
			presentationStyle={'overFullScreen'}
			statusBarTranslucent={statusBarTranslucent ?? false}
			visible={visible}
		>
			{visible && <DropdownOverlay onPress={onRequestClose} backgroundColor={dropdownOverlayColor}/>}
			<View
				onLayout={onLayoutView}
				style={[
					{overflow: "visible"},
					{width: "100%", height: "100%"},
					{pointerEvents: Platform.OS == 'web' ? 'none' : 'box-none'},
					// TODO: fix for android notch status bar causing dropdown wrong position
					Platform.OS == 'android' && {
						width,
						height: fixedHeight,
						marginTop: top,
						marginBottom: bottom
					}
				]}
			>
				{children}
			</View>
		</Modal>
	);
};

export default DropdownModal;
