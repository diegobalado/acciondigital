import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import NotFoundPage from './NotFoundPage.svelte';

describe('NotFoundPage', () => {
	it('renders fallback message and return link', () => {
		render(NotFoundPage, { returnHref: '/eventos/' });

		expect(screen.getByTestId('not-found-content')).toBeTruthy();
		expect(screen.getByRole('heading', { name: 'Pagina no encontrada' })).toBeTruthy();
		expect(screen.getByTestId('not-found-return-link').getAttribute('href')).toBe('/eventos/');
	});
});
