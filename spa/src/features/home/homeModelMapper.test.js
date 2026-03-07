import { mapLegacyHomeEvent } from './homeModelMapper';

describe('mapLegacyHomeEvent', () => {
	it('maps common legacy fields into SPA home event model', () => {
		const mapped = mapLegacyHomeEvent({
			id: '17',
			titulo: '  3ra Fecha   XCO  ',
			descripcion: '  Circuito tecnico  ',
			img_url: '  /assets/images/eventos/17.jpg ',
			url: ' /eventos/17 ',
			published: 1
		});

		expect(mapped).toEqual({
			id: 17,
			title: '3ra Fecha XCO',
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
			link: '/eventos/default',
			publicado: 0
		});

		expect(mapped).toEqual({
			id: 0,
			title: 'Evento sin id',
			description: '',
			imageUrl: '/assets/images/eventos/default.jpg',
			eventUrl: '/eventos/default',
			isPublished: false
		});
	});
});