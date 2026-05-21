import {configureRemoteControl, RemoteControlConfiguration,} from './configureRemoteControl';

export {Directions} from '@bam.tech/lrud';
export {SpatialNavigationNode} from './components/FocusableNode';
export {SpatialNavigationRoot} from './components/Root';
export {SpatialNavigationScrollView} from './components/ScrollView';
export {SpatialNavigationView} from './components/View';
export {DefaultFocus} from './context/DefaultFocusContext';
// TODO: Need checking still for issue's
export {SpatialNavigationVirtualizedList} from './components/virtualizedList/SpatialNavigationVirtualizedList';
export {SpatialNavigationVirtualizedGrid} from './components/VirtualizedGrid/SpatialNavigationVirtualizedGrid';
export {useSpatialNavigatorFocusableAccessibilityProps} from './hooks/useSpatialNavigatorFocusableAccessibilityProps';
export {useLockSpatialNavigation} from './context/LockSpatialNavigationContext';
export type {SpatialNavigationNodeRef} from './types/SpatialNavigationNodeRef';
export type {SpatialNavigationVirtualizedListRef} from './types/SpatialNavigationVirtualizedListRef';
export {SpatialNavigationFocusableView} from './components/FocusableView';
export {SpatialNavigationDeviceTypeProvider} from './context/DeviceContext';
export {useUniqueId} from './hooks/useUniqueId';

export {BaseRemoteControl} from './BaseRemoteControl';
export {CustomEventEmitter} from './CustomEventEmitter';
export const SpatialNavigation = {
	configureRemoteControl,
};
export type {
	RemoteControlConfiguration,
}
