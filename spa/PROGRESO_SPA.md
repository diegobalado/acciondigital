# Progreso SPA - Accion Digital

Registro iterativo de avances de la migracion SPA.

## Iteracion 0 - Bootstrap SPA

- Fecha: 2026-03-07
- Branch: `spa-svelte-migration`
- Objetivo: iniciar base tecnica para migracion incremental.

### Hecho

- Proyecto Svelte + Vite creado en `spa/`.
- Stack de tests instalado: `vitest`, `@testing-library/svelte`, `jsdom`, `@vitest/coverage-v8`.
- Configuracion de tests agregada en `vite.config.js` y scripts npm.
- Test inicial agregado: `src/App.test.js`.
- Placeholder inicial de app para migracion (`src/App.svelte`).
- Documentacion de plan/progreso creada (`PLAN_SPA.md`, `PROGRESO_SPA.md`).

### Verificacion

- `npm run test`: OK.
- `npm run build`: OK.

### Proximo paso

- Fase 1: definir estructura de carpetas y primer cliente de datos para JSON legacy.

## Iteracion 1 - Infra compartida (Fase 1.1)

- Fecha: 2026-03-07
- Branch: `spa-svelte-migration`
- Objetivo: cerrar infraestructura inicial para consumo de datos legacy y mapeo de modelo home.

### Hecho

- Estructura base agregada:
	- `src/app/config/`
	- `src/features/home/`
	- `src/services/`
	- `src/shared/models/`
- Cliente inicial de datos legacy implementado: `src/services/legacyDataClient.js`.
- Helper de normalizacion agregado: `src/shared/models/legacyNormalization.js`.
- Mapeo inicial de home implementado: `src/features/home/homeModelMapper.js`.
- Tests unitarios agregados:
	- `src/shared/models/legacyNormalization.test.js`
	- `src/features/home/homeModelMapper.test.js`
	- `src/app/config/migration.test.js` (reubicacion desde `src/shared/` a `src/app/config/`)

### Verificacion

- `npm run test`: OK (3 files, 5 tests).
- `npm run build`: OK.

### Proximo paso

- Fase 2.1: iniciar migracion de Home con carga real de `inicio.json`, estados de UI y pruebas de render.

## Iteracion 3 - Home base (Fase 2.1)

- Fecha: 2026-03-07
- Branch: `spa-svelte-migration`
- Objetivo: implementar flujo inicial de Home con carga real de `inicio.json` y estados de UI.

### Hecho

- Nueva API de Home: `src/features/home/homeApi.js`.
	- lectura de `inicio.json` via `legacyDataClient`
	- mapeo de `eventos` con `mapLegacyHomeEvent`
- Mapper Home ajustado al formato real legacy (`ID`, `text`, `ph`) con fallback de URL.
- Componente de Home inicial agregado: `src/features/home/HomePage.svelte`.
	- estados: `loading`, `error`, `empty`, `ready`
	- render inicial de listado de eventos
- `App.svelte` actualizado para montar `HomePage`.
- Ajuste de `vite.config.js` para tests de componentes Svelte en entorno browser (`resolve.conditions`).

### Tests unitarios

- `src/features/home/homeApi.test.js`
- `src/features/home/HomePage.test.js`
- `src/features/home/homeModelMapper.test.js` actualizado

### Verificacion

- `pnpm test`: OK (5 files, 12 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 2.2: soporte `mirror=home5`, estructura visual mas cercana a legacy e insercion inicial de ads.

## Iteracion 2 - Tooling pnpm

- Fecha: 2026-03-07
- Branch: `spa-svelte-migration`
- Objetivo: unificar el package manager de la SPA en `pnpm`.

### Hecho

- Migracion de lockfile: eliminado `package-lock.json` y generado `pnpm-lock.yaml`.
- `package.json` actualizado con `packageManager: pnpm@10.30.3`.
- `PLAN_SPA.md` actualizado para ejecutar validaciones con `pnpm`.

### Verificacion

- `pnpm test`: OK (3 files, 5 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 2.1: iniciar migracion de Home con carga real de `inicio.json`, estados de UI y pruebas de render.
