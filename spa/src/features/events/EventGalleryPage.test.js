import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EventGalleryPage from './EventGalleryPage.svelte';
import { cartTotalsStore, clearCart } from '../../services/cartStore';
import { get } from 'svelte/store';

function createIntersectionObserverMock() {
	const instances = [];

	class MockIntersectionObserver {
		constructor(callback, options) {
			this.callback = callback;
			this.options = options;
			this.observe = vi.fn();
			this.unobserve = vi.fn();
			this.disconnect = vi.fn();
			instances.push(this);
		}
	}

	return {
		MockIntersectionObserver,
		triggerIntersect(instanceIndex = 0) {
			const instance = instances[instanceIndex];
			if (!instance) {
				throw new Error('IntersectionObserver instance not found');
			}

			instance.callback([{ isIntersecting: true, target: {} }]);
		}
	};
}

function setLocationSearch(search) {
	window.history.replaceState({}, '', `/eventos/${search}`);
}

describe('EventGalleryPage', () => {
	afterEach(() => {
		clearCart();
		delete globalThis.IntersectionObserver;
	});

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

	it('adds photos to global cart from gallery actions', async () => {
		setLocationSearch('?id=evt_1');

		render(EventGalleryPage, {
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
		expect(screen.getByTestId('gallery-add-to-cart').textContent).toContain('Ya agregada');
		await fireEvent.click(screen.getByTestId('gallery-add-to-cart'));
		expect(get(cartTotalsStore).totalQuantity).toBe(1);
		expect(get(cartTotalsStore).subtotal).toBe(1500);
	});

	it('adds photo from lightbox with dedicated action button', async () => {
		setLocationSearch('?id=evt_1');

		render(EventGalleryPage, {
			loadGallery: () =>
				Promise.resolve({
					event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
					photos: [{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' }],
					pagination: { page: 1, pageSize: 60, totalItems: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('gallery-list')).toBeTruthy();
		await fireEvent.click(screen.getByRole('button', { name: 'Ver foto A-145' }));
		expect(screen.getByTestId('gallery-lightbox-add-to-cart').textContent).toContain('Agregar al carrito');

		await fireEvent.click(screen.getByTestId('gallery-lightbox-add-to-cart'));
		expect(get(cartTotalsStore).totalQuantity).toBe(1);
		expect(screen.getByTestId('gallery-lightbox-add-to-cart').textContent).toContain('Ya agregada');
	});

	it('loads next gallery page when infinite sentinel intersects', async () => {
		setLocationSearch('?id=evt_1');
		const ioMock = createIntersectionObserverMock();
		globalThis.IntersectionObserver = /** @type {any} */ (ioMock.MockIntersectionObserver);

		const loadGallery = vi
			.fn()
			.mockResolvedValueOnce({
				event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
				photos: [{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' }],
				pagination: { page: 1, pageSize: 1, totalItems: 2, totalPages: 2, hasPreviousPage: false, hasNextPage: true },
				progressive: { nextPage: 2, canLoadMore: true }
			})
			.mockResolvedValueOnce({
				event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
				photos: [{ id: 'A-146', code: 'A-146', bibs: ['146'], thumbnailUrl: '/b.jpg', fullImageUrl: '/b-full.jpg' }],
				pagination: { page: 2, pageSize: 1, totalItems: 2, totalPages: 2, hasPreviousPage: true, hasNextPage: false },
				progressive: { nextPage: null, canLoadMore: false }
			});

		render(EventGalleryPage, { loadGallery, pageSize: 1 });
		expect(await screen.findByTestId('gallery-list')).toBeTruthy();
		expect(screen.getByText('A-145')).toBeTruthy();
		expect(screen.getByTestId('gallery-infinite-sentinel')).toBeTruthy();

		ioMock.triggerIntersect(0);
		expect(await screen.findByText('A-146')).toBeTruthy();
	});

	it('shows and uses back-to-top button when page is scrolled down', async () => {
		setLocationSearch('?id=evt_1');
		const scrollToSpy = vi.fn();
		Object.defineProperty(window, 'scrollY', { value: 850, writable: true, configurable: true });
		Object.defineProperty(window, 'scrollTo', { value: scrollToSpy, configurable: true });

		render(EventGalleryPage, {
			loadGallery: () =>
				Promise.resolve({
					event: { id: 'evt_1', title: 'Evento 1', price: 1500, ph: 'JPF' },
					photos: [{ id: 'A-145', code: 'A-145', bibs: ['145'], thumbnailUrl: '/a.jpg', fullImageUrl: '/a-full.jpg' }],
					pagination: { page: 1, pageSize: 60, totalItems: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('gallery-list')).toBeTruthy();
		await fireEvent.scroll(window);
		const backToTop = await screen.findByTestId('gallery-back-to-top');
		expect(backToTop).toBeTruthy();
		await fireEvent.click(backToTop);
		expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
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

		await fireEvent.keyDown(screen.getByTestId('gallery-lightbox'), { key: 'ArrowRight' });
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-146');

		await fireEvent.keyDown(screen.getByTestId('gallery-lightbox'), { key: 'ArrowLeft' });
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-145');

		await fireEvent.click(screen.getByTestId('gallery-lightbox-next'));
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-146');

		await fireEvent.click(screen.getByTestId('gallery-lightbox-prev'));
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-145');

		await fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }));
		expect(screen.getByTestId('gallery-lightbox-code').textContent).toBe('A-146');

		await fireEvent.click(screen.getByRole('button', { name: 'Cerrar lightbox' }));
		expect(screen.queryByTestId('gallery-lightbox')).toBeNull();

		await fireEvent.click(screen.getByRole('button', { name: 'Ver foto A-145' }));
		expect(screen.getByTestId('gallery-lightbox')).toBeTruthy();

		await fireEvent.click(screen.getByAltText('Foto A-145'));
		expect(screen.getByTestId('gallery-lightbox')).toBeTruthy();

		await fireEvent.click(screen.getByTestId('gallery-lightbox'));
		expect(screen.queryByTestId('gallery-lightbox')).toBeNull();

		await fireEvent.click(screen.getByRole('button', { name: 'Ver foto A-145' }));
		expect(screen.getByTestId('gallery-lightbox')).toBeTruthy();

		await fireEvent.keyDown(screen.getByTestId('gallery-lightbox'), { key: 'Escape' });
		expect(screen.queryByTestId('gallery-lightbox')).toBeNull();
	});
});