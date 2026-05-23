export type NavItem = {
	title: string;
	href?: string;
	children?: NavItem[];
};

export const navigation: NavItem[] = [
	{
		title: 'Getting Started',
		children: [
			{ title: 'Installation', href: '/installation' },
			{ title: 'Quick Start', href: '/quick-start' },
		],
	},
	{
		title: 'Components',
		href: '/components',
		children: [
			{
				title: 'Buttons',
				children: [
					{ title: 'BaseButton', href: '/components/base-button' },
					{ title: 'NativeButton', href: '/components/native-button' },
					{ title: 'CustomButton', href: '/components/custom-button' },
					{ title: 'ButtonsSlider', href: '/components/button-slider' },
					{ title: 'AutoDetectButtonsSlider', href: '/components/auto-detect-buttons-slider' },
				],
			},
			{ title: 'Switch', href: '/components/switch' },
			{ title: 'Dropdown', href: '/components/dropdown' },
			{ title: 'FlatLabelInput', href: '/components/flat-label-input' },
			{ title: 'LabeledInputField', href: '/components/labeled-input-field' },
			{ title: 'LabeledInputFieldWeb', href: '/components/labeled-input-field-web' },
			{
				title: 'Overlay & Effects',
				children: [
					{ title: 'Portal', href: '/components/portal' },
					{ title: 'PortalHost', href: '/components/portal-host' },
					{ title: 'Ripple', href: '/components/ripple' },
				],
			},
			{
				title: 'Spatial Navigation',
				children: [
					{ title: 'SpatialNavigationRoot', href: '/components/spatial-navigation-root' },
					{ title: 'SpatialNavigationDeviceTypeProvider', href: '/components/spatial-navigation-device-type-provider' },
					{
						title: 'SpatialNavigationFocusableView',
						href: '/components/spatial-navigation-focusable-view',
					},
					{ title: 'SpatialNavigationView', href: '/components/spatial-navigation-view' },
					{ title: 'SpatialNavigationNode', href: '/components/spatial-navigation-node' },
					{ title: 'DefaultFocus', href: '/components/default-focus' },
					{ title: 'SpatialNavigationScrollView', href: '/components/spatial-navigation-scroll-view' },
					{ title: 'SpatialNavigationVirtualizedList', href: '/components/spatial-navigation-virtualized-list' },
					{ title: 'SpatialNavigationVirtualizedGrid', href: '/components/spatial-navigation-virtualized-grid' },
				],
			},
		],
	},
];
