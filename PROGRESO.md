# Progreso de mejoras - Acción Digital

Registro de avances para mantener el contexto entre sesiones. Referenciar `PLAN.md` para el plan completo.

---

## Resumen rápido


| Área    | Última fase                  | Estado       |
| ------- | ---------------------------- | ------------ |
| CSS     | 1.4 (variables CSS)          | ✅ Completado |
| Datos   | mirror home (5 eventos)      | ✅ Completado |
| Scripts | 2.5 (carga estática de scripts) | ✅ Completado |


---

## Historial detallado

### Scripts

#### Fase 2.5 – Reemplazar carga dinámica por estática ✅

- **Objetivo**: Evitar inyección dinámica de scripts y definir carga explícita en HTML.
- **Cambios realizados**:
  - En `inicio/index.html` se agregaron en forma estática: `skel.min.js`, `jquery.scrolly.min.js`, `util.js`, `main.js`.
  - En `eventos/index.html` se agregaron en forma estática: `skel.min.js`, `jquery.scrolly.min.js`, `util.js`, `main.js`.
  - Se mantiene el orden de carga con jQuery al inicio y módulos del refactor al final.
- **Fecha**: 2026-03-07

#### Fase 2.4 – Definir orden de carga estándar ✅

- **Objetivo**: Estandarizar el orden de carga de scripts en todas las páginas activas del refactor.
- **Orden definido**:
  - jQuery base
  - Plugins/librerías dependientes de jQuery
  - Módulos del proyecto (`modules/*`, `scripts_auth.js`)
  - Scripts inline al final
- **Cambios realizados**:
  - Normalizado en `auth/index.html`, `auth/create_home.php`, `auth/create_event.php`, `auth/create_ads.php`, `auth/create_gallery.php`.
  - Eliminadas referencias a `assets/js/load_pieces.js` en `auth/*` (obsoleto; la carga de footer ya la hace `modules/ui.js`).
  - Corregida estructura HTML inválida en `auth/index.html` (faltaban `</head>` y contenido de `<body>`).
- **Fecha**: 2026-03-07

#### Fase 2.3 – Eliminar scripts_events.js ✅

- **Objetivo**: Eliminar archivo obsoleto con lógica duplicada.
- **Cambios realizados**:
  - Eliminado `assets/js/scripts_events.js` (no estaba siendo usado)
  - Eliminado `assets/js/scripts.js` (backup, ya reemplazado por módulos)
- **Verificación**: El archivo no estaba referenciado en ninguna página HTML/PHP.
- **Fecha**: 2026-02-28

#### Fase 2.2 – Separar scripts.js en módulos ✅

- **Objetivo**: Separar `scripts.js` (~600 líneas) en módulos especializados.
- **Módulos creados** en `assets/js/modules/`:
  - `carrito.js` – Función `carrito()` y configuración myCart, constante `phs`
  - `ui.js` – Header colapsable, btnTop, active nav, `getGET()`, carga de footer
  - `gallery.js` – Carga Handlebars, templates, scroll infinito, lightbox, `loadGallery()`, `loadEvents()`
  - `search.js` – Función `buscar()`, filtro por número de corredor, fotos sin clasificar
- **Páginas actualizadas** (11):
  - `inicio/index.html` – carrito, ui, gallery
  - `eventos/index.html` – carrito, ui, gallery, search
  - `galeria/index.html` – carrito, ui, gallery
  - `amigos/index.html` – carrito, ui, gallery
  - `faq/index.html` – carrito, ui, gallery
  - `contacto/index.php` – carrito, ui, gallery
  - `auth/index.html` – ui, scripts_auth
  - `auth/create_home.php` – ui, scripts_auth
  - `auth/create_event.php` – ui, scripts_auth
  - `auth/create_ads.php` – ui, scripts_auth
  - `auth/create_gallery.php` – ui, scripts_auth
- **Cambios adicionales**:
  - Eliminado `load_pieces.js` (su función se movió a `ui.js`)
  - Agregado `handlebars.min.js` a páginas que lo necesitan
  - Agregado `jquery.mycart.js` a páginas con carrito
- **Nota**: `scripts.js` se mantiene como backup hasta verificar funcionamiento.
- **Fecha**: 2026-02-28

#### Fase 2.1 – Unificar jQuery (CDN 2.2.4) ✅

- **Objetivo**: Unificar origen de jQuery usando CDN 2.2.4 en todas las páginas.
- **Cambios realizados**:
  - `galeria/index.html`: CDN 2.2.4 + reordenado scripts (load_pieces antes que plugins)
  - `amigos/index.html`: CDN 2.2.4 + reordenado scripts (load_pieces antes que scripts.js)
  - `faq/index.html`: CDN 2.2.4
  - `contacto/index.php`: CDN 2.2.4
  - `auth/index.html`: CDN 2.2.4 + agregado scripts_auth.js (faltaba en el head)
- **Páginas que ya usaban CDN**: inicio, eventos
- **Fecha**: 2026-02-28

#### Fase 2.0 – Análisis del estado actual ✅

- **Objetivo**: Analizar el estado actual de los scripts para planificar las fases de optimización.
- **Análisis completado**: 2026-02-28
- **Hallazgos**:
  - jQuery inconsistente: CDN 2.2.4 (inicio, eventos) vs local 2.2.3 (galeria, amigos, faq, contacto, auth)
  - `scripts.js`: ~600 líneas con múltiples responsabilidades (carrito, Handlebars, galerías, búsqueda, UI)
  - `scripts_events.js`: archivo duplicado/obsoleto con lógica similar a `scripts.js`
  - Carga dinámica problemática: scripts inyectados vía `$('body').append('<script>')`
  - Orden de carga varía entre páginas
- **Plan actualizado**:
  - **2.1**: Unificar jQuery (CDN 2.2.4 en todas las páginas) - Riesgo Bajo
  - **2.2**: Separar `scripts.js` en módulos (carrito, gallery, search, ui, utils) - Riesgo Medio
  - **2.3**: Eliminar `scripts_events.js` - Riesgo Bajo
  - **2.4**: Definir orden de carga estándar - Riesgo Bajo
  - **2.5**: Reemplazar carga dinámica de scripts por estática - Riesgo Medio
- **Fecha**: 2026-02-28

---

### CSS

#### Fase 1.1 – Bundles CSS ✅

- **Objetivo**: Organizar CSS agrupando `pieces` en bundles por tipo de página.
- **Cambios realizados**:
  - Creada carpeta `assets/css/bundles/` con 6 archivos
  - Actualizadas páginas: inicio, galeria, eventos, amigos, faq, contacto
  - Corregido import en `lightbox.css` (magnific-popup.min.css → magnific-popup.css)
- **Páginas sin cambiar** (usan sectionForms/sectionCheckout): auth, checkout, create_*
- **Fecha**: 2026-02-28

#### Fase 1.2 – Imports rotos ✅

- `multi-select.dev.css`: eliminada referencia a `url("../img/switch.png")` inexistente (background: none)
- jQuery UI: descargados 6 sprites en `assets/css/pieces/images/` (ui-icons_*.png); rutas relativas ya resuelven correctamente
- **Fecha**: 2026-02-28

#### Fase 1.3 – Separar main.css en base, layout, components ✅

- **Objetivo**: Organizar el CSS monolítico (~2100 líneas) en archivos lógicos.
- **Archivos creados**:
  - `base.css` – reset, box model, tipografía, utilidades (.hidden, .align-*)
  - `components.css` – box, button, form, icon, image, list, section, table
  - `layout.css` – wrapper, main, header, nav, footer, banner, parches
- `main.css` ahora solo importa estos tres archivos.
- **Fecha**: 2026-02-28

#### Fase 1.4 – Variables CSS (colores, fuentes) ✅
- **Objetivo**: Centralizar colores y tipografías en variables para facilitar mantenimiento.
- **Cambios**:
  - Agregadas variables en `assets/css/pieces/base.css` (`:root`) para colores comunes y fuentes.
  - Reemplazados valores hardcodeados por `var(--...)` en `base.css`, `components.css`, `layout.css`.
- **Fecha**: 2026-02-28

---

### Datos

#### Mirror home (5 eventos) ✅

- **Objetivo**: Descargar datos reales de la home para reproducir localmente (sin imágenes).
- **Fuente**: `acciondigitalfoto.com` (el dominio `.com.ar` no resolvió DNS en este entorno).
- **Archivos**:
  - `assets/datasources/mirror/home-5/inicio.live.json` (home completa)
  - `assets/datasources/mirror/home-5/inicio.5.json` (home recortada a 5 eventos)
  - `assets/datasources/mirror/home-5/<ID>.json` (5 eventos)
- **Integración**:
  - Home (local o `?mirror=home5`) usa `inicio.5.json`
  - Links de home agregan `&mirror=home5` para que `/eventos/` cargue el JSON del evento desde `mirror/home-5/`
- **Fecha**: 2026-02-28

---

### Imágenes

#### Mirror parcial de imágenes (5 eventos × 12 fotos) ✅

- **Objetivo**: Probar galería + lightbox localmente con un subconjunto de fotos.
- **Fuente**: `acciondigitalfoto.com`
- **Descarga**:
  - Por cada evento del mirror: 12 fotos (thumb + full) + `thumbs/portada.jpg`
  - Destino: `assets/images/eventos/<IdEvento>/` y `assets/images/eventos/<IdEvento>/thumbs/`
- **Resultado**: 125/130 descargas OK (5 fallos 404, no bloqueantes).
- **Nota**: `assets/images/eventos/` está ignorado por git en este repo (queda solo local).
- **Fecha**: 2026-02-28

---

## Notas de sesión

- 2026-02-28: Inicio del plan. PLAN.md y PROGRESO.md creados. Fase 1.1 CSS completada: bundles + fix lightbox.
- 2026-02-28: Mirror de datos de home (5 eventos) descargado en `assets/datasources/mirror/home-5/`.
- 2026-02-28: Mirror parcial de imágenes (12 por evento) descargado en `assets/images/eventos/`.
- 2026-02-28: CSS 1.2 completado: multi-select (switch.png) y jQuery UI (ui-icons).
- 2026-02-28: CSS 1.3 completado: main.css separado en base.css, components.css, layout.css.
- 2026-03-07: Hotfix búsqueda en `/eventos/`: `modules/search.js` ahora reutiliza el datasource del evento cargado, soporta `?mirror=home5` y robusteció filtro por código/sin clasificar.
- 2026-03-07: Simplificación estructural en `modules/gallery.js`: extracción de helpers comunes (sección actual, datasource mirror/local, template tag, parseo JSON, helper de links) y eliminación de duplicación interna sin cambio funcional.
- 2026-03-07: Introducido `modules/core.js` para centralizar estado/utilidades compartidas (`phs`, `getGET`, `getCurrentScroll`), removida duplicación en `ui.js`/`carrito.js` y aplicado orden de carga `core -> módulos` en 11 páginas.
- 2026-03-07: Estado compartido migrado a `App.state` (`galleryDataCache`, `galleryDataUrl`, `currentEventData`, `currentEventId`) y adaptados `gallery.js` + `search.js` para eliminar dependencia implícita del global `json_data`.
- 2026-03-07: `search.js` ahora usa binding de scroll namespaced y único por búsqueda (evita acumulación de handlers y llamadas duplicadas tras múltiples búsquedas).
- 2026-03-07: `search.js` simplificado para mantenibilidad: extracción de helper único de render+paginación (`renderSearchResults`) y eliminación de bloques duplicados entre flujo con resultados y sin resultados.
- 2026-03-07: `gallery.js` (flujo `/eventos/`) refactorizado para mantenibilidad: helpers dedicados para popup/carrito, construcción de item, carga por página, render de ads e infinite scroll namespaced; removido código debug/duplicado.
- 2026-03-07: Extraído `modules/renderers.js` para centralizar construcción de HTML compartido (cards de foto y links de ads) y reemplazada duplicación en `gallery.js` + `search.js`.
- 2026-03-07: Homogeneización de estilo/naming en módulos JS (principalmente `search.js` y `gallery.js`): `const/let` consistentes, nombres más descriptivos y comparaciones estrictas para facilitar lectura y mantenimiento.
- 2026-03-07: Homogeneización adicional de estilo en módulos compartidos (`ui.js`, `carrito.js`, `core.js`): variables/constantes consistentes y cleanup de naming para mejorar mantenibilidad sin cambios funcionales.

