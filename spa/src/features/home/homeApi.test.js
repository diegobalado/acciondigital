import { HOME_DATASOURCE_URL, loadHomeEvents } from './homeApi';

describe('loadHomeEvents', () => {
	it('loads inicio datasource and maps eventos', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [{ ID: 'evt_1', text: '  Evento 1  ', ph: 'JPF' }]
		});

		const events = await loadHomeEvents(dataClient);

		expect(dataClient).toHaveBeenCalledWith(HOME_DATASOURCE_URL);
		expect(events).toEqual([
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
	});

	it('returns empty list when payload does not contain eventos array', async () => {
		const dataClient = vi.fn().mockResolvedValue({ ads: [] });

		const events = await loadHomeEvents(dataClient);

		expect(events).toEqual([]);
	});
});