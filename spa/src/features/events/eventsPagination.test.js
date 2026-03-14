import { mergeProgressiveFeed } from './eventsPagination';

describe('mergeProgressiveFeed', () => {
	it('replaces feed when append is false', () => {
		const incoming = [{ type: 'event', event: { id: 'evt_2' } }];
		expect(mergeProgressiveFeed([{ type: 'event', event: { id: 'evt_1' } }], incoming, false)).toEqual(incoming);
	});

	it('appends feed when append is true', () => {
		const current = [{ type: 'event', event: { id: 'evt_1' } }];
		const incoming = [{ type: 'event', event: { id: 'evt_2' } }];
		expect(mergeProgressiveFeed(current, incoming, true)).toEqual([...current, ...incoming]);
	});

	it('deduplicates repeated events while appending progressive pages', () => {
		const current = [{ type: 'event', event: { id: 'evt_1', title: 'Evento 1' } }];
		const incoming = [
			{ type: 'event', event: { id: 'evt_1', title: 'Evento 1 duplicado' } },
			{ type: 'event', event: { id: 'evt_2', title: 'Evento 2' } }
		];

		expect(mergeProgressiveFeed(current, incoming, true)).toEqual([
			{ type: 'event', event: { id: 'evt_1', title: 'Evento 1' } },
			{ type: 'event', event: { id: 'evt_2', title: 'Evento 2' } }
		]);
	});

	it('deduplicates repeated ads by ad id while appending', () => {
		const current = [{ type: 'ad', ad: { id: 'ad_1', name: 'sponsor.jpg' } }];
		const incoming = [
			{ type: 'ad', ad: { id: 'ad_1', name: 'sponsor.jpg' } },
			{ type: 'ad', ad: { id: 'ad_2', name: 'sponsor-2.jpg' } }
		];

		expect(mergeProgressiveFeed(current, incoming, true)).toEqual([
			{ type: 'ad', ad: { id: 'ad_1', name: 'sponsor.jpg' } },
			{ type: 'ad', ad: { id: 'ad_2', name: 'sponsor-2.jpg' } }
		]);
	});
});
