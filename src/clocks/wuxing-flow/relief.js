const tau = Math.PI * 2;
const { sin, cos } = Math;

function wash(ctx, x1, y1, x2, y2, stops) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(([at, color]) => gradient.addColorStop(at, color));
  return gradient;
}

function outline(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
}

function oval(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, tau);
  ctx.fillStyle = fill;
  ctx.fill();
}

function contact(ctx, width, strength) {
  ctx.save();
  ctx.translate(313, 364);
  ctx.scale(width, 22);
  const shade = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  shade.addColorStop(0, `rgba(3,9,8,${strength})`);
  shade.addColorStop(1, "rgba(3,9,8,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

// A half-twist turns the outside of the ribbon into its inside. Sort short
// segments by depth so that the far return disappears behind the near lip.
function metal(ctx, t) {
  const turn = -0.31 + 0.35 * sin(t * tau);
  function vertex(u, v) {
    const twist = u / 2 + 0.5;
    const radius = 130 + v * 54 * cos(twist);
    const x = radius * cos(u),
      y = radius * sin(u);
    const z = v * 54 * sin(twist) + 19 * sin(2 * u) + 5 * (1 - v * v);
    const side = x * cos(turn) + z * sin(turn);
    const depth = -x * sin(turn) + z * cos(turn);
    return [309 + side * 1.17 + y * 0.29, 213 + y * 0.86 - side * 0.32 + depth * 0.48, depth - y * 0.47];
  }
  const segments = [];
  for (let i = 0; i < 152; i++) {
    const u = (tau * i) / 152,
      end = (tau * (i + 1)) / 152;
    const a = vertex(u, -1),
      b = vertex(end, -1),
      c = vertex(end, 1),
      d = vertex(u, 1);
    segments.push({ a, b, c, d, u, depth: (a[2] + b[2] + c[2] + d[2]) / 4 });
  }
  contact(ctx, 133, 0.52);
  for (const { a, b, c, d, u } of segments.sort((a, b) => a.depth - b.depth)) {
    const surface = ctx.createLinearGradient(a[0], a[1], d[0], d[1]);
    for (let j = 0; j <= 6; j++) {
      const v = j / 6;
      // The width coordinate reverses on the return of the half-twist.
      // Multiplying it by cos(u/2) makes the studio reflections meet there.
      const theta = u + (v - 0.5) * 1.45 * cos(u / 2) + turn * 1.8;
      const reflection = 0.5 + 0.5 * cos(theta + 0.65);
      const windowLight = (0.5 + 0.5 * cos(theta * 2 - 0.7)) ** 12;
      const light = 0.12 + 0.59 * reflection + 0.54 * windowLight;
      surface.addColorStop(
        v,
        `rgb(${Math.min(255, 21 + light * 240)} ${Math.min(253, 20 + light * 202)} ${Math.min(230, 18 + light * 138)})`,
      );
    }
    outline(ctx, [a, b, c, d]);
    ctx.fillStyle = ctx.strokeStyle = surface;
    ctx.lineWidth = 0.55;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.moveTo(d[0], d[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.strokeStyle = `rgba(255,235,178,${0.34 + 0.49 * (0.5 + 0.5 * cos(u + turn))})`;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
}

function water(ctx, t) {
  // The impact is the origin of successive waves. The drop is absent for
  // the instant it joins the surface, then gathers for the next fall.
  const cycle = t * 4;
  const age = cycle % 1;
  const fall = Math.max(0, (age - 0.23) / 0.77);
  contact(ctx, 187, 0.46);
  const pool = ctx.createRadialGradient(289, 305, 4, 309, 316, 195);
  pool.addColorStop(0, "#a3cabb");
  pool.addColorStop(0.27, "#568a87");
  pool.addColorStop(0.72, "#294e50");
  pool.addColorStop(1, "#233d3c");
  oval(ctx, 311, 317, 192, 53, pool);
  for (let i = 0; i < 7; i++) {
    const r = (i + age) / 7;
    ctx.beginPath();
    ctx.ellipse(311, 316, 4 + r * 183, 1 + r * 50, -0.018, 0, tau);
    ctx.strokeStyle = wash(ctx, 120, 315, 500, 315, [
      [0, "#3a5a58"],
      [0.3, "#a6d3c4"],
      [0.51, "#dfecdc"],
      [0.73, "#396e70"],
      [1, "#80b4a9"],
    ]);
    ctx.globalAlpha = 0.8 - r * 0.49;
    ctx.lineWidth = 2.8 - 1.7 * r;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const size = 0.32 + 1.11 * Math.min(1, age / 0.22);
  ctx.save();
  const y = 104 + fall * fall * 165;
  ctx.translate(310, y);
  ctx.scale(size, size);
  const drop = new Path2D("M0 -44 C-2 -24 -26 -5 -26 14 C-26 46 22 50 26 17 C29 -3 7 -22 0 -44Z");
  const body = ctx.createRadialGradient(-9, 1, 1, 3, 10, 39);
  body.addColorStop(0, "#e5f7e5");
  body.addColorStop(0.22, "#8ec1b5");
  body.addColorStop(0.58, "#3d7173");
  body.addColorStop(0.78, "#204950");
  body.addColorStop(1, "#b2dfd0");
  ctx.fillStyle = body;
  ctx.fill(drop);
  ctx.strokeStyle = "#d0ead9";
  ctx.lineWidth = 1.2;
  ctx.stroke(drop);
  ctx.beginPath();
  ctx.moveTo(-6, -17);
  ctx.quadraticCurveTo(-17, -4, -18, 8);
  ctx.strokeStyle = "#eff9e6";
  ctx.lineWidth = 2.3;
  ctx.stroke();
  ctx.restore();
}

function ringPoint(angle, r) {
  const rough =
    1 + 0.056 * sin(3 * angle + r) + 0.031 * sin(7 * angle - r) + 0.017 * sin(13 * angle + 2 * r);
  return [r * 153 * rough * cos(angle) - (1 - r) * 42, r * 113 * rough * sin(angle) + (1 - r) * 13];
}

// Fixed patterns stay attached to the surface while it turns.
function grain(seed) {
  const n = sin(seed * 78.233 + 11.7) * 43758.5453;
  return n - Math.floor(n);
}
const edge = Array.from({ length: 145 }, (_, i) => ringPoint((i / 144) * tau, 1));
let growthRings;
function makeGrowthRing(_, i) {
  const r = (i + 0.8 + 0.67 * grain(i)) / 60;
  const ring = new Path2D();
  edge.forEach((_, j) => {
    const angle = (j / 144) * tau;
    const point = ringPoint(angle, r + 0.005 * sin(angle * 4 + i * 0.3));
    if (j === 0) ring.moveTo(...point);
    else ring.lineTo(...point);
  });
  ring.closePath();
  return ring;
}

function wood(ctx, t) {
  contact(ctx, 163, 0.56);
  ctx.save();
  ctx.translate(317, 216);
  ctx.rotate(-0.19 + 0.07 * sin(t * tau));
  // A short bark-covered section behind the end grain, seen obliquely.
  for (let i = 0; i < 144; i++) {
    const a = edge[i],
      b = edge[i + 1];
    if ((b[0] - a[0]) * 46 - (b[1] - a[1]) * 25 >= 0) continue;
    const bark = 42 + Math.round(18 * grain(i) + 14 * cos(i * 0.1));
    outline(ctx, [a, b, [b[0] + 25, b[1] + 46], [a[0] + 25, a[1] + 46]]);
    ctx.fillStyle = `rgb(${bark + 29} ${bark + 8} ${bark - 5})`;
    ctx.fill();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    const split = grain(i + 39);
    ctx.beginPath();
    ctx.moveTo(a[0] + 3, a[1] + 5);
    ctx.lineTo(a[0] + 6 + split * 7, a[1] + 16);
    ctx.lineTo(a[0] + 13 + split * 3, a[1] + 24);
    ctx.lineTo(a[0] + 18 + split * 6, a[1] + 33 + split * 12);
    ctx.strokeStyle = "#3b2b20ac";
    ctx.lineWidth = 0.8 + 1.6 * split;
    ctx.stroke();
  }
  outline(ctx, edge);
  ctx.fillStyle = wash(ctx, -140, -80, 124, 127, [
    [0, "#ebc893"],
    [0.38, "#cf9c64"],
    [0.78, "#aa794e"],
    [1, "#846039"],
  ]);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#67492f";
  ctx.stroke();
  growthRings ??= Array.from({ length: 57 }, makeGrowthRing);
  growthRings.forEach((ring, i) => {
    ctx.strokeStyle = i % 4 === 0 ? "#69412199" : "#79523060";
    ctx.lineWidth = 0.5 + grain(i) * 1.6;
    ctx.stroke(ring);
  });
  for (let i = 0; i < 95; i++) {
    const angle = grain(i + 500) * tau,
      r = 0.25 + 0.55 * grain(i + 72);
    const a = ringPoint(angle, r),
      b = ringPoint(angle + 0.005, r + 0.04 + 0.14 * grain(i + 322));
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.strokeStyle = "#fce3b65e";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  for (const [angle, length] of [
    [0.42, 0.42],
    [2.16, 0.22],
    [3.8, 0.31],
    [5.5, 0.13],
  ]) {
    const a = ringPoint(angle, 1),
      b = ringPoint(angle + 0.015, 1),
      tip = ringPoint(angle + 0.085, 1 - length);
    outline(ctx, [a, b, tip]);
    ctx.fillStyle = "#56371f";
    ctx.fill();
  }
  ctx.restore();
}

function fire(ctx, t) {
  const wave = t * tau * 3;
  const glow = ctx.createRadialGradient(306, 285, 6, 306, 274, 134);
  glow.addColorStop(0, "#f4a54d55");
  glow.addColorStop(0.54, "#df653a1c");
  glow.addColorStop(1, "#b94a2300");
  ctx.fillStyle = glow;
  ctx.fillRect(165, 132, 288, 285);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let plume = 0; plume < 4; plume++) {
    const shift = [-38, 37, 8, -8][plume],
      height = [175, 212, 286, 141][plume];
    for (let layer = 0; layer < 18; layer++) {
      const r = 1 - layer / 19,
        left = [],
        right = [];
      for (let j = 0; j <= 36; j++) {
        const h = j / 36;
        const sway = h * (23 * sin(h * 6.8 - wave + plume * 1.7) + 21 * sin(h * 4.4 + wave * 0.67));
        const x = 310 + shift * (1 - 0.3 * h) + sway;
        const y = 350 - h * height * (0.36 + 0.64 * r) * (0.95 + 0.05 * sin(wave + plume));
        const width = (plume === 2 ? 54 : 37) * r * sin(Math.PI * h) ** 0.67 * (1 - 0.7 * h);
        left.push([x - width, y]);
        right.push([x + width, y]);
      }
      outline(ctx, [...left, ...right.reverse()]);
      ctx.fillStyle =
        plume === 3
          ? "rgba(239,192,105,.072)"
          : layer > 10
            ? "rgba(240,123,32,.075)"
            : "rgba(225,54,13,.075)";
      ctx.fill();
    }
  }
  ctx.restore();
}

function earth(ctx, t) {
  contact(ctx, 190, 0.58);
  const drift = sin(t * tau) * 0.14;
  // A vertical cut through folded strata, with the narrow return face in shadow.
  const corners = [
    [122, 185],
    [351, 221],
    [493, 146],
    [270, 115],
  ];
  function surface(face, x, h) {
    const a = corners[face],
      b = corners[face + 1];
    const envelope = sin(Math.PI * x);
    const fold =
      envelope *
      (25 * sin(x * 5 + face * 2 + h * 1.2) + 6 * cos(x * 14 + drift) + 2 * sin(x * 53 + h * 0.7));
    const chipped = envelope * (3.4 * sin(x * 21) + 1.6 * sin(x * 67));
    return [
      a[0] + (b[0] - a[0]) * x + chipped - (face === 0 ? 1 - x : x) * 11 * h,
      a[1] + (b[1] - a[1]) * x + fold + (130 + 10 * sin((face * Math.PI) / 2 + (x * Math.PI) / 2)) * h,
    ];
  }
  // Both faces meet at the same stratigraphic depth at their shared corner.
  const bands = [
    "#916344",
    "#e0bc8d",
    "#b48158",
    "#694735",
    "#c1966b",
    "#d9ae79",
    "#84553b",
    "#b18d68",
    "#674c40",
  ];
  const boundaries = [0, 0.07, 0.2, 0.28, 0.32, 0.47, 0.6, 0.7, 0.84, 1];
  for (let face = 0; face < 2; face++) {
    for (let i = 0; i < bands.length; i++) {
      const line = (h) => Array.from({ length: 49 }, (_, j) => surface(face, j / 48, h));
      outline(ctx, [...line(boundaries[i]), ...line(boundaries[i + 1]).reverse()]);
      ctx.fillStyle = bands[i];
      ctx.fill();
      ctx.strokeStyle = bands[i];
      ctx.lineWidth = 0.8;
      ctx.stroke();
      if (face === 1) {
        ctx.fillStyle = "#231c174e";
        ctx.fill();
      }
      for (let k = 1; k <= 3; k++) {
        const points = line(boundaries[i] + ((boundaries[i + 1] - boundaries[i]) * k) / 4);
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        for (const p of points.slice(1)) ctx.lineTo(...p);
        ctx.strokeStyle = k === 1 ? "#fae1a838" : "#3d30232e";
        ctx.stroke();
      }
    }
    for (let j = 0; j < 670; j++) {
      const [x, y] = surface(face, grain(j + 54), grain(j + 860));
      ctx.fillStyle = j % 3 === 0 ? "#ffe5b94a" : "#46372665";
      ctx.fillRect(x, y, 0.7 + grain(j + 251) * 2.6, 0.6 + grain(j + 29));
    }
    const front = Array.from({ length: 49 }, (_, j) => surface(face, j / 48, 0));
    const base = Array.from({ length: 49 }, (_, j) => surface(face, j / 48, 1)).reverse();
    outline(ctx, [...front, ...base]);
    ctx.fillStyle = wash(ctx, 140 + drift * 110, 170, 435, 330, [
      [0, "#ffddaa20"],
      [0.55, "#422a180a"],
      [1, "#221a1847"],
    ]);
    ctx.fill();
  }
  const lip = Array.from({ length: 49 }, (_, j) => surface(0, j / 48, 0));
  const side = Array.from({ length: 49 }, (_, j) => surface(1, j / 48, 0));
  outline(ctx, [...lip, ...side, corners[3]]);
  ctx.fillStyle = wash(ctx, 180, 124, 392, 230, [
    [0, "#ecd5b0"],
    [0.5, "#bc9770"],
    [1, "#ab8862"],
  ]);
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let j = 0; j < 48; j++) {
    ctx.beginPath();
    for (let k = 0; k <= 50; k++) {
      const x = 100 + k * 8,
        y = 103 + j * 3.4 + 11 * sin(x * 0.027 + j * 0.15 + drift) + 5 * cos(x * 0.048 - j * 0.09);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = j % 5 === 0 ? "#6c58417a" : "#705e473a";
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
  ctx.restore();
}

const materials = [metal, water, wood, fire, earth];

export function createReliefRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof Path2D === "undefined") return null;
  const sx = canvas.width / 620,
    sy = canvas.height / 450;
  ctx.setTransform(sx, 0, 0, sy, 0, 0);
  let incoming;
  let incomingIndex = -1;
  return (index, progress, moving) => {
    ctx.clearRect(0, 0, 620, 450);
    materials[index](ctx, moving ? progress : 0.36);
    if (!moving || progress <= 0.88) return;
    // Composite the incoming study as one image, preserving its internal
    // translucency. Allocate the small scratch surface only at a transition.
    if (!incoming) {
      const layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;
      incoming = layer.getContext("2d");
      if (!incoming) return;
      incoming.setTransform(sx, 0, 0, sy, 0, 0);
    }
    const next = (index + 1) % materials.length;
    if (incomingIndex !== next) {
      incoming.clearRect(0, 0, 620, 450);
      materials[next](incoming, 0);
      incomingIndex = next;
    }
    const f = (progress - 0.88) / 0.12,
      mix = f * f * (3 - 2 * f);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${mix})`;
    ctx.fillRect(0, 0, 620, 450);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = mix;
    ctx.drawImage(incoming.canvas, 0, 0, 620, 450);
    ctx.restore();
  };
}
