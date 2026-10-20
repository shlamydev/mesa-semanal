# Mesa Semanal

Planificador de comidas semanal con lista de la compra automática. El punto de partida es un prototipo en un único HTML: `prototipo/planificador-comidas.html`. Léelo entero antes de empezar: es la referencia de funcionalidad, diseño y comportamiento.

## Objetivo

Convertir el prototipo en una web mantenible y dejarla lista para desplegar. La migración inicial mantuvo el aspecto del prototipo; después (ver "Progreso") se rediseñó la interfaz y se añadieron mejoras para la presentación, sin romper las reglas de negocio.

## Stack

* Vite + React + TypeScript
* CSS plano con variables (migrar tal cual los tokens `:root` del prototipo, incluido el modo oscuro)
* Estado: React (`useReducer` + contexto) con persistencia en `localStorage` (clave `mesa-semanal`)
* Tests: Vitest + Testing Library
* Sin backend por ahora. Despliegue estático (Vercel, Netlify o GitHub Pages)

## Comandos

* `npm install`: instalar dependencias
* `npm run dev`: servidor de desarrollo
* `npm run build`: build de producción
* `npm run test`: tests
* `npm run lint`: lint

## Estructura prevista

```
src/
  components/   Semana, Recetas, Compra, Modales, Sidebar, Resumen
  data/         recetas base (recipes.ts) y calorías
  state/        reducer, contexto y persistencia
  lib/          shopping.ts (cálculo de la lista de la compra)
  styles/       tokens.css y estilos por componente
prototipo/      HTML original (no modificar, solo referencia)

```

## Modelo de datos (viene del prototipo)

* Receta: `{ id, n, e, t, tg, m, ing, k, custom? }`
   * `tg`: `"v"` vegetariana, `"vg"` vegana
   * `m`: comidas válidas, p. ej. `"bam"`
   * `ing`: `[nombre, cantidad para 2 personas, unidad, sección]`
   * `k`: kcal aproximadas por persona
* Estado: `{ people, plan, done, have, meals, custom }`
   * `plan`: `{ "<día 0-6><comida>": recetaId }`
   * comidas: `b` desayuno, `a` almuerzo, `l` comida, `m` merienda, `d` cena

## Reglas de negocio que no se deben romper

* Las cantidades de las recetas están definidas para 2 personas y se escalan por `people / 2`
* La lista de la compra suma ingredientes con mismo nombre y unidad, y agrupa por sección
* Las comidas ocultas no cuentan en la lista de la compra, pero sus recetas se conservan en el plan
* Siempre debe quedar al menos una comida activa
* "Ya lo tengo" mueve el ingrediente a la despensa; es por nombre
* Si una búsqueda o filtro no da resultados, se ofrece crear una receta (desde un hueco, se asigna a ese hueco)
* Las recetas propias se pueden eliminar; las de serie no

## Convenciones

* Idioma de la interfaz y de los textos: español
* TypeScript estricto, componentes funcionales, sin `any`
* Accesibilidad: foco visible, `aria-*` en pestañas, botones y modales, cierre con Escape
* Respetar `prefers-color-scheme` y `prefers-reduced-motion`
* Mobile first; la cuadrícula semanal pasa a siete columnas y aparece la barra lateral desde 900px
* Commits pequeños y descriptivos

## Forma de trabajar

1. Proponer un plan corto antes de tocar código
2. Migrar por partes (datos y lógica primero, luego componentes) y probar tras cada una
3. Añadir tests de `shopping.ts` y del reducer
4. Comparar con el prototipo antes de dar algo por terminado

## Siguientes mejoras (fuera del alcance inicial)

Editar recetas propias, pasos de preparación, macros, objetivo diario de kcal, exportar la lista de la compra, cuentas de usuario y sincronización entre dispositivos.

## Progreso

Ojo: el prototipo HTML es una versión **anterior** a este documento. Las comidas configurables, las calorías y las recetas propias solo existen en la versión React.

### Hecho
- Esqueleto Vite + React + TS estricto, Vitest + Testing Library, oxlint (`npm run lint`).
- Tokens CSS migrados del prototipo (`src/styles/tokens.css`, con modo oscuro) y colores nuevos `--a` (almuerzo) y `--m` (merienda).
- Datos: 12 recetas del prototipo + 4 ligeras (almuerzo/merienda), todas con `k` (kcal/persona, estimadas) en `src/data/recipes.ts`.
- Lógica con tests: `lib/shopping.ts`, `lib/nutrition.ts`, `lib/filter.ts`, `lib/suggest.ts`, reducer, persistencia (migra el formato antiguo del prototipo).
- Componentes: Cabecera, pestañas, Compra, Semana (comidas configurables, kcal por día, arrastrar y soltar, sugerir), selector de receta, Modal accesible.
- Pestaña Recetas (búsqueda, filtros, kcal) y detalle de receta con ingredientes escalados.
- Recetas propias: formulario con validación, creación desde "+ Nueva receta", desde búsqueda sin resultados y desde un hueco (se asigna al hueco), eliminación con confirmación (solo las propias).

- Comprobado en navegador real (5 comidas, kcal por día, estilo idéntico al prototipo).
- Despliegue preparado: `vercel.json` y `README.md` con los pasos (Vercel o Netlify).

- Rediseño visual (2026-10-19): tokens nuevos (`--surf-2`, `--ok`, radios y sombra), huecos con recuadro de emoji tintado por comida, tarjetas de receta con icono, estados vacíos, modales con desenfoque y animación de entrada, barra de pestañas fija abajo en móvil, día de hoy resaltado en la semana.
- Cabecera con resumen de la semana (comidas planificadas, media diaria de kcal, ingredientes por comprar; `lib/summary.ts` con tests) y botón de modo claro/oscuro (`lib/theme.ts`, `state/useTheme.ts`; la elección se guarda en la clave `mesa-semanal-theme`, aparte del estado del dominio).
- Objetivo diario de kcal (`state.goal`, 0 = sin objetivo; acción `SET_GOAL`, límite `MAX_GOAL` = 6000): campo en la cabecera y barra de progreso por día en Semana, en rojo con el texto «+N sobre el objetivo» si se supera (`lib/nutrition.ts` → `goalProgress`). Los estados guardados sin `goal` se leen como 0.
- Pasos de preparación (`Recipe.s`, opcional): las 16 recetas de serie los traen y se ven en el detalle. Recetas propias editables (acción `UPDATE_CUSTOM`, el formulario `NewRecipeModal` sirve para crear y editar; al guardar vuelve al detalle). Las de serie no se editan.
- Exportar la lista de la compra (`lib/exportList.ts` con tests): copiar al portapapeles, compartir con Web Share (solo si el navegador lo soporta) e imprimir con estilos `@media print`. Solo exporta lo pendiente (ni en despensa ni comprado).
- Deshacer: tras «Vaciar» y tras eliminar una receta propia el aviso ofrece «Deshacer» (6 s). Acción `RESTORE` con un parche parcial (`plan`, `done`, `custom`), así no pisa cambios hechos en medio (p. ej. las personas). Tipo `Notify` en `types.ts`.
- Rediseño v3 (2026-10-20), sustituye a los anteriores: panel con **barra lateral verde bosque** (`Sidebar.tsx`: logotipo, menú con iconos, personas y modo oscuro) y contenido claro con un único acento menta (`--acc`). La semana va en **siete columnas** (lunes a domingo) con una fila por comida (CSS grid + subgrid en `semana.css`) y las fechas reales (`lib/week.ts`, con tests). `Resumen.tsx` muestra planificado, media de kcal, objetivo diario y compra pendiente. Tipografía: Bricolage Grotesque (títulos) e Instrument Sans (texto). En móvil: cabecera arriba y pestañas fijas abajo. Se retiró `Cabecera.tsx`.

### Pendiente de verdad: subir a GitHub e importar en Vercel (ver README).
- Mejoras futuras de la sección "Siguientes mejoras" (sincronización entre dispositivos, cuentas).

### Decisiones
- `meals` en el estado guarda las comidas visibles en orden canónico (b, a, l, m, d); por defecto b, l, d como el prototipo.
- Recetas propias con id desde 1000 (`nextCustomId`), así no chocan con las de serie; al eliminar una se quita también del plan.
- Una clave de hueco es `<día><comida>` (p. ej. `2l`); la de "comprado" es `nombre|unidad`; "ya lo tengo" va solo por nombre.
- Tests: Node 25 trae un `localStorage` experimental que rompe jsdom; `src/test/setup.ts` lo sustituye por uno en memoria.
- El estado de interfaz (pestaña, filtros, búsqueda, modales) es local de React; solo lo del dominio va al reducer y a `localStorage`.
