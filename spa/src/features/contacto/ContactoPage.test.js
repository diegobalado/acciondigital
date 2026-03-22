import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ContactoPage from './ContactoPage.svelte';

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

describe('ContactoPage', () => {
	it('shows loading state while requesting contact content', async () => {
		const deferred = createDeferred();
		render(ContactoPage, { loadContacto: () => deferred.promise });

		expect(screen.getByTestId('contacto-loading')).toBeTruthy();

		deferred.resolve({ datasourceUrl: 'mock', contacto: null });
		await screen.findByTestId('contacto-empty');
	});

	it('shows error state when loading fails', async () => {
		render(ContactoPage, { loadContacto: () => Promise.reject(new Error('network')) });

		expect(await screen.findByTestId('contacto-error')).toBeTruthy();
	});

	it('shows empty state when no contact payload is available', async () => {
		render(ContactoPage, { loadContacto: () => Promise.resolve({ datasourceUrl: 'mock', contacto: null }) });

		expect(await screen.findByTestId('contacto-empty')).toBeTruthy();
	});

	it('renders contact section and social links', async () => {
		render(ContactoPage, {
			loadContacto: () =>
				Promise.resolve({
					datasourceUrl: 'mock',
					contacto: {
						aboutTitle: 'Nosotros',
						aboutDescription: 'Fotografia de deportes',
						contactName: 'Javier Piva Flos',
						phone: '0249 450-3791',
						contactTitle: 'Contacto',
						formAction: '/contacto/index.php',
						recipientEmails: ['acciondigitalfoto@gmail.com'],
						socialLinks: [
							{
								id: 'facebook',
								name: 'Facebook',
								url: 'https://www.facebook.com/AccionDigitalfoto/',
								target: '_blank'
							}
						]
					}
				})
		});

		expect(await screen.findByTestId('contacto-content')).toBeTruthy();
		expect(screen.getByText('Javier Piva Flos')).toBeTruthy();
		expect(screen.getByTestId('contacto-social-facebook').getAttribute('href')).toBe(
			'https://www.facebook.com/AccionDigitalfoto/'
		);
		expect(screen.getByRole('button', { name: 'Enviar' })).toBeTruthy();
	});
});
