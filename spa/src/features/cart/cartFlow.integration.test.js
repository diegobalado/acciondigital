import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import EventsPage from '../events/EventsPage.svelte';
import CartPage from './CartPage.svelte';
import SpaNav from '../../shared/components/SpaNav.svelte';
import { APP_ROUTES } from '../../app/routing/routes';
import { clearCart } from '../../services/cartStore';

describe('cart flow integration', () => {
	afterEach(() => {
		cleanup();
		clearCart();
	});

	it('persists cart items from events to nav popup and cart page', async () => {
		render(EventsPage, {
			loadEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Evento 1',
								eventUrl: '/eventos/?id=evt_1',
								coverImageUrl: '/1.jpg'
							}
						}
					],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 1,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		await fireEvent.click(screen.getByTestId('events-add-to-cart'));

		cleanup();
		render(SpaNav, { currentRoute: APP_ROUTES.EVENTS, currentSearch: '' });
		await fireEvent.click(screen.getByTestId('spa-nav-cart-toggle'));
		expect(screen.getByTestId('spa-nav-cart-summary').textContent).toContain('Items: 1');
		expect(screen.getByTestId('spa-nav-cart-item').textContent).toContain('Evento 1');

		cleanup();
		render(CartPage);
		expect(await screen.findByTestId('cart-page-list')).toBeTruthy();
		expect(screen.getByText('Evento 1')).toBeTruthy();
	});
});
