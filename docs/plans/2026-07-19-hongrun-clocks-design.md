# Hongrun Clocks design

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
