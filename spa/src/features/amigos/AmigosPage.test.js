import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AmigosPage from './AmigosPage.svelte';

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

describe('AmigosPage', () => {
	it('shows loading state while requesting friends content', async () => {
		const deferred = createDeferred();
		render(AmigosPage, { loadAmigos: () => deferred.promise });

		expect(screen.getByTestId('amigos-loading')).toBeTruthy();

		deferred.resolve({ datasourceUrl: 'mock', amigos: [] });
		await screen.findByTestId('amigos-empty');
	});

	it('shows error state when loading fails', async () => {
		render(AmigosPage, { loadAmigos: () => Promise.reject(new Error('network')) });

		expect(await screen.findByTestId('amigos-error')).toBeTruthy();
	});

	it('shows empty state when no friend pages are available', async () => {
		render(AmigosPage, { loadAmigos: () => Promise.resolve({ datasourceUrl: 'mock', amigos: [] }) });

		expect(await screen.findByTestId('amigos-empty')).toBeTruthy();
	});

	it('renders mapped friend cards', async () => {
		render(AmigosPage, {
			loadAmigos: () =>
				Promise.resolve({
					datasourceUrl: 'mock',
					amigos: [
						{
							id: 'perfil_extremo',
							name: 'Perfil Extremo',
							subtitle: 'Deportes de Aventura',
							location: 'Tandil - Buenos Aires - Argentina',
							websiteUrl: 'http://perfilextremo.com/',
							target: '_blank',
							email: 'contacto@perfilextremo.com',
							emailUrl: 'mailto:contacto@perfilextremo.com',
							imageUrl: '/assets/images/amigos/perfil_extremo.jpg'
						}
					]
				})
		});

		expect(await screen.findByTestId('amigos-list')).toBeTruthy();
		expect(screen.getByText('Perfil Extremo')).toBeTruthy();
		expect(screen.getByText('Deportes de Aventura')).toBeTruthy();
		expect(screen.getByText('Tandil - Buenos Aires - Argentina')).toBeTruthy();
		expect(screen.getByText('contacto@perfilextremo.com')).toBeTruthy();
		expect(screen.getByTestId('amigos-summary').textContent).toContain('Paginas: 1');

		const websiteLinks = screen.getAllByRole('link', { name: 'http://perfilextremo.com/' });
		expect(websiteLinks[0].getAttribute('href')).toBe('http://perfilextremo.com/');
	});
});
