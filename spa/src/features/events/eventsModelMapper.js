import { normalizeLegacyText } from '../../shared/models/legacyNormalization';

function resolveEventId(legacyEvent) {
	return normalizeLegacyText(String(legacyEvent?.ID ?? legacyEvent?.id ?? legacyEvent?.img ?? ''));
}

function resolveTitle(legacyEvent) {
	return normalizeLegacyText(legacyEvent?.text ?? legacyEvent?.titulo ?? legacyEvent?.title ?? '');
}

function buildDefaultEventUrl(eventId) {
	if (!eventId) {
		return '';
	}

	return `/eventos/?id=${encodeURIComponent(eventId)}`;
}

function buildDefaultCoverUrl(eventId) {
	if (!eventId) {
		return '';
	}

	return `/assets/images/eventos/${encodeURIComponent(eventId)}/thumbs/portada.jpg`;
}

export function mapLegacyCatalogEvent(legacyEvent) {
	const id = resolveEventId(legacyEvent);
	const title = resolveTitle(legacyEvent);
	const eventUrl = normalizeLegacyText(legacyEvent?.url ?? legacyEvent?.href) || buildDefaultEventUrl(id);
	const coverImageUrl =
		normalizeLegacyText(legacyEvent?.coverImageUrl ?? legacyEvent?.image ?? legacyEvent?.img_url) ||
		buildDefaultCoverUrl(id);

	return {
		id,
		title,
		date: normalizeLegacyText(legacyEvent?.fecha ?? legacyEvent?.date),
		location: normalizeLegacyText(legacyEvent?.lugar ?? legacyEvent?.location),
		eventUrl,
		coverImageUrl
	};
}
