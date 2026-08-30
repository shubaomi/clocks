import test from "node:test";
import assert from "node:assert/strict";
import { clocks, getClock, getClockNeighbors, routeFor } from "../src/lib/catalog.js";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

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
  assert.equal(clocks.length, 12);
  for (const clock of clocks) {
    assert.ok(clock.titleZh);
    assert.ok(clock.titleEn);
    assert.ok(["portrait", "square", "landscape"].includes(clock.aspect));
    assert.ok(clock.canvas.width > 0);
    assert.ok(clock.canvas.height > 0);
    assert.ok(clock.series);
    assert.match(clock.ambient, /^#[0-9a-f]{6}$/i);
    assert.ok(clock.description.length > 20);
    assert.ok(clock.facts.length >= 3);
  }
});

test("every catalog slug has a matching clock component", async () => {
  const root = resolve("src", "clocks");
  const directories = await readdir(root, { withFileTypes: true });
  const available = new Set(directories.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  for (const clock of clocks) assert.ok(available.has(clock.slug), `Missing component directory: ${clock.slug}`);
});

test("journal navigation follows catalog order and wraps at both ends", () => {
  const first = getClockNeighbors(clocks[0].slug);
  assert.equal(first.previous, clocks.at(-1));
  assert.equal(first.current, clocks[0]);
  assert.equal(first.next, clocks[1]);

  const last = getClockNeighbors(clocks.at(-1).slug);
  assert.equal(last.previous, clocks.at(-2));
  assert.equal(last.current, clocks.at(-1));
  assert.equal(last.next, clocks[0]);
  assert.equal(getClockNeighbors("missing-clock"), undefined);
});
