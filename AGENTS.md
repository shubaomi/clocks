# Cultural Clocks maintenance rules

## Product shape

This is a static Svelte/Vite cultural-clock gallery. It has no backend, database, authentication, analytics, or runtime API dependency.

## Routing

- `src/lib/catalog.js` is the source of truth for clock slugs and metadata.
- Every catalog slug must have a matching `src/clocks/<slug>/Clock.svelte` component.
- `npm run build` must generate `dist/<slug>/index.html` for every clock.
- Do not add per-clock Nginx locations, ports, processes, or domains.

## Visual constraints

- Preserve the warm paper, ink, cinnabar, and jade gallery shell.
- Keep clock-specific backgrounds inside their framed exhibit surface.
- Do not restore full-page black wrappers around individual clocks.
- Do not add external fonts or image dependencies without explicit approval.

## Required verification

- Run `npm run check`.
- Confirm the homepage and every detail route load directly.
- Confirm displayed seconds advance.
- Check desktop and mobile layouts for overflow and text clipping.
- Keep `deploy.sh` limited to building/copying files; it must never edit or reload Nginx.
