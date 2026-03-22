import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FaqPage from './FaqPage.svelte';

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

describe('FaqPage', () => {
	it('shows loading state while requesting faq content', async () => {
		const deferred = createDeferred();
		render(FaqPage, { loadFaq: () => deferred.promise });

		expect(screen.getByTestId('faq-loading')).toBeTruthy();

		deferred.resolve({ datasourceUrl: 'mock', faqItems: [] });
		await screen.findByTestId('faq-empty');
	});

	it('shows error state when loading fails', async () => {
		render(FaqPage, { loadFaq: () => Promise.reject(new Error('network')) });

		expect(await screen.findByTestId('faq-error')).toBeTruthy();
	});

	it('shows empty state when no faq items are available', async () => {
		render(FaqPage, { loadFaq: () => Promise.resolve({ datasourceUrl: 'mock', faqItems: [] }) });

		expect(await screen.findByTestId('faq-empty')).toBeTruthy();
	});

	it('renders faq list and toggles answers', async () => {
		render(FaqPage, {
			loadFaq: () =>
				Promise.resolve({
					datasourceUrl: 'mock',
					faqItems: [
						{
							id: 'find-photos',
							question: 'Como puedo encontrar mis fotos?',
							answer: 'Usa el buscador por numero de corredor.'
						}
					]
				})
		});

		expect(await screen.findByTestId('faq-list')).toBeTruthy();
		expect(screen.getByTestId('faq-summary').textContent).toContain('Preguntas: 1');

		const toggle = screen.getByTestId('faq-toggle-find-photos');
		expect(screen.queryByTestId('faq-answer-find-photos')).toBeNull();

		await fireEvent.click(toggle);
		expect(screen.getByTestId('faq-answer-find-photos').textContent).toContain('buscador');

		await fireEvent.click(toggle);
		expect(screen.queryByTestId('faq-answer-find-photos')).toBeNull();
	});
});
