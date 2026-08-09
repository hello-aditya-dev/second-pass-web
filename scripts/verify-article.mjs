#!/usr/bin/env node
/**
 * article:verify — Verify an article passes all quality checks.
 * Usage: bun run article:verify -- <slug>
 */

import fs from "node:fs";
import path from "node:path";

// Minimal frontmatter parser (no dependency needed)
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const raw = match[1];
  const data = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^(\w+):\s*["']?(.+?)["']?\s*$/);
    if (m) data[m[1]] = m[2];
  }
  return data;
}

const slug = process.argv.find((a, i) => process.argv[i - 1] === "--") || process.argv[2];
if (!slug) {
  console.error("Usage: bun run article:verify -- <slug>");
  process.exit(1);
}

const dir = path.join("src", "content", "articles");
const candidates = [`${slug}.mdx`, `${slug}.md`];
let filePath = null;
for (const c of candidates) {
  if (fs.existsSync(path.join(dir, c))) {
    filePath = path.join(dir, c);
    break;
  }
}

if (!filePath) {
  console.error(`FAIL: Article file not found for slug "${slug}"`);
  process.exit(1);
}

const text = fs.readFileSync(filePath, "utf8");
const data = parseFrontmatter(text);
let failures = 0;
let warnings = 0;

function fail(msg) { console.error(`FAIL: ${msg}`); failures++; }
function warn(msg) { console.warn(`WARN: ${msg}`); warnings++; }

// 1. Unique slug / slug-frontmatter consistency
if (data.slug && data.slug !== slug) {
  fail(`Frontmatter slug "${data.slug}" does not match file slug "${slug}"`);
}

// 2. Status rules
if (data.status === "published" && !data.publishedAt) {
  fail("Published article missing publishedAt");
}

// 3. Demo flag
if (data.demo === "true" && data.status === "published") {
  warn("Demo article is published — remove before launch");
}

// 4. Title/dek sanity
if (!data.title || data.title.startsWith("REPLACE")) {
  fail("Title is missing or contains REPLACE marker");
}
if (!data.dek || data.dek.startsWith("REPLACE")) {
  fail("Dek is missing or contains REPLACE marker");
}

// 5. Valid section/format
const validSections = ["AI", "Compute", "Systems", "Security", "Research", "Data"];
if (data.section && !validSections.includes(data.section)) {
  fail(`Invalid section: "${data.section}"`);
}

const validFormats = ["NOW", "SECOND PASS", "DEEP", "PROOF", "DATA"];
if (data.format && !validFormats.includes(data.format)) {
  fail(`Invalid format: "${data.format}"`);
}

// 6. FIRST PASS count
if (!text.includes("firstPass:") && !text.includes("first_pass:")) {
  fail("Missing firstPass block");
}

// 7. Author
if (!data.author) {
  fail("Missing author");
}

// 8. publishedAt
if (!data.publishedAt) {
  fail("Missing publishedAt");
}

// 9. updatedAt >= publishedAt (if present)
if (data.updatedAt && data.publishedAt) {
  if (new Date(data.updatedAt) < new Date(data.publishedAt)) {
    fail("updatedAt is before publishedAt");
  }
}

// 10. Source URL syntax
const sourceUrls = text.match(/url:\s*["']?(https?:\/\/[^\s"']+)/g) || [];
for (const u of sourceUrls) {
  const url = u.replace(/url:\s*["']?/, "");
  if (url.includes("example.com")) {
    fail(`Source URL uses example.com: ${url}`);
  }
}

// 11. No REPLACE / TODO markers in published content
if (data.status === "published") {
  if (/REPLACE:|REPLACE WITH|TODO:/.test(text)) {
    fail("Published article contains REPLACE or TODO markers");
  }
}

// 12. No private newsroom paths
if (/publication-newsroom|newsroom\//.test(text)) {
  fail("Article references private newsroom paths");
}

// 13. No obvious secret patterns
if (/(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}/i.test(text)) {
  fail("Article contains possible secret/token pattern");
}

// 14. Public media paths
const mediaPaths = text.match(/\/(?:images|media|assets)\/[^\s"')]+/g) || [];
for (const mp of mediaPaths) {
  if (!mp.startsWith("/")) {
    fail(`Non-absolute media path: ${mp}`);
  }
}

console.log(`\nVerified: ${slug}`);
console.log(`${warnings} warning(s), ${failures} failure(s)`);

if (failures) process.exit(1);
