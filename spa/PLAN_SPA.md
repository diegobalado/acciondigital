# Plan SPA - Accion Digital (Svelte + Vite)

Documento de referencia para migrar de forma incremental el frontend legacy a una SPA en Svelte.

## Objetivo

- Crear una SPA moderna en `spa/` manteniendo la app legacy operativa durante la migracion.
- Migrar por features/paginas, con paridad funcional y pruebas unitarias.

## Reglas de trabajo

1. Cada iteracion debe tener alcance pequeno y verificable.
2. Cada iteracion debe actualizar este plan y `PROGRESO_SPA.md`.
3. Cada iteracion debe cerrar con commit en `spa-svelte-migration`.
4. Cada feature relevante migrada debe incluir tests unitarios.
5. Priorizar mantenibilidad antes que optimizacion.

## Acuerdos operativos (continuidad)

1. Trabajar siempre sobre la branch `spa-svelte-migration`.
2. Mantener la migracion aislada dentro de `spa/` salvo necesidad explicita de integrar con legacy.
3. No romper el sitio legacy durante la migracion.
4. Cada iteracion debe ser pequena, verificable y con commit propio.
5. En cada iteracion correr validaciones minimas en `spa/`:
	- `pnpm test`
	- `pnpm build`
6. Registrar al cierre de cada iteracion:
	- Cambios realizados
	- Tests agregados/actualizados
	- Resultado de verificaciones
	- Proximo paso
7. Al finalizar iteracion: `git add` + `git commit` + `git push`.

## Definicion de iteracion (DoD)

Una iteracion se considera cerrada solo si cumple todo lo siguiente:

1. Objetivo funcional concreto completado.
2. Tests unitarios relevantes creados/ajustados.
3. `PLAN_SPA.md` y `PROGRESO_SPA.md` actualizados.
4. `pnpm test` y `pnpm build` en verde.
5. Commit y push en `spa-svelte-migration`.

## Estado actual de arranque

1. Branch activa de migracion creada: `spa-svelte-migration`.
2. SPA base creada en `spa/` con Svelte + Vite.
3. Testing base configurado con Vitest.
4. Documentos de seguimiento creados y versionados.
5. Primer commit de bootstrap ya publicado.

## Fases

### Fase 0 - Setup base

- [x] Crear branch `spa-svelte-migration`.
- [x] Inicializar proyecto `Svelte + Vite` en `spa/`.
- [x] Configurar stack de testing (Vitest + Testing Library).
- [x] Crear documentos `PLAN_SPA.md` y `PROGRESO_SPA.md`.

### Fase 1 - Infra compartida

- [x] Definir estructura base de carpetas (`app`, `features`, `shared`, `services`).
- [x] Implementar cliente de datos para JSON legacy.
- [x] Definir capa de mapeo de modelos (legacy -> SPA).
- [x] Tests unitarios de utilidades y mapeos.

#### Proxima iteracion sugerida (Fase 1.1)

1. Iteracion cerrada el 2026-03-07:
	- estructura base creada (`app`, `features/home`, `services`, `shared/models`)
	- `legacyDataClient` inicial implementado
	- mapeo base de home implementado (`mapLegacyHomeEvent`)
	- tests unitarios de helper y mapeo agregados
2. Proxima iteracion sugerida (Fase 2.1):
	- comenzar migracion de vista Home con estados `loading`, `error` y `empty`
	- conectar carga de `inicio.json` via `legacyDataClient`
	- renderizar primer listado minimo de eventos mapeados
	- tests unitarios del flujo de carga y render inicial

### Fase 2 - Home

- [x] Migrar vista de inicio y listado de eventos.
- [x] Soportar modo mirror (`mirror=home5`).
- [x] Tests unitarios para render y estados vacios/error.

#### Proxima iteracion sugerida (Fase 2.2)

1. Iteracion cerrada el 2026-03-07:
	- soporte `mirror=home5` en datasource de Home
	- integracion inicial de ads en feed de Home
	- tests de mirror y helper de insercion de ads
2. Iteracion cerrada el 2026-03-08 (Fase 2.3):
	- render Home aproximado al template legacy `inicioTemplate.htm` (thumb + etiqueta)
	- tracking desacoplado para clic en eventos/ads (`homeTracking`)
	- contrato de card reutilizable para futuras secciones (`MediaCard`)
	- tests unitarios de tracking e integracion de Home actualizados
3. Proxima iteracion sugerida (Fase 3.1):
	- iniciar migracion de pagina `eventos` con carga de datasource legacy
	- definir mapper base para cards de evento/galeria
	- incorporar estado inicial de paginacion (page 1) sin infinite scroll
	- tests unitarios del mapper y de estados `loading/error/empty`
4. Iteracion cerrada el 2026-03-08 (Fase 3.1):
	- nueva feature `events` con mapper, API y `EventsPage`
	- paginacion inicial implementada en catalogo de eventos
	- ruteo SPA minimo por `pathname` para `/eventos`
	- tests unitarios de mapper, API y pagina de eventos
5. Proxima iteracion sugerida (Fase 3.2):
	- incorporar insercion de ads en la grilla de `eventos`
	- preparar contrato para paginado progresivo (base de infinite scroll)
	- agregar tracking desacoplado de clics en cards de eventos
	- cubrir nuevos helpers con tests unitarios

### Fase 3 - Eventos/Galeria

- [ ] Migrar pagina de eventos y grilla de fotos.
- [ ] Migrar paginacion/infinite scroll.
- [ ] Migrar insercion de ads.
- [ ] Tests unitarios de helpers de paginado/render.

### Fase 4 - Busqueda

- [ ] Migrar buscador (por numero y sin clasificar).
- [ ] Preservar comportamiento actual en eventos y mirror.
- [ ] Tests unitarios de filtros y edge cases.

### Fase 5 - Carrito/Checkout

- [ ] Encapsular logica de carrito en servicios SPA.
- [ ] Mantener integracion con checkout PHP existente.
- [ ] Tests unitarios de payloads y reglas de compra.

### Fase 6 - Secciones secundarias

- [ ] Migrar amigos.
- [ ] Migrar faq.
- [ ] Migrar contacto.
- [ ] Tests unitarios de componentes clave.

### Fase 7 - Auth

- [ ] Migrar pantallas auth necesarias (si aplica al alcance SPA).
- [ ] Mantener compatibilidad con endpoints PHP actuales.
- [ ] Tests unitarios de logica de formularios/mapeos.

### Fase 8 - Hardening

- [ ] Verificar paridad funcional contra legacy.
- [ ] Revisar cobertura y completar gaps.
- [ ] Preparar deploy de SPA (GitHub Pages / cloud target).

## Convencion de commits

- `chore(spa): ...` para setup/infrastructura.
- `feat(spa-<feature>): ...` para migraciones funcionales.
- `test(spa-<feature>): ...` para iteraciones de pruebas.
- `docs(spa): ...` para cambios en plan/progreso.

## Comandos utiles

Ejecutar desde `spa/`:

- `pnpm install`
- `pnpm dev`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm build`
