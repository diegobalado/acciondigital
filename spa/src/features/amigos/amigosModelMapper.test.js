import { mapLegacyAmigo } from './amigosModelMapper';
import { describe, expect, it } from 'vitest';

describe('mapLegacyAmigo', () => {
	it('maps legacy fields to SPA model', () => {
		const result = mapLegacyAmigo(
			{
				ID: 'perfil_extremo',
				title: ' Perfil Extremo ',
				category: ' Deportes de Aventura ',
				lugar: ' Tandil ',
				href: 'http://perfilextremo.com/',
				email: 'contacto@perfilextremo.com',
				image: '/assets/images/amigos/perfil_extremo.jpg'
			},
			2
		);

		expect(result).toEqual({
			id: 'perfil_extremo',
			name: 'Perfil Extremo',
			subtitle: 'Deportes de Aventura',
			location: 'Tandil',
			websiteUrl: 'http://perfilextremo.com/',
			email: 'contacto@perfilextremo.com',
			emailUrl: 'mailto:contacto@perfilextremo.com',
			imageUrl: '/assets/images/amigos/perfil_extremo.jpg',
			target: '_blank'
		});
	});

	it('uses defaults when legacy item is incomplete', () => {
		const result = mapLegacyAmigo({}, 3);

		expect(result).toEqual({
			id: 'amigo_3',
			name: 'Pagina amiga',
			subtitle: '',
			location: '',
			websiteUrl: '#',
			email: '',
			emailUrl: '',
			imageUrl: '/assets/images/amigos/amigo_3.jpg',
			target: '_self'
		});
	});
});
