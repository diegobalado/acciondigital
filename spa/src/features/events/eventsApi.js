import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyCatalogEvent } from './eventsModelMapper';

export const EVENTS_CATALOG_DATASOURCE_URL = '/assets/datasources/galeria.json';

function toPositiveInt(value, fallback) {
	const parsed = Number.parseInt(String(value), 10);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return fallback;
	}

	return parsed;
}

export async function loadEventsCatalog(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	const page = toPositiveInt(options.page ?? 1, 1);
	const pageSize = toPositiveInt(options.pageSize ?? 12, 12);
	const datasourceUrl = options.datasourceUrl || EVENTS_CATALOG_DATASOURCE_URL;

	const payload = await dataClient(datasourceUrl);
	const legacyEvents = Array.isArray(payload?.eventos) ? payload.eventos : [];
	const events = legacyEvents.map(mapLegacyCatalogEvent);

	const totalItems = events.length;
	const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	const pageItems = events.slice(start, end);

	return {
		datasourceUrl,
		events: pageItems,
		pagination: {
			page: currentPage,
			pageSize,
			totalItems,
			totalPages,
			hasPreviousPage: currentPage > 1,
			hasNextPage: currentPage < totalPages
		}
	};
}
