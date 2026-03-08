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
			pagination: {
				page: 1,
				pageSize: 12,
				totalItems: 0,
				totalPages: 1,
				hasPreviousPage: false,
				hasNextPage: false
			}
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
					pagination: {
						page: 1,
						pageSize: 12,
						totalItems: 0,
						totalPages: 1,
						hasPreviousPage: false,
						hasNextPage: false
					}
				})
		});

		expect(await screen.findByTestId('events-empty')).toBeTruthy();
	});

	it('renders events and paginates to next page', async () => {
		const loadEvents = vi
			.fn()
			.mockResolvedValueOnce({
				events: [{ id: 'evt_1', title: 'Evento 1', eventUrl: '/eventos/?id=evt_1', coverImageUrl: '/1.jpg' }],
				pagination: {
					page: 1,
					pageSize: 1,
					totalItems: 2,
					totalPages: 2,
					hasPreviousPage: false,
					hasNextPage: true
				}
			})
			.mockResolvedValueOnce({
				events: [{ id: 'evt_2', title: 'Evento 2', eventUrl: '/eventos/?id=evt_2', coverImageUrl: '/2.jpg' }],
				pagination: {
					page: 2,
					pageSize: 1,
					totalItems: 2,
					totalPages: 2,
					hasPreviousPage: true,
					hasNextPage: false
				}
			});

		render(EventsPage, { loadEvents });

		expect(await screen.findByTestId('events-list')).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Evento 1' }).getAttribute('href')).toBe('/eventos/?id=evt_1');

		const nextButton = screen.getByRole('button', { name: 'Siguiente' });
		expect(nextButton.disabled).toBe(false);
		await fireEvent.click(nextButton);

		expect(await screen.findByRole('link', { name: 'Evento 2' })).toBeTruthy();
		expect(loadEvents).toHaveBeenCalledWith({ page: 1 });
		expect(loadEvents).toHaveBeenCalledWith({ page: 2 });
	});
});
