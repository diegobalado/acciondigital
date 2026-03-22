export const APP_ROUTES = Object.freeze({
	HOME: 'home',
	EVENTS: 'events',
	EVENT_GALLERY: 'event-gallery',
	AMIGOS: 'amigos',
	FAQ: 'faq',
	CONTACTO: 'contacto',
	NOT_FOUND: 'not-found'
});

function normalizePathname(pathname = '/') {
	if (!pathname || pathname === '/') {
		return '/';
	}

	return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function hasSelectedEvent(search = '') {
	const params = new URLSearchParams(search);
	return params.has('g') || params.has('id');
}

export function resolveAppRoute(locationLike = {}) {
	const pathname = normalizePathname(locationLike.pathname || '/');
	const search = locationLike.search || '';

	if (pathname === '/eventos') {
		return hasSelectedEvent(search) ? APP_ROUTES.EVENT_GALLERY : APP_ROUTES.EVENTS;
	}

	if (pathname === '/amigos') {
		return APP_ROUTES.AMIGOS;
	}

	if (pathname === '/faq') {
		return APP_ROUTES.FAQ;
	}

	if (pathname === '/contacto') {
		return APP_ROUTES.CONTACTO;
	}

	return pathname === '/' ? APP_ROUTES.HOME : APP_ROUTES.NOT_FOUND;
}

export function resolveAppRouteFromWindow(currentWindowLike = null) {
	const windowRef = currentWindowLike || (typeof window === 'undefined' ? null : window);

	if (!windowRef || !windowRef.location) {
		return APP_ROUTES.HOME;
	}

	return resolveAppRoute(windowRef.location);
}
