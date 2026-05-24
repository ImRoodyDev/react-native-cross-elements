import React from 'react';
import { View, Text, ScrollView, Pressable, Platform as RNPlatform, useWindowDimensions, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { PlatformBadges } from '../../../components/PlatformBadges';

type Platform = 'ios' | 'android' | 'web' | 'tv';

const COMPONENT_GROUPS = [
	{
		title: 'Buttons',
		description: 'Interactive, animated button components for every use case.',
		accent: '#6366f1',
		components: [
			{
				name: 'BaseButton',
				href: '/components/base-button',
				description: 'Full-control button with render-prop children, ripple, animation, and state callbacks.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'NativeButton',
				href: '/components/native-button',
				description: 'Text-based button with optional icons and async loading indicator.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'CustomButton',
				href: '/components/custom-button',
				description: 'Custom content button with async pending state and color callbacks.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'ButtonsSlider',
				href: '/components/button-slider',
				description: 'Fixed-orientation segmented control with animated selection.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
			{
				name: 'AutoDetectButtonsSlider',
				href: '/components/auto-detect-buttons-slider',
				description: 'Segmented control that auto-detects orientation from its container dimensions.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
		],
	},
	{
		title: 'Form',
		description: 'Inputs and selection controls.',
		accent: '#a855f7',
		components: [
			{
				name: 'Switch',
				href: '/components/switch',
				description: 'Animated toggle switch with smooth track and thumb animations.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
			{
				name: 'Dropdown',
				href: '/components/dropdown',
				description: 'Animated dropdown with search, portal support, programmatic control, and custom renderers.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
			{
				name: 'FlatLabelInput',
				href: '/components/flat-label-input',
				description: 'Animated floating label text input with leading/trailing components.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
			{
				name: 'LabeledInputField',
				href: '/components/labeled-input-field',
				description: 'Inline floating label input with icon slots and state-driven styling.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'LabeledInputFieldWeb',
				href: '/components/labeled-input-field-web',
				description: 'Web-optimized labeled input with lower-cost placeholder positioning.',
				platforms: ['web'] as Platform[],
			},
		],
	},
	{
		title: 'Overlay & Effects',
		description: 'Components for rendering content outside the hierarchy and visual press feedback.',
		accent: '#ec4899',
		components: [
			{
				name: 'Portal',
				href: '/components/portal',
				description: 'Render children into a named PortalHost for modals and toasts.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
			{
				name: 'PortalHost',
				href: '/components/portal-host',
				description: 'Root host layer that receives Portal content for overlays and dropdowns.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
			{
				name: 'Ripple',
				href: '/components/ripple',
				description: 'Low-level animated ripple effect used by pressable components.',
				platforms: ['ios', 'android', 'web'] as Platform[],
			},
		],
	},
	{
		title: 'Spatial Navigation',
		description: 'LRUD-powered focus engine for TV, remote, D‑Pad, and keyboard navigation.',
		accent: '#06b6d4',
		components: [
			{
				name: 'SpatialNavigationRoot',
				href: '/components/spatial-navigation-root',
				description: 'Top-level provider that enables the spatial navigation context.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationDeviceTypeProvider',
				href: '/components/spatial-navigation-device-type-provider',
				description: 'Provider that detects pointer, keyboard, and remote input mode for focus behavior.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationFocusableView',
				href: '/components/spatial-navigation-focusable-view',
				description: 'Wraps a View into a focusable navigation node with full event callbacks.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationView',
				href: '/components/spatial-navigation-view',
				description: 'Directional container for grouping focusable spatial navigation children.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationNode',
				href: '/components/spatial-navigation-node',
				description: 'Low-level focusable node with focus, select, active, and ref control.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'DefaultFocus',
				href: '/components/default-focus',
				description: 'Marks the default child to focus when a navigation area activates.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationScrollView',
				href: '/components/spatial-navigation-scroll-view',
				description: 'Scroll container that cooperates with remote and pointer focus movement.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationVirtualizedList',
				href: '/components/spatial-navigation-virtualized-list',
				description: 'Virtualized list with registered focus nodes for large TV-style menus.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
			{
				name: 'SpatialNavigationVirtualizedGrid',
				href: '/components/spatial-navigation-virtualized-grid',
				description: 'Virtualized grid for performant spatial navigation across many items.',
				platforms: ['ios', 'android', 'web', 'tv'] as Platform[],
			},
		],
	},
];

export default function ComponentsIndexPage() {
	const { width } = useWindowDimensions();
	const isWide = width >= 900;

	return (
		<ScrollView
			className="flex-1 bg-zinc-950"
			contentContainerStyle={{ paddingBottom: 80 }}
			showsVerticalScrollIndicator
		>
			<View className="px-6 pt-10 pb-4" style={{ maxWidth: 768 }}>
				<Text className="text-4xl font-bold text-white mb-3">Components</Text>
				<Text className="text-zinc-400 text-base leading-7 mb-10">
					react-native-cross-elements provides a complete set of interactive UI components and spatial navigation
					primitives for React Native — iOS, Android, Web, and TV.
				</Text>

				{COMPONENT_GROUPS.map((group) => (
					<View key={group.title} className="mb-12">
						{/* Group header */}
						<View className="flex-row items-center gap-3 mb-1">
							<View className="w-1 h-5 rounded-full" style={{ backgroundColor: group.accent }} />
							<Text className="text-xl font-bold text-white">{group.title}</Text>
						</View>
						<Text className="text-zinc-500 text-sm mb-5 pl-4">{group.description}</Text>

						{/* Component cards */}
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
							{group.components.map((comp) => (
								<ComponentCard key={comp.name} {...comp} accent={group.accent} cardWidth={isWide ? 340 : width - 48} />
							))}
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
}

function ComponentCard({
	name,
	href,
	description,
	platforms,
	accent,
	cardWidth,
}: {
	name: string;
	href: string;
	description: string;
	platforms: Platform[];
	accent: string;
	cardWidth: number;
}) {
	return (
		<Link href={href as any} asChild>
			<Pressable
				style={({ hovered, pressed }) => [
					styles.componentCard,
					{ width: cardWidth, borderColor: accent + '45' },
					hovered && RNPlatform.OS === 'web' ? styles.componentCardHovered : null,
					pressed ? styles.componentCardPressed : null,
				]}
			>
				<View className="flex-row items-start justify-between mb-3">
					<Text className="text-white font-semibold text-base">{name}</Text>
					<View className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: accent }} />
				</View>
				<Text className="text-zinc-500 text-sm leading-5 mb-4">{description}</Text>
				<View className="flex-row items-center justify-between">
					<PlatformBadges platforms={platforms} size="sm" />
					<Text style={{ color: accent }} className="text-xs font-medium">
						View →
					</Text>
				</View>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	componentCard: {
		borderRadius: 12,
		borderWidth: 1,
		backgroundColor: '#18181b',
		padding: 16,
		minHeight: 172,
		transitionDuration: '180ms',
	},
	componentCardHovered: {
		backgroundColor: '#1f1f23',
		transform: [{ translateY: -3 }],
		shadowColor: '#6366f1',
		shadowOpacity: 0.24,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 10 },
		...((RNPlatform.OS === 'web'
			? {
					boxShadow: '0 16px 34px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.04)',
				}
			: {}) as any),
	},
	componentCardPressed: {
		opacity: 0.82,
		transform: [{ scale: 0.99 }],
	},
});
