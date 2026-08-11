#!/usr/bin/env node
/**
 * link-integrity-audit — Verify that internal CTA links resolve to real routes.
 *
 * Checks internal links on:
 *   - homepage (index.html)
 *   - /data
 *   - /research
 *   - footer (all pages)
 *   - article commercial CTAs (/intelligence links)
 *
 * For each internal href (starting with /), verifies that the corresponding
 * file exists in the build output.
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
const buildDir =
  fs.existsSync(vercelStatic) && fs.existsSync(path.join(vercelStatic, "index.html"))
    ? vercelStatic
    : distDir;

if (!fs.existsSync(buildDir)) {
  console.error("FAIL: Build output not found. Run `bun run build` first.");
  process.exit(1);
}

let failures = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  failures++;
}
function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

console.log("═══ LINK INTEGRITY AUDIT ═══\n");

/**
 * Resolve an internal path and check if it exists in the build output.
 * Handles both HTML pages and static files (CSV, JSON, SVG, etc.).
 * /articles/slug → articles/slug/index.html
 * /data → data/index.html
 * /data/file.csv → data/file.csv (static file, not a page)
 */
function checkInternalPathExists(href) {
  const cleanPath = href.split(/[?#]/)[0];
  if (!cleanPath.startsWith("/")) return true; // external or non-internal
  const relative = cleanPath.replace(/^\//, "");
  if (relative === "") return fs.existsSync(path.join(buildDir, "index.html"));

  // Check if it's a direct file (has a file extension)
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(relative);

  if (hasExtension) {
    // Static file — check directly
    return fs.existsSync(path.join(buildDir, relative));
  }

  // No extension — try as a page (path/index.html)
  return fs.existsSync(path.join(buildDir, relative, "index.html"));
}

/**
 * Extract all internal hrefs from HTML content.
 */
function extractInternalHrefs(html) {
  const re = /<a\s[^>]*href="([^"]*)"/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    // Only internal paths (not external URLs, not anchors-only, not mailto)
    if (href.startsWith("/") && !href.startsWith("//")) {
      out.push(href);
    }
  }
  return [...new Set(out)]; // unique
}

// Pages to audit
const pagesToAudit = [
  { path: "index.html", label: "Homepage" },
  { path: path.join("data", "index.html"), label: "/data" },
  { path: path.join("research", "index.html"), label: "/research" },
  { path: path.join("security", "index.html"), label: "/security" },
  { path: path.join("systems", "index.html"), label: "/systems" },
  { path: path.join("intelligence", "index.html"), label: "/intelligence" },
];

// Add all article pages
const articlesDir = path.join(buildDir, "articles");
if (fs.existsSync(articlesDir)) {
  for (const slug of fs.readdirSync(articlesDir)) {
    const articleHtml = path.join(articlesDir, slug, "index.html");
    if (fs.existsSync(articleHtml)) {
      pagesToAudit.push({
        path: path.join("articles", slug, "index.html"),
        label: `Article: ${slug}`,
      });
    }
  }
}

for (const page of pagesToAudit) {
  const fullPath = path.join(buildDir, page.path);
  if (!fs.existsSync(fullPath)) {
    fail(`${page.label}: page not found at ${page.path}`);
    continue;
  }

  const html = fs.readFileSync(fullPath, "utf8");
  const hrefs = extractInternalHrefs(html);
  const broken = [];

  for (const href of hrefs) {
    if (!checkInternalPathExists(href)) {
      broken.push(href);
    }
  }

  if (broken.length === 0) {
    pass(`${page.label}: all ${hrefs.length} internal links resolve`);
  } else {
    fail(`${page.label}: ${broken.length} broken internal link(s):`);
    for (const b of broken) {
      console.error(`      → ${b}`);
    }
  }
}

// ── Specific CTA checks ──────────────────────────────────────────
console.log("\n── CTA destination checks ──");

// Check that /data Published DATA links resolve
const dataHtmlPath = path.join(buildDir, "data", "index.html");
if (fs.existsSync(dataHtmlPath)) {
  const dataHtml = fs.readFileSync(dataHtmlPath, "utf8");
  const dataHrefs = extractInternalHrefs(dataHtml).filter((h) =>
    h.includes("/articles/")
  );
  for (const href of dataHrefs) {
    if (checkInternalPathExists(href)) {
      pass(`/data CTA → ${href} resolves`);
    } else {
      fail(`/data CTA → ${href} is BROKEN`);
    }
  }
}

// Check article intelligence CTAs
const articlesToCheck = fs.existsSync(articlesDir)
  ? fs.readdirSync(articlesDir).filter((d) =>
      fs.existsSync(path.join(articlesDir, d, "index.html"))
    )
  : [];

let articlesWithIntelCta = 0;
let articlesWithIntelLink = 0;

for (const slug of articlesToCheck) {
  const articleHtml = fs.readFileSync(
    path.join(articlesDir, slug, "index.html"),
    "utf8"
  );

  // Check if article has an / INTELLIGENCE block
  if (/intelligence-block|\/\s*INTELLIGENCE/i.test(articleHtml)) {
    articlesWithIntelCta++;
    const hasIntelLink = /<a\s[^>]*href="[^"]*\/intelligence/.test(articleHtml);
    if (hasIntelLink) {
      articlesWithIntelLink++;
    } else {
      fail(`Article ${slug}: has / INTELLIGENCE block but no /intelligence link`);
    }
  }
}

if (articlesWithIntelCta > 0) {
  pass(`${articlesWithIntelLink}/${articlesWithIntelCta} articles with / INTELLIGENCE have clickable /intelligence links`);
}

// ── Summary ──────────────────────────────────────────────────────
console.log(`\n═══ RESULT ═══`);
console.log(`${failures} failure(s), ${warnings} warning(s)`);

if (failures > 0) {
  console.error("\nLINK INTEGRITY AUDIT — FAIL");
  process.exit(1);
} else {
  console.log("\nLINK INTEGRITY AUDIT — PASS");
  process.exit(0);
}
