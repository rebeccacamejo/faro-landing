/**
 * Generates all favicon and app-icon formats from public/icon.svg.
 * Run with: node scripts/generate-icons.mjs
 *
 * Outputs:
 *   public/favicon.ico     — multi-size ICO (16, 32, 48)
 *   public/apple-icon.png  — 180x180 for iOS
 *   public/icon-192.png    — 192x192 for PWA
 *   public/icon-512.png    — 512x512 for PWA
 */

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const svg = readFileSync(join(publicDir, "icon.svg"));

function px(n) {
  return sharp(svg, { density: Math.ceil((n / 64) * 72) })
    .resize(n, n)
    .png()
    .toBuffer();
}

async function main() {
  console.log("Generating icons from public/icon.svg…\n");

  const [p16, p32, p48, p180, p192, p512] = await Promise.all([
    px(16),
    px(32),
    px(48),
    px(180),
    px(192),
    px(512),
  ]);

  // ── ICO (multi-size) ───────────────────────────────────────────────────────
  const ico = await pngToIco([p16, p32, p48]);
  writeFileSync(join(publicDir, "favicon.ico"), ico);
  console.log("✓  favicon.ico       (16 · 32 · 48 px)");

  // ── PNG outputs ────────────────────────────────────────────────────────────
  writeFileSync(join(publicDir, "apple-icon.png"), p180);
  console.log("✓  apple-icon.png    (180 × 180)");

  writeFileSync(join(publicDir, "icon-192.png"), p192);
  console.log("✓  icon-192.png      (192 × 192)");

  writeFileSync(join(publicDir, "icon-512.png"), p512);
  console.log("✓  icon-512.png      (512 × 512)");

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
