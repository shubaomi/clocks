const two = (value) => String(value).padStart(2, "0");

const timezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Local Time";

export function createClockTime(date = new Date()) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  const elapsedSecond = second + millisecond / 1000;
  const elapsedMinute = minute + elapsedSecond / 60;
  const elapsedHour = hour + elapsedMinute / 60;
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const startOfNextYear = new Date(date.getFullYear() + 1, 0, 1);
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 1)) /
      86400000,
  ) + 1;
  const yearProgress = (date - startOfYear) / (startOfNextYear - startOfYear);

  return {
    timestamp: date.getTime(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour,
    minute,
    second,
    millisecond,
    hh: two(hour),
    mm: two(minute),
    ss: two(second),
    dayOfYear,
    timezone,
    progress: {
      second: millisecond / 1000,
      minute: elapsedSecond / 60,
      hour: elapsedMinute / 60,
      day: elapsedHour / 24,
      year: yearProgress,
    },
  };
}
