import { buildEventsFeed } from './eventsFeed';

describe('buildEventsFeed', () => {
	it('inserts ads every configured event frequency', () => {
		const events = [
			{ id: 'evt_1' },
			{ id: 'evt_2' },
			{ id: 'evt_3' },
			{ id: 'evt_4' }
		];
		const ads = [{ id: 'ad_1' }, { id: 'ad_2' }];

		const feed = buildEventsFeed(events, ads, 2);

		expect(feed).toEqual([
			{ type: 'event', event: events[0] },
			{ type: 'event', event: events[1] },
			{ type: 'ad', ad: ads[0] },
			{ type: 'event', event: events[2] },
			{ type: 'event', event: events[3] },
			{ type: 'ad', ad: ads[1] }
		]);
	});

	it('returns only ads when event list is empty', () => {
		const ads = [{ id: 'ad_1' }];
		expect(buildEventsFeed([], ads)).toEqual([{ type: 'ad', ad: ads[0] }]);
	});
});
