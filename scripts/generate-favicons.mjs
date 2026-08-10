#!/usr/bin/env node
/**
 * generate-favicons — Generate PNG favicon fallbacks from mark.svg.
 * Uses sharp to render the SVG at various sizes.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = import.meta.dirname
  ? path.join(import.meta.dirname, "..")
  : process.cwd();

const svgPath = path.join(ROOT, "public", "mark.svg");
const publicDir = path.join(ROOT, "public");

const svgBuffer = fs.readFileSync(svgPath);

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 }
];

for (const { name, size } of sizes) {
  const outPath = path.join(publicDir, name);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`✓ ${name} (${size}×${size})`);
}

console.log("All favicon PNGs generated.");
