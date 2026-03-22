# Progreso SPA - Accion Digital

Registro iterativo de avances de la migracion SPA.

## Iteracion 23 - Refactor de ruteo SPA (infra)

- Fecha: 2026-03-22
- Branch: `spa-svelte-migration`
- Objetivo: reducir complejidad de `App.svelte` centralizando el matching de rutas sin introducir libreria externa.

### Hecho

- Nuevo modulo de ruteo `src/app/routing/routes.js`:
	- contrato `APP_ROUTES`
	- resolver `resolveAppRoute` para `pathname + search`
	- helper `resolveAppRouteFromWindow`
- `App.svelte` simplificado:
	- deja de usar multiples flags por pathname
	- renderiza vistas por route key (`home/events/event-gallery/amigos/faq/contacto`)
- Tests unitarios agregados:
	- `src/app/routing/routes.test.js` con casos de rutas conocidas, fallback y query de galeria (`?id`/`?g`)

### Verificacion

- Validacion estatico/sintactica: pendiente (`get_errors` tras editar).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Fase 6.5: implementar barra de navegacion compartida SPA apoyada en el contrato de rutas centralizado.

## Iteracion 22 - Contacto base (Fase 6.4)

- Fecha: 2026-03-22
- Branch: `spa-svelte-migration`
- Objetivo: iniciar migracion de `contacto` con ruta SPA, carga desacoplada y estados base de UI.

### Hecho

- Nueva feature `src/features/contacto/`:
	- `contactoModelMapper.js` para normalizar contrato legacy -> SPA
	- `contactoApi.js` con carga desde `/assets/datasources/contacto.json` y fallback embedded al contenido legacy de `contacto/index.php`
	- `ContactoPage.svelte` con estados `loading/error/empty/ready`, enlaces sociales y formulario apuntando al endpoint legacy
- Ruteo SPA actualizado en `App.svelte`:
	- soporte de `/contacto` y `/contacto/`
- Tests unitarios agregados:
	- `contactoModelMapper.test.js`
	- `contactoApi.test.js`
	- `ContactoPage.test.js`

### Verificacion

- Validacion estatico/sintactica: pendiente (`get_errors` tras editar).
- `pnpm test`: OK (ejecucion manual usuario).
- `pnpm build`: OK (ejecucion manual usuario).

### Proximo paso

- Continuar con Fase 6.5: navegacion compartida SPA para secciones secundarias.

## Iteracion 21 - FAQ base (Fase 6.2)

- Fecha: 2026-03-22
- Branch: `spa-svelte-migration`
- Objetivo: iniciar migracion de `faq` con ruta SPA, carga desacoplada y estados base de UI.

### Hecho

- Nueva feature `src/features/faq/`:
	- `faqModelMapper.js` para normalizar contrato legacy -> SPA
	- `faqApi.js` con carga desde `/assets/datasources/faq.json` y fallback embedded al contenido FAQ legacy
	- `FaqPage.svelte` con estados `loading/error/empty/ready` y acordeon basico de preguntas
- Ruteo SPA actualizado en `App.svelte`:
	- soporte de `/faq` y `/faq/`
- Tests unitarios agregados:
	- `faqModelMapper.test.js`
	- `faqApi.test.js`
	- `FaqPage.test.js`

### Verificacion

- Validacion estatico/sintactica: pendiente (`get_errors` tras editar).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Ejecutar validaciones manuales (`pnpm test` y `pnpm build`) y continuar con Fase 6.4 (`contacto`).

## Iteracion 20 - Estandar de iconos con Lucide (Fase 6.3 UI)

- Fecha: 2026-03-21
- Branch: `spa-svelte-migration`
- Objetivo: definir libreria oficial de iconos e integrarla en lightbox de galeria.

### Hecho

- Dependencia `lucide-svelte` instalada en `spa/package.json`.
- `EventGalleryPage.svelte` actualizado para usar iconos Lucide en lightbox:
	- `ChevronLeft` (anterior)
	- `ChevronRight` (siguiente)
	- `X` (cerrar)
- `PLAN_SPA.md` actualizado con decision de arquitectura para libreria de iconos.
- `AGENTS.md` actualizado con reglas de desarrollo UI:
	- todos los nuevos iconos deben usar `lucide-svelte`
	- todos los nuevos componentes deben usar TailwindCSS + DaisyUI

### Verificacion

- Validacion estatico/sintactica: pendiente (`get_errors` tras editar).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Ejecutar validaciones manuales (`pnpm test` y `pnpm build`) y continuar con Fase 6.2 (`faq`).

## Iteracion 19 - Lightbox en galeria (Fase 6.3)

- Fecha: 2026-03-21
- Branch: `spa-svelte-migration`
- Objetivo: completar UX de lightbox en galeria de evento y cubrir flujo con tests unitarios.

### Hecho

- Lightbox de `EventGalleryPage` validado en flujo completo:
	- apertura por click sobre miniatura
	- navegacion `anterior/siguiente`
	- cierre por boton y por `Escape`
	- cierre por click en backdrop y no cierre al click sobre contenido interno
- Tests de `EventGalleryPage.test.js` ampliados para cubrir:
	- navegacion por teclado (`ArrowLeft`/`ArrowRight`)
	- navegacion por botones (`prev`/`next`) y wrap-around
	- cierre por boton, backdrop y teclado

### Verificacion

- Validacion estatico/sintactica: pendiente (`get_errors` tras editar).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Ejecutar validaciones manuales (`pnpm test` y `pnpm build`) y continuar con Fase 6.2 (`faq`) o cierre de pendientes de Fase 6.1.

## Iteracion 18 - Amigos base (Fase 6.1)

- Fecha: 2026-03-15
- Branch: `spa-svelte-migration`
- Objetivo: iniciar migracion de `amigos` con ruta SPA, carga desacoplada y estados base de UI.

### Hecho

- Nueva feature `src/features/amigos/`:
	- `amigosModelMapper.js` para normalizar contrato legacy -> SPA
	- `amigosApi.js` con carga desde `/assets/datasources/amigos.json` y fallback embedded al contenido legacy conocido
	- `AmigosPage.svelte` con estados `loading/error/empty/ready` y cards de paginas amigas
- Ruteo SPA actualizado en `App.svelte`:
	- soporte de `/amigos` y `/amigos/`
- Tests unitarios agregados:
	- `amigosModelMapper.test.js`
	- `amigosApi.test.js`
	- `AmigosPage.test.js`

### Verificacion

- Validacion estatico/sintactica: OK (`get_errors`).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Ejecutar validaciones manuales (`pnpm test` y `pnpm build`) y verificar navegacion visual en `/amigos` con `pnpm dev`.

## Iteracion 17 - Ajuste de grilla en galeria

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: asegurar visualizacion en grilla responsive en la pagina de galeria.

### Hecho

- `EventGalleryPage.svelte` ajustada para usar clases de grilla explicitas en `gallery-list`:
	- `grid-cols-1` en mobile
	- `sm:grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4`
- Cards de foto acotadas en mobile para evitar efecto de lista de ancho completo.
- Correccion de alcance: `HomePage.svelte` tambien ajustada para renderizar el feed en grilla responsive (no lista vertical).

### Verificacion

- Validacion estatico/sintactica del archivo modificado: OK (`get_errors`).
- Verificacion visual manual: pendiente en navegador (`pnpm dev`).

### Proximo paso

- Confirmar visualmente el comportamiento en mobile/desktop y continuar con Fase 6.1 (`amigos`).

## Iteracion 16 - Fallback local de eventos/galerias para testing

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: permitir navegar y abrir eventos reales desde la SPA usando el contenido disponible en la carpeta padre durante desarrollo local.

### Hecho

- `vite.config.js` extendido con endpoints locales de desarrollo:
	- `/__legacy/events-index.json` lista galerias reales desde `../assets/images/eventos`
	- `/__legacy/event-gallery.json?id=...` construye una galeria a partir del filesystem cuando no existe JSON legacy
- Fallback local integrado en:
	- `src/features/events/eventsApi.js` para catalogo y busqueda
	- `src/features/events/eventGalleryApi.js` para detalle de galeria
	- `src/features/home/homeApi.js` para que Home tambien enlace a eventos realmente navegables cuando existan
- Tests unitarios ampliados:
	- `eventsApi.test.js`
	- `eventGalleryApi.test.js`
	- `homeApi.test.js`

### Verificacion

- Validacion estatico/sintactica: pendiente de ejecutar tras editar.
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Verificar navegacion manual en `pnpm dev` sobre un evento real del filesystem y luego retomar Fase 6.1 (`amigos`).

## Iteracion 15 - Consolidacion UI Tailwind compartida

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: reducir duplicacion visual entre Home/Eventos/Galeria con una capa pequena de clases compartidas sobre Tailwind.

### Hecho

- Nuevo modulo `src/shared/ui/classes.js`:
	- tokens de clases para layout, formularios, estados, paneles y acciones frecuentes
	- reutilizacion simple via imports sin introducir una abstraccion pesada de componentes
- `MediaCard.svelte` migrada:
	- eliminacion del bloque `<style>` local
	- clases visuales expresadas con utilidades Tailwind
- Limpieza incremental aplicada en:
	- `HomePage.svelte`
	- `EventsPage.svelte`
	- `EventGalleryPage.svelte`
	- unificacion de contenedores, estados `loading/error/empty`, botones, paneles y grillas

### Verificacion

- Validacion estatico/sintactica de archivos modificados: pendiente (`get_errors` tras editar).
- `pnpm test`: ya validado manualmente antes de esta iteracion; conviene rerun manual corto al cerrar.
- `pnpm build`: ya validado manualmente antes de esta iteracion; conviene rerun manual corto al cerrar.

### Proximo paso

- Fase 6.1: iniciar migracion de `amigos` reutilizando esta base visual compartida.

## Iteracion 14 - Galeria por evento + checkout legacy real (Fase 5.3)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: llevar carrito al nivel de fotos por evento y completar submit legacy compatible con PHP.

### Hecho

- Nueva API `src/features/events/eventGalleryApi.js`:
	- carga de datasource por evento con soporte `mirror=home5`
	- mapeo de fotos legacy (`code`, `bibs`, `thumbnailUrl`, `fullImageUrl`)
	- filtro por bib/numero y alias `sin clasificar`
	- paginado progresivo base de fotos
- Nueva pagina `src/features/events/EventGalleryPage.svelte`:
	- ruta SPA por query `?id=` o `?g=` dentro de `/eventos`
	- busqueda de fotos por bib/untagged
	- carrito de fotos con `summary`, `ph`, `type` alineados a checkout legacy
	- submit al checkout via bridge legado
- `checkoutBridge.js` mejorada:
	- `submitLegacyCheckoutPayload` genera `form POST` con campos nested `products[index][field]`
	- compatibilidad real con `/checkout/index.php` en PHP
- Ajustes de navegacion:
	- `App.svelte` ahora distingue catalogo de eventos vs galeria por evento
	- `HomePage` y `EventsPage` preservan `mirror` al navegar a detalle
- Tests nuevos/actualizados:
	- `eventGalleryApi.test.js`
	- `EventGalleryPage.test.js`
	- `checkoutBridge.test.js` actualizado para submit nested

### Verificacion

- Validacion estatico/sintactica de archivos modificados: OK (`get_errors`).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Fase 6.1: iniciar migracion de `amigos`.

## Iteracion 13 - Carrito UI + submit checkout base (Fase 5.2)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: integrar servicios de carrito en UI de eventos y conectar accion de checkout al bridge legacy.

### Hecho

- `EventsPage.svelte` actualizada:
	- panel de carrito con resumen de items/total
	- acciones de carrito en UI: `Agregar al carrito`, `Quitar`, cambio de cantidad
	- submit `Ir al checkout` conectado a `createLegacyCheckoutPayload` + `submitLegacyCheckoutPayload`
	- manejo de estado de submit (`isCheckoutPending`) y error de checkout
- `checkoutBridge.js` extendida:
	- helper `submitLegacyCheckoutPayload` con adaptador inyectable para tests
	- fallback browser con `form POST` hacia `/checkout/index.php`
- Tests agregados/actualizados:
	- `EventsPage.test.js` cubre acciones de carrito y submit con bridge inyectado
	- `checkoutBridge.test.js` cubre submitter custom y fallback DOM

### Verificacion

- Validacion estatico/sintactica de archivos modificados: OK (`get_errors`).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Fase 5.3: llevar carrito al nivel de fotos por evento y completar paridad de campos de checkout.

## Iteracion 12 - Carrito service + checkout bridge (Fase 5.1)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: encapsular logica base de carrito y preparar puente de payload hacia checkout PHP legacy.

### Hecho

- Nuevo servicio `src/services/cartService.js`:
	- contrato normalizado de item de carrito
	- helpers de estado: `addCartItem`, `removeCartItem`, `updateCartItemQuantity`
	- calculo de totales con regla promo legacy (cantidad >= 5 => total 0)
- Nuevo servicio `src/services/checkoutBridge.js`:
	- mapeo de items SPA al formato esperado por `/checkout/index.php`
	- constructor de payload `POST` legacy (`products`, `totalPrice`)
- Tests unitarios agregados:
	- `src/services/cartService.test.js`
	- `src/services/checkoutBridge.test.js`

### Verificacion

- Validacion estatico/sintactica de archivos nuevos: OK (`get_errors`).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Fase 5.2: integrar servicios de carrito en UI SPA y enlazar accion de checkout.

## Iteracion 11 - Busqueda mirror+sin clasificar (Fase 4.2)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: completar paridad base de buscador en eventos para mirror y alias legacy de "sin clasificar".

### Hecho

- `eventsApi.js` extendida:
	- resolucion de datasource por `mirror=home5` para catalogo y busqueda
	- fallback a `galeria.json` cuando el catalogo mirror no esta disponible
	- soporte de alias `sin clasificar`/`untagged` en busqueda desacoplada
- `EventsPage.svelte` actualizada:
	- propagacion de `location.search` a carga y busqueda para respetar mirror
	- estado de UI especifico para busqueda `sin clasificar`
	- tracking desacoplado de busqueda (`submit`, `resultado`, `limpiar`)
- `eventsTracking.js` y tests ampliados:
	- metodos de tracking para flujo de busqueda
	- cobertura de eventos analytics de busqueda
- Tests unitarios agregados/actualizados:
	- `eventsApi.test.js` (mirror + fallback + alias sin clasificar)
	- `eventsTracking.test.js` (tracking de busqueda)
	- `EventsPage.test.js` (mensaje y tracking para `sin clasificar`)

### Verificacion

- Validacion estatico/sintactica de archivos modificados: OK (`get_errors`).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Fase 5.1: iniciar encapsulacion de carrito/checkout en servicios SPA.

## Iteracion 10 - Limpieza UI con Tailwind (gradual)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: mover estilos repetidos de Home/Eventos a clases utilitarias Tailwind sin alterar comportamiento.

### Hecho

- `HomePage.svelte` refactorizada:
	- layout base, espaciados y textos migrados a utilidades Tailwind
	- eliminacion del bloque `<style>` local redundante
- `EventsPage.svelte` refactorizada:
	- formulario de busqueda, resumen, grilla e infinite status migrados a utilidades Tailwind
	- skeletons simplificados con `animate-pulse`
	- eliminacion de CSS local repetitivo

### Verificacion

- Validacion estatico/sintactica de componentes actualizados: OK (`get_errors`).
- `pnpm test`: pendiente de ejecucion manual.
- `pnpm build`: pendiente de ejecucion manual.

### Proximo paso

- Fase 4.2: continuar paridad de buscador legacy (`sin clasificar` + mirror).

## Iteracion 9 - Busqueda bib/numero base (Fase 4.1)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: iniciar migracion de buscador de eventos por bib/numero con API desacoplada y estados de UI.

### Hecho

- `eventsApi.js` extendida con `searchEventsCatalog`:
	- busqueda desacoplada sobre datasource legacy de catalogo
	- matching por texto y tokens numericos (bib/numero) con comparacion exacta
- `EventsPage.svelte` actualizada:
	- formulario de busqueda (`Buscar`/`Limpiar`) integrado en pagina de eventos
	- estados de UI de busqueda: `idle`, `loading`, `empty`, `error`
	- resumen dinamico de resultados con query activa
	- coexistencia con infinite scroll del catalogo cuando no hay busqueda activa
- Tests unitarios agregados/actualizados:
	- `eventsApi.test.js` cubre busqueda por texto, por numero y query vacia
	- `EventsPage.test.js` cubre flujo de busqueda, empty de busqueda y reset con `Limpiar`

### Verificacion

- `pnpm test`: OK (13 files, 49 tests).
- `pnpm build`: OK.

### Proximo paso

- Fase 4.2: completar paridad legacy de busqueda (`sin clasificar` + variantes mirror).

## Iteracion 8 - Eventos infinite scroll+skeletons+dedup (Fase 3.3)

- Fecha: 2026-03-14
- Branch: `spa-svelte-migration`
- Objetivo: reemplazar boton progresivo por infinite scroll y robustecer anexado incremental.

### Hecho

- `EventsPage.svelte` actualizada:
	- reemplazo de boton `Cargar mas` por sentinel con `IntersectionObserver`
	- placeholders/skeleton visibles durante la carga incremental
	- proteccion contra solicitudes concurrentes en `loadMore`
- `eventsPagination.js` mejorada:
	- deduplicacion al anexar feed progresivo (eventos/ads) para evitar repetidos
- Tests unitarios ampliados:
	- `EventsPage.test.js` cubre carga por interseccion del sentinel
	- `EventsPage.test.js` cubre estado incremental con skeletons
	- `eventsPagination.test.js` cubre deduplicacion de eventos y ads

### Verificacion

- Validacion estatico/sintactica en archivos modificados: OK (`get_errors`, sin problemas).
- `pnpm test`: pendiente (ejecucion omitida desde VS Code).
- `pnpm build`: pendiente (ejecucion omitida desde VS Code).

### Proximo paso

- Fase 4.1: iniciar migracion de buscador (`bib/numero`) con API desacoplada y estados de UI.

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
