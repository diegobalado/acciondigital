import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../app/routing/routes';
import { addItemToCart, clearCart } from '../../services/cartStore';
import SpaNav from './SpaNav.svelte';

describe('SpaNav', () => {
	beforeEach(() => {
		clearCart();
	});

	it('renders all nav links', () => {
		render(SpaNav, { currentRoute: APP_ROUTES.HOME, currentSearch: '' });

		expect(screen.getByTestId('spa-nav')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-inicio')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-eventos')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-link-amigos')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-cart-toggle')).toBeTruthy();
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

	it('opens cart popup and links to full cart page', async () => {
		addItemToCart({ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'foto_1', price: 1000, quantity: 2 });
		render(SpaNav, { currentRoute: APP_ROUTES.HOME, currentSearch: '?mirror=home5' });

		await fireEvent.click(screen.getByTestId('spa-nav-cart-toggle'));
		expect(screen.getByTestId('spa-nav-cart-popup')).toBeTruthy();
		expect(screen.getByTestId('spa-nav-cart-summary').textContent).toContain('Items: 2');
		expect(screen.getByTestId('spa-nav-open-cart-page').getAttribute('href')).toBe('/carrito/?mirror=home5');
	});

	it('closes cart popup when Escape is pressed', async () => {
		addItemToCart({ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'foto_1', price: 1000, quantity: 1 });
		render(SpaNav, { currentRoute: APP_ROUTES.HOME, currentSearch: '' });

		await fireEvent.click(screen.getByTestId('spa-nav-cart-toggle'));
		expect(screen.getByTestId('spa-nav-cart-popup')).toBeTruthy();

		await fireEvent.keyDown(window, { key: 'Escape' });
		expect(screen.queryByTestId('spa-nav-cart-popup')).toBeNull();
	});

	it('renders skip link to main content landmark', () => {
		render(SpaNav, { currentRoute: APP_ROUTES.HOME, currentSearch: '' });

		const skipLink = screen.getByRole('link', { name: 'Saltar al contenido principal' });
		expect(skipLink.getAttribute('href')).toBe('#spa-main-content');
	});
});
