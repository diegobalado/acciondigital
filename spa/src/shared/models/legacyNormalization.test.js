import { normalizeLegacyText } from './legacyNormalization';

describe('normalizeLegacyText', () => {
	it('returns empty string when value is not a string', () => {
		expect(normalizeLegacyText(undefined)).toBe('');
		expect(normalizeLegacyText(null)).toBe('');
		expect(normalizeLegacyText(123)).toBe('');
	});

	it('trims and collapses repeated spaces', () => {
		expect(normalizeLegacyText('  Copa   Balcarce   2026  ')).toBe('Copa Balcarce 2026');
	});
});