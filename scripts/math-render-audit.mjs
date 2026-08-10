#!/usr/bin/env node
/**
 * math-render-audit.mjs
 *
 * Detects raw LaTeX that has escaped into reader-visible prose
 * instead of being rendered through KaTeX.
 *
 * PRIMARY CHECK: wrong delimiters \[...\] and \(...\)
 *   These are always errors — the site requires $$...$$ and $...$
 *
 * SECONDARY CHECK: raw LaTeX commands visible as prose
 *   Catches \frac, \boxed, etc. outside any math context ($...$ or $$...$$)
 *   Correctly handles $$ used as inline math in prose lines.
 *
 * Exit 0 if clean, exit 1 if raw LaTeX found.
 */

import { readFile, glob } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ARTICLES_DIR = join(ROOT, "src", "content", "articles");

// Always wrong — these delimiters are never valid in this site
const WRONG_DELIMITERS = [
  { pattern: /\\\[/g, name: "\\[" },
  { pattern: /\\\]/g, name: "\\]" },
  { pattern: /\\\(/g, name: "\\(" },
  { pattern: /\\\)/g, name: "\\)" },
];

// Raw LaTeX commands that should never appear outside math context
const LATEX_COMMANDS = [
  /\\frac\{?/y,
  /\\boxed\{?/y,
  /\\times\b/y,
  /\\text\{/y,
  /\\left\b/y,
  /\\right\b/y,
  /\\sum\b/y,
  /\\operatorname\b/y,
  /\\cdot\b/y,
  /\\rightarrow\b/y,
  /\\approx\b/y,
  /\\le\b/y,
  /\\ge\b/y,
  /\\propto\b/y,
  /\\gtrsim\b/y,
  /\\lceil\b/y,
  /\\rceil\b/y,
  /\\lfloor\b/y,
  /\\rfloor\b/y,
];

/**
 * Check if a position in a line is inside a math span.
 * Handles both $...$ and $$...$$ used inline in prose.
 */
function isInsideInlineMath(line, pos) {
  // Scan the line character by character tracking math state
  let i = 0;
  let inMath = false;
  let mathDelimiterLen = 0;

  while (i < pos) {
    if (line[i] === '$') {
      // Count consecutive $
      let count = 0;
      while (i + count < line.length && line[i + count] === '$') count++;

      if (count >= 2) {
        // $$ toggles inline math
        if (!inMath) {
          inMath = true;
          mathDelimiterLen = 2;
        } else if (mathDelimiterLen === 2) {
          inMath = false;
          mathDelimiterLen = 0;
        }
        i += 2;
      } else {
        // Single $ toggles inline math
        if (!inMath) {
          inMath = true;
          mathDelimiterLen = 1;
        } else if (mathDelimiterLen === 1) {
          inMath = false;
          mathDelimiterLen = 0;
        }
        i += 1;
      }
    } else {
      i += 1;
    }
  }

  return inMath;
}

function auditArticle(content) {
  const issues = [];
  const lines = content.split("\n");

  // PASS 1: Check for wrong delimiters
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { pattern, name } of WRONG_DELIMITERS) {
      const re = new RegExp(pattern.source, "g");
      if (re.test(line)) {
        issues.push({
          line: i + 1,
          type: "wrong-delimiter",
          message: `Wrong math delimiter: ${name}`,
          context: line.trim().substring(0, 120)
        });
      }
    }
  }

  // PASS 2: Check for raw LaTeX commands outside any math context
  let inDisplayMath = false;
  let inFrontmatter = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track frontmatter
    if (i === 0 && trimmed === "---") { inFrontmatter = true; continue; }
    if (inFrontmatter && trimmed === "---") { inFrontmatter = false; continue; }
    if (inFrontmatter) continue;

    // Track code blocks
    if (trimmed.startsWith("```")) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock) continue;

    // Track display math blocks (standalone $$ on its own line)
    if (trimmed === "$$") {
      inDisplayMath = !inDisplayMath;
      continue;
    }

    // Skip lines inside display math
    if (inDisplayMath) continue;

    // For prose lines, check if LaTeX commands are outside inline math
    for (const cmdPattern of LATEX_COMMANDS) {
      const re = new RegExp(cmdPattern.source, "g");
      let match;
      while ((match = re.exec(line)) !== null) {
        if (!isInsideInlineMath(line, match.index)) {
          issues.push({
            line: i + 1,
            type: "raw-latex-in-prose",
            message: `Raw LaTeX outside math: ${match[0]}`,
            context: line.trim().substring(0, 120)
          });
        }
      }
    }
  }

  return issues;
}

async function main() {
  const articlePaths = [];
  for await (const entry of glob(join(ARTICLES_DIR, "*.md"))) {
    articlePaths.push(entry);
  }

  let totalIssues = 0;
  const results = [];

  for (const filePath of articlePaths.sort()) {
    const content = await readFile(filePath, "utf-8");
    const slug = filePath.split("/").pop().replace(".md", "");

    // Only audit published articles
    if (!content.includes('status: "published"')) continue;

    const issues = auditArticle(content);
    totalIssues += issues.length;

    if (issues.length > 0) {
      results.push({ slug, issues });
    }
  }

  if (results.length === 0) {
    console.log("✅ math-render-audit: No raw LaTeX found in published articles.");
    process.exit(0);
  }

  console.log(`❌ math-render-audit: Found ${totalIssues} raw LaTeX issue(s) in ${results.length} article(s).\n`);

  for (const { slug, issues } of results) {
    console.log(`## ${slug}`);
    for (const issue of issues) {
      console.log(`  Line ${issue.line}: [${issue.type}] ${issue.message}`);
      console.log(`    ${issue.context}`);
    }
    console.log();
  }

  process.exit(1);
}

main().catch(err => {
  console.error("math-render-audit error:", err);
  process.exit(2);
});
