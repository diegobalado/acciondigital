export function mergeProgressiveFeed(currentFeed, incomingFeed, append = false) {
	const safeCurrent = Array.isArray(currentFeed) ? currentFeed : [];
	const safeIncoming = Array.isArray(incomingFeed) ? incomingFeed : [];

	if (!append) {
		return safeIncoming;
	}

	return [...safeCurrent, ...safeIncoming];
}
