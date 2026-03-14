import { createEventsClickTracker } from './eventsTracking';

describe('createEventsClickTracker', () => {
	it('tracks event click with galeria category', () => {
		const trackEvent = vi.fn();
		const tracker = createEventsClickTracker({ trackEvent });

		tracker.trackFeedClick({ type: 'event', event: { title: 'Open XCO' } });

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Eventos',
			category: 'Galeria',
			label: 'Open XCO'
		});
	});

	it('tracks ad click with galeria category', () => {
		const trackEvent = vi.fn();
		const tracker = createEventsClickTracker({ trackEvent });

		tracker.trackFeedClick({ type: 'ad', ad: { name: 'ad-banner.jpg' } });

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Publicidades',
			category: 'Galeria',
			label: 'ad-banner.jpg'
		});
	});

	it('tracks search submit and result actions', () => {
		const trackEvent = vi.fn();
		const tracker = createEventsClickTracker({ trackEvent });

		tracker.trackSearchSubmitted('145');
		tracker.trackSearchResult('145', true);

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Filtros',
			category: 'Evento',
			label: 'Busqueda: 145'
		});
		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Filtros',
			category: 'Evento',
			label: 'Busqueda con resultados: 145'
		});
	});

	it('tracks search cleared action', () => {
		const trackEvent = vi.fn();
		const tracker = createEventsClickTracker({ trackEvent });

		tracker.trackSearchCleared();

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Filtros',
			category: 'Evento',
			label: 'Busqueda limpiada'
		});
	});
});
