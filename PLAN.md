# Plan de mejoras - Acción Digital

Documento de referencia para las mejoras iterativas del sitio. Usar junto con `PROGRESO.md` para mantener el contexto entre sesiones.

---

## 1. CSS – Organización y optimización

### Estado actual

- **Carpetas**: `assets/css/pieces/`, `assets/css/sections/`, `assets/css/fonts/`, `assets/css/plugins/`
- **Problemas**:
  - Cada página carga 3–5 archivos CSS por separado (más solicitudes HTTP)
  - `main.css` mezcla base, layout, componentes y parches (ahora separado en imports)
  - Rutas rotas: `lightbox.css` importa `magnific-popup.min.css` (existe `magnific-popup.css`)
  - `multi-select.dev.css` usa `url("../img/switch.png")` inexistente
  - jQuery UI usa rutas relativas `images/ui-icons_*.png` que pueden fallar
  - `sectionForms.css` y `sectionCheckout.css` duplican imports
  - Bootstrap y Magnific Popup minificados pueden estar en `.gitignore`

### Plan de CSS (por fases)


| Fase    | Descripción                                                     | Riesgo |
| ------- | --------------------------------------------------------------- | ------ |
| **1.1** | Crear bundles CSS que agrupen `pieces` por tipo de página       | Bajo   |
| **1.2** | Corregir imports rotos (magnific, multi-select, jQuery UI)      | Bajo   |
| **1.3** | Separar en `base`, `layout` y `components` dentro de `main.css` | Medio  |
| **1.4** | Extraer variables CSS (colores, espaciados, fuentes)            | Bajo   |
| **1.5** | Revisar Bootstrap: CDN vs local, versión                        | Medio  |
| **1.6** | Minificación/concatenación para producción (opcional)           | Medio  |


### Mapa de dependencias CSS por página


| Página                   | Archivos actuales                              |
| ------------------------ | ---------------------------------------------- |
| inicio                   | main, forms, bootstrap, galleries              |
| galeria                  | main, bootstrap, galleries                     |
| eventos                  | main, bootstrap, buscador, galleries, lightbox |
| amigos                   | main, amigos, bootstrap, galleries             |
| faq                      | main, faq, bootstrap, galleries, tooltipster   |
| contacto                 | main, contact, bootstrap                       |
| auth                     | sectionForms (main + bootstrap + forms)        |
| checkout                 | sectionCheckout, forms                         |
| create_event/create_home | sectionForms, multi-select                     |


---

## 2. Scripts – Organización

### Estado actual

- jQuery inconsistente: CDN 2.2.4 (inicio, eventos) vs local 2.2.3 (galeria, amigos, faq, contacto, auth)
- `scripts.js` concentra mucha lógica (~600 líneas): Handlebars, carrito, galerías, checkout, búsqueda, UI
- `scripts_events.js`: lógica duplicada/obsoleto (última actualización pendiente de análisis)
- Carga dinámica de footer y templates vía `$.load()`
- Scripts inyectados dinámicamente vía `$('body').append('<script>')` (skel, scrolly, util, main)

### Análisis detallado


| Página   | jQuery      | Scripts cargados                                           |
| -------- | ----------- | ---------------------------------------------------------- |
| inicio   | CDN 2.2.4   | scrolly, load_pieces, handlebars, scripts, plugins, mycart |
| eventos  | CDN 2.2.4   | load_pieces, handlebars, plugins, mycart, magnific, lodash, scripts |
| galeria  | Local 2.2.3 | load_pieces, plugins                                       |
| amigos   | Local 2.2.3 | scripts, load_pieces, plugins                              |
| faq      | Local 2.2.3 | load_pieces, scripts, plugins, mycart, accordion, tooltipster |
| contacto | Local 2.2.3 | load_pieces, scripts, plugins                              |
| auth     | Local 2.2.3 | scripts_auth, load_pieces, scrolly, util                   |
| checkout | -           | sectionCheckout.css, forms.css (inline scripts)            |


### Plan de scripts (por fases)


| Fase    | Descripción                                                          | Riesgo | Páginas afectadas                |
| ------- | -------------------------------------------------------------------- | ------ | -------------------------------- |
| **2.1** | Unificar jQuery: usar CDN 2.2.4 en todas las páginas                 | Bajo   | galeria, amigos, faq, contacto, auth |
| **2.2** | Separar `scripts.js` en módulos: carrito, gallery, search, ui, utils | Medio  | inicio, eventos, amigos, faq, contacto |
| **2.3** | Eliminar `scripts_events.js` (consolidar en `scripts.js` si hay lógica única) | Bajo   | ninguna (archivo obsoleto)       |
| **2.4** | Definir orden de carga estándar y aplicar en todas las páginas       | Bajo   | todas                            |
| **2.5** | Reemplazar carga dinámica de scripts (skel, scrolly, util, main) por carga estática en HTML | Medio  | inicio, eventos                  |


---

## 3. Otros (backlog)

- Imágenes/ assets: revisar `.gitignore` y rutas
- Actualizar librerías (jQuery 2.2.x, Font Awesome 4.6, Bootstrap)
- Seguridad: sanitizar inputs en PHP (contacto, auth)

---

## Cómo usar este plan

1. Trabajar de forma iterativa; cada cambio debe mantener la funcionalidad actual.
2. Actualizar `PROGRESO.md` tras cada mejora.
3. Probar en las páginas afectadas antes de dar por cerrada una fase.
4. En cada iteración, crear un commit con los cambios y hacer push a la rama activa (actualmente `refactor`).
5. Priorizar legibilidad y mantenibilidad antes que performance: primero simplificar y eliminar complejidad innecesaria, luego optimizar rendimiento.

