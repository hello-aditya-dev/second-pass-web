#!/usr/bin/env node
/**
 * house-object-audit — Verify that house editorial objects render correctly.
 *
 * Checks built article HTML for:
 *   - Empty calculation semantic containers (calc-question, calc-result, etc.)
 *     where source content exists as sibling paragraphs
 *   - Duplicate paragraph text inside calculation/claim-check sections
 *   - Unexpected number of calculation/claim-check blocks
 *   - Claim check boundary swallowing (multiple claims merged into one)
 *   - / INTELLIGENCE blocks that lack a real /intelligence link
 *
 * Exit 0 on PASS, exit 1 on FAIL.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = import.meta.dirname
  ? path.join(import.meta.dirname, "..")
  : process.cwd();

const vercelStatic = path.join(ROOT, ".vercel", "output", "static");
const distDir = path.join(ROOT, "dist");
const DIST_ARTICLES =
  fs.existsSync(path.join(vercelStatic, "articles"))
    ? path.join(vercelStatic, "articles")
    : fs.existsSync(path.join(distDir, "articles"))
      ? path.join(distDir, "articles")
      : null;

if (!DIST_ARTICLES) {
  console.error("FAIL: Build output not found. Run `bun run build` first.");
  process.exit(1);
}

let failures = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  failures++;
}
function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

// ── Helpers ──────────────────────────────────────────────────────

/** Strip HTML tags to get text content */
function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").trim();
}

/** Extract text content from all <p> tags in an HTML section */
function extractParagraphTexts(html) {
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[1]);
    if (text) out.push(text);
  }
  return out;
}

/** Extract a section of HTML between two markers */
function extractSection(html, startPattern, endPattern) {
  const startMatch = html.match(startPattern);
  if (!startMatch) return null;
  const startIdx = startMatch.index + startMatch[0].length;
  const rest = html.slice(startIdx);
  const endMatch = rest.match(endPattern);
  if (!endMatch) return rest;
  return rest.slice(0, endMatch.index);
}

/** Count sections by class */
function countSections(html, className) {
  const re = new RegExp(`<section[^>]*class="[^"]*\\b${className}\\b[^"]*"`, "gi");
  return (html.match(re) || []).length;
}

/** Extract content of sections by class */
function extractSections(html, className) {
  const sections = [];
  const re = new RegExp(
    `<section[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)</section>`,
    "gi"
  );
  let m;
  while ((m = re.exec(html)) !== null) {
    sections.push(m[0]);
  }
  return sections;
}

// ── Get all article slugs ────────────────────────────────────────
const slugs = fs.readdirSync(DIST_ARTICLES).filter((d) =>
  fs.existsSync(path.join(DIST_ARTICLES, d, "index.html"))
);

console.log("═══ HOUSE OBJECT AUDIT ═══\n");
console.log(`Auditing ${slugs.length} articles.\n`);

for (const slug of slugs) {
  const htmlPath = path.join(DIST_ARTICLES, slug, "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;

  let articleFailures = 0;

  // ── Check for empty calculation content containers ────────────
  const calcSections = extractSections(html, "calculation-block");
  for (let i = 0; i < calcSections.length; i++) {
    const section = calcSections[i];

    // Check for empty calc-question, calc-result, calc-so-what, calc-caveat
    const emptyContainers = section.match(
      /<(?:div|p)[^>]*class="[^"]*\b(calc-question|calc-result|calc-so-what|calc-caveat)\b[^"]*"[^>]*>\s*<\/(?:div|p)>/gi
    );
    if (emptyContainers) {
      fail(`${slug}: calculation block ${i + 1} has empty container(s): ${emptyContainers.join(", ")}`);
      articleFailures++;
    }
  }

  // ── Check for duplicate paragraph text in calculation blocks ──
  for (let i = 0; i < calcSections.length; i++) {
    const texts = extractParagraphTexts(calcSections[i]);
    const seen = new Set();
    for (const text of texts) {
      const normalized = text.replace(/\s+/g, " ").trim();
      if (normalized.length < 20) continue; // skip short labels
      if (seen.has(normalized)) {
        fail(`${slug}: calculation block ${i + 1} has duplicate paragraph: "${normalized.slice(0, 80)}..."`);
        articleFailures++;
      }
      seen.add(normalized);
    }
  }

  // ── Check for duplicate paragraph text in claim-check blocks ──
  const claimSections = extractSections(html, "claim-check");
  for (let i = 0; i < claimSections.length; i++) {
    const texts = extractParagraphTexts(claimSections[i]);
    const seen = new Set();
    for (const text of texts) {
      const normalized = text.replace(/\s+/g, " ").trim();
      if (normalized.length < 20) continue;
      if (seen.has(normalized)) {
        fail(`${slug}: claim-check block ${i + 1} has duplicate paragraph: "${normalized.slice(0, 80)}..."`);
        articleFailures++;
      }
      seen.add(normalized);
    }
  }

  // ── Check that claim-check blocks have exactly one SECOND / PASS verdict ──
  for (let i = 0; i < claimSections.length; i++) {
    const verdictCount = (claimSections[i].match(/class="[^"]*\bclaim-verdict\b/gi) || []).length;
    if (verdictCount === 0) {
      fail(`${slug}: claim-check block ${i + 1} has no SECOND / PASS verdict`);
      articleFailures++;
    } else if (verdictCount > 1) {
      fail(`${slug}: claim-check block ${i + 1} has ${verdictCount} verdicts (expected 1) — possible claim swallowing`);
      articleFailures++;
    }
  }

  // ── Check for known corruption strings ────────────────────────
  const corruptionPatterns = [
    /model8-visible/,
    /MCP authorization guidance adds a related identity principle\/ resource\. MCP authorization guidance/,
  ];
  for (const pat of corruptionPatterns) {
    if (pat.test(body)) {
      fail(`${slug}: contains known corruption pattern: ${pat}`);
      articleFailures++;
    }
  }

  // ── Check / INTELLIGENCE blocks have real links ──────────────
  const intelSections = extractSections(html, "intelligence-block");
  if (intelSections.length > 0) {
    for (let i = 0; i < intelSections.length; i++) {
      const hasLink = /<a\s[^>]*href="[^"]*\/intelligence/.test(intelSections[i]);
      if (!hasLink) {
        fail(`${slug}: / INTELLIGENCE block ${i + 1} has no /intelligence link`);
        articleFailures++;
      }
    }
  }

  if (articleFailures === 0) {
    pass(`${slug}: ${calcSections.length} calculation(s), ${claimSections.length} claim-check(s), ${intelSections.length} intelligence block(s) — clean`);
  }
}

// ── Summary ──────────────────────────────────────────────────────
console.log(`\n═══ RESULT ═══`);
console.log(`${failures} failure(s)`);

if (failures > 0) {
  console.error("\nHOUSE OBJECT AUDIT — FAIL");
  process.exit(1);
} else {
  console.log("\nHOUSE OBJECT AUDIT — PASS");
  process.exit(0);
}
