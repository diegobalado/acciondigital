import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EventsPage from './EventsPage.svelte';

function createDeferred() {
	/** @type {(value: any) => void} */
	let resolve = () => {};
	/** @type {(reason?: any) => void} */
	let reject = () => {};
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

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
		},
		getInstanceCount() {
			return instances.length;
		}
	};
}

describe('EventsPage', () => {
	afterEach(() => {
		delete globalThis.IntersectionObserver;
	});

	it('shows loading state while requesting events', async () => {
		const deferred = createDeferred();
		render(EventsPage, { loadEvents: () => deferred.promise });

		expect(screen.getByTestId('events-loading')).toBeTruthy();

		deferred.resolve({
			events: [],
			feed: [],
			pagination: {
				page: 1,
				pageSize: 12,
				totalItems: 0,
				totalPages: 1,
				hasPreviousPage: false,
				hasNextPage: false
			},
			progressive: { nextPage: null, canLoadMore: false }
		});
		await screen.findByTestId('events-empty');
	});

	it('shows error state when loading fails', async () => {
		render(EventsPage, { loadEvents: () => Promise.reject(new Error('network')) });
		expect(await screen.findByTestId('events-error')).toBeTruthy();
	});

	it('renders empty state when no events are returned', async () => {
		render(EventsPage, {
			loadEvents: () =>
				Promise.resolve({
					events: [],
					feed: [],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 0,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-empty')).toBeTruthy();
	});

	it('renders feed and loads next page when infinite sentinel intersects', async () => {
		const ioMock = createIntersectionObserverMock();
		globalThis.IntersectionObserver = /** @type {any} */ (ioMock.MockIntersectionObserver);

		const loadEvents = vi
			.fn()
			.mockResolvedValueOnce({
				events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
				feed: [
					{
						type: 'event',
						event: { id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }
					}
				],
				pagination: {
					page: 1,
					pageSize: 1,
					totalItems: 2,
					totalPages: 2,
					hasPreviousPage: false,
					hasNextPage: true
				},
				progressive: { nextPage: 2, canLoadMore: true }
			})
			.mockResolvedValueOnce({
				events: [{ id: 'evt_2', title: 'Evento 2', eventUrl: '/eventos/?id=evt_2', coverImageUrl: '/2.jpg' }],
				feed: [
					{
						type: 'event',
						event: { id: 'evt_2', title: 'Evento 2', eventUrl: '/eventos/?id=evt_2', coverImageUrl: '/2.jpg' }
					}
				],
				pagination: {
					page: 2,
					pageSize: 1,
					totalItems: 2,
					totalPages: 2,
					hasPreviousPage: true,
					hasNextPage: false
				},
				progressive: { nextPage: null, canLoadMore: false }
			});

		render(EventsPage, { loadEvents });

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Evento 1' }).getAttribute('href')).toBe('/eventos/?id=evt_1');
		expect(screen.getByTestId('events-infinite-sentinel')).toBeTruthy();
		expect(ioMock.getInstanceCount()).toBe(1);

		ioMock.triggerIntersect(0);

		expect(await screen.findByRole('link', { name: 'Evento 2' })).toBeTruthy();
		expect(loadEvents).toHaveBeenCalledWith({ page: 1, pageSize: 12 });
		expect(loadEvents).toHaveBeenCalledWith({ page: 2, pageSize: 12 });
	});

	it('shows incremental skeletons while next progressive page is loading', async () => {
		const ioMock = createIntersectionObserverMock();
		globalThis.IntersectionObserver = /** @type {any} */ (ioMock.MockIntersectionObserver);

		const deferredNextPage = createDeferred();
		const loadEvents = vi
			.fn()
			.mockResolvedValueOnce({
				events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
				feed: [
					{
						type: 'event',
						event: { id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }
					}
				],
				pagination: {
					page: 1,
					pageSize: 1,
					totalItems: 2,
					totalPages: 2,
					hasPreviousPage: false,
					hasNextPage: true
				},
				progressive: { nextPage: 2, canLoadMore: true }
			})
			.mockImplementationOnce(() => deferredNextPage.promise);

		render(EventsPage, { loadEvents });
		expect(await screen.findByTestId('events-list')).toBeTruthy();

		ioMock.triggerIntersect(0);
		expect(await screen.findAllByTestId('events-skeleton-item')).toHaveLength(3);

		deferredNextPage.resolve({
			events: [{ id: 'evt_2', title: 'Evento 2', eventUrl: '/eventos/?id=evt_2', coverImageUrl: '/2.jpg' }],
			feed: [
				{
					type: 'event',
					event: { id: 'evt_2', title: 'Evento 2', eventUrl: '/eventos/?id=evt_2', coverImageUrl: '/2.jpg' }
				}
			],
			pagination: {
				page: 2,
				pageSize: 1,
				totalItems: 2,
				totalPages: 2,
				hasPreviousPage: true,
				hasNextPage: false
			},
			progressive: { nextPage: null, canLoadMore: false }
		});

		expect(await screen.findByRole('link', { name: 'Evento 2' })).toBeTruthy();
		expect(screen.queryByTestId('events-skeleton-item')).toBeNull();
	});

	it('renders ad cards and tracks clicks with injected adapter', async () => {
		const trackEvent = vi.fn();
		render(EventsPage, {
			trackEvent,
			loadEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Evento 1',
								eventUrl: '/eventos/?id=evt_1',
								coverImageUrl: '/1.jpg'
							}
						},
						{
							type: 'ad',
							ad: {
								id: 'ad_1',
								name: 'sponsor.jpg',
								href: 'https://sponsor.test',
								target: '_blank',
								imageUrl: '/assets/images/ads/sponsor.jpg'
							}
						}
					],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 1,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		expect(screen.getByTestId('events-ad-item')).toBeTruthy();

		await fireEvent.click(screen.getByRole('link', { name: 'Evento 1' }));
		await fireEvent.click(screen.getByRole('link', { name: 'sponsor.jpg' }));

		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Eventos',
			category: 'Galeria',
			label: 'Evento 1'
		});
		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Publicidades',
			category: 'Galeria',
			label: 'sponsor.jpg'
		});
	});

	it('searches by bib/number query and renders matching results', async () => {
		const searchDeferred = createDeferred();
		const searchEvents = vi.fn().mockImplementation(() => searchDeferred.promise);

		render(EventsPage, {
			searchEvents,
			loadEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Evento 1',
								eventUrl: '/eventos/?id=evt_1',
								coverImageUrl: '/1.jpg'
							}
						}
					],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 1,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-list')).toBeTruthy();

		await fireEvent.input(screen.getByTestId('events-search-input'), { target: { value: '145' } });
		await fireEvent.submit(screen.getByTestId('events-search-form'));

		expect(searchEvents).toHaveBeenCalledWith({ query: '145' });
		expect(screen.getByTestId('events-loading')).toBeTruthy();

		searchDeferred.resolve({
			events: [{ id: 'evt_145', title: 'Evento 145', eventUrl: '/eventos/?id=evt_145', coverImageUrl: '/145.jpg' }]
		});

		expect(await screen.findByRole('link', { name: 'Evento 145' })).toBeTruthy();
		expect(screen.getByTestId('events-summary').textContent).toContain('Busqueda "145"');
	});

	it('shows empty state when search has no matches', async () => {
		render(EventsPage, {
			searchEvents: () => Promise.resolve({ events: [] }),
			loadEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Evento 1',
								eventUrl: '/eventos/?id=evt_1',
								coverImageUrl: '/1.jpg'
							}
						}
					],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 1,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		await fireEvent.input(screen.getByTestId('events-search-input'), { target: { value: '9999' } });
		await fireEvent.submit(screen.getByTestId('events-search-form'));

		expect(await screen.findByTestId('events-empty')).toBeTruthy();
		expect(screen.getByTestId('events-empty').textContent).toContain('No hay resultados');
	});

	it('clears search and restores catalog feed', async () => {
		render(EventsPage, {
			searchEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_145', title: 'Evento 145', eventUrl: '/eventos/?id=evt_145', coverImageUrl: '/145.jpg' }]
				}),
			loadEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Evento 1',
								eventUrl: '/eventos/?id=evt_1',
								coverImageUrl: '/1.jpg'
							}
						}
					],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 1,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		await fireEvent.input(screen.getByTestId('events-search-input'), { target: { value: '145' } });
		await fireEvent.submit(screen.getByTestId('events-search-form'));
		expect(await screen.findByRole('link', { name: 'Evento 145' })).toBeTruthy();

		await fireEvent.click(screen.getByTestId('events-search-clear'));
		expect(await screen.findByRole('link', { name: 'Evento 1' })).toBeTruthy();
		expect(screen.queryByTestId('events-search-clear')).toBeNull();
	});

	it('shows untagged guidance message and tracks search actions', async () => {
		const trackEvent = vi.fn();
		render(EventsPage, {
			trackEvent,
			searchEvents: () => Promise.resolve({ isUntagged: true, events: [] }),
			loadEvents: () =>
				Promise.resolve({
					events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Evento 1',
								eventUrl: '/eventos/?id=evt_1',
								coverImageUrl: '/1.jpg'
							}
						}
					],
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 1,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					},
					progressive: { nextPage: null, canLoadMore: false }
				})
		});

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		await fireEvent.input(screen.getByTestId('events-search-input'), { target: { value: 'sin clasificar' } });
		await fireEvent.submit(screen.getByTestId('events-search-form'));

		expect(await screen.findByTestId('events-empty')).toBeTruthy();
		expect(screen.getByTestId('events-empty').textContent).toContain('no aplica al catalogo de eventos');
		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Filtros',
			category: 'Evento',
			label: 'Busqueda: sin clasificar'
		});
		expect(trackEvent).toHaveBeenCalledWith({
			action: 'Filtros',
			category: 'Evento',
			label: 'Busqueda sin resultados: sin clasificar'
		});
	});
});
