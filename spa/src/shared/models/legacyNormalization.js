export function normalizeLegacyText(value) {
	if (typeof value !== 'string') {
		return '';
	}

	return value.trim().replace(/\s+/g, ' ');
}