# Cultural Clocks design

## Decision

Create one static cultural-clock collection at `clocks.hihongrun.com`. Nginx serves the generated files directly. The site uses physical directory routes so adding a clock never requires another Nginx location, upstream, port, DNS record, or certificate.

## Product boundary

The product is a curated personal clock gallery, not a community publishing platform. It includes a collection homepage, live previews, and one themed detail page per clock. Accounts, likes, sorting, submissions, a backend, analytics, and a database are deliberately excluded.

## Information architecture

- `/` is the editorial collection homepage.
- `/<clock-slug>/` is a generated physical route containing an `index.html` copy of the application shell.
- `src/lib/catalog.js` is the single catalog of clock names, routes, aspect ratios, descriptions, and presentation metadata.
- `src/clocks/<clock-slug>/Clock.svelte` contains each clock's visual component.

Adding a clock means adding its component and catalog entry, then rebuilding. The route generator creates `dist/<clock-slug>/index.html` automatically.

## Visual direction

The surrounding site is an eastern time-art museum: warm rice-paper neutrals, ink text, cinnabar accents, restrained jade, wide editorial spacing, subtle fibers, and framed live exhibits. Clock components retain their distinct palettes, but they no longer control the page background. Portrait and square clocks receive composition-specific frames on both collection and detail pages.

## Approved detail direction: D · 时间器物志

The approved direction treats each detail route as one entry in an editorial journal of time objects. A single live clock remains the primary exhibit; its cultural explanation stays in semantic HTML beside it, and the existing time explorer remains the only direct manipulation of time. Spatial treatment is localized to the framed exhibit and must read as paper, ink, metal, water, stone, smoke, sky, or another material already present in that clock's visual language. It is not a shared futuristic skin.

### Requirement trace

- `CC-D1` — Keep the catalog, routes, copy, time calculations, timezone/date behavior, clock components, SEO fields, and existing time-explorer behavior unchanged.
- `CC-D2` — Enhance only detail presentation: editorial hierarchy, a shallow exhibit plane, and previous/current/next journal navigation. Do not restructure the collection homepage.
- `CC-D3` — Preserve every clock's aspect ratio, palette, symbols, and internal motion. The shell may provide depth and light but may not invent cultural content.
- `CC-D4` — Use semantic HTML for titles, descriptions, facts, rules, status, navigation, and controls. Decorative depth layers are hidden from assistive technology.
- `CC-D5` — Pointer tilt is optional feedback only. Links, buttons, range input, keyboard focus, touch, and Escape retain complete equivalent paths.
- `CC-D6` — Add no runtime dependency, external font, image, model, shader, Canvas, or WebGL layer. The approved effect is CSS 2.5D using transform, opacity, border, and shadow.
- `CC-D7` — Provide a build-time flag and a query-string override that restore the incumbent flat presentation without changing displayed time data.
- `CC-D8` — Do not run a continuous animation loop for spatial presentation. Pointer work occurs only while interacting; no spatial render work continues in a hidden tab or off-screen exhibit.
- `CC-D9` — At reduced motion, coarse pointer, unsupported 3D transforms, or when the feature flag is off, render a stable flat exhibit with the same clock and controls.
- `CC-D10` — Automated checks can prove implementation and data equivalence, but cultural accuracy and final aesthetic approval remain human gates.

### Responsibilities and cultural boundary

The clock component owns the dial, hands, marks, cultural forms, internal material cues, and time-driven animation. The exhibit shell owns only framing, shallow depth, ambient paper light, physical shadow, and interaction feedback. The editorial column owns all explanation and status text. The journal navigator reads existing names and series from `src/lib/catalog.js`; it adds no interpretation.

Repository research is the cultural source boundary. Historical mappings, contemporary reinterpretations, approximations, and known limits remain exactly as documented in `docs/research/chinese-timekeeping.md` and the catalog. Unknown or unverified symbols, religious meanings, historical claims, and stereotypes are excluded.

### Layout and state map

- Desktop: an asymmetric editorial column and a larger live exhibit column share the page. The clock surface sits on a shallow layered plane; the existing time explorer remains directly below it.
- Tablet: the two columns collapse before either becomes cramped. Copy, exhibit, explorer, and journal navigation follow one document flow.
- 390 px and 360 px phones: one column, full-width readable copy, aspect-ratio-preserving exhibit, touch-sized controls, and no horizontal overflow or clipped text.
- Resting/running: the clock's existing motion is the only continuous motion. The shell is still.
- Hover: fine pointers may produce a small bounded tilt and shadow shift. It must not obscure content or change the clock time.
- Focus: native focus rings remain visible. Entering one-screen exploration uses the existing button; Escape exits it.
- Switching: previous and next entries are normal links to generated physical routes; the current entry is identified with `aria-current` and is not an inert card-shaped button.
- Loading/error: `ClockRenderer` keeps its existing semantic loading and failure states inside the same framed surface.

### Visual and motion rules

Use the existing serif and mono stacks, rice-paper field, ink hierarchy, cinnabar rule, and restrained jade live-status cue. Depth is shallow and physical: one support plane, one edge, and a soft directional shadow. Do not use generic glass cards, purple/blue AI glow, neon bloom, floating dashboards, identical rounded cards, free camera movement, parallax scenery, or perpetual decorative animation. One pointer response and the existing route/focus transitions are the motion budget.

### Performance, fallback, and rollback

- Add no production dependency and no new asset request. Spatial code is a client leaf and does not place continuous frame values in Svelte state.
- Keep the shell to compositor-friendly transforms/opacity and a maximum pointer tilt of a few degrees. Do not add filters that continuously repaint the clock.
- Mobile and coarse-pointer devices receive the static composition, so there is no DPR, GPU heat, or WebGL context cost. WebGL-unavailable devices are fully supported because the feature does not depend on WebGL.
- `prefers-reduced-motion: reduce` removes spatial transitions and tilt. CSS feature queries flatten unsupported 3D transforms.
- `VITE_TIME_OBJECT_JOURNAL=0` disables the direction at build time. `?spatial=0` provides a local verification/rollback path while preserving the same route and data.

### Acceptance evidence

Run the existing test, build, and distribution checks; add tests for flag resolution and journal adjacency. In browsers, compare spatial on/off time data, verify all direct routes and advancing seconds, and observe desktop, tablet, 390 px, and 360 px layouts. Exercise mouse, touch-sized controls, keyboard order, visible focus, Escape, reduced motion, resize, zoom, hidden-tab recovery, loading/error behavior, long copy, and console state. Review real screenshots with impeccable after implementation. Production deployment and cultural approval are explicitly outside automated evidence.

## Time data

One browser-local time source feeds every mounted clock. Detail pages update frequently enough for smooth progress effects; the collection page updates less often to reduce unnecessary work. No user time or location data leaves the browser.

## Deployment

Vite produces static assets in `dist`. A post-build script creates physical detail directories. Nginx is configured once with a document root, `index index.html`, and `try_files $uri $uri/ =404`. The local deployment script may build and copy files only; it must not edit, test, restart, or reload Nginx.

## Verification

- Unit-test all twelve two-hour boundaries and the midnight transition.
- Validate unique catalog slugs and generated detail routes.
- Build and verify the complete `dist` tree.
- Check homepage and both detail routes at desktop, tablet, and phone widths.
- Verify clocks advance, no page has horizontal overflow, and no external runtime assets are required.
