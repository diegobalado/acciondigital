import { describe, expect, it } from 'vitest';
import { createLegacyCheckoutPayload, LEGACY_CHECKOUT_ENDPOINT } from './checkoutBridge';

describe('checkoutBridge', () => {
	it('maps cart items to legacy checkout payload shape', () => {
		const payload = createLegacyCheckoutPayload([
			{
				id: 'pic_1',
				name: 'Open XCO',
				summary: 'foto_001',
				price: 1500,
				quantity: 2,
				image: '/assets/images/eventos/evt_1/thumbs/001.jpg',
				event: 'evt_1',
				ph: 'JPF',
				type: 'Galeria'
			}
		]);

		expect(payload.endpoint).toBe(LEGACY_CHECKOUT_ENDPOINT);
		expect(payload.method).toBe('POST');
		expect(payload.body).toEqual({
			products: [
				{
					id: 'pic_1',
					name: 'Open XCO',
					summary: 'foto_001',
					price: 1500,
					quantity: 2,
					image: '/assets/images/eventos/evt_1/thumbs/001.jpg',
					event: 'evt_1',
					ph: 'JPF',
					type: 'Galeria'
				}
			],
			totalPrice: 3000
		});
	});

	it('propagates promo-adjusted total price for checkout payload', () => {
		const payload = createLegacyCheckoutPayload([
			{ id: '1', name: 'Evento', summary: 'a', price: 1000, quantity: 3, event: 'evt' },
			{ id: '2', name: 'Evento', summary: 'b', price: 1000, quantity: 2, event: 'evt' }
		]);

		expect(payload.totals.hasPromo).toBe(true);
		expect(payload.body.totalPrice).toBe(0);
	});
});