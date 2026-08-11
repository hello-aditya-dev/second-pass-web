#!/usr/bin/env node
/**
 * visual-audit.mjs
 * Structural visual integrity QA for SECOND / PASS articles.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dirname
  ? join(import.meta.dirname, "..")
  : process.cwd();

const slug = process.argv.find((a, i) => i > 1 && !a.startsWith("--")) || null;

const vercelStatic = join(ROOT, ".vercel", "output", "static");
const distDir = join(ROOT, "dist", "client");
const buildDir = existsSync(vercelStatic) && existsSync(join(vercelStatic, "index.html"))
  ? vercelStatic
  : distDir;

function getArticleSlugs() {
  const articlesDir = join(ROOT, "src", "content", "articles");
  const files = readdirSync(articlesDir).filter(f => f.endsWith(".md"));
  return files.map(f => f.replace(".md", ""));
}

const allSlugs = getArticleSlugs();
const targetSlugs = slug ? [slug] : allSlugs;

let totalPass = 0;
let totalFail = 0;

for (const s of targetSlugs) {
  const htmlPath = join(buildDir, "articles", s, "index.html");
  if (!existsSync(htmlPath)) {
    console.log(`SKIP: ${s} (no built HTML)`);
    continue;
  }

  const html = readFileSync(htmlPath, "utf8");
  const failures = [];

  // 1. Research images should be in semantic figure
  const bareImgInP = html.match(/<p>\s*<img[^>]*src="[^"]*\/research\/[^"]*"[^>]*>\s*<\/p>/g);
  if (bareImgInP && bareImgInP.length > 0) {
    failures.push(`${bareImgInP.length} research image(s) in plain <p>, not <figure>`);
  }

  // 2. Research images should have alt text
  const researchImgs = html.match(/<img[^>]*src="[^"]*\/research\/[^"]*"[^>]*>/g) || [];
  for (const img of researchImgs) {
    if (!/alt="[^"]+"/.test(img) || /alt=""/.test(img)) {
      failures.push("Research image missing alt text");
      break;
    }
  }

  // 3. Research figures should have figcaption
  const researchFigures = html.match(/<figure[^>]*class="[^"]*research-figure[^"]*"[^>]*>[\s\S]*?<\/figure>/g) || [];
  for (const fig of researchFigures) {
    if (!fig.includes("<figcaption")) {
      failures.push("Research figure missing figcaption");
    }
  }

  // 4. No package-relative paths
  if (/\.\.\/04_CHARTS\/|\.\.\/03_RESEARCH\/|\.\.\/05_QA\/|\/mnt\/data\/|file:\/\//.test(html)) {
    failures.push("Package-relative or local path found");
  }

  // 5. Table wrappers
  const tables = html.match(/<table/g);
  const tableWraps = html.match(/class="table-wrap"/g);
  if (tables && tables.length > 0 && (!tableWraps || tableWraps.length < tables.length)) {
    failures.push(`${tables.length - (tableWraps ? tableWraps.length : 0)} table(s) missing .table-wrap`);
  }

  // 6. No raw / CALCULATION heading
  if (/<h[23][^>]*>\/ CALCULATION<\/h[23]>/i.test(html)) {
    failures.push("/ CALCULATION heading not transformed");
  }

  // 7. No raw / CLAIM CHECK heading
  if (/<h[23][^>]*>\/ CLAIM CHECK<\/h[23]>/i.test(html)) {
    failures.push("/ CLAIM CHECK heading not transformed");
  }

  // 8. No raw / ASSUMPTION heading
  if (/<h[23][^>]*>\/ ASSUMPTION<\/h[23]>/i.test(html)) {
    failures.push("/ ASSUMPTION heading not transformed");
  }

  // 9. No raw LaTeX outside KaTeX
  // Remove annotation elements first (contain LaTeX source for accessibility)
  let cleanHtml = html.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, "");
  // Remove katex spans (multiple passes for nesting)
  for (let pass = 0; pass < 15; pass++) {
    const next = cleanHtml
      .replace(/<span[^>]*class="[^"]*katex[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<span[^>]*class="[^"]*katex-display[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");
    if (next === cleanHtml) break;
    cleanHtml = next;
  }
  // Also remove math-inline spans (post-build KaTeX)
  cleanHtml = cleanHtml.replace(/<span[^>]*class="math-inline"[^>]*>[\s\S]*?<\/span>/gi, "");
  // Remove code blocks to avoid false positives
  cleanHtml = cleanHtml.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, "");
  cleanHtml = cleanHtml.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, "");
  if (/\\frac\{/.test(cleanHtml) || /\\sum_/.test(cleanHtml) || /\\text\{/.test(cleanHtml)) {
    failures.push("Raw LaTeX outside KaTeX");
  }

  // 10. No sentinel values
  if (html.includes("24182") || html.includes("24183") || html.includes("24190") || html.includes("24191")) {
    failures.push("Sentinel value found");
  }

  // 11. Single H1
  const h1Count = (html.match(/<h1[^>]*>/g) || []).length;
  if (h1Count > 1) {
    failures.push(`Multiple H1 tags: ${h1Count}`);
  }

  // 12. Missing research assets
  const researchSrcs = html.match(/src="([^"]*\/research\/[^"]*\.(svg|png))"/g) || [];
  for (const srcMatch of researchSrcs) {
    const src = srcMatch.match(/src="([^"]+)"/)[1];
    const assetPath = join(buildDir, src.replace(/^\//, ""));
    if (!existsSync(assetPath)) {
      failures.push(`Missing research asset: ${src}`);
    }
  }

  if (failures.length === 0) {
    console.log(`✓ ${s}`);
    totalPass++;
  } else {
    console.log(`✗ ${s}`);
    for (const f of failures) {
      console.log(`  - ${f}`);
    }
    totalFail++;
  }
}

console.log(`\n── Visual Audit ──`);
console.log(`PASS: ${totalPass}`);
console.log(`FAIL: ${totalFail}`);
console.log(`Total: ${totalPass + totalFail}`);

if (totalFail > 0) {
  process.exit(1);
}
