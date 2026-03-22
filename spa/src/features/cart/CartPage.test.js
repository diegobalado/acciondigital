import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CartPage from './CartPage.svelte';
import { addItemToCart, clearCart } from '../../services/cartStore';

describe('CartPage', () => {
	beforeEach(() => {
		clearCart();
	});

	it('shows empty state when cart has no items', async () => {
		render(CartPage);

		expect(screen.getByTestId('cart-page-empty')).toBeTruthy();
	});

	it('renders cart items from shared cart store', async () => {
		addItemToCart({ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'foto_1', price: 1000, quantity: 1 });
		render(CartPage);

		expect(await screen.findByTestId('cart-page-list')).toBeTruthy();
		expect(screen.getByText('Evento 1')).toBeTruthy();
	});

	it('submits checkout with injected adapter', async () => {
		addItemToCart({ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'foto_1', price: 1000, quantity: 1 });
		const submitCheckout = vi.fn().mockResolvedValue({ ok: true });
		render(CartPage, { submitCheckout });

		await fireEvent.click(screen.getByTestId('cart-page-checkout'));
		expect(submitCheckout).toHaveBeenCalledTimes(1);
	});
});
