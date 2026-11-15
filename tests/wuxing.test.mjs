import test from "node:test";
import assert from "node:assert/strict";
import { createClockTimeAtDaySecond } from "../src/lib/clock-time.js";
import { phaseAt, phases } from "../src/clocks/wuxing-flow/phases.js";

test("each local minute passes through five generating phases, twelve seconds each", () => {
  const sequence = ["金", "水", "木", "火", "土"];
  for (let second = 0; second < 60; second++) {
    const phase = phaseAt(second, 999);
    const position = Math.floor(second / 12);
    assert.equal(phases[phase.index].name, sequence[position]);
    assert.equal(phases[phase.next].name, sequence[(position + 1) % 5]);
    assert.ok(phase.progress >= 0 && phase.progress < 1);
    if (second % 12 === 0) assert.equal(phaseAt(second).progress, 0);
  }
});

test("the explorer and the new day share the same phase origin", () => {
  const date = new Date(2026, 10, 14, 23, 59, 59);
  for (const second of [0, 60, 3600, 86400]) {
    const time = createClockTimeAtDaySecond(date, second);
    assert.deepEqual(phaseAt(time.second, time.millisecond), { index: 0, next: 1, progress: 0 });
  }
  assert.equal(phaseAt(date.getSeconds()).index, 4);
});
