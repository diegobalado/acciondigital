# Plan SPA - Accion Digital (Svelte + Vite)

Documento de referencia para migrar de forma incremental el frontend legacy a una SPA en Svelte.

## Objetivo

- Crear una SPA moderna en `spa/` manteniendo la app legacy operativa durante la migracion.
- Migrar por features/paginas, con paridad funcional y pruebas unitarias.

## Decisiones de arquitectura

### Librería de componentes UI
- **Seleccionada: DaisyUI 5** (plugin de Tailwind 4, dev dependency).
- Criterios: compatibilidad nativa con Tailwind 4, cero JS en runtime, instalación trivial, no interfiere con componentes Svelte existentes.
- **shadcn-svelte** queda reservado para fases futuras si se necesitan componentes interactivos accesibles (modals, drawers, formularios complejos).
- Fecha de decisión: 2026-03-21.

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

## Directivas de ejecucion de comandos (tokens)

1. Para optimizar consumo de tokens, priorizar ejecucion manual local de:
	- `pnpm test`
	- `pnpm build`
	- comandos de Git (`git status`, `git commit`, `git push`, etc.)
2. En el chat, reportar resultados en formato resumido:
	- `pnpm test OK` / `pnpm build OK`
	- o errores puntuales con archivo, test y mensaje principal
3. Compartir solo logs relevantes cuando haya fallos (evitar pegar salidas completas largas).
4. El agente ejecutara comandos directamente solo cuando sea necesario para:
	- diagnosticar un fallo que requiera contexto adicional
	- validar un fix puntual antes de cerrar iteracion
	- cumplir una solicitud explicita del usuario

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
6. Iteracion cerrada el 2026-03-08 (Fase 3.2):
	- feed mixto de `eventos` (eventos + ads) con helper dedicado
	- tracking desacoplado para cards de `eventos` y publicidades
	- paginado progresivo base con contrato `progressive` y boton `Cargar mas`
	- tests unitarios de feed, tracking, paginacion y pagina `EventsPage`
7. Proxima iteracion sugerida (Fase 3.3):
	- reemplazar boton `Cargar mas` por disparador de scroll (infinite scroll)
	- incorporar placeholders/skeleton durante carga incremental
	- validar deduplicacion de items al anexar paginas
	- tests de comportamiento incremental y edge cases de final de listado
8. Iteracion cerrada el 2026-03-14 (Fase 3.3):
	- `EventsPage` migro de boton a `infinite scroll` con `IntersectionObserver`
	- placeholders/skeleton agregados durante carga incremental de paginas
	- deduplicacion de items implementada al anexar feed progresivo
	- tests unitarios ampliados para flujo incremental y edge cases de merge
9. Proxima iteracion sugerida (Fase 4.1):
	- iniciar migracion de busqueda por `bib/numero` sobre catalogo de eventos
	- definir API de busqueda desacoplada para datasource legacy inicial
	- incorporar estado UI de busqueda (idle/loading/empty/error)
	- tests unitarios de filtros y edge cases de entrada
10. Iteracion cerrada el 2026-03-14 (Fase 4.1):
	- API desacoplada de busqueda inicial en eventos (`searchEventsCatalog`)
	- UI de busqueda por `bib/numero` integrada en `EventsPage`
	- estados de busqueda implementados: `idle/loading/empty/error`
	- tests unitarios agregados para API y flujo de UI de busqueda
11. Proxima iteracion sugerida (Fase 4.2):
	- incorporar comportamiento `sin clasificar` y paridad de filtros del legacy
	- contemplar variaciones de datasource por `mirror` para busqueda
	- agregar tracking desacoplado de acciones de busqueda
	- ampliar tests con casos de mirror/sin clasificar
12. Iteracion cerrada el 2026-03-14 (UI/Tailwind gradual):
	- limpieza incremental de estilos repetidos en `HomePage` y `EventsPage`
	- migracion de layout/spacing/typography a clases utilitarias Tailwind
	- reduccion de CSS local redundante manteniendo funcionalidad existente
13. Iteracion cerrada el 2026-03-14 (Fase 4.2):
	- soporte `mirror=home5` en datasource de catalogo y busqueda de eventos
	- compatibilidad de alias `sin clasificar` (`untagged`) en buscador
	- tracking desacoplado de acciones de busqueda (submit/result/clear)
	- tests unitarios ampliados para mirror/sin clasificar/tracking
14. Proxima iteracion sugerida (Fase 5.1):
	- iniciar encapsulacion de carrito en servicios SPA
	- definir contrato de items y mapeo a payload de checkout legacy
	- agregar pruebas de reglas base de carrito (agregar/remover/cantidad)
	- preparar puente inicial hacia checkout PHP existente
15. Iteracion cerrada el 2026-03-14 (Fase 5.1):
	- servicio base de carrito encapsulado en `src/services/cartService.js`
	- contrato de item y reglas base (`add/remove/update quantity`) implementadas
	- puente a checkout legacy en `src/services/checkoutBridge.js`
	- tests unitarios agregados para reglas de carrito y payload a `/checkout/index.php`
16. Proxima iteracion sugerida (Fase 5.2):
	- integrar carrito SPA en UI de grilla de fotos/eventos
	- mostrar resumen de carrito y acciones de remove/update
	- conectar submit de checkout al bridge de payload legacy
	- cubrir flujo de integracion UI + servicio con tests
17. Iteracion cerrada el 2026-03-14 (Fase 5.2):
	- carrito integrado en `EventsPage` con acciones `agregar`, `quitar` y `cantidad`
	- resumen de carrito y total derivados desde `cartService`
	- accion `Ir al checkout` conectada al `checkoutBridge` legacy
	- tests de integracion UI + bridge agregados en `EventsPage` y `checkoutBridge`
18. Proxima iteracion sugerida (Fase 5.3):
	- integrar carrito en pagina de fotos por evento (nivel imagen)
	- mapear campos `summary/ph/type` con mayor paridad legacy
	- robustecer submit legacy en backend bridge (form-data/transport real)
	- ampliar tests end-to-end de flujo compra SPA->checkout
19. Iteracion cerrada el 2026-03-14 (Fase 5.3):
	- nueva pagina de galeria por evento con carga paginada de fotos y busqueda por bib/untagged
	- carrito integrado a nivel imagen con campos `summary/ph/type` alineados a legacy
	- `checkoutBridge` robustecida con submit real via `form POST` nested compatible con PHP
	- tests unitarios/integracion agregados para API, UI de galeria y bridge legacy
20. Iteracion cerrada el 2026-03-14 (UI/Tailwind compartida):
	- nueva capa minima `src/shared/ui/classes.js` para layout/form/panel/status/actions
	- `MediaCard` alineada a Tailwind y sin CSS local redundante
	- limpieza incremental extendida a `HomePage`, `EventsPage` y `EventGalleryPage`
21. Iteracion cerrada el 2026-03-14 (fallback local de galerias para testing):
	- endpoints dev-only en Vite para indexar eventos reales desde `../assets/images/eventos`
	- fallback local aplicado a Home, catalogo de eventos y detalle de galeria
	- navegacion SPA preparada para testear con assets realmente presentes en la carpeta padre
22. Proxima iteracion sugerida (Fase 6.1):
	- iniciar migracion de seccion `amigos`
	- definir consumo de datasource y estructura de cards/seccion
	- preservar estilo visual consistente con SPA actual
	- agregar tests unitarios de render/estados basicos
23. Iteracion iniciada el 2026-03-15 (Fase 6.1):
	- feature `amigos` creada con `amigosApi`, `amigosModelMapper` y `AmigosPage`
	- ruta `/amigos` integrada en `App.svelte`
	- tests unitarios base agregados para mapper, API y pagina
	- pendiente cierre de iteracion tras validacion manual (`pnpm test` + `pnpm build`)
24. Proxima iteracion sugerida (Fase 6.2):
	- iniciar migracion de seccion `faq`
	- definir mapper/API de preguntas frecuentes y estados base de UI
	- mantener consistencia visual con `shared/ui/classes.js`
	- agregar tests unitarios de render/estados y casos vacios

### Fase 3 - Eventos/Galeria

- [x] Migrar pagina de eventos y grilla de fotos.
- [x] Migrar paginacion/infinite scroll.
- [x] Migrar insercion de ads.
- [x] Tests unitarios de helpers de paginado/render.

### Fase 4 - Busqueda

- [x] Migrar buscador (por numero y sin clasificar).
- [x] Preservar comportamiento actual en eventos y mirror.
- [x] Tests unitarios de filtros y edge cases.

### Fase 5 - Carrito/Checkout

- [x] Encapsular logica de carrito en servicios SPA.
- [x] Mantener integracion con checkout PHP existente.
- [x] Tests unitarios de payloads y reglas de compra.

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
