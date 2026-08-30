const disabledValues = new Set(["0", "false", "off", "no"]);

function permitsJournal(value) {
  if (value === undefined || value === null || value === "") return true;
  return !disabledValues.has(String(value).trim().toLowerCase());
}

export function resolveTimeObjectJournalEnabled({ buildValue, queryValue } = {}) {
  return permitsJournal(buildValue) && permitsJournal(queryValue);
}

export const timeObjectJournalEnabled = resolveTimeObjectJournalEnabled({
  buildValue: import.meta.env?.VITE_TIME_OBJECT_JOURNAL,
});
