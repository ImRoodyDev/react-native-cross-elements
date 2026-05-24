import React from 'react';
import { View, Text, ScrollView, useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { PlatformBadges } from './PlatformBadges';
import { CodeBlock } from './CodeBlock';

type SupportedPlatform = 'ios' | 'android' | 'web' | 'tv';

type Section = {
	title: string;
	content: React.ReactNode;
};

type Props = {
	title: string;
	description: string;
	platforms?: SupportedPlatform[];
	importCode?: string;
	sections?: Section[];
};

export function DocPage({ title, description, platforms, importCode, sections = [] }: Props) {
	const { width } = useWindowDimensions();
	const px = width >= 1024 ? 48 : 24;

	const innerContent = (
		<View style={[styles.contentWrap, { paddingHorizontal: px }]}>
			{/* Page header */}
			<View style={styles.pageHeader}>
				<Text style={styles.pageTitle}>{title}</Text>
				{platforms && (
					<View style={{ marginBottom: 16 }}>
						<PlatformBadges platforms={platforms} />
					</View>
				)}
				<Text style={styles.pageDescription}>{description}</Text>
			</View>

			<View style={styles.divider} />

			{/* Import */}
			{importCode && (
				<View style={styles.section}>
					<SectionTitle>Import</SectionTitle>
					<CodeBlock code={importCode} language="tsx" />
				</View>
			)}

			{/* Dynamic sections */}
			{sections.map((s, i) => (
				<View key={i} style={styles.section}>
					<SectionTitle>{s.title}</SectionTitle>
					{s.content}
				</View>
			))}
		</View>
	);

	if (Platform.OS === 'web') {
		return <View style={styles.scrollContent}>{innerContent}</View>;
	}

	return (
		<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
			{innerContent}
		</ScrollView>
	);
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
	return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'tip' }) {
	const cfg = {
		info: {
			borderColor: 'rgba(99,102,241,0.35)',
			bg: 'rgba(99,102,241,0.07)',
			textColor: '#a5b4fc',
			icon: 'ℹ️',
		},
		warning: {
			borderColor: 'rgba(245,158,11,0.35)',
			bg: 'rgba(245,158,11,0.07)',
			textColor: '#fcd34d',
			icon: '⚠️',
		},
		tip: {
			borderColor: 'rgba(34,197,94,0.35)',
			bg: 'rgba(34,197,94,0.07)',
			textColor: '#86efac',
			icon: '✨',
		},
	}[type];

	return (
		<View
			style={{
				borderRadius: 10,
				borderWidth: 1,
				borderLeftWidth: 3,
				borderColor: cfg.borderColor,
				borderLeftColor: cfg.textColor,
				backgroundColor: cfg.bg,
				paddingHorizontal: 16,
				paddingVertical: 14,
				marginBottom: 16,
				flexDirection: 'row',
				gap: 10,
				alignItems: 'flex-start',
			}}
		>
			<Text style={{ fontSize: 14, marginTop: 1 }}>{cfg.icon}</Text>
			<Text style={{ color: cfg.textColor, fontSize: 14, lineHeight: 22, flex: 1 }}>{children}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
		backgroundColor: '#09090b',
	},
	scrollContent: {
		alignItems: 'center',
		paddingBottom: 120,
	},
	contentWrap: {
		width: '100%',
		maxWidth: 780,
		paddingTop: 52,
	},
	pageHeader: {
		marginBottom: 32,
	},
	pageTitle: {
		fontSize: 34,
		fontWeight: '800',
		color: '#ffffff',
		letterSpacing: -0.8,
		marginBottom: 14,
		lineHeight: 42,
	},
	pageDescription: {
		color: '#71717a',
		fontSize: 16,
		lineHeight: 28,
	},
	divider: {
		height: 1,
		backgroundColor: '#18181b',
		marginBottom: 40,
	},
	section: {
		marginBottom: 48,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#ffffff',
		letterSpacing: -0.3,
		marginBottom: 20,
	},
});
