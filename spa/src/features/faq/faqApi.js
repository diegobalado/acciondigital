import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyFaqItem } from './faqModelMapper';

export const FAQ_DATASOURCE_URL = '/assets/datasources/faq.json';

const FALLBACK_FAQ_ITEMS = [
	{
		id: 'encontrar-fotos',
		question: 'Como puedo encontrar mis fotos?',
		answer:
			'Desde Inicio elegi el evento y usa el buscador por numero de corredor. Si no aparece resultado, proba la opcion de fotos sin clasificar.'
	},
	{
		id: 'comprar-fotos',
		question: 'Como compro mis fotos?',
		answer:
			'En la galeria del evento agrega fotos al carrito, revisa Mis Fotos y continua al checkout para confirmar tu pedido.'
	},
	{
		id: 'pagar-fotos',
		question: 'Como hago para pagar mis fotos?',
		answer:
			'En la confirmacion completa tus datos y elegi metodo de pago. Estan disponibles transferencia bancaria y Mercado Pago.'
	},
	{
		id: 'recibir-fotos',
		question: 'Como recibo mis fotos?',
		answer:
			'Despues de confirmar el pago, recibis las fotos por mail en alta resolucion y sin marcas de agua.'
	},
	{
		id: 'fotos-impresas',
		question: 'Como consigo mis fotos impresas?',
		answer:
			'Podes pedir fotos impresas contactandote por el formulario y detallando en observaciones que queres soporte fisico.'
	}
];

function extractLegacyFaqItems(payload) {
	if (Array.isArray(payload?.faq)) {
		return payload.faq;
	}

	if (Array.isArray(payload?.items)) {
		return payload.items;
	}

	if (Array.isArray(payload?.questions)) {
		return payload.questions;
	}

	if (Array.isArray(payload)) {
		return payload;
	}

	return [];
}

export async function loadFaqContent(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	let payload = null;
	let datasourceUrl = FAQ_DATASOURCE_URL;

	try {
		payload = await dataClient(FAQ_DATASOURCE_URL);
	} catch {
		payload = { faq: FALLBACK_FAQ_ITEMS };
		datasourceUrl = 'fallback:embedded';
	}

	const faqItems = extractLegacyFaqItems(payload)
		.map(mapLegacyFaqItem)
		.filter((item) => item.question && item.answer);

	return {
		datasourceUrl,
		faqItems
	};
}
