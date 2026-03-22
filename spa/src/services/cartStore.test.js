import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	addItemToCart,
	cartItemsStore,
	cartTotalsStore,
	clearCart,
	removeItemFromCart,
	submitCartCheckout,
	updateItemQuantityInCart
} from './cartStore';

describe('cartStore', () => {
	beforeEach(() => {
		clearCart();
	});

	it('adds, updates and removes cart items through store actions', () => {
		addItemToCart({ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'foto_1', price: 1000, quantity: 1 });
		addItemToCart({ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'foto_1', price: 1000, quantity: 2 });

		expect(get(cartItemsStore)).toHaveLength(1);
		expect(get(cartItemsStore)[0].quantity).toBe(3);

		updateItemQuantityInCart({ id: 'pic_1', event: 'evt_1' }, 5);
		expect(get(cartItemsStore)[0].quantity).toBe(5);

		removeItemFromCart({ id: 'pic_1', event: 'evt_1' });
		expect(get(cartItemsStore)).toHaveLength(0);
	});

	it('exposes derived cart totals', () => {
		addItemToCart({ id: 'a', event: 'evt_1', name: 'A', summary: 'a', price: 500, quantity: 2 });
		addItemToCart({ id: 'b', event: 'evt_1', name: 'B', summary: 'b', price: 1000, quantity: 1 });

		const totals = get(cartTotalsStore);
		expect(totals.totalQuantity).toBe(3);
		expect(totals.subtotal).toBe(2000);
	});

	it('submits checkout using injected adapters', async () => {
		addItemToCart({ id: 'a', event: 'evt_1', name: 'A', summary: 'a', price: 500, quantity: 1 });
		const createPayload = vi.fn().mockReturnValue({ endpoint: '/checkout/index.php', body: { products: [{}], totalPrice: 500 } });
		const submitPayload = vi.fn().mockResolvedValue({ ok: true });

		const payload = await submitCartCheckout({ createPayload, submitPayload });

		expect(createPayload).toHaveBeenCalledTimes(1);
		expect(submitPayload).toHaveBeenCalledTimes(1);
		expect(payload).toBeTruthy();
	});

	it('returns null checkout payload when cart is empty', async () => {
		const createPayload = vi.fn();
		const submitPayload = vi.fn();

		const payload = await submitCartCheckout({ createPayload, submitPayload });

		expect(payload).toBeNull();
		expect(createPayload).not.toHaveBeenCalled();
		expect(submitPayload).not.toHaveBeenCalled();
	});
});
