import * as esbuild from "esbuild";
import { readFileSync, statSync } from "fs";

// IIFE build for <script> tag usage
await esbuild.build({
  entryPoints: ["src/pixel.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["es2017", "chrome80", "firefox78", "safari13"],
  outfile: "dist/pixel.js",
  banner: { js: "/* Faro Attribution Pixel v0.1.0 — faro.com/privacy */" },
});

// ESM build for npm consumers
await esbuild.build({
  entryPoints: ["src/pixel.ts"],
  bundle: true,
  minify: false,
  format: "esm",
  platform: "browser",
  target: ["es2017"],
  outfile: "dist/pixel.esm.js",
});

const size = statSync("dist/pixel.js").size;
console.log(`pixel.js: ${(size / 1024).toFixed(1)} KB`);
if (size > 5120) {
  console.error(`ERROR: pixel.js exceeds 5 KB budget (${size} bytes)`);
  process.exit(1);
}
