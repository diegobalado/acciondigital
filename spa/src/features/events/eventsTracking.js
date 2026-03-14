export function trackEventsClickEvent({ action, category, label }) {
	if (typeof window === 'undefined') {
		return;
	}

	const gtag = window['gtag'];
	if (typeof gtag !== 'function') {
		return;
	}

	gtag('event', action, {
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

	function trackSearchSubmitted(query) {
		trackEvent({
			action: 'Filtros',
			category: 'Evento',
			label: query ? `Busqueda: ${query}` : 'Busqueda vacia'
		});
	}

	function trackSearchResult(query, hasResults) {
		trackEvent({
			action: 'Filtros',
			category: 'Evento',
			label: hasResults ? `Busqueda con resultados: ${query}` : `Busqueda sin resultados: ${query}`
		});
	}

	function trackSearchCleared() {
		trackEvent({
			action: 'Filtros',
			category: 'Evento',
			label: 'Busqueda limpiada'
		});
	}

	return {
		trackFeedClick,
		trackSearchSubmitted,
		trackSearchResult,
		trackSearchCleared
	};
}
