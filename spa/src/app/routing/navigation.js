import { APP_ROUTES } from './routes';

export const SPA_NAV_ITEMS = Object.freeze([
	{ id: 'inicio', label: 'Inicio', href: '/', routes: [APP_ROUTES.HOME] },
	{
		id: 'eventos',
		label: 'Eventos',
		href: '/eventos/',
		routes: [APP_ROUTES.EVENTS, APP_ROUTES.EVENT_GALLERY]
	},
	{ id: 'amigos', label: 'Amigos', href: '/amigos/', routes: [APP_ROUTES.AMIGOS] },
	{ id: 'faq', label: 'Ayuda', href: '/faq/', routes: [APP_ROUTES.FAQ] },
	{ id: 'contacto', label: 'Contacto', href: '/contacto/', routes: [APP_ROUTES.CONTACTO] }
]);

export function buildNavHref(href, currentSearch = '') {
	if (!currentSearch) {
		return href;
	}

	const currentParams = new URLSearchParams(currentSearch);
	if (!currentParams.has('mirror')) {
		return href;
	}

	const [baseHref, existingSearch = ''] = String(href || '').split('?');
	const mergedParams = new URLSearchParams(existingSearch);
	if (!mergedParams.has('mirror')) {
		mergedParams.set('mirror', currentParams.get('mirror') || '');
	}

	const nextSearch = mergedParams.toString();
	return nextSearch ? `${baseHref}?${nextSearch}` : baseHref;
}

export function isNavItemActive(item, currentRoute) {
	if (!item || !Array.isArray(item.routes)) {
		return false;
	}

	return item.routes.includes(currentRoute);
}
