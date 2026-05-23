import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Platform } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { navigation, type NavItem } from '../data/navigation';

// ── Animated section content (fade + slide on expand/collapse) ───────────────
function AnimatedSection({ show, children }: { show: boolean; children: React.ReactNode }) {
	const [mounted, setMounted] = useState(show);
	const opacity = useRef(new Animated.Value(show ? 1 : 0)).current;
	const translateY = useRef(new Animated.Value(show ? 0 : -6)).current;

	useEffect(() => {
		if (show) {
			setMounted(true);
			Animated.parallel([
				Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
				Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 280, friction: 22 }),
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
				Animated.timing(translateY, { toValue: -6, duration: 140, useNativeDriver: true }),
			]).start(() => setMounted(false));
		}
	}, [show]);

	if (!mounted) return null;
	return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────
export function Sidebar({ onClose }: { onClose?: () => void }) {
	return (
		<View style={styles.sidebar}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
				{navigation.map((section, i) => (
					<SidebarSection key={i} item={section} depth={0} onClose={onClose} />
				))}
			</ScrollView>
		</View>
	);
}

function SidebarSection({ item, depth, onClose }: { item: NavItem; depth: number; onClose?: () => void }) {
	const [open, setOpen] = useState(true);
	const chevronAnim = useRef(new Animated.Value(1)).current;
	const pathname = usePathname() ?? '';
	const router = useRouter();

	function toggle() {
		const next = !open;
		setOpen(next);
		Animated.spring(chevronAnim, {
			toValue: next ? 1 : 0,
			useNativeDriver: true,
			tension: 220,
			friction: 18,
		}).start();
	}

	const chevronRotate = chevronAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['-90deg', '0deg'],
	});

	if (item.children) {
		// Top-level section
		if (depth === 0) {
			return (
				<View style={styles.sectionGroup}>
					<Pressable onPress={toggle} style={styles.sectionHeader}>
						<Text style={styles.sectionLabel}>{item.title}</Text>
						<Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
							<Text style={styles.chevron}>▾</Text>
						</Animated.View>
					</Pressable>
					<AnimatedSection show={open}>
						{item.children.map((child, i) => (
							<SidebarSection key={i} item={child} depth={1} onClose={onClose} />
						))}
					</AnimatedSection>
				</View>
			);
		}

		// Nested group (e.g. Buttons sub-section)
		return (
			<View style={styles.nestedGroup}>
				<Pressable onPress={toggle} style={[styles.nestedHeader, { paddingLeft: 22 + depth * 12 }]}>
					<Text style={styles.nestedLabel}>{item.title}</Text>
					<Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
						<Text style={styles.chevronSm}>▾</Text>
					</Animated.View>
				</Pressable>
				<AnimatedSection show={open}>
					{item.children.map((child, i) => (
						<SidebarSection key={i} item={child} depth={depth + 1} onClose={onClose} />
					))}
				</AnimatedSection>
			</View>
		);
	}

	// Leaf nav item
	const isActive = item.href ? pathname === item.href : false;

	const navButton = (
		<Pressable
			onPress={() => {
				if (item.href) {
					router.push(item.href as any);
				}
				onClose?.();
			}}
			style={({ pressed, hovered }) => [
				styles.navItem,
				{ paddingLeft: 22 + depth * 12 },
				isActive ? styles.navItemActive : null,
				hovered && Platform.OS === 'web' && !isActive ? styles.navItemHovered : null,
				pressed && !isActive ? styles.navItemPressed : null,
			]}
		>
			{/* Active left-border accent */}
			<View style={[styles.activeBorder, isActive && styles.activeBorderVisible]} />
			<Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>{item.title}</Text>
		</Pressable>
	);

	return navButton;
}

const styles = StyleSheet.create({
	sidebar: {
		width: 260,
		height: '100%',
		flexShrink: 0,
		backgroundColor: '#09090b',
		borderRightWidth: 1,
		borderRightColor: '#18181b',
	},
	scrollContent: {
		paddingTop: 24,
		paddingBottom: 48,
	},

	// Top-level section
	sectionGroup: {
		marginBottom: 20,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		paddingVertical: 8,
	},
	sectionLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#3f3f46',
		letterSpacing: 1,
		textTransform: 'uppercase',
	},
	chevron: {
		color: '#3f3f46',
		fontSize: 12,
	},

	// Nested group
	nestedGroup: {
		marginBottom: 2,
	},
	nestedHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingRight: 20,
		paddingVertical: 6,
	},
	nestedLabel: {
		fontSize: 13,
		fontWeight: '500',
		color: '#52525b',
	},
	chevronSm: {
		color: '#3f3f46',
		fontSize: 10,
	},

	// Nav leaf item
	navItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingRight: 18,
		marginHorizontal: 12,
		borderRadius: 8,
		marginBottom: 2,
		position: 'relative',
		transitionDuration: '160ms',
	},
	navItemActive: {
		backgroundColor: 'rgba(99,102,241,0.12)',
	},
	navItemHovered: {
		backgroundColor: 'rgba(99,102,241,0.08)',
		transform: [{ translateX: 2 }],
		...((Platform.OS === 'web'
			? {
					boxShadow: 'inset 0 0 0 1px rgba(129,140,248,0.12)',
				}
			: {}) as any),
	},
	navItemPressed: {
		backgroundColor: '#18181b',
	},
	navItemText: {
		fontSize: 14,
		color: '#71717a',
		flex: 1,
	},
	navItemTextActive: {
		color: '#e4e4e7',
		fontWeight: '500',
	},

	// Left border accent
	activeBorder: {
		position: 'absolute',
		left: 0,
		top: 4,
		bottom: 4,
		width: 2,
		borderRadius: 2,
		backgroundColor: 'transparent',
	},
	activeBorderVisible: {
		backgroundColor: '#6366f1',
	},
});
