import { describe, expect, it } from 'vitest';
import { APP_ROUTES, resolveAppRoute, resolveAppRouteFromWindow } from './routes';

describe('resolveAppRoute', () => {
	it('resolves events catalog route', () => {
		expect(resolveAppRoute({ pathname: '/eventos', search: '' })).toBe(APP_ROUTES.EVENTS);
		expect(resolveAppRoute({ pathname: '/eventos/', search: '' })).toBe(APP_ROUTES.EVENTS);
	});

	it('resolves event gallery route when query has id or g', () => {
		expect(resolveAppRoute({ pathname: '/eventos', search: '?id=170301' })).toBe(APP_ROUTES.EVENT_GALLERY);
		expect(resolveAppRoute({ pathname: '/eventos/', search: '?g=170301' })).toBe(APP_ROUTES.EVENT_GALLERY);
	});

	it('resolves secondary pages', () => {
		expect(resolveAppRoute({ pathname: '/amigos', search: '' })).toBe(APP_ROUTES.AMIGOS);
		expect(resolveAppRoute({ pathname: '/faq/', search: '' })).toBe(APP_ROUTES.FAQ);
		expect(resolveAppRoute({ pathname: '/contacto', search: '' })).toBe(APP_ROUTES.CONTACTO);
	});

	it('falls back to home for unknown paths', () => {
		expect(resolveAppRoute({ pathname: '/', search: '' })).toBe(APP_ROUTES.HOME);
		expect(resolveAppRoute({ pathname: '/otra', search: '' })).toBe(APP_ROUTES.HOME);
	});
});

describe('resolveAppRouteFromWindow', () => {
	it('uses location from provided window-like object', () => {
		const route = resolveAppRouteFromWindow({
			location: {
				pathname: '/faq/',
				search: ''
			}
		});

		expect(route).toBe(APP_ROUTES.FAQ);
	});

	it('returns home when window is unavailable', () => {
		expect(resolveAppRouteFromWindow(null)).toBe(APP_ROUTES.HOME);
	});
});
