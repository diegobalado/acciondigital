import { describe, expect, it, vi } from 'vitest';
import { FAQ_DATASOURCE_URL, loadFaqContent } from './faqApi';

describe('loadFaqContent', () => {
	it('loads datasource and maps faq list', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			faq: [
				{
					id: 'find-photos',
					question: 'Como puedo encontrar mis fotos?',
					answer: 'Usa el buscador.'
				}
			]
		});

		const result = await loadFaqContent({ dataClient });

		expect(dataClient).toHaveBeenCalledWith(FAQ_DATASOURCE_URL);
		expect(result.datasourceUrl).toBe(FAQ_DATASOURCE_URL);
		expect(result.faqItems).toHaveLength(1);
		expect(result.faqItems[0].id).toBe('find-photos');
	});

	it('uses embedded fallback when datasource is missing', async () => {
		const dataClient = vi.fn().mockRejectedValue(new Error('404'));

		const result = await loadFaqContent({ dataClient });

		expect(result.datasourceUrl).toBe('fallback:embedded');
		expect(result.faqItems.length).toBeGreaterThan(0);
	});
});
