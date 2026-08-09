#!/usr/bin/env node
/**
 * build-search — Run Pagefind against the correct Astro/Vercel build output
 * and ensure the generated index lands in the Vercel static deployment output.
 *
 * Astro with @astrojs/vercel builds to .vercel/output/static.
 * Pagefind must index that directory and write its output there too.
 *
 * Usage: node scripts/build-search.mjs
 */

import { execSync } from "node:child_process";
import { existsSync, cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dirname
  ? join(import.meta.dirname, "..")
  : join(process.cwd());

// Astro Vercel adapter output
const vercelStatic = join(ROOT, ".vercel", "output", "static");
// Legacy Astro dist (used by `astro preview`)
const distDir = join(ROOT, "dist");

// Determine which directory has the prerendered HTML
let siteDir = null;
if (existsSync(vercelStatic) && existsSync(join(vercelStatic, "index.html"))) {
  siteDir = vercelStatic;
  console.log(`[build-search] Using Vercel static output: ${vercelStatic}`);
} else if (existsSync(distDir) && existsSync(join(distDir, "index.html"))) {
  siteDir = distDir;
  console.log(`[build-search] Using Astro dist output: ${distDir}`);
} else {
  console.error("[build-search] No built HTML found. Run `bun run build:astro` first.");
  process.exit(1);
}

// Run Pagefind against the built HTML
const pagefindOut = join(siteDir, "pagefind");
console.log(`[build-search] Running Pagefind against ${siteDir}...`);

try {
  execSync(
    `npx pagefind --site "${siteDir}" --output-path "${pagefindOut}"`,
    {
      encoding: "utf8",
      stdio: "inherit",
      timeout: 60_000,
      cwd: ROOT
    }
  );
} catch (err) {
  console.error("[build-search] Pagefind failed:", err.message || err);
  process.exit(1);
}

// Verify Pagefind output
const pagefindJs = join(pagefindOut, "pagefind.js");
if (!existsSync(pagefindJs)) {
  console.error("[build-search] pagefind.js not found after indexing. Something went wrong.");
  process.exit(1);
}

console.log(`[build-search] ✓ pagefind.js generated at ${pagefindJs}`);

// If we indexed dist/ but the Vercel output also exists, copy pagefind there too
if (siteDir === distDir && existsSync(vercelStatic)) {
  const vercelPagefind = join(vercelStatic, "pagefind");
  mkdirSync(vercelPagefind, { recursive: true });
  cpSync(pagefindOut, vercelPagefind, { recursive: true });
  console.log(`[build-search] ✓ Copied Pagefind output to ${vercelPagefind}`);
}

console.log("[build-search] ✓ Search index built and placed in deployment output.");
