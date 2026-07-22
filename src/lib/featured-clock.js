const STORAGE_KEY = "cultural-clocks-featured-bag-v1";

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createBag(items, lastSlug = "", random = Math.random) {
  const bag = shuffle(items, random);
  if (bag.length > 1 && bag[0] === lastSlug) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }
  return bag;
}

export function drawFromBag(items, state = {}, random = Math.random) {
  const valid = new Set(items);
  let bag = Array.isArray(state.bag) ? state.bag.filter((slug) => valid.has(slug)) : [];
  const lastSlug = valid.has(state.lastSlug) ? state.lastSlug : "";

  if (bag.length === 0) bag = createBag(items, lastSlug, random);

  const [slug = items[0], ...remaining] = bag;
  return {
    slug,
    state: { bag: remaining, lastSlug: slug },
  };
}

export function readFeaturedState(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeFeaturedState(state, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function pickFeaturedClock(items, options = {}) {
  const { random = Math.random, storage = globalThis.localStorage } = options;
  const result = drawFromBag(items, readFeaturedState(storage), random);
  writeFeaturedState(result.state, storage);
  return result.slug;
}

export { STORAGE_KEY };
