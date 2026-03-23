# Paridad SPA vs Legacy - Checklist

Fecha base: 2026-03-22

## Objetivo

Validar que la SPA mantiene paridad funcional y UX clave respecto al sitio legacy.

## Secciones

- [ ] Inicio (`/`) 
- [ ] Eventos catalogo (`/eventos/`) 
- [ ] Galeria de evento (`/eventos/?id=...`) 
- [ ] Amigos (`/amigos/`) 
- [ ] FAQ (`/faq/`) 
- [ ] Contacto (`/contacto/`) 
- [ ] Carrito (`/carrito/`) 
- [ ] Not found (`/ruta-invalida`) 

## Casos transversales

- [ ] Estados `loading/error/empty` presentes y consistentes
- [ ] `mirror=home5` se preserva al navegar entre secciones
- [ ] Navegacion por teclado (Tab/Enter/Escape) sin bloqueos
- [ ] `aria-current` correcto en nav principal
- [ ] Skip-link funciona hacia `#spa-main-content`
- [ ] Popup de carrito abre/cierra correctamente (boton, Escape)
- [ ] Checkout legacy inicia desde `/carrito/`

## Evidencia automatizada actual

- Routing app-level: `src/App.test.js`
- Navegacion + popup carrito: `src/shared/components/SpaNav.test.js`
- Flujo carrito cross-page: `src/features/cart/cartFlow.integration.test.js`
- Carrito store y pagina carrito: `src/services/cartStore.test.js`, `src/features/cart/CartPage.test.js`

## Cierre

Completar este checklist en QA manual antes de considerar terminada la fase de hardening final.
