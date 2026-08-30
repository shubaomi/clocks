import test from "node:test";
import assert from "node:assert/strict";
import { resolveTimeObjectJournalEnabled } from "../src/lib/feature-flags.js";

test("time object journal is enabled by default", () => {
  assert.equal(resolveTimeObjectJournalEnabled(), true);
});

test("build and query values can independently disable the journal", () => {
  for (const value of ["0", "false", "FALSE", "off", "no"]) {
    assert.equal(resolveTimeObjectJournalEnabled({ buildValue: value }), false);
    assert.equal(resolveTimeObjectJournalEnabled({ queryValue: value }), false);
  }
});

test("a query cannot override a build-time rollback", () => {
  assert.equal(
    resolveTimeObjectJournalEnabled({ buildValue: "0", queryValue: "1" }),
    false,
  );
  assert.equal(
    resolveTimeObjectJournalEnabled({ buildValue: "1", queryValue: "1" }),
    true,
  );
});
