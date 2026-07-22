const TAU = Math.PI * 2;
const DAY_MS = 86400000;

export const solarTerms = [
  ["冬至", "Winter Solstice", ["蚯蚓结", "麋角解", "水泉动"]],
  ["小寒", "Minor Cold", ["雁北乡", "鹊始巢", "雉始雊"]],
  ["大寒", "Major Cold", ["鸡始乳", "征鸟厉疾", "水泽腹坚"]],
  ["立春", "Start of Spring", ["东风解冻", "蛰虫始振", "鱼陟负冰"]],
  ["雨水", "Rain Water", ["獭祭鱼", "鸿雁来", "草木萌动"]],
  ["惊蛰", "Awakening of Insects", ["桃始华", "仓庚鸣", "鹰化为鸠"]],
  ["春分", "Spring Equinox", ["玄鸟至", "雷乃发声", "始电"]],
  ["清明", "Pure Brightness", ["桐始华", "田鼠化为鴽", "虹始见"]],
  ["谷雨", "Grain Rain", ["萍始生", "鸣鸠拂其羽", "戴胜降于桑"]],
  ["立夏", "Start of Summer", ["蝼蝈鸣", "蚯蚓出", "王瓜生"]],
  ["小满", "Grain Buds", ["苦菜秀", "靡草死", "麦秋至"]],
  ["芒种", "Grain in Ear", ["螳螂生", "鵙始鸣", "反舌无声"]],
  ["夏至", "Summer Solstice", ["鹿角解", "蜩始鸣", "半夏生"]],
  ["小暑", "Minor Heat", ["温风至", "蟋蟀居壁", "鹰始挚"]],
  ["大暑", "Major Heat", ["腐草为萤", "土润溽暑", "大雨时行"]],
  ["立秋", "Start of Autumn", ["凉风至", "白露降", "寒蝉鸣"]],
  ["处暑", "End of Heat", ["鹰乃祭鸟", "天地始肃", "禾乃登"]],
  ["白露", "White Dew", ["鸿雁来", "玄鸟归", "群鸟养羞"]],
  ["秋分", "Autumn Equinox", ["雷始收声", "蛰虫坯户", "水始涸"]],
  ["寒露", "Cold Dew", ["鸿雁来宾", "雀入大水为蛤", "菊有黄华"]],
  ["霜降", "Frost Descent", ["豺乃祭兽", "草木黄落", "蛰虫咸俯"]],
  ["立冬", "Start of Winter", ["水始冰", "地始冻", "雉入大水为蜃"]],
  ["小雪", "Minor Snow", ["虹藏不见", "天气上升地气下降", "闭塞而成冬"]],
  ["大雪", "Major Snow", ["鹖鴠不鸣", "虎始交", "荔挺出"]],
].map(([zh, en, pentads], index) => ({ index, zh, en, pentads }));

export const trigrams = [
  { zh: "坤", en: "Earth", symbol: "☷", bits: [0, 0, 0] },
  { zh: "震", en: "Thunder", symbol: "☳", bits: [1, 0, 0] },
  { zh: "坎", en: "Water", symbol: "☵", bits: [0, 1, 0] },
  { zh: "兑", en: "Lake", symbol: "☱", bits: [1, 1, 0] },
  { zh: "艮", en: "Mountain", symbol: "☶", bits: [0, 0, 1] },
  { zh: "离", en: "Fire", symbol: "☲", bits: [1, 0, 1] },
  { zh: "巽", en: "Wind", symbol: "☴", bits: [0, 1, 1] },
  { zh: "乾", en: "Heaven", symbol: "☰", bits: [1, 1, 1] },
];

const hexagramNames = Array(64);
[
  [63, "乾"], [0, "坤"], [17, "屯"], [34, "蒙"], [23, "需"], [58, "讼"],
  [2, "师"], [16, "比"], [55, "小畜"], [59, "履"], [7, "泰"], [56, "否"],
  [61, "同人"], [47, "大有"], [4, "谦"], [8, "豫"], [25, "随"], [38, "蛊"],
  [3, "临"], [48, "观"], [41, "噬嗑"], [37, "贲"], [32, "剥"], [1, "复"],
  [57, "无妄"], [39, "大畜"], [33, "颐"], [30, "大过"], [18, "坎"], [45, "离"],
  [28, "咸"], [14, "恒"], [60, "遁"], [15, "大壮"], [40, "晋"], [5, "明夷"],
  [53, "家人"], [43, "睽"], [20, "蹇"], [10, "解"], [35, "损"], [49, "益"],
  [31, "夬"], [62, "姤"], [24, "萃"], [6, "升"], [26, "困"], [22, "井"],
  [29, "革"], [46, "鼎"], [9, "震"], [36, "艮"], [52, "渐"], [11, "归妹"],
  [13, "丰"], [44, "旅"], [54, "巽"], [27, "兑"], [50, "涣"], [19, "节"],
  [51, "中孚"], [12, "小过"], [21, "既济"], [42, "未济"],
].forEach(([index, name]) => { hexagramNames[index] = name; });

export const fourSymbols = [
  { zh: "青龙", en: "Azure Dragon", direction: "东", color: "#66a7a0", mansions: ["角", "亢", "氐", "房", "心", "尾", "箕"] },
  { zh: "玄武", en: "Black Tortoise", direction: "北", color: "#7183a5", mansions: ["斗", "牛", "女", "虚", "危", "室", "壁"] },
  { zh: "白虎", en: "White Tiger", direction: "西", color: "#d5d1c7", mansions: ["奎", "娄", "胃", "昴", "毕", "觜", "参"] },
  { zh: "朱雀", en: "Vermilion Bird", direction: "南", color: "#d36a58", mansions: ["井", "鬼", "柳", "星", "张", "翼", "轸"] },
];

export const zodiacSigns = [
  ["白羊", "Aries", "♈"], ["金牛", "Taurus", "♉"], ["双子", "Gemini", "♊"],
  ["巨蟹", "Cancer", "♋"], ["狮子", "Leo", "♌"], ["处女", "Virgo", "♍"],
  ["天秤", "Libra", "♎"], ["天蝎", "Scorpio", "♏"], ["射手", "Sagittarius", "♐"],
  ["摩羯", "Capricorn", "♑"], ["水瓶", "Aquarius", "♒"], ["双鱼", "Pisces", "♓"],
].map(([zh, en, symbol], index) => ({ index, zh, en, symbol }));

export const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const sexagenaryPairs = Array.from({ length: 60 }, (_, index) => ({
  index,
  stem: heavenlyStems[index % heavenlyStems.length],
  branch: earthlyBranches[index % earthlyBranches.length],
  name: `${heavenlyStems[index % heavenlyStems.length]}${earthlyBranches[index % earthlyBranches.length]}`,
}));

const normalize = (value, modulo) => ((value % modulo) + modulo) % modulo;

export function elapsedDay(time) {
  return time.hour + time.minute / 60 + time.second / 3600 + (time.millisecond || 0) / 3600000;
}

export function getSolarTermCompressionState(time) {
  const termIndex = time.hour % 24;
  const millisecondInTerm =
    time.minute * 60000 + time.second * 1000 + (time.millisecond || 0);
  const minuteInTerm = millisecondInTerm / 60000;
  const pentadInTerm = Math.min(2, Math.floor(minuteInTerm / 20));
  const term = solarTerms[termIndex];
  return {
    termIndex,
    term,
    pentadInTerm,
    pentadIndex: termIndex * 3 + pentadInTerm,
    pentad: term.pentads[pentadInTerm],
    termProgress: minuteInTerm / 60,
    pentadProgress: (minuteInTerm % 20) / 20,
  };
}

export function getSunLongitude(date) {
  const julianDay = date.getTime() / DAY_MS + 2440587.5;
  const days = julianDay - 2451545;
  const meanLongitude = normalize(280.46 + 0.9856474 * days, 360);
  const anomaly = normalize(357.528 + 0.9856003 * days, 360) * Math.PI / 180;
  return normalize(meanLongitude + 1.915 * Math.sin(anomaly) + 0.02 * Math.sin(2 * anomaly), 360);
}

export function getActualSolarTerm(date) {
  const longitude = getSunLongitude(date);
  const index = Math.floor(normalize(longitude - 270, 360) / 15);
  return { ...solarTerms[index], longitude };
}

export function getHexagramState(time) {
  const progress = elapsedDay(time) / 24;
  const index = Math.min(63, Math.floor(progress * 64));
  const lower = trigrams[index & 7];
  const upper = trigrams[(index >> 3) & 7];
  return {
    index,
    number: index + 1,
    name: hexagramNames[index],
    lines: Array.from({ length: 6 }, (_, line) => (index >> line) & 1),
    lower,
    upper,
    progress: progress * 64 - index,
  };
}

export function getClepsydraState(time) {
  const progress = elapsedDay(time) / 24;
  return {
    progress,
    float: progress,
    levels: [1 - progress * 0.26, 0.76, 0.66, progress],
  };
}

export function getMoonPhase(date) {
  const referenceNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const lunations = (date.getTime() - referenceNewMoon) / DAY_MS / 29.530588853;
  return normalize(lunations, 1);
}

export function getMansionState(time) {
  const date = new Date(time.timestamp);
  return {
    rotation: (elapsedDay(time) / 24) * 360,
    moonPhase: getMoonPhase(date),
    moonOrbit: normalize(getMoonPhase(date) + elapsedDay(time) / 24 / 29.530588853, 1),
  };
}

export function getZodiacSkyState(time) {
  const date = new Date(time.timestamp);
  const longitude = getSunLongitude(date);
  const index = Math.floor(longitude / 30) % 12;
  return {
    index,
    sign: zodiacSigns[index],
    longitude,
    skyRotation: (elapsedDay(time) / 24) * 360,
  };
}

export function getSundialState(time) {
  const dayAngle = ((time.dayOfYear || 1) - 172) / 365.2422 * TAU;
  const summerFactor = (Math.cos(dayAngle) + 1) / 2;
  return {
    shadowAngle: elapsedDay(time) / 24 * 360 - 180,
    shadowLength: 0.36 + (1 - summerFactor) * 0.48,
    seasonProgress: normalize(((time.dayOfYear || 1) - 1) / 365.2422, 1),
  };
}

export function getIncenseState(time) {
  const progress = elapsedDay(time) / 24;
  return {
    progress,
    segment: Math.min(99, Math.floor(progress * 100)),
    ember: progress * 100,
  };
}

export function getArmillaryState(time) {
  return {
    escapement: time.second,
    quarter: Math.floor(time.minute / 15),
    quarterActive: time.minute % 15 === 0 && time.second < 5,
    hourActive: time.minute === 0 && time.second < 8,
    sphereRotation: elapsedDay(time) / 24 * 360,
  };
}

export function getSexagenaryState(time) {
  const index = time.second % 60;
  return {
    ...sexagenaryPairs[index],
    progress: ((time.millisecond || 0) / 1000),
    stemRotation: index / 10 * 360,
    branchRotation: index / 12 * 360,
  };
}
