import { describe, expect, it } from 'vitest';
import { mapLegacyContactoContent } from './contactoModelMapper';

describe('mapLegacyContactoContent', () => {
	it('maps legacy contact fields to SPA model', () => {
		const result = mapLegacyContactoContent({
			about: {
				title: ' Nosotros ',
				description: ' Fotografia de deportes ',
				name: ' Javier Piva Flos ',
				phone: ' 0249 450-3791 '
			},
			form: {
				title: ' Contacto ',
				action: '/contacto/index.php'
			},
			recipientEmails: [' acciondigitalfoto@gmail.com '],
			social: [{ id: 'facebook', label: ' Facebook ', href: 'https://www.facebook.com/AccionDigitalfoto/' }]
		});

		expect(result).toEqual({
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
		});
	});

	it('uses defaults when payload is incomplete', () => {
		const result = mapLegacyContactoContent({});

		expect(result).toEqual({
			aboutTitle: 'Nosotros',
			aboutDescription: 'Fotografia de deportes',
			contactName: 'Javier Piva Flos',
			phone: '0249 450-3791',
			contactTitle: 'Contacto',
			formAction: '/contacto/index.php',
			recipientEmails: [],
			socialLinks: []
		});
	});
});
