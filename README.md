# Hongrun Clocks — 时间造物集

A static collection of cultural clock designs. The gallery and every detail page use the visitor's local browser time without a backend, database, analytics service, or external runtime asset.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run check
```

## Production output

`npm run build` creates:

```text
dist/
├── index.html
├── assets/
├── twelve-shichen/index.html
└── zodiac-seal-almanac/index.html
```

Each new catalog entry receives its own physical route during the build. The production server only needs one generic static-site configuration.

## Add another clock

1. Add `src/clocks/<slug>/Clock.svelte`.
2. Add the clock metadata to `src/lib/catalog.js`.
3. Run `npm run check`.

No backend route or per-clock server configuration is required.
