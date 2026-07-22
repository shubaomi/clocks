import test from "node:test";
import assert from "node:assert/strict";
import { createBag, drawFromBag } from "../src/lib/featured-clock.js";

function sequenceRandom(values) {
  let index = 0;
  return () => values[index++ % values.length];
}

test("a shuffle bag covers every item exactly once", () => {
  const items = ["a", "b", "c", "d"];
  const bag = createBag(items, "", sequenceRandom([0.2, 0.8, 0.4]));
  assert.equal(bag.length, items.length);
  assert.deepEqual(new Set(bag), new Set(items));
});

test("a new bag avoids repeating the previous final clock", () => {
  const bag = createBag(["a", "b", "c"], "a", () => 0.999);
  assert.notEqual(bag[0], "a");
});

test("draws stay unique until the bag is exhausted", () => {
  const items = ["a", "b", "c"];
  const seen = [];
  let state = {};
  for (let index = 0; index < items.length; index += 1) {
    const result = drawFromBag(items, state, () => 0.5);
    seen.push(result.slug);
    state = result.state;
  }
  assert.equal(new Set(seen).size, items.length);
});
