import { AMIGOS_DATASOURCE_URL, loadAmigosContent } from './amigosApi';
import { describe, expect, it, vi } from 'vitest';

describe('loadAmigosContent', () => {
	it('loads datasource and maps amigos list', async () => {
		const dataClient = vi.fn().mockResolvedValue({
			amigos: [
				{
					ID: 'perfil_extremo',
					title: 'Perfil Extremo',
					category: 'Deportes de Aventura',
					lugar: 'Tandil',
					href: 'http://perfilextremo.com/'
				}
			]
		});

		const result = await loadAmigosContent({ dataClient });

		expect(dataClient).toHaveBeenCalledWith(AMIGOS_DATASOURCE_URL);
		expect(result.datasourceUrl).toBe(AMIGOS_DATASOURCE_URL);
		expect(result.amigos).toHaveLength(1);
		expect(result.amigos[0].id).toBe('perfil_extremo');
		expect(result.amigos[0].name).toBe('Perfil Extremo');
	});

	it('uses embedded fallback when datasource is missing', async () => {
		const dataClient = vi.fn().mockRejectedValue(new Error('404'));

		const result = await loadAmigosContent({ dataClient });

		expect(result.datasourceUrl).toBe('fallback:embedded');
		expect(result.amigos).toHaveLength(1);
		expect(result.amigos[0].id).toBe('perfil_extremo');
	});
});
