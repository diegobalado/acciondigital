import { normalizeLegacyText } from '../../shared/models/legacyNormalization';

function asId(value) {
	if (value === null || value === undefined) {
		return '';
	}

	return normalizeLegacyText(String(value));
}

function buildFallbackEventUrl(eventUrl, id) {
	if (eventUrl) {
		return eventUrl;
	}

	if (!id) {
		return '';
	}

	return `/eventos/?id=${encodeURIComponent(id)}`;
}

export function mapLegacyHomeEvent(legacyEvent) {
	const title = normalizeLegacyText(
		legacyEvent?.title ?? legacyEvent?.titulo ?? legacyEvent?.text ?? legacyEvent?.name
	);
	const id = asId(legacyEvent?.ID ?? legacyEvent?.id);
	const imageUrl = normalizeLegacyText(
		legacyEvent?.img_url ?? legacyEvent?.image ?? legacyEvent?.thumb
	);
	const eventUrl = normalizeLegacyText(legacyEvent?.url ?? legacyEvent?.link);

	return {
		id,
		title,
		photographer: normalizeLegacyText(legacyEvent?.ph),
		description: normalizeLegacyText(legacyEvent?.description ?? legacyEvent?.descripcion),
		imageUrl,
		eventUrl: buildFallbackEventUrl(eventUrl, id),
		isPublished: Boolean(legacyEvent?.published ?? legacyEvent?.publicado ?? true)
	};
}