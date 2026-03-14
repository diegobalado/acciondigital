import { fetchLegacyJson } from '../../services/legacyDataClient';

export const EVENT_GALLERY_PAGE_SIZE = 60;
export const LOCAL_EVENT_GALLERY_URL = '/__legacy/event-gallery.json';

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

function extractPhotoBibTokens(rawCode) {
	const segments = String(rawCode ?? '').split('-').slice(1);
	return segments.map((segment) => segment.trim()).filter(Boolean);
}

function isMirrorHome5Search(search) {
	const params = new URLSearchParams(String(search || ''));
	return params.get('mirror') === 'home5';
}

function isUntaggedQuery(query) {
	return query === 'untagged' || query === 'sin clasificar' || query === 'sin-clasificar';
}

function resolveEventGalleryDatasource(eventId, options = {}) {
	if (options.datasourceUrl) {
		return options.datasourceUrl;
	}

	if (isMirrorHome5Search(options.search)) {
		return `/assets/datasources/mirror/home-5/${eventId}.json`;
	}

	return `/assets/datasources/${eventId}.json`;
}

function buildLocalEventGalleryUrl(eventId) {
	return `${LOCAL_EVENT_GALLERY_URL}?id=${encodeURIComponent(eventId)}`;
}

function mapLegacyEventPhoto(eventId, rawCode) {
	const code = String(rawCode ?? '').trim();
	const bibs = extractPhotoBibTokens(code);

	return {
		id: code,
		code,
		bibs,
		isTagged: bibs.length > 0,
		thumbnailUrl: `/assets/images/eventos/${encodeURIComponent(eventId)}/thumbs/${encodeURIComponent(code)}.jpg`,
		fullImageUrl: `/assets/images/eventos/${encodeURIComponent(eventId)}/${encodeURIComponent(code)}.jpg`
	};
}

function mapLegacyEventGalleryPayload(eventId, payload) {
	const rawPhotos = Array.isArray(payload?.pictures) ? payload.pictures : [];
	const photos = rawPhotos.map((photoCode) => mapLegacyEventPhoto(eventId, photoCode));

	return {
		event: {
			id: String(payload?.IdEvento ?? eventId ?? '').trim(),
			title: String(payload?.title ?? '').trim(),
			price: Number(payload?.price ?? 0) || 0,
			promo: Number(payload?.promo ?? 0) || 0,
			ph: String(payload?.ph ?? '').trim(),
			searchEnabled: String(payload?.search ?? '').trim() === 'true'
		},
		photos,
		ads: Array.isArray(payload?.ads) ? payload.ads : []
	};
}

export function filterGalleryPhotos(photos, query) {
	const safePhotos = Array.isArray(photos) ? photos : [];
	const normalizedQuery = normalizeSearchTerm(query);

	if (!normalizedQuery) {
		return safePhotos;
	}

	if (isUntaggedQuery(normalizedQuery)) {
		return safePhotos.filter((photo) => !photo.isTagged);
	}

	return safePhotos.filter((photo) => {
		if (photo.code.toLowerCase().includes(normalizedQuery)) {
			return true;
		}

		return photo.bibs.some((bib) => bib === normalizedQuery);
	});
}

export async function loadEventGallery(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	const eventId = String(options.eventId ?? '').trim();
	const page = toPositiveInt(options.page ?? 1, 1);
	const pageSize = toPositiveInt(options.pageSize ?? EVENT_GALLERY_PAGE_SIZE, EVENT_GALLERY_PAGE_SIZE);
	const query = normalizeSearchTerm(options.query);

	if (!eventId) {
		return {
			datasourceUrl: '',
			event: null,
			photos: [],
			pagination: {
				page: 1,
				pageSize,
				totalItems: 0,
				totalPages: 1,
				hasPreviousPage: false,
				hasNextPage: false
			},
			progressive: {
				nextPage: null,
				canLoadMore: false
			}
		};
	}

	const resolvedDatasourceUrl = resolveEventGalleryDatasource(eventId, options);
	let payload;
	let datasourceUrl = resolvedDatasourceUrl;

	try {
		payload = await dataClient(resolvedDatasourceUrl);
	} catch (error) {
		const defaultDatasourceUrl = `/assets/datasources/${eventId}.json`;
		if (resolvedDatasourceUrl !== defaultDatasourceUrl && !options.datasourceUrl) {
			datasourceUrl = defaultDatasourceUrl;
			try {
				payload = await dataClient(defaultDatasourceUrl);
			} catch {
				datasourceUrl = buildLocalEventGalleryUrl(eventId);
				payload = await dataClient(datasourceUrl);
			}
		} else {
			datasourceUrl = buildLocalEventGalleryUrl(eventId);
			try {
				payload = await dataClient(datasourceUrl);
			} catch {
				throw error;
			}
		}
	}

	const mapped = mapLegacyEventGalleryPayload(eventId, payload);
	const filteredPhotos = filterGalleryPhotos(mapped.photos, query);
	const totalItems = filteredPhotos.length;
	const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;

	return {
		datasourceUrl,
		event: mapped.event,
		photos: filteredPhotos.slice(start, end),
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