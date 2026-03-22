import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PageLayout from './PageLayout.svelte';
import PageLayoutSlotHarness from './PageLayoutSlotHarness.svelte';

describe('PageLayout', () => {
	it('renders default title/subtitle header', () => {
		render(PageLayout, {
			props: {
				title: 'Titulo',
				subtitle: 'Subtitulo'
			}
		});

		expect(screen.getByRole('heading', { name: 'Titulo' })).toBeTruthy();
		expect(screen.getByText('Subtitulo')).toBeTruthy();
	});

	it('renders custom header slot and default slot content', () => {
		render(PageLayoutSlotHarness);

		expect(screen.getByRole('heading', { name: 'Header custom' })).toBeTruthy();
		expect(screen.getByTestId('layout-content')).toBeTruthy();
	});

	it('supports wide shell + compact header variant', () => {
		render(PageLayout, {
			props: {
				shell: 'wide',
				headerVariant: 'compact',
				title: 'Galeria'
			}
		});

		expect(screen.getByRole('heading', { name: 'Galeria' })).toBeTruthy();
	});
});
