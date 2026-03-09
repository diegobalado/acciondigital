# Progreso SPA - Accion Digital

Registro iterativo de avances de la migracion SPA.

## Iteracion 7 - Eventos ads+tracking+progresivo (Fase 3.2)

- Fecha: 2026-03-08
- Branch: `spa-svelte-migration`
- Objetivo: incorporar ads y tracking en eventos, y preparar base de paginado progresivo.

### Hecho

- Nuevos modulos en `src/features/events/`:
	- `eventsFeed.js` para feed mixto (eventos + ads)
	- `eventsTracking.js` para tracking desacoplado de clics
	- `eventsPagination.js` con helper de merge para carga progresiva
- `eventsApi.js` extendida:
	- mapeo de ads legacy
	- retorno de `feed` mixto por pagina
	- contrato `progressive` (`nextPage`, `canLoadMore`)
- `EventsPage.svelte` actualizada:
	- render de feed mixto via `MediaCard`
	- tracking inyectable de clics en eventos/ads
	- paginacion progresiva base con boton `Cargar mas`
- Tests unitarios agregados/actualizados:
	- `eventsFeed.test.js`
	- `eventsTracking.test.js`
	- `eventsPagination.test.js`
	- `eventsApi.test.js`
	- `EventsPage.test.js`

### Verificacion

- `pnpm test`: OK (13 files, 40 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 3.3: migrar de boton `Cargar mas` a infinite scroll y cubrir edge cases de anexado.

## Iteracion 6 - Eventos base (Fase 3.1)

- Fecha: 2026-03-08
- Branch: `spa-svelte-migration`
- Objetivo: iniciar migracion de pagina `eventos` con datasource legacy, mapper y paginacion inicial.

### Hecho

- Nueva feature `events` agregada en `src/features/events/`:
	- `eventsModelMapper.js`
	- `eventsApi.js`
	- `EventsPage.svelte`
- Catalogo de eventos conectado a `galeria.json` con mapeo legacy (`ID`/`text`).
- Paginacion inicial implementada (page/pageSize/totalPages) con botones `Anterior`/`Siguiente`.
- `App.svelte` actualizado para ruteo minimo por `pathname`:
	- `/eventos` renderiza `EventsPage`
	- resto de paths renderiza `HomePage`
- Ajuste de entorno dev en `vite.config.js`:
	- middleware `legacy-assets-bridge` para servir `/assets/*` desde la carpeta legacy real
	- Home deja de caer en estado de error por 404 de `inicio.json` durante `pnpm dev`
- Tests unitarios agregados:
	- `src/features/events/eventsModelMapper.test.js`
	- `src/features/events/eventsApi.test.js`
	- `src/features/events/EventsPage.test.js`

### Verificacion

- `pnpm test`: OK (10 files, 32 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 3.2: agregar ads en feed de eventos + tracking desacoplado + base de paginado progresivo.

## Iteracion 5 - Home visual+tracking (Fase 2.3)

- Fecha: 2026-03-08
- Branch: `spa-svelte-migration`
- Objetivo: acercar Home al template legacy, desacoplar tracking y definir card reutilizable.

### Hecho

- Nuevo componente reutilizable `MediaCard` en `src/shared/components/MediaCard.svelte`.
- Home actualizada en `src/features/home/HomePage.svelte`:
	- render de feed con contrato de card reutilizable
	- estructura visual alineada con legacy (imagen + etiqueta)
	- tracking de clic desacoplado via adaptador inyectable
- Modulo de tracking agregado en `src/features/home/homeTracking.js`.
- Mapper Home ajustado para fallback de miniatura legacy por `ID`:
	- `thumbnailUrl` en `src/features/home/homeModelMapper.js`.
- Tests unitarios agregados/actualizados:
	- `src/features/home/homeTracking.test.js`
	- `src/features/home/HomePage.test.js`
	- `src/features/home/homeApi.test.js`
	- `src/features/home/homeModelMapper.test.js`

### Verificacion

- `pnpm test`: OK (7 files, 23 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 3.1: iniciar migracion de `eventos` con datasource legacy, mapper base y paginacion inicial.

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

## Iteracion 4 - Home mirror+ads (Fase 2.2)

- Fecha: 2026-03-07
- Branch: `spa-svelte-migration`
- Objetivo: agregar soporte inicial de `mirror=home5` e integracion de ads en el listado Home.

### Hecho

- API Home extendida en `src/features/home/homeApi.js`:
	- resolucion de datasource por query param (`inicio.json` vs `mirror/home-5/inicio.5.json`)
	- mapeo inicial de ads legacy (`name`, `href`, `target`, `imageUrl`)
	- retorno de `feed` mixto (eventos + ads)
- Helper de insercion agregado: `src/features/home/homeFeed.js`.
- Home actualizada para render de feed mixto en `src/features/home/HomePage.svelte`.
- Tests unitarios agregados/actualizados:
	- `src/features/home/homeFeed.test.js`
	- `src/features/home/homeApi.test.js` (mirror + ads)
	- `src/features/home/HomePage.test.js` (render de ads)

### Verificacion

- `pnpm test`: OK (6 files, 19 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 2.3: aproximar estructura visual de Home a template legacy y desacoplar tracking de clics.

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
