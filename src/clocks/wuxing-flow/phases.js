export const phases = [
  { name: "金", english: "Metal", color: "#e9d4a2", pigment: [208, 185, 138] },
  { name: "水", english: "Water", color: "#98d5cc", pigment: [94, 177, 171] },
  { name: "木", english: "Wood", color: "#d2a270", pigment: [166, 116, 69] },
  { name: "火", english: "Fire", color: "#ffac76", pigment: [226, 112, 61] },
  { name: "土", english: "Earth", color: "#e3b48d", pigment: [184, 137, 101] },
];

export function phaseAt(second, millisecond = 0) {
  const index = Math.floor(second / 12);
  const progress = (second % 12 + millisecond / 1000) / 12;
  return { index, next: (index + 1) % phases.length, progress };
}
