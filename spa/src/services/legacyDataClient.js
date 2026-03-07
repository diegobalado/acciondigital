export class LegacyDataClientError extends Error {
	constructor(message, options = {}) {
		super(message);
		this.name = 'LegacyDataClientError';
		this.status = options.status;
		this.cause = options.cause;
	}
}

export async function fetchLegacyJson(url, fetchImpl = fetch) {
	try {
		const response = await fetchImpl(url);

		if (!response.ok) {
			throw new LegacyDataClientError(`Legacy request failed: ${response.status}`, {
				status: response.status
			});
		}

		return await response.json();
	} catch (error) {
		if (error instanceof LegacyDataClientError) {
			throw error;
		}

		throw new LegacyDataClientError('Unable to fetch legacy JSON datasource', {
			cause: error
		});
	}
}