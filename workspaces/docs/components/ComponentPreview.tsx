import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { CodeBlock } from './CodeBlock';

type Props = {
	/** Live component to render in the Preview tab */
	children: React.ReactNode;
	/** Source code string — when provided, shows a Preview / Code tab bar */
	code?: string;
	language?: string;
	/** Optional label shown in the tab bar corner */
	label?: string;
	/** Minimum height of the preview area */
	height?: number;
	/** Dark (default) or light preview background */
	dark?: boolean;
};

export function ComponentPreview({ children, code, language = 'tsx', label, height = 160, dark = true }: Props) {
	const [tab, setTab] = useState<'preview' | 'code'>('preview');
	const hasTabs = !!code;

	return (
		<View style={styles.wrap}>
			{/* ── Tab bar ─────────────────────────────────── */}
			<View style={styles.tabBar}>
				<View style={styles.tabGroup}>
					{hasTabs ? (
						(['preview', 'code'] as const).map((t) => (
							<Pressable
								key={t}
								onPress={() => setTab(t)}
								accessibilityRole="button"
								accessibilityState={{ selected: tab === t }}
								style={({ pressed, hovered }) => [
									styles.tab,
									tab === t ? styles.tabActive : null,
									hovered && Platform.OS === 'web' && tab !== t ? styles.tabHovered : null,
									pressed && { opacity: 0.65 },
								]}
							>
								<Text style={[styles.tabText, tab === t ? styles.tabTextActive : null]}>
									{t === 'preview' ? 'Preview' : 'Code'}
								</Text>
							</Pressable>
						))
					) : (
						<View style={[styles.tab, styles.tabActive]}>
							<Text style={styles.tabTextActive}>Preview</Text>
						</View>
					)}
				</View>
				{label && <Text style={styles.labelText}>{label}</Text>}
			</View>
			{/* ── Preview pane ────────────────────────────── */}{' '}
			{tab === 'preview' && (
				<View style={[styles.previewArea, { minHeight: height }, dark ? styles.previewDark : styles.previewLight]}>
					{/* dot-grid background — pointer-events none so children stay interactive */}
					{dark && <View style={styles.dotGrid} pointerEvents="none" />}
					<View style={styles.previewContent}>{children}</View>
				</View>
			)}
			{/* ── Code pane ───────────────────────────────── */}
			{hasTabs && tab === 'code' && <CodeBlock code={code} language={language} />}
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#1f1f23',
		// NOTE: no overflow:'hidden' here — that property clips touch hit-testing on
		// native (iOS/Android) and blocks nested scroll containers on web.
		// Instead, each inner section carries its own overflow + border-radius.
		marginBottom: 16,
	},

	// Tab bar
	tabBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		backgroundColor: '#0d0d10',
		borderBottomWidth: 1,
		borderBottomColor: '#1a1a1e',
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	tabGroup: {
		flexDirection: 'row',
		gap: 0,
	},
	tab: {
		paddingHorizontal: 14,
		paddingVertical: 11,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		transitionDuration: '160ms',
	},
	tabActive: {
		borderBottomColor: '#6366f1',
		backgroundColor: 'rgba(99,102,241,0.08)',
	},
	tabHovered: {
		backgroundColor: '#18181b',
	},
	tabText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#52525b',
	},
	tabTextActive: {
		fontSize: 13,
		fontWeight: '500',
		color: '#e4e4e7',
	},
	labelText: {
		color: '#3f3f46',
		fontSize: 11,
	},

	// Preview area
	previewArea: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden', // safe here — no Pressables are direct children; clips dot grid to rounded corners
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
	},
	previewDark: {
		backgroundColor: '#09090b',
	},
	previewLight: {
		backgroundColor: '#f4f4f5',
	},
	dotGrid: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.35,
		zIndex: 0,
	},
	previewContent: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
		width: '100%',
		position: 'relative', // establishes stacking context
		zIndex: 1, // sits above the absolute dot-grid layer
	},
});
