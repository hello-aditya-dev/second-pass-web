#!/usr/bin/env node
// currency-regression-test.mjs — Regression test for currency/KaTeX safety
// Creates a test MDX with known currency patterns, builds it, and verifies
// the HTML output does NOT contain malformed KaTeX.
// Exits 0 on PASS, 1 on FAIL.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const TEST_SLUG = "currency-regression-test-fixture";
const ARTICLES_DIR = "./src/content/articles";
const TEST_FILE = path.join(ARTICLES_DIR, `${TEST_SLUG}.md`);

// ── Test MDX content ───────────────────────────────────────────────────

const TEST_MDX = `---
title: "Currency regression test fixture"
dek: "Test fixture for currency safety regression testing with known patterns"
slug: "${TEST_SLUG}"
section: "AI"
format: "NOW"
author: "Aditya"
publishedAt: "2026-01-01"
status: "published"
firstPass:
  - "Test fixture for currency regression."
  - "Do not publish this article."
featured: false
demo: true
tags:
  - "test"
adPolicy: "none"
sources: []
---

A costs $1. B costs $3.

The review costs $4.50.

The token premium is $0.0768.

Sol costs $5/M input and $30/M output.

Inline math variable: $$N$$

Display math fraction:

$$C = \\frac{x}{y}$$
`;

// ── Cleanup helper ──────────────────────────────────────────────────────

function cleanup() {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }
}

// ── Main ────────────────────────────────────────────────────────────────

let pass = true;
const failures = [];

try {
  // Step 1: Write test MDX
  console.log("CURRENCY REGRESSION TEST");
  console.log("════════════════════════");

  fs.writeFileSync(TEST_FILE, TEST_MDX, "utf8");
  console.log(`1. Wrote test fixture: ${TEST_FILE}`);

  // Step 2: Build
  console.log("2. Running astro build...");
  try {
    execSync("bun run build:astro", {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 120000
    });
    console.log("   Build succeeded.");
    // Process inline math tags (post-build step)
    try {
      execSync("node scripts/process-inline-math.mjs", {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 30000
      });
    } catch {
      // math:inline is best-effort — don't fail the test if it errors
    }
  } catch (buildErr) {
    console.error("   Build FAILED!");
    console.error(buildErr.stderr?.toString() || buildErr.message);
    failures.push("Astro build failed");
    pass = false;
    // Still try to check if HTML exists (partial build)
  }

  // Step 3: Find and read the built HTML
  const DIST_CANDIDATES = [
    path.join("dist", "client", "articles", TEST_SLUG, "index.html"),
    path.join("dist", "articles", TEST_SLUG, "index.html")
  ];

  const htmlPath = DIST_CANDIDATES.find((p) => fs.existsSync(p));

  if (!htmlPath) {
    failures.push("Built HTML not found for test fixture");
    pass = false;
    console.error("3. Built HTML not found!");
  } else {
    console.log(`3. Found built HTML: ${htmlPath}`);
    const html = fs.readFileSync(htmlPath, "utf8");

    // Strip HTML tags for text checking
    const stripTags = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // ── Verification A: Currency appears as readable prose ─────────────
    console.log("\n   Verification A: Currency as readable prose");
    const textContent = stripTags(html);

    const proseChecks = [
      { pattern: /A costs/, name: '"A costs"' },
      { pattern: /\$1/, name: '"$1" as prose' },
      { pattern: /B costs/, name: '"B costs"' },
      { pattern: /\$3/, name: '"$3" as prose' },
      { pattern: /\$4\.50/, name: '"$4.50" as prose' },
      { pattern: /\$0\.0768/, name: '"$0.0768" as prose' },
      { pattern: /\$5\/M/, name: '"$5/M" as prose' },
      { pattern: /\$30\/M/, name: '"$30/M" as prose' }
    ];

    for (const check of proseChecks) {
      if (check.pattern.test(textContent)) {
        console.log(`   ✓ ${check.name}: found`);
      } else {
        console.log(`   ✗ ${check.name}: NOT found`);
        failures.push(`Prose check: ${check.name} not found in built HTML`);
        pass = false;
      }
    }

    // ── Verification B: No KaTeX wrapping of currency ──────────────────
    console.log("\n   Verification B: No KaTeX wrapping currency text");

    // Extract all KaTeX annotation texts
    const annotationRe = /<annotation[^>]*>([^<]+)<\/annotation>/gi;
    const katexAnnotations = [];
    let match;
    while ((match = annotationRe.exec(html)) !== null) {
      katexAnnotations.push(match[1]);
    }

    // These phrases should NOT appear inside KaTeX annotations
    // (they would indicate currency was parsed as math)
    const badAnnotationPatterns = [
      { pattern: /and succeeds/, name: '"and succeeds" in KaTeX' },
      { pattern: /per review/, name: '"per review" in KaTeX' },
      { pattern: /input and/, name: '"input and" in KaTeX' }
    ];

    for (const check of badAnnotationPatterns) {
      const found = katexAnnotations.some((a) => check.pattern.test(a));
      if (found) {
        console.log(`   ✗ ${check.name}: FOUND (currency parsed as math!)`);
        failures.push(`KaTeX annotation contains ${check.name}`);
        pass = false;
      } else {
        console.log(`   ✓ ${check.name}: not found (good)`);
      }
    }

    // ── Verification C: Math variable N renders as KaTeX ───────────────
    console.log("\n   Verification C: Math variable $$N$$ renders as KaTeX");

    // Check that there's a katex span with N in it
    const katexNRe = /class="katex"[^>]*>[\s\S]*?<span[^>]*class="[^"]*base[^"]*"[^>]*>[\s\S]*?N[\s\S]*?<\/span>/i;
    const hasKatexN = katexNRe.test(html) || /class="katex"[^>]*>[\s\S]*?<mi[^>]*>N<\/mi>/i.test(html);

    if (hasKatexN) {
      console.log("   ✓ $$N$$ renders as KaTeX");
    } else {
      // Fallback: check annotation contains just "N"
      const hasAnnotationN = katexAnnotations.some((a) => a.trim() === "N");
      if (hasAnnotationN) {
        console.log("   ✓ $$N$$ renders as KaTeX (via annotation)");
      } else {
        console.log("   ✗ $$N$$ does NOT render as KaTeX");
        failures.push("$$N$$ does not render as KaTeX");
        pass = false;
      }
    }

    // ── Verification D: Fraction renders as KaTeX ──────────────────────
    console.log("\n   Verification D: $$C = \\frac{x}{y}$$ renders as KaTeX");

    // Check annotation contains the fraction
    const hasFraction = katexAnnotations.some((a) => /\\frac\{x\}\{y\}/.test(a));

    if (hasFraction) {
      console.log('   ✓ $$C = \\frac{x}{y}$$ renders as KaTeX (via annotation)');
    } else {
      // Check for mfrac element in MathML (alternative indicator)
      const hasMfrac = /<mfrac>/.test(html);
      if (hasMfrac) {
        console.log('   ✓ $$C = \\frac{x}{y}$$ renders as KaTeX (via mfrac element)');
      } else {
        console.log('   ✗ $$C = \\frac{x}{y}$$ does NOT render as KaTeX');
        failures.push('$$C = \\frac{x}{y}$$ does not render as KaTeX');
        pass = false;
      }
    }

    // ── Verification E: No raw LaTeX in output ─────────────────────────
    console.log("\n   Verification E: No raw LaTeX in prose output");

    // Check that \frac{ doesn't appear outside katex spans
    const bodySansKatex = html
      .replace(/<span[^>]*class="[^"]*katex[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<span[^>]*class="[^"]*katex-display[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");

    const rawLatexPatterns = [/\\frac\{/, /\\boxed\{/];
    for (const pat of rawLatexPatterns) {
      if (pat.test(bodySansKatex)) {
        console.log(`   ✗ Raw LaTeX "${pat.source}" found outside KaTeX spans`);
        failures.push(`Raw LaTeX ${pat.source} in built HTML`);
        pass = false;
      } else {
        console.log(`   ✓ No raw "${pat.source}" outside KaTeX spans`);
      }
    }
  }

} catch (err) {
  console.error("Unexpected error:", err.message);
  failures.push(`Unexpected error: ${err.message}`);
  pass = false;
} finally {
  // Step 4: Cleanup test fixture
  cleanup();
  console.log("\n4. Cleaned up test fixture.");
}

// ── Report ──────────────────────────────────────────────────────────────

console.log("\n════════════════════════");
if (failures.length > 0) {
  console.log("Failures:");
  for (const f of failures) console.log(`  ✗ ${f}`);
}
console.log(`RESULT: ${pass ? "PASS" : "FAIL"}`);

process.exit(pass ? 0 : 1);
