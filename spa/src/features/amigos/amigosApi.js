import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyAmigo } from './amigosModelMapper';

export const AMIGOS_DATASOURCE_URL = '/assets/datasources/amigos.json';

const FALLBACK_LEGACY_AMIGOS = [
	{
		id: 'perfil_extremo',
		name: 'Perfil Extremo',
		subtitle: 'Deportes de Aventura',
		location: 'Tandil - Buenos Aires - Argentina',
		websiteUrl: 'http://perfilextremo.com/',
		email: 'contacto@perfilextremo.com',
		imageUrl: '/assets/images/amigos/perfil_extremo.jpg'
	}
];

function extractLegacyAmigos(payload) {
	if (Array.isArray(payload?.amigos)) {
		return payload.amigos;
	}

	if (Array.isArray(payload?.friends)) {
		return payload.friends;
	}

	if (Array.isArray(payload)) {
		return payload;
	}

	return [];
}

export async function loadAmigosContent(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	let payload = null;
	let datasourceUrl = AMIGOS_DATASOURCE_URL;

	try {
		payload = await dataClient(AMIGOS_DATASOURCE_URL);
	} catch {
		payload = { amigos: FALLBACK_LEGACY_AMIGOS };
		datasourceUrl = 'fallback:embedded';
	}

	const amigos = extractLegacyAmigos(payload).map(mapLegacyAmigo);

	return {
		datasourceUrl,
		amigos
	};
}
