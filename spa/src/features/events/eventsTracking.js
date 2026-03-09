export function trackEventsClickEvent({ action, category, label }) {
	if (typeof window === 'undefined') {
		return;
	}

	if (typeof window.gtag !== 'function') {
		return;
	}

	window.gtag('event', action, {
		event_category: category,
		event_label: label
	});
}

export function createEventsClickTracker(options = {}) {
	const trackEvent = options.trackEvent || trackEventsClickEvent;

	function trackFeedClick(item) {
		if (!item || !item.type) {
			return;
		}

		if (item.type === 'event') {
			trackEvent({
				action: 'Eventos',
				category: 'Galeria',
				label: item.event?.title || ''
			});
			return;
		}

		if (item.type === 'ad') {
			trackEvent({
				action: 'Publicidades',
				category: 'Galeria',
				label: item.ad?.name || ''
			});
		}
	}

	return {
		trackFeedClick
	};
}
