export function joinClsx(base: string | undefined, prefix: string): string | undefined {
	if (!base) return undefined;

	// Clean base: remove trailing non-alphanumeric chars
	const cleanedBase = base.replace(/[^a-zA-Z0-9]+$/, "");

	// Clean prefix: remove leading non-alphanumeric chars
	const cleanedPrefix = prefix.replace(/^[^a-zA-Z0-9]+/, "");

	if (!cleanedPrefix) return cleanedBase; // avoid trailing '-'

	return `${cleanedBase}-${cleanedPrefix}`;
}