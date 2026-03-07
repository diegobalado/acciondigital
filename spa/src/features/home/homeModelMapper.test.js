import { mapLegacyHomeEvent } from './homeModelMapper';

describe('mapLegacyHomeEvent', () => {
	it('maps common legacy fields into SPA home event model', () => {
		const mapped = mapLegacyHomeEvent({
			ID: '164_End3DomTand_2_7_23',
			text: '  CAMP. BON. DE ENDURO - 3ra MANGA - 2.7.23  ',
			descripcion: '  Circuito tecnico  ',
			img_url: '  /assets/images/eventos/17.jpg ',
			url: ' /eventos/17 ',
			ph: ' JPF ',
			published: 1
		});

		expect(mapped).toEqual({
			id: '164_End3DomTand_2_7_23',
			title: 'CAMP. BON. DE ENDURO - 3ra MANGA - 2.7.23',
			photographer: 'JPF',
			description: 'Circuito tecnico',
			imageUrl: '/assets/images/eventos/17.jpg',
			eventUrl: '/eventos/17',
			isPublished: true
		});
	});

	it('applies fallbacks and safe defaults', () => {
		const mapped = mapLegacyHomeEvent({
			name: 'Evento sin id',
			thumb: '/assets/images/eventos/default.jpg',
			publicado: 0
		});

		expect(mapped).toEqual({
			id: '',
			title: 'Evento sin id',
			photographer: '',
			description: '',
			imageUrl: '/assets/images/eventos/default.jpg',
			eventUrl: '',
			isPublished: false
		});
	});

	it('builds fallback event URL when there is id but no explicit URL', () => {
		const mapped = mapLegacyHomeEvent({
			ID: 'abc_123',
			text: 'Evento legacy'
		});

		expect(mapped.eventUrl).toBe('/eventos/?id=abc_123');
	});
});