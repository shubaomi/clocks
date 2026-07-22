import test from "node:test";
import assert from "node:assert/strict";
import {
  getDoubleHourState,
  getZodiacState,
} from "../src/lib/time-periods.js";
import {
  advanceDaySecond,
  createClockTime,
  createClockTimeAtDaySecond,
  formatDaySecond,
} from "../src/lib/clock-time.js";

const boundaries = [
  [23, 0, 0],
  [1, 0, 1],
  [3, 0, 2],
  [5, 0, 3],
  [7, 0, 4],
  [9, 0, 5],
  [11, 0, 6],
  [13, 0, 7],
  [15, 0, 8],
  [17, 0, 9],
  [19, 0, 10],
  [21, 0, 11],
];

test("double-hour and zodiac boundaries map to all twelve periods", () => {
  for (const [hour, minute, expectedIndex] of boundaries) {
    assert.equal(getDoubleHourState(hour, minute).index, expectedIndex);
    assert.equal(getZodiacState(hour, minute).index, expectedIndex);
  }
});

test("the Zi period crosses midnight without changing index", () => {
  assert.equal(getDoubleHourState(23, 59, 59).index, 0);
  assert.equal(getDoubleHourState(0, 59, 59).index, 0);
  assert.equal(getZodiacState(23, 59, 59).index, 0);
  assert.equal(getZodiacState(0, 59, 59).index, 0);
});

test("period progress remains bounded", () => {
  const samples = [
    [0, 0, 0, 0],
    [6, 29, 30, 500],
    [12, 45, 12, 250],
    [23, 59, 59, 999],
  ];

  for (const sample of samples) {
    const doubleHour = getDoubleHourState(...sample);
    const zodiac = getZodiacState(...sample);
    assert.ok(doubleHour.progress >= 0 && doubleHour.progress < 1);
    assert.ok(zodiac.progress >= 0 && zodiac.progress < 1);
  }
});

test("day-of-year uses calendar dates and is not shifted by daylight saving time", () => {
  assert.equal(createClockTime(new Date(2026, 6, 22, 12)).dayOfYear, 203);
  assert.equal(createClockTime(new Date(2024, 11, 31, 12)).dayOfYear, 366);
});

test("timeline exploration covers the complete local day without mutating its live source", () => {
  const live = createClockTime(new Date(2026, 6, 22, 14, 35, 42, 700));

  assert.equal(formatDaySecond(0), "00:00:00");
  assert.equal(formatDaySecond(3661), "01:01:01");
  assert.equal(formatDaySecond(86400), "24:00:00");

  const midnight = createClockTimeAtDaySecond(live, 0);
  const noon = createClockTimeAtDaySecond(live, 43200);
  const end = createClockTimeAtDaySecond(live, 86400);

  assert.deepEqual([midnight.hour, midnight.minute, midnight.second], [0, 0, 0]);
  assert.deepEqual([noon.hour, noon.minute, noon.second], [12, 0, 0]);
  assert.deepEqual([end.hour, end.minute, end.second], [0, 0, 0]);
  assert.equal(end.day, 23);
  assert.deepEqual([live.hour, live.minute, live.second], [14, 35, 42]);
});

test("automatic day playback advances proportionally and loops after midnight", () => {
  assert.equal(advanceDaySecond(0, 30_000, 60), 43_200);
  assert.equal(advanceDaySecond(82_800, 5_000, 60), 3_600);
  assert.equal(advanceDaySecond(0, 30_000, 30), 0);
  assert.equal(advanceDaySecond(0, 5_000, 120), 3_600);
});
