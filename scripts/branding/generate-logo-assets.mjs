// One-off script that derives every logo asset in public/ from a single source PNG.
// Not part of the app build.
//
//   node scripts/branding/generate-logo-assets.mjs <source.png>
//
// The source artwork is flat two-colour vector art rendered on an opaque white
// background. To get a transparent logo that sits correctly on both light and dark
// headers, each pixel is treated as one of the two brand colours composited over
// white, and the original alpha is recovered:
//
//   P = F·a + 255·(1 − a)   =>   a = (255 − P) / (255 − F)
//
// Solving per candidate colour and keeping whichever reconstructs the pixel most
// accurately preserves clean anti-aliased edges, which a naive luminance key does
// not — it would make the gold bolt semi-transparent.
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
// sharp is not a direct dependency; it arrives transitively via @nuxt/image -> ipx.
const sharp = require('../../node_modules/ipx/node_modules/sharp');

const SRC = process.argv[2];
const OUT = 'public';
if (!SRC) { console.error('usage: node generate-logo-assets.mjs <source.png>'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

export const BRAND = {
  navy: [0x0a, 0x10, 0x1c],   // #0A101C — shield, braces, wordmark
  gold: [0xd1, 0xa1, 0x32],   // #D1A132 — lightning bolt
};
// Wordmark and shield are near-invisible on a dark header, so the dark variant
// remaps navy to this. Gold has enough contrast on both and is left alone.
const NAVY_ON_DARK = [0xf1, 0xf5, 0xf9];

// Measured from the source; keeps the crops independent of incidental whitespace.
const MARK = { left: 443, top: 309, width: 1162, height: 1184 };

function alphaFor(pixel, fg) {
  let sum = 0, weight = 0;
  for (let c = 0; c < 3; c++) {
    const span = 255 - fg[c];
    if (span < 12) continue;               // channel too close to white to be informative
    sum += ((255 - pixel[c]) / span) * span;
    weight += span;
  }
  if (!weight) return 0;
  return Math.max(0, Math.min(1, sum / weight));
}

function reconstructionError(pixel, fg, a) {
  let err = 0;
  for (let c = 0; c < 3; c++) err += Math.abs(pixel[c] - (fg[c] * a + 255 * (1 - a)));
  return err;
}

/** Composite-over-white removal, returning RGBA with flat brand colours. */
async function toTransparent(src, { navyAs = BRAND.navy } = {}) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  const candidates = [
    { fg: BRAND.navy, paint: navyAs },
    { fg: BRAND.gold, paint: BRAND.gold },
  ];

  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const px = [data[i], data[i + 1], data[i + 2]];
    let best = null;
    for (const cand of candidates) {
      const a = alphaFor(px, cand.fg);
      const err = reconstructionError(px, cand.fg, a);
      if (!best || err < best.err) best = { ...cand, a, err };
    }
    const a = best.a < 0.02 ? 0 : best.a;      // snap the background fully clear
    out[o] = best.paint[0];
    out[o + 1] = best.paint[1];
    out[o + 2] = best.paint[2];
    out[o + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png();
}

/** Minimal ICO container. Each entry is a PNG payload, which every modern browser reads. */
function encodeIco(pngs) {
  const dir = Buffer.alloc(6 + pngs.length * 16);
  dir.writeUInt16LE(0, 0);              // reserved
  dir.writeUInt16LE(1, 2);              // type: icon
  dir.writeUInt16LE(pngs.length, 4);
  let offset = dir.length;
  pngs.forEach(({ size, buffer }, i) => {
    const e = 6 + i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, e);       // 0 means 256
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1);
    dir.writeUInt8(0, e + 2);           // palette size
    dir.writeUInt8(0, e + 3);           // reserved
    dir.writeUInt16LE(1, e + 4);        // colour planes
    dir.writeUInt16LE(32, e + 6);       // bits per pixel
    dir.writeUInt32LE(buffer.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += buffer.length;
  });
  return Buffer.concat([dir, ...pngs.map(p => p.buffer)]);
}

const wrote = [];
const record = (name, buf) => { writeFileSync(`${OUT}/${name}`, buf); wrote.push([name, buf.length]); };

// 1. Full logo, light and dark variants, trimmed of surrounding whitespace.
for (const [name, navyAs] of [['logo.png', BRAND.navy], ['logo-dark.png', NAVY_ON_DARK]]) {
  const img = await toTransparent(SRC, { navyAs });
  record(name, await img.trim({ threshold: 1 }).resize({ width: 1024, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer());
}

// 2. The shield mark on its own.
//    The header renders the logo at h-7 (28px) *and* prints the site title beside
//    it, so the full lockup would both duplicate the wordmark and be illegible.
//    The mark alone is also the only thing readable at favicon sizes.
const markPng = await (await toTransparent(SRC)).extract(MARK).png().toBuffer();
const markDarkPng = await (await toTransparent(SRC, { navyAs: NAVY_ON_DARK })).extract(MARK).png().toBuffer();
const sizes = [16, 32, 48, 64, 128, 256];
const pngs = [];
for (const size of sizes) {
  pngs.push({ size, buffer: await sharp(markPng).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer() });
}
record('favicon.ico', encodeIco(pngs));
for (const [name, buf] of [['logo-mark.png', markPng], ['logo-mark-dark.png', markDarkPng]]) {
  record(name, await sharp(buf).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer());
}
record('apple-touch-icon.png', await sharp(markPng).resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toBuffer());

// 3. Social card. Opaque, because OpenGraph previews composite on unpredictable backgrounds.
// fit:'inside' bounds both axes — the logo is taller than it is wide once the
// wordmark is included, so a width-only resize overflows the 630px card height.
const logoForCard = await (await toTransparent(SRC)).trim({ threshold: 1 })
  .resize({ width: 820, height: 470, fit: 'inside', withoutEnlargement: true }).png().toBuffer();
record('og-image.png', await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#ffffff' } })
  .composite([{ input: logoForCard, gravity: 'centre' }])
  .png({ compressionLevel: 9 }).toBuffer());

console.log('wrote:');
for (const [name, bytes] of wrote) console.log(`  ${name.padEnd(22)} ${(bytes / 1024).toFixed(1)} kB`);
