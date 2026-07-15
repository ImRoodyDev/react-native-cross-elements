import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, useWindowDimensions, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navbar } from '../components/Navbar';
import { PlatformBadges } from '../components/PlatformBadges';
import { publicAsset } from '../utils/publicAsset';

const STATS = [
	{ value: '15+', label: 'Components' },
	{ value: '4', label: 'Platforms' },
	{ value: '60fps', label: 'Animations' },
	{ value: '100%', label: 'TypeScript' },
];

const FEATURES = [
	{
		icon: '🧩',
		title: 'Rich UI Components',
		description: 'Buttons, Switch, Dropdown, Inputs, Ripple, Portal — all cross-platform and accessible.',
		accent: '#ff3d7f',
	},
	{
		icon: '📺',
		title: 'TV & Spatial Navigation',
		description: 'LRUD-powered focus engine for remote, D-Pad, keyboard, and pointer devices.',
		accent: '#06b6d4',
	},
	{
		icon: '✨',
		title: 'Silky Animations',
		description: 'Powered by React Native Reanimated 3 for 60/120 fps interactions on every platform.',
		accent: '#f59e0b',
	},
	{
		icon: '🎨',
		title: 'Fully Stylable',
		description: 'Every component exposes style callbacks with focused, hovered, and pressed states.',
		accent: '#ff8a00',
	},
	{
		icon: '♿',
		title: 'Accessible',
		description: 'Proper accessibility roles, props, and screen reader support out of the box.',
		accent: '#22c55e',
	},
	{
		icon: '📦',
		title: 'TypeScript First',
		description: 'Strict types and generics throughout — great IDE autocompletion.',
		accent: '#ec4899',
	},
];

const COMPONENT_CARDS = [
	{
		name: 'BaseButton',
		tag: 'Button',
		description: 'Fully customizable button with ripple, animation, and per-state style callbacks.',
		href: '/components/base-button',
		color: '#ff3d7f',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'NativeButton',
		tag: 'Button',
		description: 'Text-based button with optional icons and async loading indicator.',
		href: '/components/native-button',
		color: '#ff8a00',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'Switch',
		tag: 'Form',
		description: 'Animated toggle with smooth track and thumb transitions.',
		href: '/components/switch',
		color: '#22c55e',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'Dropdown',
		tag: 'Form',
		description: 'Animated dropdown with search, portal support, and imperative refs.',
		href: '/components/dropdown',
		color: '#f59e0b',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'FlatLabelInput',
		tag: 'Form',
		description: 'Animated floating label input with keyboard-aware layout.',
		href: '/components/flat-label-input',
		color: '#ff5a8a',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'LabeledInputField',
		tag: 'Form',
		description: 'Inline floating label input with left and right adornment slots.',
		href: '/components/labeled-input-field',
		color: '#17a8ff',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'LabeledInputFieldWeb',
		tag: 'Form',
		description: 'Web-optimized labeled input with lower-cost placeholder positioning.',
		href: '/components/labeled-input-field-web',
		color: '#14b8a6',
		platforms: ['web'] as const,
	},
	{
		name: 'Portal',
		tag: 'Overlay',
		description: 'Render content outside the view hierarchy for overlays and toasts.',
		href: '/components/portal',
		color: '#ec4899',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'PortalHost',
		tag: 'Overlay',
		description: 'Root host layer that receives Portal content for overlays and dropdowns.',
		href: '/components/portal-host',
		color: '#f43f5e',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'Ripple',
		tag: 'Effect',
		description: 'Low-level animated ripple effect used by pressable components.',
		href: '/components/ripple',
		color: '#38bdf8',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'SpatialNavigationRoot',
		tag: 'Navigation',
		description: 'Top-level provider for TV/keyboard D-Pad spatial navigation.',
		href: '/components/spatial-navigation-root',
		color: '#06b6d4',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'CustomButton',
		tag: 'Button',
		description: 'Fully customizable button with custom content, icons, and animated states.',
		href: '/components/custom-button',
		color: '#06b6d4',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'ButtonsSlider',
		tag: 'Button',
		description: 'Segmented control with animated selection indicator.',
		href: '/components/button-slider',
		color: '#ff7a1a',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'AutoDetectButtonsSlider',
		tag: 'Button',
		description: 'Auto-detecting segmented slider that adapts to content width dynamically.',
		href: '/components/auto-detect-buttons-slider',
		color: '#10b981',
		platforms: ['ios', 'android', 'web'] as const,
	},
	{
		name: 'SpatialNavigationFocusableView',
		tag: 'Navigation',
		description: 'Focusable container for TV/keyboard D-Pad spatial navigation with LRUD support.',
		href: '/components/spatial-navigation-focusable-view',
		color: '#ff3d7f',
		platforms: ['android', 'tv'] as const,
	},
	{
		name: 'SpatialNavigationView',
		tag: 'Navigation',
		description: 'Directional container for grouping focusable spatial navigation children.',
		href: '/components/spatial-navigation-view',
		color: '#0ea5e9',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'SpatialNavigationNode',
		tag: 'Navigation',
		description: 'Low-level focusable node with focus, select, active, and ref control.',
		href: '/components/spatial-navigation-node',
		color: '#22c55e',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'DefaultFocus',
		tag: 'Navigation',
		description: 'Marks the default child to focus when a navigation area activates.',
		href: '/components/default-focus',
		color: '#f59e0b',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'SpatialNavigationScrollView',
		tag: 'Navigation',
		description: 'Scroll container that cooperates with remote and pointer focus movement.',
		href: '/components/spatial-navigation-scroll-view',
		color: '#06b6d4',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'SpatialNavigationDeviceTypeProvider',
		tag: 'Navigation',
		description: 'Provider that detects pointer, keyboard, and remote input mode for focus behavior.',
		href: '/components/spatial-navigation-device-type-provider',
		color: '#0891b2',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'SpatialNavigationVirtualizedList',
		tag: 'Navigation',
		description: 'Virtualized list with registered focus nodes for large TV-style menus.',
		href: '/components/spatial-navigation-virtualized-list',
		color: '#17a8ff',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
	{
		name: 'SpatialNavigationVirtualizedGrid',
		tag: 'Navigation',
		description: 'Virtualized grid for performant spatial navigation across many items.',
		href: '/components/spatial-navigation-virtualized-grid',
		color: '#ff8a00',
		platforms: ['ios', 'android', 'web', 'tv'] as const,
	},
];

export default function HomeScreen() {
	const { width } = useWindowDimensions();
	const router = useRouter();
	const isWide = width >= 768;
	const isXWide = width >= 1100;
	const gridWidth = Math.min(width - (isWide ? 96 : 48), 1100);
	const cardWidth = isXWide ? Math.floor((gridWidth - 32) / 3) : isWide ? Math.floor((gridWidth - 16) / 2) : width - 48;
	const featureWidth = isXWide ? 300 : isWide ? Math.min((width - 96) / 2, 360) : width - 48;

	return (
		<SafeAreaView style={styles.root} edges={['top']}>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={Platform.OS === 'web'}
				stickyHeaderIndices={[0]}
			>
				<View style={styles.navbarSticky}>
					<Navbar />
				</View>

				<View
					style={[
						styles.hero,
						{
							paddingTop: isWide ? 96 : 60,
							paddingBottom: isWide ? 80 : 56,
						},
						Platform.OS === 'web'
							? ({
									backgroundImage:
										`linear-gradient(180deg, rgba(9,9,11,0.16) 0%, rgba(9,9,11,0.36) 52%, #09090b 100%), url("${publicAsset('background.png')}")`,
									backgroundPosition: 'center top',
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
								} as any)
							: null,
					]}
				>
					<View style={styles.badge}>
						<View style={styles.badgeDot} />
						<Text style={styles.badgeText}>v1.0.0 · React Native + TV + Web</Text>
					</View>

					<View style={[styles.heroIconWrap, { width: isWide ? 112 : 84, height: isWide ? 112 : 84 }]}>
						<Image source={{ uri: publicAsset('rn-icon.png') }} style={styles.heroIconImage} resizeMode="contain" />
					</View>

					<Text
						numberOfLines={2}
						adjustsFontSizeToFit
						style={[
							styles.headline,
							{
								fontSize: isWide ? 68 : 38,
								lineHeight: isWide ? 80 : 48,
								maxWidth: '80%',
								width: '80%',
							},
							Platform.OS === 'web'
								? ({
										backgroundImage: 'linear-gradient(135deg, #ffffff 18%, #ffe7b0 50%, #ff5a8a 82%, #17a8ff 100%)',
										backgroundClip: 'text',
										WebkitBackgroundClip: 'text',
										color: 'transparent',
									} as any)
								: null,
						]}
					>
						React Native Cross Elements
					</Text>

					<Text style={[styles.subhead, { maxWidth: isWide ? 580 : 340, fontSize: isWide ? 18 : 15 }]}>
						Beautiful, cross-platform interactable components and spatial navigation for React Native — iOS, Android,
						Web, and TV — with full accessibility support.
					</Text>

					<View style={styles.badgesRow}>
						<PlatformBadges />
					</View>

					<View
						style={[
							styles.installWrap,
							{ width: isWide ? Math.min(Math.floor(width * 0.28), 520) : Math.min(380, width - 48) },
						]}
					>
						<InstallSnippet />
					</View>

					<View style={styles.ctaRow}>
						<View>
							<Pressable
								onPress={() => router.push('/components')}
								style={({ pressed, hovered }) => [
									styles.ctaSecondary,
									pressed && { opacity: 0.7 },
									Platform.OS === 'web' && hovered ? ({ borderColor: '#52525b' } as any) : null,
								]}
							>
								<Text style={styles.ctaSecondaryText}>Browse Components</Text>
							</Pressable>
						</View>
						<View>
							<Pressable
								onPress={() => router.push('/installation')}
								style={({ pressed, hovered }) => [
									styles.ctaPrimary,
									pressed && styles.ctaPressed,
									Platform.OS === 'web' && hovered
										? ({ borderColor: 'rgba(255,184,77,0.45)', transform: [{ translateY: -1 }] } as any)
										: null,
								]}
							>
								<Text style={styles.ctaPrimaryText}>Get Started →</Text>
							</Pressable>
						</View>
					</View>
				</View>

				<View style={styles.statsStrip}>
					{STATS.map((s, i) => (
						<React.Fragment key={s.label}>
							{i > 0 && <View style={styles.statsDivider} />}
							<View style={styles.statItem}>
								<Text style={styles.statValue}>{s.value}</Text>
								<Text style={styles.statLabel}>{s.label}</Text>
							</View>
						</React.Fragment>
					))}
				</View>

				<View style={[styles.section, { paddingHorizontal: isWide ? 48 : 24 }]}>
					<SectionHeader
						title="Everything you need"
						subtitle="One library for all your cross-platform interactive UI needs."
					/>
					<View style={[styles.grid, { gap: 14 }]}>
						{FEATURES.map((feature) => (
							<FeatureCard key={feature.title} {...feature} width={featureWidth} />
						))}
					</View>
				</View>

				<View style={[styles.section, { paddingHorizontal: isWide ? 48 : 24 }]}>
					<SectionHeader title="Components" subtitle="Explore the full cross-platform component library." />
					<View style={styles.componentsGrid}>
						{COMPONENT_CARDS.map((card) => (
							<ComponentCard key={card.name} {...card} cardWidth={cardWidth} />
						))}
					</View>
				</View>

				<View style={[styles.ctaSection, { marginHorizontal: isWide ? 48 : 24 }]}>
					<Text style={[styles.ctaSectionTitle, { fontSize: isWide ? 32 : 24 }]}>Ready to build something great?</Text>
					<Text style={styles.ctaSectionSub}>
						Install in seconds. Works on iOS, Android, Web, and TV out of the box.
					</Text>
					<View style={styles.ctaRow}>
						<View>
							<Pressable onPress={() => router.push('/installation')} style={({ pressed }) => [styles.ctaPrimary, pressed && styles.ctaPressed]}>
								<Text style={styles.ctaPrimaryText}>Read the Docs →</Text>
							</Pressable>
						</View>
						<View>
							<Pressable onPress={() => router.push('/quick-start')} style={({ pressed }) => [styles.ctaSecondary, pressed && { opacity: 0.7 }]}>
								<Text style={styles.ctaSecondaryText}>Quick Start</Text>
							</Pressable>
						</View>
					</View>
				</View>

				<View style={styles.footer}>
					<View style={styles.footerLinks}>
						<FooterLink label="GitHub" url="https://github.com/imroodydev/react-native-cross-elements" />
						<FooterLink label="npm" url="https://www.npmjs.com/package/react-native-cross-elements" />
						<FooterLink label="Issues" url="https://github.com/imroodydev/react-native-cross-elements/issues" />
					</View>
					<Text style={styles.footerLegal}>
						MIT License · Made with ♥ by{' '}
						<Text
							style={{ color: '#a1a1aa' }}
							onPress={() =>
								Platform.OS === 'web' ? (window as Window).open('https://github.com/imroodydev', '_blank') : undefined
							}
						>
							ImRoodyDev
						</Text>
					</Text>
					<Text style={styles.footerSub}>react-native-cross-elements · v1.0.0</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

function InstallSnippet() {
	const [copied, setCopied] = useState(false);
	const cmd = 'npm install react-native-cross-elements';

	const handleCopy = async () => {
		if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
			await navigator.clipboard.writeText(cmd);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<View style={styles.installBox}>
			<Text style={styles.installPrompt}>$</Text>
			<Text style={styles.installCmd} numberOfLines={1}>
				{cmd}
			</Text>
			<Pressable onPress={handleCopy} style={({ pressed }) => [styles.copyBtn, pressed && { opacity: 0.6 }]}>
				<Text style={styles.copyBtnText}>{copied ? '✓' : 'Copy'}</Text>
			</Pressable>
		</View>
	);
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<Text style={styles.sectionSub}>{subtitle}</Text>
		</View>
	);
}

function FeatureCard({ icon, title, description, accent, width }: (typeof FEATURES)[0] & { width: number }) {
	return (
		<View style={[styles.featureCard, { width }]}>
			<View style={[styles.featureIconWrap, { backgroundColor: accent + '20' }]}>
				<Text style={styles.featureIcon}>{icon}</Text>
			</View>
			<Text style={styles.featureTitle}>{title}</Text>
			<Text style={styles.featureDesc}>{description}</Text>
		</View>
	);
}

function ComponentCard({
	name,
	tag,
	description,
	href,
	color,
	platforms,
	cardWidth,
}: (typeof COMPONENT_CARDS)[0] & { cardWidth: number }) {
	return (
		<Link href={href as any} asChild>
			{/*
			  The card styling lives on the inner View, not the Pressable: <Link asChild> clones its
			  child and overwrites `style`, so anything set on the Pressable is silently dropped (which
			  is why the border never rendered). Hover/press still come from the Pressable's state.
			*/}
			<Pressable>
				{({ hovered, pressed }) => {
					const isHovered = hovered && Platform.OS === 'web';
					return (
						<View
							style={[
								styles.componentCard,
								{
									width: cardWidth,
									// Fill is always weaker than the border, so the card reads as an outlined box
									// with the accent only tinting the surface. Both step up on hover;
									// transitionDuration on componentCard eases between them.
									borderColor: color + (isHovered ? '99' : '59'),
									backgroundColor: color + (isHovered ? '1c' : '0d'),
								},
								isHovered ? [styles.componentCardHovered, { shadowColor: color }] : null,
								pressed && { opacity: 0.85 },
							]}
						>
							<View style={styles.componentCardBody}>
								<View style={styles.componentCardHeader}>
									<Text style={styles.componentName}>{name}</Text>
									<View style={[styles.componentTag, { backgroundColor: color + '1e' }]}>
										<Text style={[styles.componentTagText, { color }]}>{tag}</Text>
									</View>
								</View>
								<Text style={styles.componentDesc}>{description}</Text>
								<View style={styles.componentFooter}>
									<PlatformBadges platforms={platforms as any} size="sm" />
									<Text style={[styles.componentArrow, { color }]}>View →</Text>
								</View>
							</View>
						</View>
					);
				}}
			</Pressable>
		</Link>
	);
}

function FooterLink({ label, url }: { label: string; url: string }) {
	return (
		<Pressable
			onPress={() => Platform.OS === 'web' && (window as Window).open(url, '_blank')}
			style={({ pressed }) => [styles.footerLinkBtn, pressed && { opacity: 0.6 }]}
		>
			<Text style={styles.footerLinkText}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#09090b',
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 0,
	},
	navbarSticky: {
		backgroundColor: '#09090b',
		zIndex: 20,
	},
	hero: {
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	badge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 24,
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 99,
		borderWidth: 1,
		borderColor: '#3f3f46',
		backgroundColor: '#18181b',
	},
	badgeDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: '#4ade80',
	},
	badgeText: {
		color: '#a1a1aa',
		fontSize: 12,
		fontWeight: '500',
	},
	heroIconWrap: {
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 18,
		backgroundColor: 'rgba(9,9,11,0.34)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.18)',
		overflow: 'hidden',
		...((Platform.OS === 'web'
			? {
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
					boxShadow: '0 18px 45px rgba(0,0,0,0.22)',
				}
			: {}) as any),
	},
	heroIconImage: {
		width: '72%',
		height: '72%',
	},
	headline: {
		color: '#ffffff',
		fontWeight: '800',
		textAlign: 'center',
		letterSpacing: 0,
		marginBottom: 20,
	},
	subhead: {
		color: '#f4f4f5',
		textAlign: 'center',
		lineHeight: 28,
		marginBottom: 28,
		textShadowColor: 'rgba(0,0,0,0.35)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 10,
	},
	badgesRow: {
		marginBottom: 28,
	},
	installWrap: {
		marginBottom: 32,
	},
	installBox: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#27272a',
		backgroundColor: '#111113',
		gap: 10,
	},
	installPrompt: {
		color: '#4ade80',
		fontSize: 13,
		fontFamily: Platform.OS === 'web' ? 'Menlo, Consolas, monospace' : 'monospace',
		fontWeight: '600',
	},
	installCmd: {
		flex: 1,
		color: '#d4d4d8',
		fontSize: 13,
		fontFamily: Platform.OS === 'web' ? 'Menlo, Consolas, monospace' : 'monospace',
	},
	copyBtn: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#3f3f46',
		backgroundColor: '#1c1c1f',
	},
	copyBtnText: {
		color: '#a1a1aa',
		fontSize: 11,
		fontWeight: '500',
	},
	ctaRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		justifyContent: 'center',
	},
	ctaPrimary: {
		paddingHorizontal: 28,
		paddingVertical: 15,
		borderRadius: 10,
		backgroundColor: '#ff3d7f',
		borderWidth: 1,
		borderColor: 'rgba(255,184,77,0.34)',
		shadowColor: '#ff3d7f',
		shadowOpacity: 0.2,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		transitionDuration: '180ms',
		...((Platform.OS === 'web'
			? {
					backgroundImage: 'linear-gradient(135deg, #ff3d7f 0%, #ff7a1a 100%)',
					boxShadow: '0 8px 18px rgba(255,61,127,0.2)',
				}
			: {}) as any),
	},
	ctaPressed: {
		opacity: 0.8,
		transform: [{ scale: 0.97 }],
	},
	ctaPrimaryText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 15,
		letterSpacing: 0.1,
	},
	ctaSecondary: {
		paddingHorizontal: 28,
		paddingVertical: 15,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#3f3f46',
		backgroundColor: '#18181b',
		transitionDuration: '160ms',
	},
	ctaSecondaryText: {
		color: '#e4e4e7',
		fontWeight: '600',
		fontSize: 15,
	},
	ctaGhost: {
		paddingHorizontal: 20,
		paddingVertical: 13,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#27272a',
	},
	ctaGhostText: {
		color: '#71717a',
		fontWeight: '500',
		fontSize: 15,
	},
	statsStrip: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginTop: 16,
		marginBottom: 8,
		paddingVertical: 20,
		paddingHorizontal: 24,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#1f1f23',
		backgroundColor: '#0d0d10',
		gap: 0,
	},
	statsDivider: {
		width: 1,
		height: 32,
		backgroundColor: '#27272a',
		marginHorizontal: 24,
	},
	statItem: {
		alignItems: 'center',
		paddingHorizontal: 8,
	},
	statValue: {
		color: '#ffffff',
		fontSize: 26,
		fontWeight: '700',
		letterSpacing: -0.5,
	},
	statLabel: {
		color: '#52525b',
		fontSize: 11,
		fontWeight: '500',
		marginTop: 2,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	section: {
		paddingVertical: 64,
	},
	sectionHeader: {
		alignItems: 'center',
		marginBottom: 40,
	},
	sectionTitle: {
		color: '#ffffff',
		fontSize: 32,
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 10,
		letterSpacing: -0.5,
	},
	sectionSub: {
		color: '#52525b',
		fontSize: 15,
		textAlign: 'center',
		lineHeight: 24,
		maxWidth: 480,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	componentsGrid: {
		width: '100%',
		maxWidth: 1100,
		alignSelf: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 16,
	},
	featureCard: {
		backgroundColor: '#111113',
		borderWidth: 1,
		borderColor: '#1f1f23',
		borderRadius: 16,
		padding: 20,
		margin: 7,
	},
	featureIconWrap: {
		width: 44,
		height: 44,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
	},
	featureIcon: {
		fontSize: 22,
	},
	featureTitle: {
		color: '#ffffff',
		fontSize: 15,
		fontWeight: '600',
		marginBottom: 6,
	},
	featureDesc: {
		color: '#52525b',
		fontSize: 13,
		lineHeight: 20,
	},
	// Border colour and fill are supplied per-card from the accent (see ComponentCard) — matching the
	// feature cards' shape, but tinted instead of flat grey.
	componentCard: {
		borderWidth: 1,
		borderRadius: 16,
		overflow: 'hidden',
		minHeight: 172,
		transitionDuration: '180ms',
	},
	componentCardHovered: {
		transform: [{ translateY: -3 }],
		shadowOpacity: 0.22,
		shadowRadius: 18,
		shadowOffset: { width: 0, height: 12 },
		...((Platform.OS === 'web'
			? {
					boxShadow: '0 18px 46px rgba(0,0,0,0.35)',
				}
			: {}) as any),
	},
	componentCardBody: {
		padding: 18,
		flex: 1,
		justifyContent: 'space-between',
	},
	componentCardHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 10,
		gap: 8,
	},
	componentTag: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		flexShrink: 0,
	},
	componentTagText: {
		fontSize: 10,
		fontWeight: '700',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
	},
	componentName: {
		color: '#ffffff',
		fontSize: 15,
		fontWeight: '700',
		flex: 1,
		letterSpacing: -0.2,
		lineHeight: 21,
	},
	componentDesc: {
		color: '#71717a',
		fontSize: 13,
		lineHeight: 20,
		marginBottom: 14,
	},
	componentFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	componentArrow: {
		fontSize: 13,
		fontWeight: '600',
	},
	ctaSection: {
		marginVertical: 24,
		paddingVertical: 56,
		paddingHorizontal: 24,
		borderColor: '#1f1f23',
		backgroundColor: '#0d0d10',
		alignItems: 'center',
	},
	ctaSectionTitle: {
		color: '#ffffff',
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 10,
		letterSpacing: -0.3,
	},
	ctaSectionSub: {
		color: '#52525b',
		fontSize: 15,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 28,
		maxWidth: 400,
	},
	footer: {
		alignItems: 'center',
		paddingTop: 32,
		paddingBottom: 48,
		paddingHorizontal: 24,
		borderTopWidth: 1,
		borderColor: '#1a1a1e',
		gap: 8,
	},
	footerLinks: {
		flexDirection: 'row',
		gap: 4,
		marginBottom: 4,
	},
	footerLinkBtn: {
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	footerLinkText: {
		color: '#52525b',
		fontSize: 13,
	},
	footerLegal: {
		color: '#3f3f46',
		fontSize: 13,
	},
	footerSub: {
		color: '#27272a',
		fontSize: 11,
	},
});
