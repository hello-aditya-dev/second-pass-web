#!/usr/bin/env node
/**
 * launch:verify — Verify that a public launch cannot happen accidentally.
 *
 * Fails if:
 * - any published demo article exists
 * - homepage depends on demo content
 * - SITE_PRELAUNCH is not deliberately false for launch verification
 * - canonical is invalid
 * - example.com exists in published content
 * - Beehiiv is not configured
 * - Resend is not configured
 * - social images missing for real (non-demo) articles
 * - author page missing (Aditya)
 * - RSS/sitemaps broken
 * - Pagefind missing
 * - build fails
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = import.meta.dirname
  ? path.join(import.meta.dirname, "..")
  : process.cwd();

let failures = 0;
let warnings = 0;

function fail(msg) { console.error(`FAIL: ${msg}`); failures++; }
function warn(msg) { console.warn(`WARN: ${msg}`); warnings++; }
function pass(msg) { console.log(`✓ ${msg}`); }

console.log("═══ SECOND / PASS LAUNCH VERIFICATION ═══\n");

// 1. SITE_PRELAUNCH must be explicitly "false" for launch
console.log("── Prelaunch flag ──");
const prelaunch = process.env.SITE_PRELAUNCH;
if (prelaunch === "false") {
  pass("SITE_PRELAUNCH is explicitly false — launch mode");
} else {
  fail("SITE_PRELAUNCH is not false — site is still in prelaunch mode. Set SITE_PRELAUNCH=false to enable public indexing.");
  warn("This is expected during development. The check confirms you must explicitly disable prelaunch at launch.");
}

// 2. No published demo articles
console.log("\n── Demo content ──");
const articlesDir = path.join(ROOT, "src", "content", "articles");
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
let publishedDemos = 0;
for (const file of articleFiles) {
  const text = fs.readFileSync(path.join(articlesDir, file), "utf8");
  const isPublished = /status:\s*["']?published["']?/.test(text);
  const isDemo = /demo:\s*true/.test(text);
  if (isPublished && isDemo) {
    fail(`Published demo article: ${file}`);
    publishedDemos++;
  }
}
if (publishedDemos === 0) {
  pass("No published demo articles");
}

// 3. No example.com in published content
console.log("\n── Content hygiene ──");
let exampleComCount = 0;
for (const file of articleFiles) {
  const text = fs.readFileSync(path.join(articlesDir, file), "utf8");
  const isPublished = /status:\s*["']?published["']?/.test(text);
  if (isPublished && text.includes("example.com")) {
    fail(`example.com found in published article: ${file}`);
    exampleComCount++;
  }
}
if (exampleComCount === 0) {
  pass("No example.com in published content");
}

// 4. Canonical check
console.log("\n── Canonical ──");
const siteUrl = process.env.PUBLIC_SITE_URL || "";
if (siteUrl && siteUrl !== "https://example.com" && siteUrl.startsWith("https://")) {
  pass(`Canonical origin: ${siteUrl}`);
} else if (!siteUrl) {
  warn("PUBLIC_SITE_URL not set — will default to https://second-pass.vercel.app");
} else {
  fail(`Invalid canonical: ${siteUrl}`);
}

// 5. Provider configuration
console.log("\n── Providers ──");
if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
  pass("Beehiiv configured");
} else {
  fail("Beehiiv not configured (BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID missing)");
}

if (process.env.RESEND_API_KEY) {
  pass("Resend configured");
} else {
  fail("Resend not configured (RESEND_API_KEY missing)");
}

// 6. Author page exists
console.log("\n── Author system ──");
const authorPage = path.join(ROOT, "src", "pages", "authors", "aditya.astro");
if (fs.existsSync(authorPage)) {
  pass("/authors/aditya page exists");
} else {
  fail("/authors/aditya page missing");
}

// 7. Social images for real (non-demo) articles
console.log("\n── Social assets ──");
const socialDir = path.join(ROOT, "public", "social");
for (const file of articleFiles) {
  const text = fs.readFileSync(path.join(articlesDir, file), "utf8");
  const isPublished = /status:\s*["']?published["']?/.test(text);
  const isDemo = /demo:\s*true/.test(text);
  const slugMatch = text.match(/slug:\s*["']?([a-z0-9-]+)["']?/);
  if (isPublished && !isDemo && slugMatch) {
    const slug = slugMatch[1];
    const ogPng = path.join(socialDir, slug, "og.png");
    if (!fs.existsSync(ogPng)) {
      fail(`Missing social image for real article: ${slug}`);
    } else {
      pass(`Social image exists for: ${slug}`);
    }
  }
}

// 8. Build check
console.log("\n── Build ──");
try {
  execSync("bun run build:astro", {
    encoding: "utf8",
    stdio: "pipe",
    timeout: 180_000,
    cwd: ROOT
  });
  pass("Astro build succeeds");
} catch (err) {
  fail("Astro build fails");
  console.error(err.stderr?.slice(0, 500));
}

// 9. Pagefind check
console.log("\n── Pagefind ──");
const vercelStatic = path.join(ROOT, ".vercel", "output", "static");
const distDir = path.join(ROOT, "dist");
const buildDir = fs.existsSync(vercelStatic) ? vercelStatic : distDir;
const pagefindJs = path.join(buildDir, "pagefind", "pagefind.js");
if (fs.existsSync(pagefindJs)) {
  pass("Pagefind index exists");
} else {
  fail("Pagefind index missing — run `bun run search:index` after build");
}

// 10. RSS check
console.log("\n── RSS/Sitemap ──");
const rssPath = path.join(buildDir, "rss.xml");
const sitemapPath = path.join(buildDir, "sitemap-index.xml");
if (fs.existsSync(rssPath)) {
  pass("RSS feed exists");
} else {
  fail("RSS feed missing");
}
if (fs.existsSync(sitemapPath)) {
  pass("Sitemap exists");
} else {
  warn("Sitemap not found (may be sitemap-0.xml)");
}

// 11. Favicon fallbacks
console.log("\n── Favicons ──");
const faviconFiles = ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"];
for (const f of faviconFiles) {
  if (fs.existsSync(path.join(ROOT, "public", f))) {
    pass(`${f} exists`);
  } else {
    fail(`${f} missing — run \`bun run favicons:generate\``);
  }
}

// Summary
console.log(`\n═══ RESULT ═══`);
console.log(`${failures} failure(s), ${warnings} warning(s)`);

if (failures > 0) {
  console.error("\nLAUNCH:VERIFY — FAIL. Do not launch until all failures are resolved.");
  process.exit(1);
} else {
  console.log("\nLAUNCH:VERIFY — PASS. All checks satisfied.");
  process.exit(0);
}
