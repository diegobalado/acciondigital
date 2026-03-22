import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from './routes';
import { buildNavHref, isNavItemActive, SPA_NAV_ITEMS } from './navigation';

describe('buildNavHref', () => {
	it('keeps href unchanged when mirror is not present', () => {
		expect(buildNavHref('/eventos/', '')).toBe('/eventos/');
		expect(buildNavHref('/eventos/', '?foo=bar')).toBe('/eventos/');
	});

	it('propagates mirror param to target href', () => {
		expect(buildNavHref('/eventos/', '?mirror=home5')).toBe('/eventos/?mirror=home5');
		expect(buildNavHref('/contacto/?x=1', '?mirror=home5')).toBe('/contacto/?x=1&mirror=home5');
	});

	it('does not duplicate mirror when already present', () => {
		expect(buildNavHref('/eventos/?mirror=home5', '?mirror=home5')).toBe('/eventos/?mirror=home5');
	});
});

describe('isNavItemActive', () => {
	it('returns true when current route is included in nav item routes', () => {
		const eventsItem = SPA_NAV_ITEMS.find((item) => item.id === 'eventos');
		expect(isNavItemActive(eventsItem, APP_ROUTES.EVENTS)).toBe(true);
		expect(isNavItemActive(eventsItem, APP_ROUTES.EVENT_GALLERY)).toBe(true);
	});

	it('returns false for unrelated routes', () => {
		const faqItem = SPA_NAV_ITEMS.find((item) => item.id === 'faq');
		expect(isNavItemActive(faqItem, APP_ROUTES.CONTACTO)).toBe(false);
	});
});
