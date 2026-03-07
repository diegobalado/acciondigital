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

## Fases

### Fase 0 - Setup base

- [x] Crear branch `spa-svelte-migration`.
- [x] Inicializar proyecto `Svelte + Vite` en `spa/`.
- [x] Configurar stack de testing (Vitest + Testing Library).
- [x] Crear documentos `PLAN_SPA.md` y `PROGRESO_SPA.md`.

### Fase 1 - Infra compartida

- [ ] Definir estructura base de carpetas (`app`, `features`, `shared`, `services`).
- [ ] Implementar cliente de datos para JSON legacy.
- [ ] Definir capa de mapeo de modelos (legacy -> SPA).
- [ ] Tests unitarios de utilidades y mapeos.

### Fase 2 - Home

- [ ] Migrar vista de inicio y listado de eventos.
- [ ] Soportar modo mirror (`mirror=home5`).
- [ ] Tests unitarios para render y estados vacios/error.

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
