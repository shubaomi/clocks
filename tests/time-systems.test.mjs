import test from "node:test";
import assert from "node:assert/strict";
import {
  earthlyBranches,
  fourSymbols,
  getActualSolarTerm,
  getClepsydraState,
  getHexagramState,
  getSexagenaryState,
  getSolarTermCompressionState,
  heavenlyStems,
  sexagenaryPairs,
  solarTerms,
  zodiacSigns,
} from "../src/lib/time-systems.js";

const at = (hour, minute = 0, second = 0, millisecond = 0) => ({
  hour, minute, second, millisecond, dayOfYear: 1, timestamp: Date.UTC(2026, 0, 1, hour, minute, second, millisecond),
});

test("twenty-four terms and seventy-two pentads cover every compressed boundary", () => {
  assert.equal(solarTerms.length, 24);
  assert.equal(solarTerms.flatMap((term) => term.pentads).length, 72);
  for (let hour = 0; hour < 24; hour += 1) {
    assert.equal(getSolarTermCompressionState(at(hour)).termIndex, hour);
    assert.equal(getSolarTermCompressionState(at(hour, 0)).pentadInTerm, 0);
    assert.equal(getSolarTermCompressionState(at(hour, 20)).pentadInTerm, 1);
    assert.equal(getSolarTermCompressionState(at(hour, 40)).pentadInTerm, 2);
  }
  assert.equal(getSolarTermCompressionState(at(0)).term.zh, "冬至");
  assert.equal(getSolarTermCompressionState(at(6)).term.zh, "春分");
  assert.equal(getSolarTermCompressionState(at(12)).term.zh, "夏至");
  assert.equal(getSolarTermCompressionState(at(18)).term.zh, "秋分");
});

test("astronomical solar-term approximation finds the four seasonal anchors", () => {
  assert.equal(getActualSolarTerm(new Date("2026-03-21T12:00:00Z")).zh, "春分");
  assert.equal(getActualSolarTerm(new Date("2026-06-22T12:00:00Z")).zh, "夏至");
  assert.equal(getActualSolarTerm(new Date("2026-09-23T12:00:00Z")).zh, "秋分");
  assert.equal(getActualSolarTerm(new Date("2026-12-22T12:00:00Z")).zh, "冬至");
});

test("hexagram clock stays in range and switches every 22 minutes 30 seconds", () => {
  assert.equal(getHexagramState(at(0)).index, 0);
  assert.equal(getHexagramState(at(0, 22, 29, 999)).index, 0);
  assert.equal(getHexagramState(at(0, 22, 30)).index, 1);
  assert.equal(getHexagramState(at(23, 59, 59, 999)).index, 63);
  assert.equal(getHexagramState(at(0)).lines.length, 6);
});

test("clepsydra progress and float remain bounded and monotonic", () => {
  const samples = [at(0), at(6), at(12), at(18), at(23, 59, 59, 999)].map(getClepsydraState);
  for (const sample of samples) {
    assert.ok(sample.float >= 0 && sample.float < 1);
  }
  for (let index = 1; index < samples.length; index += 1) {
    assert.ok(samples[index].float > samples[index - 1].float);
  }
});

test("four symbols, zodiac signs, and sexagenary data are complete and unique", () => {
  const mansions = fourSymbols.flatMap((symbol) => symbol.mansions);
  assert.equal(fourSymbols.length, 4);
  assert.ok(fourSymbols.every((symbol) => symbol.mansions.length === 7));
  assert.equal(mansions.length, 28);
  assert.equal(new Set(mansions).size, 28);
  assert.equal(zodiacSigns.length, 12);
  assert.equal(new Set(zodiacSigns.map((sign) => sign.en)).size, 12);
  assert.equal(heavenlyStems.length, 10);
  assert.equal(earthlyBranches.length, 12);
  assert.equal(sexagenaryPairs.length, 60);
  assert.equal(new Set(sexagenaryPairs.map((pair) => pair.name)).size, 60);
  assert.equal(getSexagenaryState(at(0, 0, 0)).name, "甲子");
  assert.equal(getSexagenaryState(at(0, 0, 59)).name, "癸亥");
});

test("all compressed systems wrap cleanly at midnight", () => {
  assert.equal(getSolarTermCompressionState(at(23, 59, 59, 999)).termIndex, 23);
  assert.equal(getSolarTermCompressionState(at(0)).termIndex, 0);
  assert.equal(getHexagramState(at(23, 59, 59, 999)).index, 63);
  assert.equal(getHexagramState(at(0)).index, 0);
});
