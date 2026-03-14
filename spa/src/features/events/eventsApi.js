import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyCatalogEvent } from './eventsModelMapper';
import { buildEventsFeed } from './eventsFeed';

export const EVENTS_CATALOG_DATASOURCE_URL = '/assets/datasources/galeria.json';
export const EVENTS_CATALOG_MIRROR_HOME5_DATASOURCE_URL = '/assets/datasources/mirror/home-5/galeria.5.json';

function mapLegacyEventAd(ad, index) {
	const href = ad?.href || '#';

	return {
		id: ad?.id || ad?.name || `ad_${index}`,
		name: ad?.name || '',
		href,
		target: href === '#' ? '_self' : '_blank',
		imageUrl: ad?.name ? `/assets/images/ads/${ad.name}` : ''
	};
}

function toPositiveInt(value, fallback) {
	const parsed = Number.parseInt(String(value), 10);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return fallback;
	}

	return parsed;
}

function normalizeSearchTerm(value) {
	return String(value ?? '')
		.trim()
		.toLowerCase();
}

function isMirrorHome5Search(search) {
	const params = new URLSearchParams(String(search || ''));
	return params.get('mirror') === 'home5';
}

function isUntaggedQuery(query) {
	return query === 'untagged' || query === 'sin clasificar' || query === 'sin-clasificar';
}

function resolveEventsCatalogDatasource(options = {}) {
	if (options.datasourceUrl) {
		return options.datasourceUrl;
	}

	if (isMirrorHome5Search(options.search)) {
		return EVENTS_CATALOG_MIRROR_HOME5_DATASOURCE_URL;
	}

	return EVENTS_CATALOG_DATASOURCE_URL;
}

function normalizeDigits(value) {
	return String(value ?? '').replace(/\D+/g, '');
}

function extractDigitTokens(value) {
	const matches = String(value ?? '').match(/\d+/g);
	return Array.isArray(matches) ? matches : [];
}

function mapCatalogPayload(payload) {
	const legacyEvents = Array.isArray(payload?.eventos) ? payload.eventos : [];
	const events = legacyEvents.map(mapLegacyCatalogEvent);
	const ads = Array.isArray(payload?.ads) ? payload.ads.map(mapLegacyEventAd) : [];

	return {
		events,
		ads
	};
}

function matchesBibOrNumber(eventItem, query) {
	const normalizedQuery = normalizeSearchTerm(query);
	if (!normalizedQuery) {
		return false;
	}

	const queryDigits = normalizeDigits(normalizedQuery);
	const title = normalizeSearchTerm(eventItem?.title);
	const id = normalizeSearchTerm(eventItem?.id);
	const eventUrl = normalizeSearchTerm(eventItem?.eventUrl);
	const combinedText = `${title} ${id} ${eventUrl}`;

	if (combinedText.includes(normalizedQuery)) {
		return true;
	}

	if (!queryDigits) {
		return false;
	}

	const candidateDigitTokens = extractDigitTokens(combinedText);
	return candidateDigitTokens.some((token) => token === queryDigits);
}

export async function loadEventsCatalog(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	const page = toPositiveInt(options.page ?? 1, 1);
	const pageSize = toPositiveInt(options.pageSize ?? 12, 12);
	const resolvedDatasourceUrl = resolveEventsCatalogDatasource(options);

	let payload;
	let datasourceUrl = resolvedDatasourceUrl;
	try {
		payload = await dataClient(resolvedDatasourceUrl);
	} catch (error) {
		if (resolvedDatasourceUrl === EVENTS_CATALOG_MIRROR_HOME5_DATASOURCE_URL && !options.datasourceUrl) {
			datasourceUrl = EVENTS_CATALOG_DATASOURCE_URL;
			payload = await dataClient(EVENTS_CATALOG_DATASOURCE_URL);
		} else {
			throw error;
		}
	}

	const { events, ads } = mapCatalogPayload(payload);

	const totalItems = events.length;
	const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	const pageItems = events.slice(start, end);

	return {
		datasourceUrl,
		events: pageItems,
		ads,
		feed: buildEventsFeed(pageItems, ads),
		pagination: {
			page: currentPage,
			pageSize,
			totalItems,
			totalPages,
			hasPreviousPage: currentPage > 1,
			hasNextPage: currentPage < totalPages
		},
		progressive: {
			nextPage: currentPage < totalPages ? currentPage + 1 : null,
			canLoadMore: currentPage < totalPages
		}
	};
}

export async function searchEventsCatalog(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	const datasourceUrl = resolveEventsCatalogDatasource(options);
	const query = normalizeSearchTerm(options.query);

	if (!query) {
		return {
			query,
			isUntagged: false,
			events: []
		};
	}

	if (isUntaggedQuery(query)) {
		return {
			query,
			isUntagged: true,
			events: []
		};
	}

	const payload = await dataClient(datasourceUrl);
	const { events } = mapCatalogPayload(payload);

	return {
		query,
		isUntagged: false,
		events: events.filter((eventItem) => matchesBibOrNumber(eventItem, query))
	};
}
