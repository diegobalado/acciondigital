function toNumber(value, fallback = 0) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) {
		return fallback;
	}

	return parsed;
}

function toPositiveInt(value, fallback = 1) {
	const parsed = Number.parseInt(String(value), 10);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return fallback;
	}

	return parsed;
}

export function normalizeCartItem(rawItem = {}) {
	return {
		id: String(rawItem.id ?? '').trim(),
		name: String(rawItem.name ?? '').trim(),
		summary: String(rawItem.summary ?? '').trim(),
		price: toNumber(rawItem.price, 0),
		quantity: toPositiveInt(rawItem.quantity, 1),
		image: String(rawItem.image ?? '').trim(),
		event: String(rawItem.event ?? rawItem.eventId ?? '').trim(),
		ph: String(rawItem.ph ?? '').trim(),
		type: String(rawItem.type ?? '').trim()
	};
}

function isSameCartItem(left, right) {
	return left.id === right.id && left.event === right.event;
}

export function addCartItem(currentItems = [], rawItem = {}) {
	const nextItem = normalizeCartItem(rawItem);
	const safeItems = Array.isArray(currentItems) ? currentItems : [];

	if (!nextItem.id || !nextItem.name) {
		return safeItems;
	}

	const existingIndex = safeItems.findIndex((item) => isSameCartItem(item, nextItem));
	if (existingIndex === -1) {
		return [...safeItems, nextItem];
	}

	return safeItems.map((item, index) => {
		if (index !== existingIndex) {
			return item;
		}

		return {
			...item,
			quantity: toPositiveInt(item.quantity, 1) + nextItem.quantity
		};
	});
}

export function removeCartItem(currentItems = [], key = {}) {
	const safeItems = Array.isArray(currentItems) ? currentItems : [];
	const id = String(key.id ?? '').trim();
	const event = String(key.event ?? key.eventId ?? '').trim();

	return safeItems.filter((item) => !(item.id === id && item.event === event));
}

export function updateCartItemQuantity(currentItems = [], key = {}, quantity = 1) {
	const safeItems = Array.isArray(currentItems) ? currentItems : [];
	const id = String(key.id ?? '').trim();
	const event = String(key.event ?? key.eventId ?? '').trim();
	const normalizedQuantity = toPositiveInt(quantity, 0);

	if (normalizedQuantity <= 0) {
		return removeCartItem(safeItems, { id, event });
	}

	return safeItems.map((item) => {
		if (item.id !== id || item.event !== event) {
			return item;
		}

		return {
			...item,
			quantity: normalizedQuantity
		};
	});
}

export function calculateCartTotals(currentItems = [], options = {}) {
	const safeItems = Array.isArray(currentItems) ? currentItems : [];
	const promoThreshold = toPositiveInt(options.promoThreshold ?? 5, 5);
	const totalQuantity = safeItems.reduce((acc, item) => acc + toPositiveInt(item.quantity, 1), 0);
	const subtotal = safeItems.reduce(
		(acc, item) => acc + toNumber(item.price, 0) * toPositiveInt(item.quantity, 1),
		0
	);
	const hasPromo = totalQuantity >= promoThreshold;

	return {
		totalQuantity,
		subtotal,
		totalPrice: hasPromo ? 0 : subtotal,
		hasPromo
	};
}