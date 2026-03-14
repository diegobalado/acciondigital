import { EVENTS_CATALOG_DATASOURCE_URL, loadEventsCatalog, searchEventsCatalog } from './eventsApi';
import { describe, expect, it, vi } from 'vitest';

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
		expect(result.feed).toEqual([
			{ type: 'event', event: result.events[0] },
			{ type: 'event', event: result.events[1] }
		]);
		expect(result.pagination).toEqual({
			page: 1,
			pageSize: 2,
			totalItems: 3,
			totalPages: 2,
			hasPreviousPage: false,
			hasNextPage: true
		});
		expect(result.progressive).toEqual({ nextPage: 2, canLoadMore: true });
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
		expect(result.progressive).toEqual({ nextPage: null, canLoadMore: false });
	});

	it('returns empty result for payload without eventos', async () => {
		const dataClient = vi.fn().mockResolvedValue({ ads: [] });

		const result = await loadEventsCatalog({ dataClient });

		expect(result.events).toEqual([]);
		expect(result.feed).toEqual([]);
		expect(result.pagination.totalItems).toBe(0);
		expect(result.pagination.totalPages).toBe(1);
		expect(result.progressive).toEqual({ nextPage: null, canLoadMore: false });
	});

	it('maps ads and exposes them in the page feed', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: Array.from({ length: 6 }).map((_, index) => ({ ID: `evt_${index + 1}`, text: `Evento ${index + 1}` })),
			ads: [{ name: 'sponsor.jpg', href: 'https://sponsor.test' }]
		});

		const result = await loadEventsCatalog({ dataClient, pageSize: 6 });

		expect(result.ads).toEqual([
			{
				id: 'sponsor.jpg',
				name: 'sponsor.jpg',
				href: 'https://sponsor.test',
				target: '_blank',
				imageUrl: '/assets/images/ads/sponsor.jpg'
			}
		]);
		expect(result.feed[result.feed.length - 1].type).toBe('ad');
	});
});

describe('searchEventsCatalog', () => {
	it('returns matching events by text query', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [
				{ ID: 'evt_145', text: 'Maraton 145' },
				{ ID: 'evt_260', text: 'Rally 260' }
			]
		});

		const result = await searchEventsCatalog({ dataClient, query: 'rally' });

		expect(dataClient).toHaveBeenCalledWith(EVENTS_CATALOG_DATASOURCE_URL);
		expect(result.events.map((item) => item.id)).toEqual(['evt_260']);
	});

	it('returns matching events by numeric bib-like query', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			eventos: [
				{ ID: 'evt_145', text: 'Corredor 145' },
				{ ID: 'evt_514', text: 'Corredor 514' }
			]
		});

		const result = await searchEventsCatalog({ dataClient, query: '145' });

		expect(result.events.map((item) => item.id)).toEqual(['evt_145']);
	});

	it('returns empty array for blank query without requesting datasource', async () => {
		const dataClient = vi.fn();

		const result = await searchEventsCatalog({ dataClient, query: '   ' });

		expect(result.events).toEqual([]);
		expect(dataClient).not.toHaveBeenCalled();
	});
});
