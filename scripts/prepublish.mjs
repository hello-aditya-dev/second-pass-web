#!/usr/bin/env node
/**
 * prepublish — Full verification pipeline for a human-approved article.
 * Does NOT auto-approve, silently rewrite, or auto-push.
 * Usage: bun run prepublish -- <slug>
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv.find((a, i) => process.argv[i - 1] === "--") || process.argv[2];
if (!slug) {
  console.error("Usage: bun run prepublish -- <slug>");
  process.exit(1);
}

const ROOT = import.meta.dirname
  ? join(import.meta.dirname, "..")
  : process.cwd();

const steps = [
  { name: "article:verify", cmd: `node scripts/verify-article.mjs ${slug}` },
  { name: "content:audit", cmd: "node scripts/content-audit.mjs" },
  { name: "astro check", cmd: "bun run check" },
  { name: "build", cmd: "bun run build:astro" },
  { name: "pagefind", cmd: "bun run search:index" }
];

let failed = false;

for (const step of steps) {
  console.log(`\n── ${step.name} ──`);
  try {
    const output = execSync(step.cmd, {
      encoding: "utf8",
      stdio: "pipe",
      timeout: 120_000,
      cwd: ROOT
    });
    console.log(output || "(no output — passed)");
  } catch (err) {
    console.error(err.stdout || "");
    console.error(err.stderr || "");
    console.error(`FAIL: ${step.name} exited with code ${err.status}`);
    failed = true;
    break;
  }
}

// Determine the build output directory
const vercelStatic = join(ROOT, ".vercel", "output", "static");
const distDir = join(ROOT, "dist");
const buildDir = existsSync(vercelStatic) && existsSync(join(vercelStatic, "index.html"))
  ? vercelStatic
  : distDir;

// HTML inspection for the specific article
if (!failed) {
  console.log(`\n── HTML inspection for ${slug} ──`);

  // Astro static output: articles are at /articles/<slug>/index.html
  const htmlPath = join(buildDir, "articles", slug, "index.html");

  try {
    if (!existsSync(htmlPath)) {
      console.error(`FAIL: Built HTML not found at ${htmlPath}`);
      console.error(`Build directory: ${buildDir}`);
      failed = true;
    } else {
      const html = readFileSync(htmlPath, "utf8");

      const checks = [
        { label: "title tag present", test: /<title>/.test(html) && !html.includes("<title></title>") },
        { label: "meta description", test: /name="description"/.test(html) },
        { label: "canonical link", test: /rel="canonical"/.test(html) },
        { label: "JSON-LD", test: /application\/ld\+json/.test(html) },
        { label: "source anatomy (FIRST PASS)", test: /first-pass|FIRST PASS/i.test(html) },
        { label: "no example.com", test: !html.includes("example.com") }
      ];

      for (const c of checks) {
        if (c.test) {
          console.log(`  ✓ ${c.label}`);
        } else {
          console.error(`  ✗ ${c.label}`);
          failed = true;
        }
      }
    }
  } catch (e) {
    console.error(`FAIL: Could not inspect HTML: ${e.message}`);
    failed = true;
  }
}

// Pagefind verification
if (!failed) {
  console.log(`\n── Pagefind verification ──`);
  const pagefindJs = join(buildDir, "pagefind", "pagefind.js");
  if (!existsSync(pagefindJs)) {
    console.error("FAIL: pagefind.js not found in build output");
    failed = true;
  } else {
    console.log(`  ✓ pagefind.js exists at ${pagefindJs}`);
  }
}

console.log(`\n${failed ? "FAIL" : "PASS"}: prepublish ${slug}`);
if (failed) process.exit(1);
