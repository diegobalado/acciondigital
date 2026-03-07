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
		render(HomePage, { loadHome: () => deferred.promise });

		expect(screen.getByTestId('home-loading')).toBeTruthy();

		deferred.resolve({ events: [], ads: [], feed: [] });
		await screen.findByTestId('home-empty');
	});

	it('shows empty state when no events are returned', async () => {
		render(HomePage, { loadHome: () => Promise.resolve({ events: [], ads: [], feed: [] }) });

		expect(await screen.findByTestId('home-empty')).toBeTruthy();
	});

	it('shows error state when loading fails', async () => {
		render(HomePage, { loadHome: () => Promise.reject(new Error('network')) });

		expect(await screen.findByTestId('home-error')).toBeTruthy();
	});

	it('renders first mapped events list', async () => {
		render(HomePage, {
			loadHome: () =>
				Promise.resolve({
					events: [
						{
							id: 'evt_1',
							title: 'Open XCO Balcarce',
							photographer: 'JPF',
							eventUrl: '/eventos/?id=evt_1'
						}
					],
					ads: [],
					feed: [
						{
							type: 'event',
							event: {
								id: 'evt_1',
								title: 'Open XCO Balcarce',
								photographer: 'JPF',
								eventUrl: '/eventos/?id=evt_1'
							}
						}
					]
				})
		});

		expect(await screen.findByTestId('home-events-list')).toBeTruthy();
		const link = screen.getByRole('link', { name: 'Open XCO Balcarce' });
		expect(link.getAttribute('href')).toBe('/eventos/?id=evt_1');
		expect(screen.getByText('Foto: JPF')).toBeTruthy();
		expect(screen.getByTestId('home-summary').textContent).toContain('Eventos: 1');
	});

	it('renders ad item from feed', async () => {
		render(HomePage, {
			loadHome: () =>
				Promise.resolve({
					events: [],
					ads: [
						{
							id: 'ad_1',
							name: 'ad.jpg',
							href: 'https://sponsor.test',
							target: '_blank',
							imageUrl: '/assets/images/ads/ad.jpg'
						}
					],
					feed: [
						{
							type: 'ad',
							ad: {
								id: 'ad_1',
								name: 'ad.jpg',
								href: 'https://sponsor.test',
								target: '_blank',
								imageUrl: '/assets/images/ads/ad.jpg'
							}
						}
					]
				})
		});

		expect(await screen.findByTestId('home-events-list')).toBeTruthy();
		const adItem = screen.getByTestId('home-ad-item');
		expect(adItem).toBeTruthy();
		const adLink = adItem.querySelector('a');
		expect(adLink.getAttribute('href')).toBe('https://sponsor.test');
		expect(adLink.getAttribute('target')).toBe('_blank');
	});
});