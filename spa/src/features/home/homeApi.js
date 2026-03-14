import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyHomeEvent } from './homeModelMapper';
import { buildHomeFeed } from './homeFeed';
import { LOCAL_EVENTS_CATALOG_URL } from '../events/eventsApi';

export const HOME_DATASOURCE_URL = '/assets/datasources/inicio.json';
export const HOME_MIRROR_5_DATASOURCE_URL = '/assets/datasources/mirror/home-5/inicio.5.json';

function appendMirrorParam(url) {
	if (!url) {
		return '';
	}

	return url.includes('?') ? `${url}&mirror=home5` : `${url}?mirror=home5`;
}

function mapLegacyHomeAd(ad, index) {
	const href = ad?.href || '#';

	return {
		id: ad?.id || ad?.name || `ad_${index}`,
		name: ad?.name || '',
		href,
		target: href === '#' ? '_self' : '_blank',
		imageUrl: ad?.name ? `/assets/images/ads/${ad.name}` : ''
	};
}

export function resolveHomeDatasourceUrl(search = '') {
	const params = new URLSearchParams(search);
	return params.get('mirror') === 'home5' ? HOME_MIRROR_5_DATASOURCE_URL : HOME_DATASOURCE_URL;
}

async function tryLoadLocalCatalogPayload(dataClient) {
	try {
		return await dataClient(LOCAL_EVENTS_CATALOG_URL);
	} catch {
		return null;
	}
}

export async function loadHomeContent(options = {}) {
	const dataClient = options.dataClient || fetchLegacyJson;
	const search = options.search || '';
	const datasourceUrl = resolveHomeDatasourceUrl(search);
	const payload = await dataClient(datasourceUrl);
	const localPayload = await tryLoadLocalCatalogPayload(dataClient);
	const legacyEvents = Array.isArray(localPayload?.eventos) && localPayload.eventos.length > 0
		? localPayload.eventos
		: Array.isArray(payload?.eventos)
			? payload.eventos
			: [];
	const ads = Array.isArray(payload?.ads) ? payload.ads.map(mapLegacyHomeAd) : [];
	const isMirrorHome5 = datasourceUrl === HOME_MIRROR_5_DATASOURCE_URL;
	const events = legacyEvents.map(mapLegacyHomeEvent).map((event) => {
		if (!isMirrorHome5) {
			return event;
		}

		return {
			...event,
			eventUrl: appendMirrorParam(event.eventUrl)
		};
	});

	return {
		datasourceUrl,
		events,
		ads,
		feed: buildHomeFeed(events, ads)
	};
}