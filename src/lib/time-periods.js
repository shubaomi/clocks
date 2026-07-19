export function getDoubleHourState(
  hour,
  minute,
  second = 0,
  millisecond = 0,
) {
  const totalMinutes =
    hour * 60 + minute + second / 60 + millisecond / 60000;
  const shiftedMinutes = (totalMinutes + 60) % 1440;

  return {
    index: Math.floor(shiftedMinutes / 120),
    progress: (shiftedMinutes % 120) / 120,
    cycleProgress: shiftedMinutes / 1440,
    half: shiftedMinutes % 120 < 60 ? "初" : "正",
  };
}

export function getZodiacState(
  hour,
  minute,
  second = 0,
  millisecond = 0,
) {
  const totalSeconds =
    hour * 3600 + minute * 60 + second + millisecond / 1000;
  const shiftedSeconds = (totalSeconds + 3600) % 86400;

  return {
    index: Math.floor(shiftedSeconds / 7200),
    progress: (shiftedSeconds % 7200) / 7200,
  };
}
