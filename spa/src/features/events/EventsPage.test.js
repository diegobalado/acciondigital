import { fireEvent, render, screen } from '@testing-library/svelte';
import EventsPage from './EventsPage.svelte';

function createDeferred() {
	let resolve;
	let reject;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

describe('EventsPage', () => {
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

	it('renders feed and loads next page with progressive button', async () => {
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

		const loadMoreButton = screen.getByTestId('events-load-more');
		await fireEvent.click(loadMoreButton);

		expect(await screen.findByRole('link', { name: 'Evento 2' })).toBeTruthy();
		expect(loadEvents).toHaveBeenCalledWith({ page: 1, pageSize: 12 });
		expect(loadEvents).toHaveBeenCalledWith({ page: 2, pageSize: 12 });
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
});
