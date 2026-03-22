import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyContactoContent } from './contactoModelMapper';

export const CONTACTO_DATASOURCE_URL = '/assets/datasources/contacto.json';

const FALLBACK_CONTACTO_CONTENT = {
	aboutTitle: 'Nosotros',
	aboutDescription: 'Fotografia de deportes',
	contactName: 'Javier Piva Flos',
	phone: '0249 450-3791',
	contactTitle: 'Contacto',
	formAction: '/contacto/index.php',
	recipientEmails: ['acciondigitalfoto@gmail.com', 'jdiegomdq@gmail.com'],
	socialLinks: [
		{
			id: 'facebook',
			name: 'Facebook',
			url: 'https://www.facebook.com/AccionDigitalfoto/'
		},
		{
			id: 'flickr',
			name: 'Flickr',
			url: 'https://www.flickr.com/photos/xav561/albums'
		}
	]
};

function extractLegacyContactoPayload(payload) {
	if (payload?.contacto && typeof payload.contacto === 'object') {
		return payload.contacto;
	}

	if (payload?.contact && typeof payload.contact === 'object') {
		return payload.contact;
	}

	if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
		return payload;
	}

	return {};
}

export async function loadContactoContent(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	let payload = null;
	let datasourceUrl = CONTACTO_DATASOURCE_URL;

	try {
		payload = await dataClient(CONTACTO_DATASOURCE_URL);
	} catch {
		payload = FALLBACK_CONTACTO_CONTENT;
		datasourceUrl = 'fallback:embedded';
	}

	const contacto = mapLegacyContactoContent(extractLegacyContactoPayload(payload));

	return {
		datasourceUrl,
		contacto
	};
}
