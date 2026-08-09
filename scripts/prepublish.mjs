#!/usr/bin/env node
/**
 * prepublish — Full verification pipeline for a human-approved article.
 * Does NOT auto-approve, silently rewrite, or auto-push.
 * Usage: bun run prepublish -- <slug>
 */

import { execSync } from "node:child_process";

const slug = process.argv.find((a, i) => process.argv[i - 1] === "--") || process.argv[2];
if (!slug) {
  console.error("Usage: bun run prepublish -- <slug>");
  process.exit(1);
}

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
      timeout: 120_000
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

// HTML inspection for the specific article
if (!failed) {
  console.log(`\n── HTML inspection for ${slug} ──`);
  const distPath = `dist/articles/${slug}/index.html`;
  try {
    const fs = await import("node:fs");
    if (!fs.existsSync(distPath)) {
      console.error(`FAIL: Built HTML not found at ${distPath}`);
      failed = true;
    } else {
      const html = fs.readFileSync(distPath, "utf8");

      const checks = [
        { label: "title tag present", test: /<title>/.test(html) && !html.includes("<title></title>") },
        { label: "meta description", test: /name="description"/.test(html) },
        { label: "canonical link", test: /rel="canonical"/.test(html) },
        { label: "JSON-LD", test: /application\/ld\+json/.test(html) },
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

console.log(`\n${failed ? "FAIL" : "PASS"}: prepublish ${slug}`);
if (failed) process.exit(1);
