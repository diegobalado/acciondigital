import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import EventGalleryPage from './EventGalleryPage.svelte';

function setLocationSearch(search) {
	window.history.replaceState({}, '', `/eventos/${search}`);
}

describe('EventGalleryPage', () => {
	it('loads event gallery from query param and renders photos', async () => {
		setLocationSearch('?id=evt_1');

		render(EventGalleryPage, {
			loadGallery: () =>
				Promise.resolve({
					event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
					photos: [
						{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' }
					],
					pagination: { page: 1, pageSize: 60, totalItems: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('gallery-list')).toBeTruthy();
		expect(screen.getByText('Evento 1')).toBeTruthy();
		expect(screen.getByText('A-145')).toBeTruthy();
	});

	it('filters photos using gallery search form', async () => {
		setLocationSearch('?id=evt_1');
		const loadGallery = vi
			.fn()
			.mockResolvedValueOnce({
				event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
				photos: [{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' }],
				pagination: { page: 1, pageSize: 60, totalItems: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
				progressive: { nextPage: null, canLoadMore: false }
			})
			.mockResolvedValueOnce({
				event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
				photos: [{ id: 'B', code: 'B', bibs: [], thumbnailUrl: '/b.jpg', fullImageUrl: '/b-full.jpg' }],
				pagination: { page: 1, pageSize: 60, totalItems: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
				progressive: { nextPage: null, canLoadMore: false }
			});

		render(EventGalleryPage, { loadGallery });
		expect(await screen.findByTestId('gallery-list')).toBeTruthy();

		await fireEvent.input(screen.getByTestId('gallery-search-input'), { target: { value: 'sin clasificar' } });
		await fireEvent.submit(screen.getByTestId('gallery-search-form'));

		expect(loadGallery).toHaveBeenLastCalledWith(expect.objectContaining({ query: 'sin clasificar' }));
		expect(await screen.findByText('B')).toBeTruthy();
	});

	it('adds photos to cart and submits checkout through injected adapter', async () => {
		setLocationSearch('?id=evt_1');
		const submitCheckout = vi.fn().mockResolvedValue({ ok: true });

		render(EventGalleryPage, {
			submitCheckout,
			loadGallery: () =>
				Promise.resolve({
					event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
					photos: [{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' }],
					pagination: { page: 1, pageSize: 60, totalItems: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('gallery-list')).toBeTruthy();
		await fireEvent.click(screen.getByTestId('gallery-add-to-cart'));
		expect(screen.getByTestId('gallery-cart-summary').textContent).toContain('Items: 1');
		expect(screen.getByTestId('gallery-cart-summary').textContent).toContain('1500');

		await fireEvent.click(screen.getByTestId('gallery-cart-checkout'));
		expect(submitCheckout).toHaveBeenCalledTimes(1);
		expect(submitCheckout.mock.calls[0][0].body.products[0]).toMatchObject({
			id: 'A-145',
			summary: 'foto_A-145',
			ph: 'JPF',
			type: 'Galeria'
		});
	});

	it('opens lightbox and navigates between photos', async () => {
		setLocationSearch('?id=evt_1');

		render(EventGalleryPage, {
			loadGallery: () =>
				Promise.resolve({
					event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
					photos: [
						{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' },
						{ id: 'A-146', code: 'A-146', bibs: ['146'], thumbnailUrl: '/b.jpg', fullImageUrl: '/b-full.jpg' }
					],
					pagination: { page: 1, pageSize: 60, totalItems: 2, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('gallery-list')).toBeTruthy();
		await fireEvent.click(screen.getByRole('button', { name: 'Ver foto A-145' }));

		expect(screen.getByTestId('gallery-lightbox')).toBeTruthy();
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-145');

		await fireEvent.click(screen.getByTestId('gallery-lightbox-next'));
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-146');

		await fireEvent.keyDown(window, { key: 'Escape' });
		expect(screen.queryByTestId('gallery-lightbox')).toBeNull();
	});
});