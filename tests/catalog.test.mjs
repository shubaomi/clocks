import test from "node:test";
import assert from "node:assert/strict";
import { clocks, getClock, routeFor } from "../src/lib/catalog.js";

test("catalog slugs and routes are unique and stable", () => {
  const slugs = clocks.map(({ slug }) => slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const clock of clocks) {
    assert.match(clock.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(routeFor(clock), `/${clock.slug}/`);
    assert.equal(getClock(clock.slug), clock);
  }
});

test("every catalog item carries the detail-page presentation fields", () => {
  for (const clock of clocks) {
    assert.ok(clock.titleZh);
    assert.ok(clock.titleEn);
    assert.ok(["portrait", "square"].includes(clock.aspect));
    assert.ok(clock.description.length > 20);
    assert.ok(clock.facts.length >= 3);
  }
});
