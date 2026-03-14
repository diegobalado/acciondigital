import { describe, expect, it } from 'vitest';
import {
	addCartItem,
	calculateCartTotals,
	normalizeCartItem,
	removeCartItem,
	updateCartItemQuantity
} from './cartService';

describe('cartService', () => {
	it('normalizes incoming cart item contract', () => {
		const item = normalizeCartItem({
			id: ' pic_1 ',
			name: 'Evento 1',
			summary: 'foto_001',
			price: '2500',
			quantity: '2',
			image: '/img/1.jpg',
			eventId: 'evt_1',
			ph: 'JPF'
		});

		expect(item).toEqual({
			id: 'pic_1',
			name: 'Evento 1',
			summary: 'foto_001',
			price: 2500,
			quantity: 2,
			image: '/img/1.jpg',
			event: 'evt_1',
			ph: 'JPF',
			type: ''
		});
	});

	it('adds new items and merges quantity for same event picture', () => {
		const withFirst = addCartItem([], {
			id: 'pic_1',
			name: 'Evento 1',
			summary: 'foto_001',
			price: 1000,
			quantity: 1,
			event: 'evt_1'
		});
		const withMerged = addCartItem(withFirst, {
			id: 'pic_1',
			name: 'Evento 1',
			summary: 'foto_001',
			price: 1000,
			quantity: 2,
			event: 'evt_1'
		});

		expect(withMerged).toHaveLength(1);
		expect(withMerged[0].quantity).toBe(3);
	});

	it('removes and updates item quantity by composite key id+event', () => {
		const items = [
			{ id: 'pic_1', event: 'evt_1', name: 'Evento 1', summary: 'a', price: 1000, quantity: 1, image: '', ph: '', type: '' },
			{ id: 'pic_2', event: 'evt_1', name: 'Evento 1', summary: 'b', price: 1000, quantity: 1, image: '', ph: '', type: '' }
		];

		const updated = updateCartItemQuantity(items, { id: 'pic_2', event: 'evt_1' }, 4);
		expect(updated[1].quantity).toBe(4);

		const removed = removeCartItem(updated, { id: 'pic_1', event: 'evt_1' });
		expect(removed).toHaveLength(1);
		expect(removed[0].id).toBe('pic_2');
	});

	it('applies promo rule when total quantity reaches threshold', () => {
		const items = [
			{ id: 'a', event: 'evt_1', price: 500, quantity: 3 },
			{ id: 'b', event: 'evt_1', price: 700, quantity: 2 }
		];

		const totals = calculateCartTotals(items);

		expect(totals.totalQuantity).toBe(5);
		expect(totals.subtotal).toBe(2900);
		expect(totals.totalPrice).toBe(0);
		expect(totals.hasPromo).toBe(true);
	});
});