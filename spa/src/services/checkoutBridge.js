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

export async function submitLegacyCheckoutPayload(payload, options = {}) {
	const submitter = options.submitter;
	if (typeof submitter === 'function') {
		return submitter(payload);
	}

	if (typeof document === 'undefined') {
		return payload;
	}

	const form = document.createElement('form');
	form.method = 'POST';
	form.action = payload.endpoint || LEGACY_CHECKOUT_ENDPOINT;
	form.style.display = 'none';

	const totalPriceInput = document.createElement('input');
	totalPriceInput.type = 'hidden';
	totalPriceInput.name = 'totalPrice';
	totalPriceInput.value = String(payload.body?.totalPrice ?? 0);

	form.appendChild(totalPriceInput);

	const products = Array.isArray(payload.body?.products) ? payload.body.products : [];
	products.forEach((product, index) => {
		Object.entries(product).forEach(([key, value]) => {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = `products[${index}][${key}]`;
			input.value = String(value ?? '');
			form.appendChild(input);
		});
	});

	document.body.appendChild(form);
	form.submit();

	return payload;
}