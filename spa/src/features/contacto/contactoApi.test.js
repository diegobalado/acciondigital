import { describe, expect, it, vi } from 'vitest';
import { CONTACTO_DATASOURCE_URL, loadContactoContent } from './contactoApi';

describe('loadContactoContent', () => {
	it('loads datasource and maps contact content', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			contacto: {
				aboutTitle: 'Nosotros',
				aboutDescription: 'Fotografia de deportes',
				contactName: 'Javier Piva Flos',
				phone: '0249 450-3791',
				contactTitle: 'Contacto',
				formAction: '/contacto/index.php',
				socialLinks: [{ id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/AccionDigitalfoto/' }]
			}
		});

		const result = await loadContactoContent({ dataClient });

		expect(dataClient).toHaveBeenCalledWith(CONTACTO_DATASOURCE_URL);
		expect(result.datasourceUrl).toBe(CONTACTO_DATASOURCE_URL);
		expect(result.contacto.aboutTitle).toBe('Nosotros');
		expect(result.contacto.socialLinks).toHaveLength(1);
	});

	it('uses embedded fallback when datasource is missing', async () => {
		const dataClient = vi.fn().mockRejectedValue(new Error('404'));

		const result = await loadContactoContent({ dataClient });

		expect(result.datasourceUrl).toBe('fallback:embedded');
		expect(result.contacto.contactName).toBe('Javier Piva Flos');
		expect(result.contacto.socialLinks.length).toBeGreaterThan(0);
	});
});
