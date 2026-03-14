import { describe, expect, it, vi } from 'vitest';
import { filterGalleryPhotos, loadEventGallery, LOCAL_EVENT_GALLERY_URL } from './eventGalleryApi';

describe('filterGalleryPhotos', () => {
	it('filters tagged photos by bib token', () => {
		const photos = [
			{ id: 'A-145', code: 'A-145', bibs: ['145'], isTagged: true },
			{ id: 'B-514', code: 'B-514', bibs: ['514'], isTagged: true },
			{ id: 'C', code: 'C', bibs: [], isTagged: false }
		];

		expect(filterGalleryPhotos(photos, '145').map((photo) => photo.id)).toEqual(['A-145']);
	});

	it('returns untagged photos for sin clasificar alias', () => {
		const photos = [
			{ id: 'A-145', code: 'A-145', bibs: ['145'], isTagged: true },
			{ id: 'C', code: 'C', bibs: [], isTagged: false }
		];

		expect(filterGalleryPhotos(photos, 'sin clasificar').map((photo) => photo.id)).toEqual(['C']);
	});
});

describe('loadEventGallery', () => {
	it('maps gallery payload and paginates photos', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			IdEvento: 'evt_1',
			title: 'Evento 1',
			price: '1500',
			ph: 'JPF',
			pictures: ['A-145', 'B', 'C-514']
		});

		const result = await loadEventGallery({ dataClient, eventId: 'evt_1', pageSize: 2 });

		expect(result.event).toEqual({
			id: 'evt_1',
			title: 'Evento 1',
			price: 1500,
			promo: 0,
			ph: 'JPF',
			searchEnabled: false
		});
		expect(result.photos).toHaveLength(2);
		expect(result.photos[0]).toMatchObject({ id: 'A-145', bibs: ['145'], isTagged: true });
		expect(result.progressive).toEqual({ nextPage: 2, canLoadMore: true });
	});

	it('filters photo gallery query before paginating', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			IdEvento: 'evt_1',
			title: 'Evento 1',
			pictures: ['A-145', 'B', 'C-514']
		});

		const result = await loadEventGallery({ dataClient, eventId: 'evt_1', query: 'sin clasificar' });

		expect(result.photos.map((photo) => photo.id)).toEqual(['B']);
		expect(result.pagination.totalItems).toBe(1);
	});

	it('falls back from mirror datasource to default datasource', async () => {
		const dataClient = vi
			.fn()
			.mockRejectedValueOnce(new Error('404'))
			.mockResolvedValueOnce({ IdEvento: 'evt_1', title: 'Evento 1', pictures: [] });

		const result = await loadEventGallery({ dataClient, eventId: 'evt_1', search: '?mirror=home5' });

		expect(dataClient).toHaveBeenNthCalledWith(1, '/assets/datasources/mirror/home-5/evt_1.json');
		expect(dataClient).toHaveBeenNthCalledWith(2, '/assets/datasources/evt_1.json');
		expect(result.datasourceUrl).toBe('/assets/datasources/evt_1.json');
	});

	it('falls back to local filesystem-backed gallery when datasource JSON is unavailable', async () => {
		const dataClient = vi.fn().mockImplementation((url) => {
			if (url === '/assets/datasources/290_Camp_DH_Entr_28_11_25.json') {
				return Promise.reject(new Error('404'));
			}

			if (url === `${LOCAL_EVENT_GALLERY_URL}?id=290_Camp_DH_Entr_28_11_25`) {
				return Promise.resolve({
					IdEvento: '290_Camp_DH_Entr_28_11_25',
					title: 'Camp DH Entr 28 11 25',
					pictures: ['DHE_100', 'DHE_101']
				});
			}

			return Promise.reject(new Error(`Unexpected URL: ${url}`));
		});

		const result = await loadEventGallery({ dataClient, eventId: '290_Camp_DH_Entr_28_11_25' });

		expect(result.datasourceUrl).toBe(`${LOCAL_EVENT_GALLERY_URL}?id=290_Camp_DH_Entr_28_11_25`);
		expect(result.event?.id).toBe('290_Camp_DH_Entr_28_11_25');
		expect(result.photos[0]).toMatchObject({
			id: 'DHE_100',
			thumbnailUrl: '/assets/images/eventos/290_Camp_DH_Entr_28_11_25/thumbs/DHE_100.jpg',
			fullImageUrl: '/assets/images/eventos/290_Camp_DH_Entr_28_11_25/DHE_100.jpg'
		});
	});
});