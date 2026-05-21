import type {DimensionValue, StyleProp, ViewStyle} from 'react-native';

type StyleLike = | StyleProp<ViewStyle> | Record<string, unknown>
	| number
	| string
	| Array<any>
	| null
	| undefined
	| false;

export type PaddingResult = {
	top: DimensionValue;
	right: DimensionValue;
	bottom: DimensionValue;
	left: DimensionValue;
};

/**
 * Extract padding from a ViewStyle-like input.
 * - Accepts trackStyle objects, arrays of styles, numbers, or CSS-like strings ("4px 8px 4px 16px")
 * - Recognizes aliases: p, px, py, pt/pr/pb/pl, paddingX/paddingY, topPadding/rightPadding/bottomPadding/leftPadding, paddingStart/paddingEnd
 * - Precedence: base padding -> axis shorthands -> side-specific
 * - Returns strings with px for unitless values.
 */
export function extractPadding(style: StyleProp<ViewStyle> | Record<string, unknown> | number | string | Array<any> | null | undefined): PaddingResult {
	const styleObj = toStyleObject(style);

	// Base (padding / p) -> expand via CSS shorthand rules
	let [top, right, bottom, left] = expandPadding(styleObj['padding'] ?? styleObj['p']);

	// Axis shorthands
	const v = firstVal(styleObj['paddingVertical'] ?? styleObj['py'] ?? styleObj['paddingY']);
	if (v) {
		top = v;
		bottom = v;
	}
	const h = firstVal(styleObj['paddingHorizontal'] ?? styleObj['px'] ?? styleObj['paddingX']);
	if (h) {
		right = h;
		left = h;
	}

	// Side-specific (aliases last to override)
	top = pickSide(styleObj, ['paddingTop', 'topPadding', 'pt']) ?? top;
	right = pickSide(styleObj, ['paddingRight', 'rightPadding', 'pr', 'paddingEnd']) ?? right;
	bottom = pickSide(styleObj, ['paddingBottom', 'bottomPadding', 'pb']) ?? bottom;
	left = pickSide(styleObj, ['paddingLeft', 'leftPadding', 'pl', 'paddingStart']) ?? left;

	return {top, right, bottom, left};
}


/** Strip all padding related trackStyle and return the trackStyle object back*/
export function stripPaddingStyle(style: StyleProp<ViewStyle>): ViewStyle {
	const styleObj = toStyleObject(style);
	const out: Record<string, any> = {};
	for (const key of Object.keys(styleObj)) {
		if (![
			'padding', 'p',
			'paddingTop', 'topPadding', 'pt',
			'paddingRight', 'rightPadding', 'pr', 'paddingEnd',
			'paddingBottom', 'bottomPadding', 'pb',
			'paddingLeft', 'leftPadding', 'pl', 'paddingStart',
			'paddingHorizontal', 'px', 'paddingX',
			'paddingVertical', 'py', 'paddingY',
		].includes(key)) {
			out[key] = styleObj[key];
		}
	}
	return out as ViewStyle;
}

/**
 * Merge various trackStyle inputs into a single object.
 * - Arrays are flattened; later entries override earlier ones.
 * - Non-object primitive values are treated as { padding: defaultValue }.
 */
function toStyleObject(input: StyleLike): Record<string, any> {
	if (Array.isArray(input)) {
		return input.reduce<Record<string, any>>((acc, item) => {
			if (!item) return acc;
			const obj = toStyleObject(item as StyleLike);
			return Object.assign(acc, obj);
		}, {});
	}
	if (input && typeof input === 'object') {
		return input as Record<string, any>;
	}
	if (typeof input === 'number' || typeof input === 'string') {
		return {padding: input};
	}
	return {};
}

/**
 * Expand a CSS-like padding shorthand into [top, right, bottom, left].
 */
function expandPadding(value: unknown): [DimensionValue, DimensionValue, DimensionValue, DimensionValue] {
	if (value == null) {
		const z = normalizeUnit(0);
		return [z, z, z, z];
	}

	const tokens = toTokens(value);
	const len = tokens.length;

	if (len === 0) {
		const z = normalizeUnit(0);
		return [z, z, z, z];
	}
	if (len === 1) {
		const a = normalizeUnit(tokens[0]);
		return [a, a, a, a];
	}
	if (len === 2) {
		const a = normalizeUnit(tokens[0]); // top/bottom
		const b = normalizeUnit(tokens[1]); // left/right
		return [a, b, a, b];
	}
	if (len === 3) {
		const a = normalizeUnit(tokens[0]); // top
		const b = normalizeUnit(tokens[1]); // left/right
		const c = normalizeUnit(tokens[2]); // bottom
		return [a, b, c, b];
	}
	// 4+ -> top, right, bottom, left (ignore extras)
	return [
		normalizeUnit(tokens[0]),
		normalizeUnit(tokens[1]),
		normalizeUnit(tokens[2]),
		normalizeUnit(tokens[3]),
	];
}

/**
 * For axis shorthands, get first normalized defaultValue from possibly shorthand input.
 */
function firstVal(value: unknown): DimensionValue | undefined {
	if (value == null) return undefined;
	const tokens = toTokens(value);
	if (!tokens.length) return undefined;
	return normalizeUnit(tokens[0]);
}

/**
 * Pick the first defined property among aliases and normalize it.
 */
function pickSide(obj: Record<string, unknown>, keys: string[]): DimensionValue | undefined {
	for (const k of keys) {
		if (obj[k] != null) {
			return firstVal(obj[k]);
		}
	}
	return undefined;
}

/**
 * Convert input into tokens for shorthand parsing.
 * - Numbers -> ["<number>"]
 * - Strings -> sanitize then split by whitespace (supports "4px 3px 4px 4px:")
 * - Arrays  -> flatten to tokens
 */
function toTokens(value: unknown): string[] {
	if (typeof value === 'number') return [String(value)];
	if (typeof value === 'string') {
		const s = sanitizeString(value);
		return s.length ? s.split(/\s+/) : [];
	}
	if (Array.isArray(value)) {
		const out: string[] = [];
		for (const el of value) {
			if (el == null || el === false) continue;
			if (typeof el === 'number') out.push(String(el));
			else if (typeof el === 'string') {
				const s = sanitizeString(el);
				if (s.length) out.push(...s.split(/\s+/));
			}
		}
		return out;
	}
	return [];
}

function sanitizeString(s: string): string {
	// Trim, drop trailing ":" or ";" and normalize whitespace
	return s.trim().replace(/[:;]+$/g, '').replace(/\s+/g, ' ');
}

/**
 * Normalize a token to CSS-like string.
 * - Unitless -> "<n>px"
 * - Preserves existing units (px, rem, %, etc.)
 */
function normalizeUnit(token: string | number): DimensionValue {
	// if (typeof token === 'number') return token;
	// return token as DimensionValue;
	if (typeof token === 'number') return token;
	const s = String(token).trim();
	if (/^-?\d+(\.\d+)?$/.test(s)) return parseInt(s, 10);
	return s as DimensionValue;
}

