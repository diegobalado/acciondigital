import { APP_SUBTITLE, APP_TITLE, buildMigrationBanner } from './migration';

describe('app migration config', () => {
	it('builds the expected banner text', () => {
		expect(buildMigrationBanner(APP_TITLE, APP_SUBTITLE)).toBe(
			'Accion Digital SPA - Migracion incremental en progreso.'
		);
	});
});