function getFeedItemKey(item, index) {
	if (!item || typeof item !== 'object') {
		return `unknown:${index}`;
	}

	if (item.type === 'event') {
		return `event:${item.event?.id || item.event?.eventUrl || index}`;
	}

	if (item.type === 'ad') {
		return `ad:${item.ad?.id || item.ad?.href || item.ad?.name || index}`;
	}

	return `${item.type || 'item'}:${index}`;
}

export function mergeProgressiveFeed(currentFeed, incomingFeed, append = false) {
	const safeCurrent = Array.isArray(currentFeed) ? currentFeed : [];
	const safeIncoming = Array.isArray(incomingFeed) ? incomingFeed : [];

	if (!append) {
		return safeIncoming;
	}

	const seen = new Set(safeCurrent.map((item, index) => getFeedItemKey(item, index)));
	const dedupedIncoming = safeIncoming.filter((item, index) => {
		const key = getFeedItemKey(item, index);
		if (seen.has(key)) {
			return false;
		}

		seen.add(key);
		return true;
	});

	return [...safeCurrent, ...dedupedIncoming];
}
