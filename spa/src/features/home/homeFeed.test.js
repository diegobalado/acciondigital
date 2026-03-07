import { buildHomeFeed } from './homeFeed';

describe('buildHomeFeed', () => {
	it('inserts ads in the feed every N events', () => {
		const events = Array.from({ length: 7 }, (_, index) => ({ id: `evt_${index + 1}` }));
		const ads = [{ id: 'ad_1' }, { id: 'ad_2' }];

		const feed = buildHomeFeed(events, ads, 3);

		expect(feed.map((item) => item.type)).toEqual([
			'event',
			'event',
			'event',
			'ad',
			'event',
			'event',
			'event',
			'ad',
			'event'
		]);
		expect(feed[3].ad.id).toBe('ad_1');
		expect(feed[7].ad.id).toBe('ad_2');
	});

	it('returns ad-only feed when there are no events', () => {
		const feed = buildHomeFeed([], [{ id: 'ad_1' }]);

		expect(feed).toEqual([{ type: 'ad', ad: { id: 'ad_1' } }]);
	});
});