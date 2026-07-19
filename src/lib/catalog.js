export const clocks = [
  {
    slug: "twelve-shichen",
    number: "壹",
    titleZh: "十二时辰",
    titleEn: "Twelve Shichen",
    kicker: "一日十二辰",
    rule: "一时辰 · 两小时",
    ruleEn: "1 SHICHEN · 2 HOURS",
    aspect: "portrait",
    theme: "bronze",
    description:
      "以十二地支重新划分一天，让现代二十四小时与古老时序在同一条刻度上相遇。",
    note:
      "光晕沿一天的轨迹移动，漏刻标示当下所在的时辰；每两小时，空间的色彩也会随之转换。",
    facts: ["12 个时辰", "24 小时映射", "本地时间与时区"],
  },
  {
    slug: "zodiac-seal-almanac",
    number: "贰",
    titleZh: "十二生肖时辰印谱",
    titleEn: "Zodiac Seal Almanac",
    kicker: "一兽值守两小时",
    rule: "一生肖 · 两小时",
    ruleEn: "1 ANIMAL · 2 HOURS",
    aspect: "square",
    theme: "cinnabar",
    description:
      "把十二生肖化为一日值守印谱，用落墨、朱砂与日序痕迹呈现过去、当下和未来。",
    note:
      "已经走过的生肖盖上“毕”印，当值生肖保持鲜明，尚未来临的时段则安静等待。",
    facts: ["12 种生肖", "完成印记", "时段进度落墨"],
  },
];

export function getClock(slug) {
  return clocks.find((clock) => clock.slug === slug);
}

export function routeFor(clock) {
  return `/${clock.slug}/`;
}
