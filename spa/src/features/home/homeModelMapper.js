import { normalizeLegacyText } from '../../shared/models/legacyNormalization';

function asNumber(value) {
	const parsed = Number(value);
	return Number.isNaN(parsed) ? 0 : parsed;
}

export function mapLegacyHomeEvent(legacyEvent) {
	const title = normalizeLegacyText(
		legacyEvent?.title ?? legacyEvent?.titulo ?? legacyEvent?.name
	);
	const imageUrl = normalizeLegacyText(
		legacyEvent?.img_url ?? legacyEvent?.image ?? legacyEvent?.thumb
	);
	const eventUrl = normalizeLegacyText(legacyEvent?.url ?? legacyEvent?.link);

	return {
		id: asNumber(legacyEvent?.id),
		title,
		description: normalizeLegacyText(legacyEvent?.description ?? legacyEvent?.descripcion),
		imageUrl,
		eventUrl,
		isPublished: Boolean(legacyEvent?.published ?? legacyEvent?.publicado ?? true)
	};
}