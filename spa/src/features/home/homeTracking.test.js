import { createHomeClickTracker } from './homeTracking';

describe('createHomeClickTracker', () => {
	it('tracks event click with legacy naming', () => {
		const trackEvent = vi.fn();
		const tracker = createHomeClickTracker({ trackEvent });

		tracker.trackFeedClick({
			type: 'event',
			event: { title: 'Open XCO Balcarce' }
		});

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Eventos',
			category: 'Inicio',
			label: 'Open XCO Balcarce'
		});
	});

	it('tracks ad click with legacy naming', () => {
		const trackEvent = vi.fn();
		const tracker = createHomeClickTracker({ trackEvent });

		tracker.trackFeedClick({
			type: 'ad',
			ad: { name: 'ad-banner.jpg' }
		});

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Publicidades',
			category: 'Inicio',
			label: 'ad-banner.jpg'
		});
	});

	it('ignores invalid payloads', () => {
		const trackEvent = vi.fn();
		const tracker = createHomeClickTracker({ trackEvent });

		tracker.trackFeedClick(null);
		tracker.trackFeedClick({});
		tracker.trackFeedClick({ type: 'unknown' });

		expect(trackEvent).not.toHaveBeenCalled();
	});
});
