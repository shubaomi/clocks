export const phases = [
  { name: "金", english: "Metal", color: "#e9d4a2" },
  { name: "水", english: "Water", color: "#98d5cc" },
  { name: "木", english: "Wood", color: "#d2a270" },
  { name: "火", english: "Fire", color: "#ffac76" },
  { name: "土", english: "Earth", color: "#e3b48d" },
];

export function phaseAt(second, millisecond = 0) {
  const index = Math.floor(second / 12);
  const progress = (second % 12 + millisecond / 1000) / 12;
  return { index, next: (index + 1) % phases.length, progress };
}
