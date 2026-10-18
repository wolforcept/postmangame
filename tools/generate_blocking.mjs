// Usage: node generate-blocking.mjs [input.png] [output.ts]
// Install dependency first: npm install pngjs
import fs from "node:fs";
import { PNG } from "pngjs";

// const [input = "assets\\tilemap\\houses.png", output = "src\\houses.ts"] = process.argv.slice(2);
const [input = "assets\\tilemap\\blocking.png", output = "src\\blocking.ts"] = process.argv.slice(2);
const TILE = 8;

const png = PNG.sync.read(fs.readFileSync(input));
const { width, height, data } = png;

if (width % TILE !== 0 || height % TILE !== 0) {
  console.warn(
    `Warning: image is ${width}x${height}, not a multiple of ${TILE}. Partial tiles are ignored.`
  );
}

const cols = Math.floor(width / TILE);
const rows = Math.floor(height / TILE);

const blocking = [];
for (let ty = 0; ty < rows; ty++) {
  const row = [];
  for (let tx = 0; tx < cols; tx++) {
    // Only the top-left pixel of each tile is checked
    const x = tx * TILE;
    const y = ty * TILE;
    const alpha = data[(y * width + x) * 4 + 3];
    row.push(alpha !== 0); // transparent -> false, anything else -> true
  }
  blocking.push(row);
}

const body = blocking.map((row) => `  [${row.join(",")}]`).join(",\n");
const source = `export const BLOCKING: boolean[][] = [\n${body},\n];\n`;

fs.writeFileSync(output, source);
console.log(`Wrote ${output} (${cols}x${rows} tiles)`);
