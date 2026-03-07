import { fetchLegacyJson } from '../../services/legacyDataClient';
import { mapLegacyHomeEvent } from './homeModelMapper';

export const HOME_DATASOURCE_URL = '/assets/datasources/inicio.json';

export async function loadHomeEvents(dataClient = fetchLegacyJson) {
	const payload = await dataClient(HOME_DATASOURCE_URL);
	const legacyEvents = Array.isArray(payload?.eventos) ? payload.eventos : [];

	return legacyEvents.map(mapLegacyHomeEvent);
}