import { mapLegacyCatalogEvent } from './eventsModelMapper';

describe('mapLegacyCatalogEvent', () => {
	it('maps galeria payload fields', () => {
		const mapped = mapLegacyCatalogEvent({
			ID: '19_3XCO2017Web',
			text: ' OPEN XCO 21.5.2017 '
		});

		expect(mapped).toEqual({
			id: '19_3XCO2017Web',
			title: 'OPEN XCO 21.5.2017',
			date: '',
			location: '',
			eventUrl: '/eventos/?id=19_3XCO2017Web',
			coverImageUrl: '/assets/images/eventos/19_3XCO2017Web/thumbs/portada.jpg'
		});
	});

	it('supports agenda-like fallback shape', () => {
		const mapped = mapLegacyCatalogEvent({
			img: '170301',
			titulo: 'Titulo agenda',
			fecha: '01/10/2017',
			lugar: 'Tandil'
		});

		expect(mapped).toEqual({
			id: '170301',
			title: 'Titulo agenda',
			date: '01/10/2017',
			location: 'Tandil',
			eventUrl: '/eventos/?id=170301',
			coverImageUrl: '/assets/images/eventos/170301/thumbs/portada.jpg'
		});
	});
});
