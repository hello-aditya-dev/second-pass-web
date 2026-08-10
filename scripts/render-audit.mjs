#!/usr/bin/env node
/**
 * render-audit — Inspect built article HTML for render-integrity defects.
 * Usage:
 *   bun run render-audit -- <slug>
 *   bun run render-audit -- --all
 *
 * Checks A–N (see below). Exits 0 on PASS, 1 on FAIL.
 */

import fs from "node:fs";
import path from "node:path";

// ── CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const allFlag = args.includes("--all");
const slug = allFlag ? null : args.find((a) => !a.startsWith("--"));

if (!allFlag && !slug) {
  console.error("Usage: bun run render-audit -- <slug>");
  console.error("       bun run render-audit -- --all");
  process.exit(1);
}

// ── Dist base ─────────────────────────────────────────────────────────
// Vercel adapter outputs to dist/client/, static output to dist/
// Post-build processing writes to .vercel/output/static/
const DIST_CANDIDATES = [
  path.join(".vercel", "output", "static", "articles"),
  path.join("dist", "client", "articles"),
  path.join("dist", "articles")
];
const DIST = DIST_CANDIDATES.find((d) => fs.existsSync(d)) || DIST_CANDIDATES[0];

function getSlugs() {
  if (!fs.existsSync(DIST)) return [];
  return fs.readdirSync(DIST).filter((d) => {
    const p = path.join(DIST, d, "index.html");
    return fs.existsSync(p);
  });
}

const slugs = allFlag ? getSlugs() : [slug];

if (slugs.length === 0) {
  console.error(allFlag ? `No articles found in ${DIST}` : `Article not found: ${slug} (looked in ${DIST})`);
  process.exit(1);
}

// ── Sentinel pattern ──────────────────────────────────────────────────
const SENTINELS = [24182, 24183, 24190, 24191];
const SENTINEL_RE = new RegExp(
  SENTINELS.map((n) => `(?<![\\d.])${n}(?![\\d.])`).join("|")
);

// ── Raw LaTeX patterns (visible as text, not inside .katex spans) ────
const RAW_LATEX_PATTERNS = [
  /\\frac\{/,
  /\\boxed\{/,
  /\\text\{/,
  /\\arg\\min/,
  /\\Delta/
];

// ── Malformed link patterns ──────────────────────────────────────────
const MALFORMED_HREF_PATTERNS = [
  /^$/,
  /^#$/,
  /localhost/,
  /example\.com/,
  /sandbox:/,
  /file:\/\//
];

// ── Local path patterns ─────────────────────────────────────────────
const LOCAL_PATH_PATTERNS = [
  /\.\.\/05_CHARTS\//,
  /\.\.\/04_DATA\//,
  /\/mnt\/data\//,
  /C:\\\\/
];

// ── Placeholder patterns ─────────────────────────────────────────────
const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/,
  /\bTBD\b/,
  /\[DATE\]/,
  /\[NUMBER\]/,
  /\bPLACEHOLDER\b/
];

// ── Duplicate metadata block patterns ────────────────────────────────
const DUPLICATE_META_PATTERNS = [
  /SECTION\s*\/\s*AI/,
  /FORMAT\s*\/\s*SECOND\s+PASS/,
  /PUBLISHER\s*\/\s*SECOND/
];

// ── Audit one article ────────────────────────────────────────────────
function auditOne(slug) {
  const htmlPath = path.join(DIST, slug, "index.html");
  if (!fs.existsSync(htmlPath)) {
    return { slug, error: `Built HTML not found at ${htmlPath}` };
  }

  const html = fs.readFileSync(htmlPath, "utf8");

  // Simple HTML helpers (no DOM dependency)
  const countTag = (tag) => {
    const re = new RegExp(`<${tag}[\\s>]`, "gi");
    return (html.match(re) || []).length;
  };

  const extractHrefs = () => {
    const re = /<a\s[^>]*href="([^"]*)"/gi;
    const out = [];
    let m;
    while ((m = re.exec(html)) !== null) out.push(m[1]);
    return out;
  };

  const extractHeadings = (level) => {
    const re = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi");
    const out = [];
    let m;
    while ((m = re.exec(html)) !== null) out.push(m[1]);
    return out;
  };

  // Strip HTML tags to get text content
  const stripTags = (s) => s.replace(/<[^>]+>/g, "");

  // ── A. RAW SENTINELS ─────────────────────────────────────────────
  // Find sentinel numbers that appear outside .katex spans
  let sentinelCount = 0;
  // Split the HTML by .katex spans, check text outside them
  const nonKatexChunks = html.replace(/<span[^>]*class="[^"]*katex[^"]*"[^>]*>[\s\S]*?<\/span[^>]*>/gi, "")
    .replace(/<span[^>]*class="[^"]*katex-display[^"]*"[^>]*>[\s\S]*?<\/span[^>]*>/gi, "");
  for (const s of SENTINELS) {
    const re = new RegExp(`(?<![\\d.])${s}(?![\\d.])`, "g");
    const matches = nonKatexChunks.match(re);
    if (matches) sentinelCount += matches.length;
  }

  // ── B. RAW LATEX IN BUILT BODY ───────────────────────────────────
  let rawLatexCount = 0;
  // Check body content outside of .katex spans
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;
  // Remove katex spans from body before checking
  // Strategy: replace all <span class="katex...">...</span> blocks using
  // a marker-based approach since the non-greedy regex can't handle
  // deeply nested spans. We mark opening tags, then remove everything
  // between matched pairs.
  let bodySansKatex = bodyContent;
  // Remove all MathML annotation content first (contains LaTeX source)
  bodySansKatex = bodySansKatex.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, "");
  // Then remove katex spans (multiple passes for nesting)
  for (let pass = 0; pass < 15; pass++) {
    const next = bodySansKatex
      .replace(/<span[^>]*class="[^"]*katex[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<span[^>]*class="[^"]*katex-display[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");
    if (next === bodySansKatex) break;
    bodySansKatex = next;
  }
  // Also remove math-inline spans (post-build KaTeX)
  bodySansKatex = bodySansKatex
    .replace(/<span[^>]*class="math-inline"[^>]*>[\s\S]*?<\/span>/gi, "");
  for (const pat of RAW_LATEX_PATTERNS) {
    const m = bodySansKatex.match(pat);
    if (m) rawLatexCount++;
  }

  // ── C. DUPLICATE H1 ──────────────────────────────────────────────
  const h1Count = countTag("h1");

  // ── D. DUPLICATE FIRST PASS ──────────────────────────────────────
  const h2Texts = extractHeadings(2).map(stripTags);
  const h3Texts = extractHeadings(3).map(stripTags);
  const allHeadingTexts = [...h2Texts, ...h3Texts];
  const firstPassCount = allHeadingTexts.filter((t) => /FIRST\s+PASS/i.test(t)).length;

  // ── E. DUPLICATE FRONTMATTER METADATA IN BODY ────────────────────
  let duplicateMetaCount = 0;
  for (const pat of DUPLICATE_META_PATTERNS) {
    if (pat.test(bodyContent)) duplicateMetaCount++;
  }

  // ── F. MALFORMED ARTICLE LINKS ───────────────────────────────────
  const hrefs = extractHrefs();
  let malformedLinks = 0;
  for (const href of hrefs) {
    for (const pat of MALFORMED_HREF_PATTERNS) {
      if (pat.test(href)) {
        malformedLinks++;
        break;
      }
    }
  }

  // ── G. LOCAL PACKAGE PATHS ───────────────────────────────────────
  let localPaths = 0;
  for (const pat of LOCAL_PATH_PATTERNS) {
    if (pat.test(bodyContent)) localPaths++;
  }

  // ── H. PLACEHOLDERS ──────────────────────────────────────────────
  let placeholders = 0;
  const bodyText = stripTags(bodyContent);
  for (const pat of PLACEHOLDER_PATTERNS) {
    if (pat.test(bodyText)) placeholders++;
  }

  // ── I. BROKEN INTERNAL ARTICLE LINKS ─────────────────────────────
  const articleLinks = hrefs.filter((h) => h.startsWith("/articles/"));
  let brokenInternalLinks = 0;
  for (const link of articleLinks) {
    // Extract slug: /articles/slug/ or /articles/slug
    const slugMatch = link.match(/^\/articles\/([^/?#]+)/);
    if (slugMatch) {
      const targetDir = path.join(DIST, slugMatch[1]);
      if (!fs.existsSync(targetDir)) brokenInternalLinks++;
    }
  }

  // ── J. MISSING CTA DESTINATION ───────────────────────────────────
  let missingCta = 0;
  if (/INTELLIGENCE/i.test(bodyText) || /\/\s*INTELLIGENCE/i.test(bodyText)) {
    const hasIntelLink = hrefs.some((h) => h.includes("/intelligence"));
    if (!hasIntelLink) missingCta = 1;
  }

  // ── K. MATH RENDERING ────────────────────────────────────────────
  const katexCount = (html.match(/class="[^"]*katex[^"]*"/gi) || []).length;

  // ── L. FIGURE/FIGCAPTION ─────────────────────────────────────────
  const figureCount = countTag("figure");
  const figcaptionCount = countTag("figcaption");

  // ── M. CANONICAL ─────────────────────────────────────────────────
  const canonicalMatch = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  const canonicalOk = canonicalMatch && !canonicalMatch[1].includes("example.com");

  // ── N. OG IMAGE ──────────────────────────────────────────────────
  const ogImageOk = /property="og:image"|name="og:image"/i.test(html);

  // ── Determine PASS/FAIL ──────────────────────────────────────────
  const defects = [
    sentinelCount > 0 && `sentinel artifacts (${sentinelCount})`,
    rawLatexCount > 0 && `raw LaTeX fragments (${rawLatexCount})`,
    h1Count > 1 && `duplicate H1 (${h1Count})`,
    firstPassCount > 1 && `duplicate FIRST PASS (${firstPassCount})`,
    duplicateMetaCount > 0 && `duplicate metadata blocks (${duplicateMetaCount})`,
    malformedLinks > 0 && `malformed links (${malformedLinks})`,
    localPaths > 0 && `local paths (${localPaths})`,
    placeholders > 0 && `placeholders (${placeholders})`,
    brokenInternalLinks > 0 && `broken internal links (${brokenInternalLinks})`,
    missingCta > 0 && `missing CTA to /intelligence`,
    !canonicalOk && "missing or invalid canonical",
    !ogImageOk && "missing og:image"
  ].filter(Boolean);

  const pass = defects.length === 0;

  return {
    slug,
    h1Count,
    firstPassCount,
    katexCount,
    figureCount,
    figcaptionCount,
    sentinelCount,
    rawLatexCount,
    duplicateMetaCount,
    malformedLinks,
    localPaths,
    placeholders,
    brokenInternalLinks,
    missingCta,
    canonicalOk,
    ogImageOk,
    pass,
    defects
  };
}

// ── Run & Report ──────────────────────────────────────────────────────
let overallPass = true;

for (const s of slugs) {
  const r = auditOne(s);

  if (r.error) {
    console.error(`\nRENDER AUDIT: ${s}`);
    console.error("────────────────────────────");
    console.error(r.error);
    console.error("\nRESULT: FAIL");
    overallPass = false;
    continue;
  }

  console.log(`\nRENDER AUDIT: ${r.slug}`);
  console.log("────────────────────────────");
  console.log(`H1 count: ${r.h1Count}`);
  console.log(`FIRST PASS count: ${r.firstPassCount}`);
  console.log(`KaTeX elements: ${r.katexCount}`);
  console.log(`Figures: ${r.figureCount}`);
  console.log(`Figcaptions: ${r.figcaptionCount}`);
  console.log(`Sentinel artifacts: ${r.sentinelCount}`);
  console.log(`Raw LaTeX fragments: ${r.rawLatexCount}`);
  console.log(`Duplicate metadata blocks: ${r.duplicateMetaCount}`);
  console.log(`Malformed links: ${r.malformedLinks}`);
  console.log(`Local paths: ${r.localPaths}`);
  console.log(`Placeholders: ${r.placeholders}`);
  console.log(`Broken internal links: ${r.brokenInternalLinks}`);
  console.log(`Missing CTA: ${r.missingCta}`);
  console.log(`Canonical: ${r.canonicalOk ? "OK" : "MISSING"}`);
  console.log(`OG image: ${r.ogImageOk ? "OK" : "MISSING"}`);

  if (r.defects.length > 0) {
    console.log("\nDefects:");
    for (const d of r.defects) console.log(`  ✗ ${d}`);
  }

  console.log(`\nRESULT: ${r.pass ? "PASS" : "FAIL"}`);
  if (!r.pass) overallPass = false;
}

if (slugs.length > 1) {
  console.log(`\n${"─".repeat(40)}`);
  console.log(`Audited ${slugs.length} articles. Overall: ${overallPass ? "PASS" : "FAIL"}`);
}

process.exit(overallPass ? 0 : 1);
