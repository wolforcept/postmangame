// Usage:
//   node extract-streets.mjs map.png            -> lists the most common colors so you can pick the street color
//   node extract-streets.mjs map.png #aa3333    -> writes streets.ts with a list of rects
//   node extract-streets.mjs map.png #aa3333 streets.ts 40   (optional output name, color tolerance)
// Install dependency first: npm install pngjs
import fs from "node:fs";
import { PNG } from "pngjs";

const [input, colorArg, output = "streets.ts", tolArg = "30"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node extract-streets.mjs map.png [#rrggbb] [output.ts] [tolerance]");
  process.exit(1);
}

const png = PNG.sync.read(fs.readFileSync(input));
const { width, height, data } = png;
const px = (x, y) => {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

// Step 1: no color given -> show the most common opaque colors
if (!colorArg) {
  const counts = new Map();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = px(x, y);
      if (a === 0) continue;
      const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log(`Image is ${width}x${height}. Most common colors:`);
  for (const [hex, n] of top) console.log(`  ${hex}  ${n} px`);
  console.log("Pick the street color and run again with it as the second argument.");
  process.exit(0);
}

// Step 2: build a mask of street pixels
const target = [1, 3, 5].map((i) => parseInt(colorArg.slice(i, i + 2), 16));
const tol = Number(tolArg);
const mask = Array.from({ length: height }, (_, y) =>
  Array.from({ length: width }, (_, x) => {
    const [r, g, b, a] = px(x, y);
    if (a === 0) return false;
    return Math.abs(r - target[0]) <= tol && Math.abs(g - target[1]) <= tol && Math.abs(b - target[2]) <= tol;
  })
);

const rects = [];
const used = Array.from({ length: height }, () => Array(width).fill(false));

// Horizontal runs of 2+ pixels
for (let y = 0; y < height; y++) {
  let x = 0;
  while (x < width) {
    if (!mask[y][x]) { x++; continue; }
    let x2 = x;
    while (x2 + 1 < width && mask[y][x2 + 1]) x2++;
    if (x2 > x) {
      rects.push({ x, y, w: x2 - x + 1, h: 1 });
      for (let i = x; i <= x2; i++) used[y][i] = true;
    }
    x = x2 + 1;
  }
}

// Vertical runs (also catches isolated pixels, e.g. diagonals) over what's left
for (let x = 0; x < width; x++) {
  let y = 0;
  while (y < height) {
    if (!mask[y][x] || used[y][x]) { y++; continue; }
    let y2 = y;
    while (y2 + 1 < height && mask[y2 + 1][x] && !used[y2 + 1][x]) y2++;
    rects.push({ x, y, w: 1, h: y2 - y + 1 });
    y = y2 + 1;
  }
}

const body = rects.map((r) => `  { x: ${r.x}, y: ${r.y}, w: ${r.w}, h: ${r.h} }`).join(",\n");
fs.writeFileSync(output, `export const STREETS = [\n${body},\n];\n`);
console.log(`Wrote ${output} with ${rects.length} rects`);
