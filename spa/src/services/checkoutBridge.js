import { calculateCartTotals, normalizeCartItem } from './cartService';

export const LEGACY_CHECKOUT_ENDPOINT = '/checkout/index.php';

function mapCartItemToLegacyProduct(rawItem) {
	const item = normalizeCartItem(rawItem);

	return {
		id: item.id,
		name: item.name,
		summary: item.summary,
		price: item.price,
		quantity: item.quantity,
		image: item.image,
		event: item.event,
		ph: item.ph,
		type: item.type
	};
}

export function createLegacyCheckoutPayload(cartItems = [], options = {}) {
	const safeItems = Array.isArray(cartItems) ? cartItems : [];
	const products = safeItems.map(mapCartItemToLegacyProduct);
	const totals = calculateCartTotals(products, options);

	return {
		endpoint: options.endpoint || LEGACY_CHECKOUT_ENDPOINT,
		method: 'POST',
		body: {
			products,
			totalPrice: totals.totalPrice
		},
		totals
	};
}