#!/usr/bin/env node
/**
 * responsive-audit.mjs
 * Playwright-based responsive integrity QA for SECOND / PASS articles.
 *
 * Usage:
 *   node scripts/responsive-audit.mjs              # all 6 articles × 7 viewports
 *   node scripts/responsive-audit.mjs <slug>       # single article × 7 viewports
 *   node scripts/responsive-audit.mjs --quick      # all articles × 2 viewports (390 + 1440)
 *   node scripts/responsive-audit.mjs <slug> --quick
 *
 * Exits 0 on all-pass, 1 on any failure.
 */

import { chromium } from "playwright";
import { execSync, spawn } from "child_process";
import http from "http";
import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";

const ARTICLES = [
  "cheapest-ai-model-not-cheapest-system",        // FLAGSHIP
  "cheapest-ai-model-not-cheapest-system-proof",   // PROOF
  "no-universal-long-context-premium",             // TABLE STRESS
  "prompt-cache-second-use-break-even",            // CACHE MATH
  "sonnet-5-price-effective-date",                 // SONNET TABLE
  "ai-inference-price-surface-v0-1",               // DATA
];

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "tablet-1024",  width: 1024,  height: 1366 },
  { name: "tablet-820",   width: 820,   height: 1180 },
  { name: "tablet-768",   width: 768,   height: 1024 },
  { name: "mobile-430",   width: 430,   height: 932 },
  { name: "mobile-390",   width: 390,   height: 844 },
  { name: "mobile-375",   width: 375,   height: 812 },
];

const TOLERANCE = 3; // px tolerance for sub-pixel rounding

/**
 * Start a simple static file server for the Astro dist directory.
 */
async function startStaticServer(port = 4321) {
  const distDir = join(process.cwd(), "dist");

  const server = createServer((req, res) => {
    let filePath = join(distDir, req.url === "/" ? "/index.html" : req.url);

    // Astro static output: /articles/slug/ serves /articles/slug/index.html
    if (!filePath.includes(".")) {
      filePath = join(filePath, "index.html");
    }

    try {
      const data = readFileSync(filePath);
      const ext = filePath.split(".").pop();
      const types = {
        html: "text/html",
        css: "text/css",
        js: "application/javascript",
        json: "application/json",
        svg: "image/svg+xml",
        png: "image/png",
        ico: "image/x-icon",
        xml: "application/xml",
        txt: "text/plain",
        webmanifest: "application/manifest+json",
      };
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      res.end(data);
    } catch {
      // Try with /index.html
      try {
        const indexPath = join(filePath, "index.html");
        const data = readFileSync(indexPath);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

/**
 * Audit a single article page at a specific viewport.
 */
async function auditPage(page, article, viewport, baseUrl) {
  const url = `${baseUrl}/articles/${article}`;
  const failures = [];

  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  } catch (e) {
    failures.push(`PAGE LOAD: ${e.message.slice(0, 100)}`);
    return failures;
  }

  // A. Page Overflow — NO horizontal scroll
  const pageOverflow = await page.evaluate((tol) => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    return sw > cw + tol ? { scrollWidth: sw, clientWidth: cw } : null;
  }, TOLERANCE);
  if (pageOverflow) {
    failures.push(`PAGE OVERFLOW: scrollWidth=${pageOverflow.scrollWidth} > clientWidth=${pageOverflow.clientWidth}`);
  }

  // B. Article body fits viewport
  const bodyOverflow = await page.evaluate((vp) => {
    const body = document.querySelector(".article-body");
    if (!body) return null;
    const r = body.getBoundingClientRect();
    return r.right > vp + 3 ? { right: r.right } : null;
  }, viewport.width);
  if (bodyOverflow) {
    failures.push(`ARTICLE BODY: right=${bodyOverflow.right.toFixed(1)} > viewport=${viewport.width}`);
  }

  // C. Article header fits viewport
  const headerOverflow = await page.evaluate((vp) => {
    const h = document.querySelector(".article-header h1");
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return r.right > vp + 3 ? { right: r.right } : null;
  }, viewport.width);
  if (headerOverflow) {
    failures.push(`ARTICLE HEADER: right=${headerOverflow.right.toFixed(1)} > viewport=${viewport.width}`);
  }

  // D. Tables — wide tables must have scrollable wrapper
  const tableIssues = await page.evaluate((tol) => {
    const issues = [];
    document.querySelectorAll("table").forEach((table) => {
      const r = table.getBoundingClientRect();
      if (r.width > window.innerWidth + tol) {
        const wrap = table.closest(".table-wrap");
        if (!wrap) {
          issues.push(`Table ${r.width.toFixed(0)}px wide without .table-wrap`);
        }
      }
    });
    return issues;
  }, TOLERANCE);
  failures.push(...tableIssues);

  // E. KaTeX display math fits or has internal scroll
  const katexIssues = await page.evaluate((tol) => {
    const issues = [];
    document.querySelectorAll(".katex-display").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + tol) {
        const hasScroll = el.scrollWidth > el.clientWidth + 2;
        if (!hasScroll) {
          issues.push(`KaTeX overflows ${r.right.toFixed(0)}px, no internal scroll`);
        }
      }
    });
    return issues;
  }, TOLERANCE);
  failures.push(...katexIssues);

  // F. Figures fit viewport
  const figureIssues = await page.evaluate((tol) => {
    const issues = [];
    document.querySelectorAll("figure, .research-figure").forEach((fig) => {
      const r = fig.getBoundingClientRect();
      if (r.right > window.innerWidth + tol) {
        issues.push(`Figure overflows ${r.right.toFixed(0)}px`);
      }
    });
    return issues;
  }, TOLERANCE);
  failures.push(...figureIssues);

  // G. Code blocks contained
  const codeIssues = await page.evaluate((tol) => {
    const issues = [];
    document.querySelectorAll("pre").forEach((pre) => {
      const r = pre.getBoundingClientRect();
      if (r.right > window.innerWidth + tol) {
        issues.push(`Pre overflows ${r.right.toFixed(0)}px`);
      }
    });
    return issues;
  }, TOLERANCE);
  failures.push(...codeIssues);

  // H. Share buttons inside viewport
  const shareOverflow = await page.evaluate((vp) => {
    const nav = document.querySelector(".article-share");
    if (!nav) return null;
    const r = nav.getBoundingClientRect();
    return r.right > vp + 3 ? { right: r.right } : null;
  }, viewport.width);
  if (shareOverflow) {
    failures.push(`SHARE: right=${shareOverflow.right.toFixed(1)} > viewport=${viewport.width}`);
  }

  // J. Header doesn't expand document width
  const headerWidthIssue = await page.evaluate((tol) => {
    const mast = document.querySelector(".masthead");
    if (!mast) return null;
    return mast.scrollWidth > window.innerWidth + tol
      ? { scrollWidth: mast.scrollWidth }
      : null;
  }, TOLERANCE);
  if (headerWidthIssue) {
    failures.push(`HEADER: scrollWidth=${headerWidthIssue.scrollWidth} > viewport`);
  }

  // K. Source rows inside viewport
  const sourceOverflow = await page.evaluate((vp) => {
    const section = document.querySelector(".sources");
    if (!section) return null;
    const r = section.getBoundingClientRect();
    return r.right > vp + 3 ? { right: r.right } : null;
  }, viewport.width);
  if (sourceOverflow) {
    failures.push(`SOURCES: right=${sourceOverflow.right.toFixed(1)} > viewport`);
  }

  // L. Article-end slug doesn't expand document width
  const articleEndOverflow = await page.evaluate((vp) => {
    const end = document.querySelector(".article-end");
    if (!end) return null;
    const r = end.getBoundingClientRect();
    return r.right > vp + 3 ? { right: r.right } : null;
  }, viewport.width);
  if (articleEndOverflow) {
    failures.push(`ARTICLE-END: right=${articleEndOverflow.right.toFixed(1)} > viewport`);
  }

  return failures;
}

async function main() {
  const args = process.argv.slice(2);
  const articleFilter = args.find((a) => !a.startsWith("--"));
  const quickMode = args.includes("--quick");

  const articles = articleFilter ? [articleFilter] : ARTICLES;
  const viewports = quickMode
    ? VIEWPORTS.filter((v) => v.name === "mobile-390" || v.name === "desktop-1440")
    : VIEWPORTS;

  // Ensure build exists
  console.log("Building site for responsive audit...");
  try {
    execSync("bun run build:astro", { stdio: "pipe", cwd: process.cwd(), timeout: 120000 });
  } catch {
    console.error("Build failed. Cannot run responsive audit.");
    process.exit(1);
  }

  // Start static server
  const port = 4321;
  console.log(`Starting static server on port ${port}...`);
  const server = await startStaticServer(port);
  const baseUrl = `http://localhost:${port}`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalFailures = 0;
  let totalPasses = 0;
  const failedCombos = [];

  for (const article of articles) {
    for (const vp of viewports) {
      const failures = await auditPage(page, article, vp, baseUrl);
      const label = `${article} @ ${vp.name} (${vp.width}×${vp.height})`;

      if (failures.length === 0) {
        console.log(`✓ ${label}`);
        totalPasses++;
      } else {
        console.log(`✗ ${label}`);
        failures.forEach((f) => console.log(`    ${f}`));
        totalFailures++;
        failedCombos.push(label);
      }
    }
  }

  await browser.close();
  server.close();

  console.log(`\n── Responsive Audit ──`);
  console.log(`PASS: ${totalPasses}`);
  console.log(`FAIL: ${totalFailures}`);
  console.log(`Total: ${totalPasses + totalFailures}`);

  if (failedCombos.length > 0) {
    console.log(`\nFailed combinations:`);
    failedCombos.forEach((c) => console.log(`  - ${c}`));
  }

  process.exit(totalFailures > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Responsive audit failed:", e.message || e);
  process.exit(1);
});
