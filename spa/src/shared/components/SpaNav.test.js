import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../app/routing/routes';
import SpaNav from './SpaNav.svelte';

describe('SpaNav', () => {
	it('renders all nav links', () => {
		render(SpaNav, { currentRoute: APP_ROUTES.HOME, currentSearch: '' });

		expect(screen.getByTestId('spa-nav')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-inicio')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-eventos')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-amigos')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-faq')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-contacto')).toBeTruthy();
	});

	it('marks active section and preserves mirror in hrefs', () => {
		render(SpaNav, { currentRoute: APP_ROUTES.EVENT_GALLERY, currentSearch: '?mirror=home5' });

		const eventsLink = screen.getByTestId('spa-nav-link-eventos');
		expect(eventsLink.getAttribute('aria-current')).toBe('page');
		expect(eventsLink.getAttribute('href')).toBe('/eventos/?mirror=home5');

		const faqLink = screen.getByTestId('spa-nav-link-faq');
		expect(faqLink.getAttribute('href')).toBe('/faq/?mirror=home5');
	});

	it('renders skip link to main content landmark', () => {
		render(SpaNav, { currentRoute: APP_ROUTES.HOME, currentSearch: '' });

		const skipLink = screen.getByRole('link', { name: 'Saltar al contenido principal' });
		expect(skipLink.getAttribute('href')).toBe('#spa-main-content');
	});
});
