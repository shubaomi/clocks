import { phases } from "./phases.js";

// Each material is a stack of horizontal sections. All five use the same
// topology so a slice can pass into its successor without replacing the object.
const turn = Math.PI * 2;
const layers = 24;
const sides = 36;
const mix = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

function section(phase, h, angle, wave) {
  let radius, height, shift = 0, twist = 0;
  switch (phase) {
    case 0: { // Planed faces and two sharp shoulders in the metal.
      const facet = Math.cos(Math.PI / 6) / Math.cos((angle + Math.PI / 6) % (turn / 6) - Math.PI / 6);
      const shoulder = Math.min(1, .62 + h * 2, .52 + (1 - h) * 1.6);
      radius = 145 * facet * shoulder;
      height = 226 * h;
      twist = .52 * h;
      break;
    }
    case 1: // Travelling crests on a shallow, dished surface.
      radius = 36 + 144 * Math.sin(h * Math.PI * .79) + 9 * Math.sin(h * 19 - wave);
      height = 100 * h + h * (17 * Math.sin(angle * 3 + wave + h * 3) + 8 * Math.cos(angle * 2 - wave));
      break;
    case 2: // Eccentric growth and a sloped end-grain cut.
      radius = (96 + 20 * (1 - h) ** 4) * (1 + .073 * Math.cos(angle * 5 + .8 * h) + .037 * Math.sin(angle * 9));
      height = h * (201 + 32 * Math.cos(angle + .4));
      shift = 23 * h;
      break;
    case 3: // A twisting waist and a fine, leaning flame tip.
      radius = 112 * Math.sin(Math.PI * (.23 + h * .77)) ** 1.4 * (1 - h * .58);
      radius *= 1 + .35 * Math.sin(angle * 3 + 4.6 * h + wave);
      height = h * 270 + 34 * Math.sin(angle * 3 + h * 4 + wave) * Math.sin(h * Math.PI);
      shift = 48 * h * h + 27 * Math.sin(h * 7 + wave) * h;
      twist = 1.65 * h;
      break;
    default: { // Shelves of sediment with irregular exposed edges.
      const shelf = Math.floor(h * 5) / 5;
      radius = (156 - 75 * shelf) * (1 + .085 * Math.sin(angle * 3 + h) + .05 * Math.cos(angle * 5 - .6));
      height = 146 * h + h * 11 * Math.sin(angle * 2 + h * 4);
      shift = -19 * h;
    }
  }
  return [radius * Math.cos(angle + twist) + shift, height, radius * Math.sin(angle + twist)];
}

function project([x, y, z], rotation) {
  const across = x * rotation.cos - z * rotation.sin;
  const depth = x * rotation.sin + z * rotation.cos;
  return { x: 309 + across * 1.24, y: 360 + depth * .45 - y, depth: depth + y * .38 };
}

function polygon(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function tint(pigment, brightness) {
  return `rgb(${pigment.map(channel => Math.min(255, Math.round(channel * brightness))).join(" ")})`;
}

function brightness(phase, light, row, col, wave) {
  const h = row / layers;
  switch (phase) {
    case 0: return .34 + .65 * light + .47 * light ** 12;
    case 1: return .37 + .68 * light + .24 * Math.sin(h * 18 - wave) ** 8;
    case 2: return .48 + .46 * light + .13 * Math.sin(col * 2.8 + h * 1.8) ** 2;
    case 3: return .58 + .46 * light + .29 * (1 - h) * Math.cos(col / sides * 19 + h * 6 - wave) ** 2;
    default: return .47 + .42 * light + .21 * Math.sin(row * 1.6) ** 4;
  }
}

export function drawRelief(ctx, index, progress, moving) {
  const position = moving ? progress : .42;
  const blend = moving ? ease(Math.max(0, (progress - .85) / .15)) : 0;
  const next = (index + 1) % phases.length;
  const pigment = phases[index].pigment.map((v, i) => mix(v, phases[next].pigment[i], blend));
  const wave = position * turn;
  const angle = -.64 + (moving ? (index + progress) * turn / 5 : index * .4);
  const rotation = { cos: Math.cos(angle), sin: Math.sin(angle) };
  const faces = [];
  const rows = [];
  ctx.clearRect(0, 0, 620, 450);

  // Directional contact shadow, with a soft tail cast onto the ground plane.
  ctx.save();
  ctx.translate(332, 365);
  ctx.rotate(-.11);
  ctx.scale(1, .24);
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, 196);
  shadow.addColorStop(0, "rgba(2,9,8,.88)");
  shadow.addColorStop(.56, "rgba(2,9,8,.44)");
  shadow.addColorStop(1, "rgba(2,9,8,0)");
  ctx.fillStyle = shadow;
  ctx.fillRect(-196, -196, 392, 392);
  ctx.restore();

  for (let row = 0; row <= layers; row++) {
    const ring = [];
    for (let col = 0; col < sides; col++) {
      const h = row / layers;
      const azimuth = col / sides * turn;
      let point = section(index, h, azimuth, wave);
      if (blend > 0) {
        const target = section(next, h, azimuth, wave);
        point = point.map((v, i) => mix(v, target[i], blend));
      }
      ring.push(project(point, rotation));
    }
    rows.push(ring);
  }

  for (let row = 0; row < layers; row++) {
    for (let col = 0; col < sides; col++) {
      const right = (col + 1) % sides;
      const a = rows[row][col], b = rows[row][right];
      const c = rows[row + 1][right], d = rows[row + 1][col];
      const dx = d.x - a.x, dy = d.y - a.y;
      if ((b.x - a.x) * dy - (b.y - a.y) * dx <= 0) continue;
      const edge = Math.atan2(b.y - a.y, b.x - a.x);
      const lambert = Math.max(0, Math.cos(edge - 2.64));
      const shade = brightness(index, lambert, row, col, wave);
      const light = blend ? mix(shade, brightness(next, lambert, row, col, wave), blend) : shade;
      const heat = (index === 3 ? 1 - blend : next === 3 ? blend : 0) * (1 - row / layers) * lambert ** 3;
      const faceColor = heat ? [pigment[0] + 22 * heat, pigment[1] + 77 * heat, pigment[2] + 16 * heat] : pigment;
      faces.push({ points: [a, b, c, d], depth: (a.depth + b.depth + c.depth + d.depth) / 4,
        fill: tint(faceColor, light) });
    }
  }
  faces.sort((a, b) => a.depth - b.depth);
  // Seal the subpixel seams between neighbouring facets.
  ctx.lineWidth = .55;
  ctx.lineJoin = "round";
  for (const face of faces) {
    polygon(ctx, face.points, face.fill);
    ctx.strokeStyle = face.fill;
    ctx.stroke();
  }

  const top = rows[layers];
  const cap = ctx.createLinearGradient(112, 100, 466, 220);
  cap.addColorStop(0, tint(pigment, 1.19));
  cap.addColorStop(.68, tint(pigment, .94));
  cap.addColorStop(1, tint(pigment, .75));
  polygon(ctx, top, cap);
  // This finish gives wood its end grain, water its concentric wavelets,
  // and stone its cut strata. Fire closes to a single point.
  const center = top.reduce((sum, p) => ({ x: sum.x + p.x / sides, y: sum.y + p.y / sides }), { x: 0, y: 0 });
  const ringCount = [3, 9, 16, 0, 5][index];
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = index === 1 ? "rgba(226,255,240,.65)" : "rgba(61,39,22,.48)";
  for (let step = 1; step <= ringCount; step++) {
    const radius = step / (ringCount + 1);
    ctx.beginPath();
    for (let k = 0; k <= sides; k++) {
      const p = top[k % sides];
      const w = index === 2 ? .019 * Math.sin(k / sides * turn * 3 + step * .41) : 0;
      const x = mix(center.x, p.x, radius + w), y = mix(center.y, p.y, radius + w);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
