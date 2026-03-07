import {
	HOME_DATASOURCE_URL,
	HOME_MIRROR_5_DATASOURCE_URL,
	loadHomeContent,
	resolveHomeDatasourceUrl
} from './homeApi';

describe('resolveHomeDatasourceUrl', () => {
	it('returns mirror datasource for mirror=home5', () => {
		expect(resolveHomeDatasourceUrl('?mirror=home5')).toBe(HOME_MIRROR_5_DATASOURCE_URL);
	});

	it('returns default datasource when mirror query is absent', () => {
		expect(resolveHomeDatasourceUrl('')).toBe(HOME_DATASOURCE_URL);
	});
});

describe('loadHomeContent', () => {
	it('loads inicio datasource and maps eventos', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [{ ID: 'evt_1', text: '  Evento 1  ', ph: 'JPF' }]
		});

		const result = await loadHomeContent({ dataClient });

		expect(dataClient).toHaveBeenCalledWith(HOME_DATASOURCE_URL);
		expect(result.events).toEqual([
			{
				id: 'evt_1',
				title: 'Evento 1',
				photographer: 'JPF',
				description: '',
				imageUrl: '',
				eventUrl: '/eventos/?id=evt_1',
				isPublished: true
			}
		]);
		expect(result.feed).toEqual([{ type: 'event', event: result.events[0] }]);
	});

	it('returns empty list when payload does not contain eventos array', async () => {
		const dataClient = vi.fn().mockResolvedValue({ ads: [] });

		const result = await loadHomeContent({ dataClient });

		expect(result.events).toEqual([]);
		expect(result.feed).toEqual([]);
	});

	it('adds mirror query param to event URLs when mirror datasource is used', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [{ ID: 'evt_1', text: 'Evento mirror' }]
		});

		const result = await loadHomeContent({ dataClient, search: '?mirror=home5' });

		expect(dataClient).toHaveBeenCalledWith(HOME_MIRROR_5_DATASOURCE_URL);
		expect(result.events[0].eventUrl).toBe('/eventos/?id=evt_1&mirror=home5');
	});

	it('maps ads and exposes them in the mixed feed', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [{ ID: 'evt_1', text: 'Evento 1' }],
			ads: [{ name: 'ad-banner.jpg', href: 'https://sponsor.test' }]
		});

		const result = await loadHomeContent({ dataClient });

		expect(result.ads).toEqual([
			{
				id: 'ad-banner.jpg',
				name: 'ad-banner.jpg',
				href: 'https://sponsor.test',
				target: '_blank',
				imageUrl: '/assets/images/ads/ad-banner.jpg'
			}
		]);
		expect(result.feed).toEqual([{ type: 'event', event: result.events[0] }]);
	});
});