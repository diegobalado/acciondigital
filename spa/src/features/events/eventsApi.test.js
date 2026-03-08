import { EVENTS_CATALOG_DATASOURCE_URL, loadEventsCatalog } from './eventsApi';

describe('loadEventsCatalog', () => {
	it('loads default datasource and returns first page', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [
				{ ID: 'evt_1', text: 'Evento 1' },
				{ ID: 'evt_2', text: 'Evento 2' },
				{ ID: 'evt_3', text: 'Evento 3' }
			]
		});

		const result = await loadEventsCatalog({ dataClient, pageSize: 2 });

		expect(dataClient).toHaveBeenCalledWith(EVENTS_CATALOG_DATASOURCE_URL);
		expect(result.events.map((item) => item.id)).toEqual(['evt_1', 'evt_2']);
		expect(result.pagination).toEqual({
			page: 1,
			pageSize: 2,
			totalItems: 3,
			totalPages: 2,
			hasPreviousPage: false,
			hasNextPage: true
		});
	});

	it('returns requested page when in range', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [
				{ ID: 'evt_1', text: 'Evento 1' },
				{ ID: 'evt_2', text: 'Evento 2' },
				{ ID: 'evt_3', text: 'Evento 3' }
			]
		});

		const result = await loadEventsCatalog({ dataClient, pageSize: 2, page: 2 });

		expect(result.events.map((item) => item.id)).toEqual(['evt_3']);
		expect(result.pagination.page).toBe(2);
		expect(result.pagination.hasPreviousPage).toBe(true);
		expect(result.pagination.hasNextPage).toBe(false);
	});

	it('returns empty result for payload without eventos', async () => {
		const dataClient = vi.fn().mockResolvedValue({ ads: [] });

		const result = await loadEventsCatalog({ dataClient });

		expect(result.events).toEqual([]);
		expect(result.pagination.totalItems).toBe(0);
		expect(result.pagination.totalPages).toBe(1);
	});
});
