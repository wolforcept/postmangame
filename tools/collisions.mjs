// Converts a black & white PNG into collision rects. Black = solid, white or transparent = free.
// Usage: npm run collisions
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const input = 'assets/tilemap/collisions.png';
const output = 'src/worldCollisions.ts';

const image = decodePng(readFileSync(input));
const rects = toRects(image);
writeFileSync(output, toTs(rects));
console.log(`${input} (${image.width}x${image.height}) -> ${rects.length} rects in ${output}`);

/** Minimal PNG decoder: non-interlaced, any color type, bit depth 1-16. Returns RGBA bytes. */
function decodePng(buf) {
    if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error(`${input} is not a PNG`);

    let width = 0, height = 0, depth = 0, colorType = 0, palette = null, transparency = null;
    const idat = [];
    for (let at = 8; at < buf.length;) {
        const length = buf.readUInt32BE(at);
        const type = buf.toString('ascii', at + 4, at + 8);
        const data = buf.subarray(at + 8, at + 8 + length);
        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            depth = data[8];
            colorType = data[9];
            if (data[12] !== 0) throw new Error('Interlaced PNGs are not supported');
        } else if (type === 'PLTE') palette = data;
        else if (type === 'tRNS') transparency = data;
        else if (type === 'IDAT') idat.push(data);
        at += 12 + length;
    }

    const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
    const bitsPerPixel = channels * depth;
    const stride = Math.ceil((width * bitsPerPixel) / 8);
    const bpp = Math.max(1, bitsPerPixel >> 3);
    const raw = inflateSync(Buffer.concat(idat));

    // Undo the per-row filters.
    const rows = [];
    let prev = new Uint8Array(stride);
    for (let y = 0; y < height; y++) {
        const filter = raw[y * (stride + 1)];
        const row = Uint8Array.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
        for (let i = 0; i < stride; i++) {
            const a = i >= bpp ? row[i - bpp] : 0;
            const b = prev[i];
            const c = i >= bpp ? prev[i - bpp] : 0;
            if (filter === 1) row[i] += a;
            else if (filter === 2) row[i] += b;
            else if (filter === 3) row[i] += (a + b) >> 1;
            else if (filter === 4) {
                const p = a + b - c;
                const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
                row[i] += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
            }
        }
        rows.push(row);
        prev = row;
    }

    const sample = (row, x, ch) => {
        const index = x * channels + ch;
        if (depth === 16) return row[index * 2];
        if (depth === 8) return row[index];
        const bit = index * depth;
        return (row[bit >> 3] >> (8 - depth - (bit & 7))) & ((1 << depth) - 1);
    };
    const toByte = (v) => (depth < 8 && colorType !== 3 ? Math.round((v * 255) / ((1 << depth) - 1)) : v);

    const rgba = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let px;
            if (colorType === 3) {
                const i = sample(rows[y], x, 0);
                px = [palette[i * 3], palette[i * 3 + 1], palette[i * 3 + 2], transparency?.[i] ?? 255];
            } else {
                const v = [...Array(channels)].map((_, ch) => toByte(sample(rows[y], x, ch)));
                px = colorType === 0 ? [v[0], v[0], v[0], 255]
                    : colorType === 2 ? [...v, 255]
                    : colorType === 4 ? [v[0], v[0], v[0], v[1]]
                    : v;
            }
            rgba.set(px, (y * width + x) * 4);
        }
    }
    return { width, height, rgba };
}

/** Greedy merge: grow each unclaimed solid pixel right as far as possible, then down. */
function toRects({ width, height, rgba }) {
    const solid = new Uint8Array(width * height);
    for (let i = 0; i < solid.length; i++) {
        const [r, g, b, a] = rgba.subarray(i * 4, i * 4 + 4);
        solid[i] = a >= 128 && (r + g + b) / 3 < 128 ? 1 : 0;
    }

    // Pixels are cleared from `solid` once a rect claims them.
    const unclaimed = (x, y) => solid[y * width + x] === 1;
    const rects = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!unclaimed(x, y)) continue;

            let w = 1;
            while (x + w < width && unclaimed(x + w, y)) w++;

            let h = 1;
            while (y + h < height && [...Array(w)].every((_, i) => unclaimed(x + i, y + h))) h++;

            for (let yy = y; yy < y + h; yy++) solid.fill(0, yy * width + x, yy * width + x + w);
            rects.push({ x, y, w, h });
        }
    }
    return rects;
}

function toTs(rects) {
    const lines = rects.map((r) => `    { x: ${r.x}, y: ${r.y}, w: ${r.w}, h: ${r.h} },`);
    return [
        `// Generated by tools/collisions.mjs from ${input}. Don't edit by hand.`,
        `import { RectLike } from 'miglib';`,
        ``,
        `export const collisions: RectLike[] = [`,
        ...lines,
        `];`,
        ``,
    ].join('\n');
}
