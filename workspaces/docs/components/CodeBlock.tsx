import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform, StyleSheet } from 'react-native';

// ── Syntax highlighting ───────────────────────────────────────────────────────

const KEYWORDS = new Set([
	'const',
	'let',
	'var',
	'function',
	'return',
	'if',
	'else',
	'for',
	'while',
	'do',
	'switch',
	'case',
	'break',
	'continue',
	'new',
	'delete',
	'typeof',
	'instanceof',
	'void',
	'null',
	'undefined',
	'true',
	'false',
	'class',
	'extends',
	'super',
	'this',
	'static',
	'async',
	'await',
	'try',
	'catch',
	'finally',
	'throw',
	'of',
	'in',
	'yield',
]);

const TS_KEYWORDS = new Set([
	'import',
	'export',
	'from',
	'as',
	'default',
	'type',
	'interface',
	'implements',
	'declare',
	'namespace',
	'enum',
	'abstract',
	'readonly',
	'keyof',
	'infer',
	'never',
	'unknown',
	'any',
]);

const BUILTIN_TYPES = new Set([
	'string',
	'number',
	'boolean',
	'object',
	'Symbol',
	'Array',
	'Promise',
	'Record',
	'Partial',
	'Required',
	'Readonly',
	'Pick',
	'Omit',
	'Exclude',
	'Extract',
	'NonNullable',
	'ReturnType',
	'React',
	'View',
	'Text',
	'Pressable',
	'ScrollView',
	'StyleSheet',
	'Platform',
	'TouchableOpacity',
	'FlatList',
	'Animated',
]);

type Token = { text: string; color: string };

function tokenize(code: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;
	while (i < code.length) {
		// Line comment
		if (code[i] === '/' && code[i + 1] === '/') {
			const end = code.indexOf('\n', i);
			const text = end === -1 ? code.slice(i) : code.slice(i, end);
			tokens.push({ text, color: '#6b7280' });
			i += text.length;
			continue;
		}
		// Block comment
		if (code[i] === '/' && code[i + 1] === '*') {
			const end = code.indexOf('*/', i + 2);
			const text = end === -1 ? code.slice(i) : code.slice(i, end + 2);
			tokens.push({ text, color: '#6b7280' });
			i += text.length;
			continue;
		}
		// Template literal
		if (code[i] === '`') {
			let j = i + 1;
			while (j < code.length && code[j] !== '`') {
				if (code[j] === '\\') j++;
				j++;
			}
			tokens.push({ text: code.slice(i, j + 1), color: '#86efac' });
			i = j + 1;
			continue;
		}
		// Strings
		if (code[i] === '"' || code[i] === "'") {
			const quote = code[i];
			let j = i + 1;
			while (j < code.length && code[j] !== quote && code[j] !== '\n') {
				if (code[j] === '\\') j++;
				j++;
			}
			tokens.push({ text: code.slice(i, j + 1), color: '#86efac' });
			i = j + 1;
			continue;
		}
		// Number literal
		if (/\d/.test(code[i]) && (i === 0 || !/[a-zA-Z_$]/.test(code[i - 1]))) {
			let j = i;
			while (j < code.length && /[\d.xXoObB_a-fA-F]/.test(code[j])) j++;
			tokens.push({ text: code.slice(i, j), color: '#fb923c' });
			i = j;
			continue;
		}
		// Identifier / keyword / type
		if (/[a-zA-Z_$]/.test(code[i])) {
			let j = i;
			while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
			const word = code.slice(i, j);
			if (KEYWORDS.has(word)) {
				tokens.push({ text: word, color: '#c084fc' }); // purple
			} else if (TS_KEYWORDS.has(word)) {
				tokens.push({ text: word, color: '#f472b6' }); // pink
			} else if (BUILTIN_TYPES.has(word)) {
				tokens.push({ text: word, color: '#67e8f9' }); // cyan
			} else if (/^[A-Z]/.test(word)) {
				tokens.push({ text: word, color: '#60a5fa' }); // blue — PascalCase
			} else if (j < code.length && code[j] === '(') {
				tokens.push({ text: word, color: '#fde68a' }); // yellow — function call
			} else {
				tokens.push({ text: word, color: '#e4e4e7' }); // default
			}
			i = j;
			continue;
		}
		// Operators / punctuation
		if (/[{}[\]().,;:!+\-*/%&|^~?=<>@#]/.test(code[i])) {
			tokens.push({ text: code[i], color: '#a1a1aa' });
			i++;
			continue;
		}
		// Whitespace + fallback
		tokens.push({ text: code[i], color: '#e4e4e7' });
		i++;
	}
	return tokens;
}

const HIGHLIGHTED_LANGS = new Set(['ts', 'tsx', 'js', 'jsx', 'typescript', 'javascript']);

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
	code: string;
	language?: string;
	filename?: string;
	showCopy?: boolean;
};

export function CodeBlock({ code, language = 'tsx', filename, showCopy = true }: Props) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(code);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch {}
		}
	};

	const tokens = HIGHLIGHTED_LANGS.has(language) ? tokenize(code) : null;

	return (
		<View style={styles.wrap}>
			{/* Header bar */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					{/* macOS-style traffic lights */}
					<View style={styles.dots}>
						<View style={[styles.dot, { backgroundColor: '#3f3f46' }]} />
						<View style={[styles.dot, { backgroundColor: '#3f3f46' }]} />
						<View style={[styles.dot, { backgroundColor: '#3f3f46' }]} />
					</View>
					{filename ? (
						<Text style={styles.filename}>{filename}</Text>
					) : (
						<View style={styles.langBadge}>
							<Text style={styles.langText}>{language}</Text>
						</View>
					)}
				</View>
				{showCopy && (
					<Pressable
						onPress={handleCopy}
						accessibilityRole="button"
						style={({ pressed, hovered }) => [
							styles.copyBtn,
							hovered && Platform.OS === 'web' ? styles.copyBtnHovered : null,
							pressed && { opacity: 0.6 },
						]}
					>
						<Text style={[styles.copyText, copied && { color: '#86efac' }]}>{copied ? '✓ Copied' : 'Copy'}</Text>
					</Pressable>
				)}
			</View>

			{/* Code */}
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={styles.codeBody}>
					{tokens ? (
						<Text style={styles.codeText} selectable>
							{tokens.map((tok, idx) => (
								<Text key={idx} style={{ color: tok.color }}>
									{tok.text}
								</Text>
							))}
						</Text>
					) : (
						<Text style={styles.codeText} selectable>
							{code}
						</Text>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const MONO = Platform.OS === 'web' ? "Menlo, Consolas, 'Courier New', monospace" : 'monospace';

const styles = StyleSheet.create({
	wrap: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#1f1f23',
		overflow: 'hidden',
		backgroundColor: '#0a0a0c',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#0d0d10',
		borderBottomWidth: 1,
		borderBottomColor: '#1a1a1e',
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	dots: {
		flexDirection: 'row',
		gap: 5,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	filename: {
		color: '#52525b',
		fontSize: 12,
		fontFamily: MONO,
	},
	langBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 5,
		backgroundColor: '#18181b',
		borderWidth: 1,
		borderColor: '#27272a',
	},
	langText: {
		color: '#52525b',
		fontSize: 11,
	},
	copyBtn: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#27272a',
		backgroundColor: '#111113',
		transitionDuration: '140ms',
	},
	copyBtnHovered: {
		borderColor: '#52525b',
		backgroundColor: '#18181b',
	},
	copyText: {
		color: '#71717a',
		fontSize: 11,
		fontWeight: '500',
	},
	codeBody: {
		paddingHorizontal: 20,
		paddingVertical: 18,
	},
	codeText: {
		color: '#e4e4e7',
		fontSize: 13,
		lineHeight: 22,
		fontFamily: MONO,
	},
});
