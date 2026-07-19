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

  return {
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
    timezone,
    progress: {
      second: millisecond / 1000,
      minute: elapsedSecond / 60,
      hour: elapsedMinute / 60,
      day: elapsedHour / 24,
    },
  };
}
