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

function buildLegacyThumbnailUrl(id, imageUrl) {
	if (imageUrl) {
		return imageUrl;
	}

	if (!id) {
		return '';
	}

	return `/assets/images/eventos/${encodeURIComponent(id)}/thumbs/portada.jpg`;
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
	const thumbnailUrl = buildLegacyThumbnailUrl(id, imageUrl);

	return {
		id,
		title,
		photographer: normalizeLegacyText(legacyEvent?.ph),
		description: normalizeLegacyText(legacyEvent?.description ?? legacyEvent?.descripcion),
		imageUrl,
		thumbnailUrl,
		eventUrl: buildFallbackEventUrl(eventUrl, id),
		isPublished: Boolean(legacyEvent?.published ?? legacyEvent?.publicado ?? true)
	};
}