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
    canvas: { width: 800, height: 1200 },
    series: "中国时序",
    theme: "bronze",
    ambient: "#8e6b32",
    mappingKind: "historical",
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
    canvas: { width: 800, height: 800 },
    series: "中国时序",
    theme: "cinnabar",
    ambient: "#8f3141",
    mappingKind: "contemporary",
    description:
      "把十二生肖化为一日值守印谱，用落墨、朱砂与日序痕迹呈现过去、当下和未来。",
    note:
      "已经走过的生肖盖上“毕”印，当值生肖保持鲜明，尚未来临的时段则安静等待。",
    facts: ["12 种生肖", "完成印记", "时段进度落墨"],
  },
  {
    slug: "solar-terms-pentads",
    number: "叁",
    titleZh: "一日四时·二十四节气",
    titleEn: "Solar Terms in One Day",
    kicker: "一年压缩为一日",
    rule: "一节气 · 一小时 · 一候二十分钟",
    ruleEn: "1 TERM · 1 HOUR · 1 PENTAD · 20 MIN",
    aspect: "landscape",
    canvas: { width: 1200, height: 720 },
    series: "中国时序",
    theme: "seasons",
    ambient: "#71865a",
    mappingKind: "contemporary",
    description:
      "把太阳周年运动压缩成一天，让二十四节气与七十二候沿一幅四季长卷持续流转。",
    note:
      "冬至落在午夜，春分、夏至、秋分依次对应清晨、正午与黄昏；另行标示真实日期所在节气。",
    facts: ["24 个节气", "72 候", "一年入一日"],
  },
  {
    slug: "taiji-day-night",
    number: "肆",
    titleZh: "太极昼夜",
    titleEn: "Taiji Day and Night",
    kicker: "阴阳随昼夜消长",
    rule: "一日一太极",
    ruleEn: "ONE DAY · ONE CONTINUOUS TAIJI",
    aspect: "square",
    canvas: { width: 900, height: 900 },
    series: "中国哲思",
    theme: "taiji",
    ambient: "#52646c",
    mappingKind: "contemporary",
    description:
      "让阴与阳的边界由本地时间持续推动，在午夜、黎明、正午和黄昏之间缓慢呼吸。",
    note:
      "太极不是静态图案；日进度改变明暗比例，秒钟只在墨色边缘留下轻微涟漪。",
    facts: ["昼夜消长", "四时节点", "本地民用时间"],
  },
  {
    slug: "yijing-hexagram-clock",
    number: "伍",
    titleZh: "易时·六十四卦",
    titleEn: "Sixty-Four Changes",
    kicker: "一日六十四变",
    rule: "一卦 · 二十二分三十秒",
    ruleEn: "1 HEXAGRAM · 22 MIN 30 SEC",
    aspect: "portrait",
    canvas: { width: 760, height: 1080 },
    series: "中国哲思",
    theme: "yijing",
    ambient: "#3f3a35",
    mappingKind: "contemporary",
    description:
      "以六根阴阳爻编码一天的六十四个时段，让时间在断续墨线之间生成卦象。",
    note:
      "采用伏羲二进制式排列表达时间状态，仅作当代时间编码，不提供吉凶或占卜解释。",
    facts: ["64 个时段", "六爻编码", "非占卜"],
  },
  {
    slug: "bronze-clepsydra",
    number: "陆",
    titleZh: "铜壶滴漏",
    titleEn: "Bronze Clepsydra",
    kicker: "水积而时见",
    rule: "水滴记秒 · 浮箭记日",
    ruleEn: "DROPS MARK SECONDS · FLOAT MARKS THE DAY",
    aspect: "portrait",
    canvas: { width: 760, height: 1080 },
    series: "古代计时器",
    theme: "clepsydra",
    ambient: "#55716b",
    mappingKind: "historical",
    description:
      "以日壶、月壶、星壶和受水壶构成纵向水路，让浮箭随着一天的积水缓缓上升。",
    note:
      "已积之水代表过去，浮箭所在水线标示当下，尚未抵达的铜尺刻度保留给未来。",
    facts: ["四层水路", "浮箭刻度", "水滴报时"],
  },
  {
    slug: "twenty-eight-mansions",
    number: "柒",
    titleZh: "四象二十八宿",
    titleEn: "Four Symbols and Twenty-Eight Mansions",
    kicker: "月行宿次",
    rule: "四象 · 各领七宿",
    ruleEn: "4 SYMBOLS · 7 MANSIONS EACH",
    aspect: "square",
    canvas: { width: 1000, height: 1000 },
    series: "中国天文",
    theme: "mansions",
    ambient: "#254e59",
    mappingKind: "historical",
    description:
      "让青龙、玄武、白虎与朱雀环列天盘，星图随一天旋转，月相随日期缓慢变化。",
    note:
      "月球位置采用近似天文计算，但不在缺少可靠宿界数据时宣称精确的当前星宿。",
    facts: ["四象", "28 宿", "近似月相"],
  },
  {
    slug: "zodiac-sky",
    number: "捌",
    titleZh: "十二星座·黄道天穹",
    titleEn: "Zodiac Sky",
    kicker: "世界星空系列",
    rule: "日期循黄道 · 时刻转天穹",
    ruleEn: "THE YEAR MOVES THE SUN · THE DAY TURNS THE SKY",
    aspect: "landscape",
    canvas: { width: 1200, height: 760 },
    series: "世界星空",
    theme: "zodiac-sky",
    ambient: "#334f83",
    mappingKind: "historical",
    description:
      "以深蓝玻璃般的黄道带展示太阳周年位置，并让天空随本地时刻持续转动。",
    note:
      "这里呈现等分黄道区段与传统星座图形，并明确区别于现代天文学的星座边界。",
    facts: ["12 个黄道区段", "太阳周年位置", "无星座运势"],
  },
  {
    slug: "sundial-gnomon",
    number: "玖",
    titleZh: "圭表日晷",
    titleEn: "Gnomon and Sundial",
    kicker: "一影量日与年",
    rule: "影向见时 · 影长见季",
    ruleEn: "DIRECTION MARKS HOURS · LENGTH MARKS SEASONS",
    aspect: "landscape",
    canvas: { width: 1100, height: 760 },
    series: "古代计时器",
    theme: "sundial",
    ambient: "#a26739",
    mappingKind: "historical",
    description:
      "把日晷的一日影向与圭表的一年影长并置，让同一道光同时衡量时刻与季节。",
    note:
      "未请求地理位置，画面是依据本地民用时间和日期生成的数字重构，不声称精确太阳时。",
    facts: ["日晷时刻", "圭表节令", "民用时间重构"],
  },
  {
    slug: "incense-seal-clock",
    number: "拾",
    titleZh: "香篆流时",
    titleEn: "Incense Seal Clock",
    kicker: "香尽而日成",
    rule: "灰为过去 · 烬为当下 · 香为未来",
    ruleEn: "ASH IS PAST · EMBER IS NOW · INCENSE IS NEXT",
    aspect: "square",
    canvas: { width: 960, height: 960 },
    series: "古代计时器",
    theme: "incense",
    ambient: "#9a5c45",
    mappingKind: "contemporary",
    description:
      "让一条香篆路径在一天中缓慢燃尽，以灰烬、余火和未燃香迹分别保存过去、当下与未来。",
    note:
      "历史香钟以预量香路计时；本作将完整路径压缩为一天，并在午夜重新铺香。",
    facts: ["香粉路径", "日进度燃痕", "午夜重置"],
  },
  {
    slug: "water-powered-armillary",
    number: "拾壹",
    titleZh: "水运仪象台",
    titleEn: "Water-Powered Astronomical Clock",
    kicker: "水力使天与时同转",
    rule: "上观天 · 中示象 · 下报时",
    ruleEn: "OBSERVE ABOVE · MODEL WITHIN · KEEP TIME BELOW",
    aspect: "landscape",
    canvas: { width: 1200, height: 820 },
    series: "古代计时器",
    theme: "armillary",
    ambient: "#526955",
    mappingKind: "historical",
    description:
      "以机械剖面重构水运仪象台，让浑仪、浑象、齿轮与报时木人在同一座天文钟中运行。",
    note:
      "秒钟推动步进机构，分钟牵动天球，每刻与整点触发无声报时动作；声音始终默认关闭。",
    facts: ["水力机械", "天象显示", "木人报时"],
  },
  {
    slug: "sexagenary-cycle",
    number: "拾贰",
    titleZh: "六十甲子",
    titleEn: "Sexagenary Cycle",
    kicker: "一分六十合",
    rule: "一秒一干支 · 一分一周天",
    ruleEn: "1 PAIR · 1 SECOND · 60 PAIRS · 1 MINUTE",
    aspect: "square",
    canvas: { width: 960, height: 960 },
    series: "中国时序",
    theme: "sexagenary",
    ambient: "#75613d",
    mappingKind: "contemporary",
    description:
      "让十天干与十二地支组成两层咬合圆环，在一分钟内依次显现完整六十甲子。",
    note:
      "这是把六十组合映射到六十秒的当代时间编码，并非传统的逐秒干支纪时。",
    facts: ["10 天干", "12 地支", "60 秒循环"],
  },
];

export function getClock(slug) {
  return clocks.find((clock) => clock.slug === slug);
}

export function routeFor(clock) {
  return `/${clock.slug}/`;
}

export function getClockNeighbors(slug) {
  const currentIndex = clocks.findIndex((clock) => clock.slug === slug);
  if (currentIndex === -1) return undefined;

  return {
    previous: clocks[(currentIndex - 1 + clocks.length) % clocks.length],
    current: clocks[currentIndex],
    next: clocks[(currentIndex + 1) % clocks.length],
  };
}

export const seriesOrder = ["中国时序", "中国哲思", "古代计时器", "中国天文", "世界星空"];
