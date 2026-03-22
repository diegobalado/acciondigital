import { render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.svelte';

function setLocation(pathname, search = '') {
	window.history.replaceState({}, '', `${pathname}${search}`);
}

describe('App routing integration', () => {
	afterEach(() => {
		window.history.replaceState({}, '', '/');
	});

	it('renders home page on root route', async () => {
		setLocation('/');
		render(App);

		expect(await screen.findByTestId('home-loading')).toBeTruthy();
	});

	it('renders not-found page for unknown routes', async () => {
		setLocation('/ruta-invalida', '?mirror=home5');
		render(App);

		expect(await screen.findByTestId('not-found-content')).toBeTruthy();
		expect(screen.getByTestId('not-found-return-link').getAttribute('href')).toBe('/?mirror=home5');
	});

	it('keeps eventos nav item active when route is event gallery', async () => {
		setLocation('/eventos/', '?id=170301');
		render(App);

		const eventosLink = await screen.findByTestId('spa-nav-link-eventos');
		expect(eventosLink.getAttribute('aria-current')).toBe('page');
	});

	it('renders cart page route', async () => {
		setLocation('/carrito/');
		render(App);

		expect(await screen.findByTestId('cart-page-summary')).toBeTruthy();
	});
});
