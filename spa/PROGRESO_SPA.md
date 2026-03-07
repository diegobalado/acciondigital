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
