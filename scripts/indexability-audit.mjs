#!/usr/bin/env node
/**
 * indexability-audit — Verify that production indexability state is consistent.
 *
 * This audit prevents the P0 defect where CURRENT_STATE.md declares the site
 * LIVE/PUBLIC but the built HTML contains noindex or robots.txt disallows /.
 *
 * It reads the built output and checks:
 *
 * For PUBLIC mode (SITE_PRELAUNCH=false):
 *   - homepage has no noindex
 *   - an article has no noindex
 *   - /research has no noindex
 *   - /data has no noindex
 *   - robots.txt contains Allow: /
 *   - robots.txt does NOT contain Disallow: /
 *   - sitemap URLs use the canonical production origin
 *
 * For PRELAUNCH mode (SITE_PRELAUNCH missing or true):
 *   - homepage HAS noindex
 *   - robots.txt contains Disallow: /
 *   - robots.txt does NOT contain Allow: /
 *
 * The audit also cross-checks against CURRENT_STATE.md: if the file says
 * "LIVE / PUBLIC" or "Site state: LIVE", the build must be in PUBLIC mode.
 *
 * Exit 0 on PASS, exit 1 on FAIL.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = import.meta.dirname
  ? path.join(import.meta.dirname, "..")
  : process.cwd();

// ── Determine build output directory ──────────────────────────────
const vercelStatic = path.join(ROOT, ".vercel", "output", "static");
const distDir = path.join(ROOT, "dist");
const buildDir =
  fs.existsSync(vercelStatic) && fs.existsSync(path.join(vercelStatic, "index.html"))
    ? vercelStatic
    : distDir;

if (!fs.existsSync(buildDir)) {
  console.error("FAIL: Build output not found. Run `bun run build` first.");
  console.error(`  Looked for: ${vercelStatic} and ${distDir}`);
  process.exit(1);
}

// ── Determine prelaunch state ─────────────────────────────────────
// The build was run with whatever SITE_PRELAUNCH was in the environment.
// We check the built robots.txt to determine the actual state.
const robotsPath = path.join(buildDir, "robots.txt");
let robotsContent = "";
if (fs.existsSync(robotsPath)) {
  robotsContent = fs.readFileSync(robotsPath, "utf8");
}

// Semantic parsing: check for Disallow: / or Allow: / as directives
const hasDisallow = /^\s*Disallow:\s*\/\s*$/m.test(robotsContent);
const hasAllow = /^\s*Allow:\s*\/\s*$/m.test(robotsContent);

// Determine mode from robots.txt (the source of truth for built state)
const isPublicMode = hasAllow && !hasDisallow;
const isPrelaunchMode = hasDisallow && !hasAllow;

let failures = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  failures++;
}
function pass(msg) {
  console.log(`  ✓ ${msg}`);
}
function warn(msg) {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

console.log("═══ INDEXABILITY AUDIT ═══\n");

// ── 1. Robots.txt consistency ────────────────────────────────────
console.log("── robots.txt ──");
console.log(`  Mode detected: ${isPublicMode ? "PUBLIC" : isPrelaunchMode ? "PRELAUNCH" : "UNKNOWN"}`);

if (!isPublicMode && !isPrelaunchMode) {
  fail("robots.txt is inconsistent — neither clearly public nor clearly prelaunch");
  fail(`  Content:\n${robotsContent}`);
}

if (isPublicMode) {
  pass("robots.txt contains Allow: /");
  if (!hasDisallow) {
    pass("robots.txt does NOT contain Disallow: /");
  } else {
    fail("robots.txt contains Disallow: / in public mode");
  }
  // Check sitemap references
  if (robotsContent.includes("sitemap-index.xml")) {
    pass("robots.txt references sitemap-index.xml");
  } else {
    fail("robots.txt missing sitemap-index.xml reference");
  }
  if (robotsContent.includes("news-sitemap.xml")) {
    pass("robots.txt references news-sitemap.xml");
  } else {
    warn("robots.txt missing news-sitemap.xml reference");
  }
}

if (isPrelaunchMode) {
  pass("robots.txt contains Disallow: / (prelaunch)");
  if (!hasAllow) {
    pass("robots.txt does NOT contain Allow: / (prelaunch)");
  } else {
    fail("robots.txt contains Allow: / in prelaunch mode");
  }
}

// ── 2. HTML noindex checks ───────────────────────────────────────
console.log("\n── HTML noindex checks ──");

function checkNoindex(relativePath, label, expectNoindex) {
  const htmlPath = path.join(buildDir, relativePath);
  if (!fs.existsSync(htmlPath)) {
    warn(`${label}: file not found at ${relativePath}`);
    return;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const hasNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i.test(html);

  if (expectNoindex) {
    if (hasNoindex) {
      pass(`${label}: has noindex (expected in prelaunch)`);
    } else {
      fail(`${label}: MISSING noindex in prelaunch mode`);
    }
  } else {
    if (!hasNoindex) {
      pass(`${label}: no noindex (expected in public mode)`);
    } else {
      fail(`${label}: has noindex in public mode`);
    }
  }
}

// Pages to check
const pagesToCheck = [
  { path: "index.html", label: "Homepage /" },
  { path: path.join("research", "index.html"), label: "/research" },
  { path: path.join("data", "index.html"), label: "/data" },
  { path: path.join("security", "index.html"), label: "/security" },
  { path: path.join("systems", "index.html"), label: "/systems" },
  { path: path.join("intelligence", "index.html"), label: "/intelligence" },
];

// Also check one article
const articlesDir = path.join(buildDir, "articles");
let articlePath = null;
if (fs.existsSync(articlesDir)) {
  const slugs = fs.readdirSync(articlesDir).filter((d) =>
    fs.existsSync(path.join(articlesDir, d, "index.html"))
  );
  if (slugs.length > 0) {
    articlePath = path.join("articles", slugs[0], "index.html");
    pagesToCheck.push({ path: articlePath, label: `Article /articles/${slugs[0]}` });
  }
}

for (const page of pagesToCheck) {
  checkNoindex(page.path, page.label, isPrelaunchMode);
}

// ── 3. Sitemap origin check (public mode) ────────────────────────
if (isPublicMode) {
  console.log("\n── Sitemap origin ──");
  const sitemapPath = path.join(buildDir, "sitemap-0.xml");
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, "utf8");
    // Check that URLs use https://second-pass.vercel.app or the configured origin
    const urlMatch = sitemap.match(/<loc>([^<]+)<\/loc>/);
    if (urlMatch) {
      const firstUrl = urlMatch[1];
      if (firstUrl.startsWith("https://second-pass.vercel.app") || firstUrl.startsWith("https://secondpass.net")) {
        pass(`Sitemap uses canonical origin: ${firstUrl.split("/").slice(0, 3).join("/")}`);
      } else if (firstUrl.startsWith("https://")) {
        warn(`Sitemap origin: ${firstUrl.split("/").slice(0, 3).join("/")} — verify this is the intended canonical origin`);
      } else {
        fail(`Sitemap URL does not use https: ${firstUrl}`);
      }
    } else {
      fail("Sitemap contains no <loc> URLs");
    }
  } else {
    warn("sitemap-0.xml not found (may be named differently)");
  }
}

// ── 4. Cross-check with CURRENT_STATE.md ─────────────────────────
console.log("\n── CURRENT_STATE.md consistency ──");
const statePath = path.join(ROOT, "CURRENT_STATE.md");
if (fs.existsSync(statePath)) {
  const stateContent = fs.readFileSync(statePath, "utf8");
  const declaresPublic = /Site state:\s*LIVE|Phase:\s*LIVE|LIVE\s*\/\s*PUBLIC/i.test(stateContent);
  const declaresPrelaunch = /Site state:\s*prelaunch|Phase:\s*prelaunch|PRELAUNCH/i.test(stateContent) && !declaresPublic;

  if (declaresPublic) {
    if (isPublicMode) {
      pass("CURRENT_STATE.md declares LIVE/PUBLIC and build is public — consistent");
    } else {
      fail("CURRENT_STATE.md declares LIVE/PUBLIC but build is prelaunch (noindex/Disallow) — INCONSISTENT");
      fail("  Either set SITE_PRELAUNCH=false and rebuild, or update CURRENT_STATE.md to reflect prelaunch state.");
    }
  } else if (declaresPrelaunch) {
    if (isPrelaunchMode) {
      pass("CURRENT_STATE.md declares prelaunch and build is prelaunch — consistent");
    } else {
      warn("CURRENT_STATE.md declares prelaunch but build is public — update CURRENT_STATE.md");
    }
  } else {
    warn("CURRENT_STATE.md does not clearly declare public or prelaunch state");
  }
} else {
  warn("CURRENT_STATE.md not found");
}

// ── Summary ──────────────────────────────────────────────────────
console.log(`\n═══ RESULT ═══`);
console.log(`${failures} failure(s), ${warnings} warning(s)`);

if (failures > 0) {
  console.error("\nINDEXABILITY AUDIT — FAIL");
  process.exit(1);
} else {
  console.log("\nINDEXABILITY AUDIT — PASS");
  process.exit(0);
}
