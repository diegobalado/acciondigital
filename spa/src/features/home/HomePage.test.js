import { render, screen } from '@testing-library/svelte';
import HomePage from './HomePage.svelte';

function createDeferred() {
	let resolve;
	let reject;

	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

describe('HomePage', () => {
	it('shows loading state while requesting events', async () => {
		const deferred = createDeferred();
		render(HomePage, { loadEvents: () => deferred.promise });

		expect(screen.getByTestId('home-loading')).toBeTruthy();

		deferred.resolve([]);
		await screen.findByTestId('home-empty');
	});

	it('shows empty state when no events are returned', async () => {
		render(HomePage, { loadEvents: () => Promise.resolve([]) });

		expect(await screen.findByTestId('home-empty')).toBeTruthy();
	});

	it('shows error state when loading fails', async () => {
		render(HomePage, { loadEvents: () => Promise.reject(new Error('network')) });

		expect(await screen.findByTestId('home-error')).toBeTruthy();
	});

	it('renders first mapped events list', async () => {
		render(HomePage, {
			loadEvents: () =>
				Promise.resolve([
					{
						id: 'evt_1',
						title: 'Open XCO Balcarce',
						photographer: 'JPF',
						eventUrl: '/eventos/?id=evt_1'
					}
				])
		});

		expect(await screen.findByTestId('home-events-list')).toBeTruthy();
		const link = screen.getByRole('link', { name: 'Open XCO Balcarce' });
		expect(link.getAttribute('href')).toBe('/eventos/?id=evt_1');
		expect(screen.getByText('Foto: JPF')).toBeTruthy();
	});
});