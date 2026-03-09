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
});
