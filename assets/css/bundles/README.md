# Bundles CSS

Archivos que agrupan los estilos por tipo de página. Cada bundle hace `@import` de los `pieces` necesarios.

## Estructura de pieces/main.css

`main.css` importa:
- `base.css` – reset, box model, tipografía, utilidades
- `components.css` – box, button, form, icon, image, list, section, table
- `layout.css` – wrapper, main, header, nav, footer, banner

| Bundle | Páginas | Incluye |
|--------|---------|---------|
| bundle-inicio.css | /inicio/ | main, bootstrap, forms, galleries |
| bundle-galeria.css | /galeria/ | main, bootstrap, galleries |
| bundle-eventos.css | /eventos/ | main, bootstrap, buscador, galleries, lightbox |
| bundle-amigos.css | /amigos/ | main, bootstrap, amigos, galleries |
| bundle-faq.css | /faq/ | main, bootstrap, faq, galleries, tooltipster |
| bundle-contacto.css | /contacto/ | main, bootstrap, contact |

Las páginas de auth y checkout usan `sections/sectionForms.css` y `sections/sectionCheckout.css`.
