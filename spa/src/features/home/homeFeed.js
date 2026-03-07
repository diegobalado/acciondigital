export function buildHomeFeed(events, ads, adFrequency = 6) {
	const safeEvents = Array.isArray(events) ? events : [];
	const safeAds = Array.isArray(ads) ? ads : [];

	if (safeEvents.length === 0) {
		return safeAds.map((ad) => ({ type: 'ad', ad }));
	}

	const feed = [];
	let adIndex = 0;

	safeEvents.forEach((event, index) => {
		feed.push({ type: 'event', event });

		const position = index + 1;
		if (position % adFrequency === 0 && adIndex < safeAds.length) {
			feed.push({ type: 'ad', ad: safeAds[adIndex] });
			adIndex += 1;
		}
	});

	return feed;
}