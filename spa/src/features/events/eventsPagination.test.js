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
});
