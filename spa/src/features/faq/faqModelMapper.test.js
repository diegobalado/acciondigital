import { describe, expect, it } from 'vitest';
import { mapLegacyFaqItem } from './faqModelMapper';

describe('mapLegacyFaqItem', () => {
	it('maps legacy faq fields to SPA model', () => {
		const result = mapLegacyFaqItem(
			{
				ID: 'find-photos',
				pregunta: ' Como puedo encontrar mis fotos? ',
				respuesta: ' Usa el buscador por numero de corredor. '
			},
			3
		);

		expect(result).toEqual({
			id: 'find-photos',
			question: 'Como puedo encontrar mis fotos?',
			answer: 'Usa el buscador por numero de corredor.'
		});
	});

	it('builds defaults when item is incomplete', () => {
		const result = mapLegacyFaqItem({}, 4);

		expect(result).toEqual({
			id: 'faq_4',
			question: 'Pregunta frecuente',
			answer: ''
		});
	});
});
