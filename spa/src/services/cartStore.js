import { derived, get, writable } from 'svelte/store';
import {
	addCartItem,
	calculateCartTotals,
	removeCartItem,
	updateCartItemQuantity
} from './cartService';
import {
	createLegacyCheckoutPayload,
	submitLegacyCheckoutPayload
} from './checkoutBridge';

const cartItemsStore = writable([]);

export { cartItemsStore };

export const cartTotalsStore = derived(cartItemsStore, ($items) => calculateCartTotals($items));

export function getCartItemsSnapshot() {
	return get(cartItemsStore);
}

export function addItemToCart(rawItem) {
	cartItemsStore.update((items) => addCartItem(items, rawItem));
}

export function removeItemFromCart(key) {
	cartItemsStore.update((items) => removeCartItem(items, key));
}

export function updateItemQuantityInCart(key, quantity) {
	cartItemsStore.update((items) => updateCartItemQuantity(items, key, quantity));
}

export function clearCart() {
	cartItemsStore.set([]);
}

export async function submitCartCheckout(options = {}) {
	const items = getCartItemsSnapshot();
	const createPayload = options.createPayload || createLegacyCheckoutPayload;
	const submitPayload = options.submitPayload || submitLegacyCheckoutPayload;

	if (!Array.isArray(items) || items.length === 0) {
		return null;
	}

	const payload = createPayload(items, options.payloadOptions || {});
	await submitPayload(payload, options.submitOptions || {});
	return payload;
}
