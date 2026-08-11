#!/usr/bin/env node
/**
 * math-render-audit
 *
 * Detects raw LaTeX that has escaped into reader-visible prose
 * instead of being rendered through KaTeX.
 *
 * TWO MODES:
 *
 * 1. SOURCE AUDIT (Markdown source files):
 *    - Wrong delimiters \[...\] and \(...\)
 *    - Raw LaTeX commands visible as prose outside math context
 *    - Single-dollar inline math ($...$) that won't render because
 *      singleDollarTextMath is disabled
 *    - Recognizes <imath>...</imath> as inline math context
 *    - Recognizes $$...$$ as display math (not single-dollar)
 *
 * 2. BUILD AUDIT (built HTML, if available):
 *    - Raw LaTeX commands visible in built article text (outside .katex spans)
 *    - Raw $...$ expressions that leaked as literal text
 *
 * Exit 0 if clean, exit 1 if raw LaTeX found.
 */

import { readFile, glob } from "node:fs/promises";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
  /\\in\b/y,
  /\\subset\b/y,
  /\\subseteq\b/y,
  /\\supset\b/y,
  /\\supseteq\b/y,
  /\\ne\b/y,
  /\\neq\b/y,
  /\\forall\b/y,
  /\\exists\b/y,
  /\\mathrm\{/y,
  /\\mathbb\{/y,
  /\\mathcal\{/y,
  /\\stackrel\b/y,
  /\\bigwedge\b/y,
  /\\Delta\b/y,
  /\\Sigma\b/y,
];

/**
 * Check if a string looks like a currency value (not math).
 * Examples: $1, $3, $4.50, $1,500, $15,000+
 */
function isCurrencyValue(str) {
  return /^\$[\d,]+(\.\d+)?\+?$/.test(str.trim()) ||
         /^\$\d/.test(str.trim());
}

/**
 * Remove <imath>...</imath> content from a line so that LaTeX inside
 * <imath> tags is not flagged as raw LaTeX in prose.
 */
function stripImathTags(line) {
  return line.replace(/<imath>[\s\S]*?<\/imath>/g, "");
}

/**
 * Check if a position in a line is inside a math span.
 * Handles $...$ and $$...$$ used inline in prose.
 */
function isInsideInlineMath(line, pos) {
  let i = 0;
  let inMath = false;
  let mathDelimiterLen = 0;

  while (i < pos) {
    if (line[i] === '$') {
      let count = 0;
      while (i + count < line.length && line[i + count] === '$') count++;

      if (count >= 2) {
        if (!inMath) {
          inMath = true;
          mathDelimiterLen = 2;
        } else if (mathDelimiterLen === 2) {
          inMath = false;
          mathDelimiterLen = 0;
        }
        i += 2;
      } else {
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

/**
 * Find single-dollar inline math ($...$) that won't render.
 * Skips currency values and content inside $$...$$ (display math).
 * Skips content inside <imath> tags.
 */
function findDisabledSingleDollarMath(line) {
  const issues = [];

  // Remove <imath> content first so we don't flag LaTeX inside it
  const cleanedLine = stripImathTags(line);

  // Tokenize: find all $ and $$ positions
  const tokens = [];
  let i = 0;
  while (i < cleanedLine.length) {
    if (cleanedLine[i] === '$') {
      let count = 0;
      while (i + count < cleanedLine.length && cleanedLine[i + count] === '$') count++;
      tokens.push({ pos: i, count });
      i += count;
    } else {
      i += 1;
    }
  }

  // Walk tokens and identify $...$ pairs (not $$...$$ pairs)
  let j = 0;
  while (j < tokens.length) {
    const tok = tokens[j];

    if (tok.count >= 2) {
      // $$ — display math delimiter. Find matching $$
      // Skip to the matching $$
      let k = j + 1;
      while (k < tokens.length && tokens[k].count < 2) k++;
      j = k + 1;
      continue;
    }

    // Single $ — find matching single $
    // But need to make sure it's not part of a $$ pair
    // (the tokenization above handles this: $$ is one token with count=2)
    let k = j + 1;
    if (k < tokens.length && tokens[k].count >= 2) {
      // This $ is immediately followed by $$ — ambiguous, skip
      j = k;
      continue;
    }

    // Find the next single $ that's not part of $$
    let endIdx = -1;
    while (k < tokens.length) {
      if (tokens[k].count === 1) {
        endIdx = k;
        break;
      }
      k++;
    }

    if (endIdx === -1) {
      // No closing $ — skip
      j++;
      continue;
    }

    // Extract the $...$ content
    const start = tok.pos + 1; // after opening $
    const end = tokens[endIdx].pos; // before closing $
    const inner = cleanedLine.substring(start, end);
    const fullMatch = cleanedLine.substring(tok.pos, tokens[endIdx].pos + 1);

    // Skip currency values
    if (isCurrencyValue(fullMatch)) {
      j = endIdx + 1;
      continue;
    }

    // Skip plain currency ranges ($1,500-$3,000)
    if (/^\d[\d,]*$/.test(inner) || /^\d[\d,]*\.\d+$/.test(inner)) {
      j = endIdx + 1;
      continue;
    }

    // Check if the inner content looks like math
    if (/\\[a-zA-Z]/.test(inner) || /[a-zA-Z]_\{/.test(inner) ||
        /[a-zA-Z]\([a-zA-Z]\)/.test(inner) || /^[a-z]$/i.test(inner) ||
        /^\\/.test(inner) || /^[A-Z]$/i.test(inner) ||
        /\^[a-zA-Z]/.test(inner) || /_[a-zA-Z]/.test(inner)) {
      issues.push({
        type: "single-dollar-math-disabled",
        message: `Single-dollar inline math won't render (singleDollarTextMath is false): ${fullMatch}`,
        context: line.trim().substring(0, 120)
      });
    }

    j = endIdx + 1;
  }

  return issues;
}

function auditArticleSource(content) {
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

  // PASS 2: Check for raw LaTeX commands outside math context
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

    // Remove <imath> content before checking for raw LaTeX
    const lineForLatexCheck = stripImathTags(line);

    // For prose lines, check if LaTeX commands are outside inline math
    for (const cmdPattern of LATEX_COMMANDS) {
      const re = new RegExp(cmdPattern.source, "g");
      let match;
      while ((match = re.exec(lineForLatexCheck)) !== null) {
        if (!isInsideInlineMath(lineForLatexCheck, match.index)) {
          issues.push({
            line: i + 1,
            type: "raw-latex-in-prose",
            message: `Raw LaTeX outside math: ${match[0]}`,
            context: line.trim().substring(0, 120)
          });
        }
      }
    }

    // PASS 3: Check for single-dollar inline math that won't render
    const dollarIssues = findDisabledSingleDollarMath(line);
    for (const issue of dollarIssues) {
      issues.push({ line: i + 1, ...issue });
    }
  }

  return issues;
}

/**
 * Audit built HTML for raw LaTeX that leaked into reader-visible text.
 */
function auditBuiltHtml(html) {
  const issues = [];

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return issues;
  let body = bodyMatch[1];

  // Remove KaTeX spans (rendered math)
  // Remove annotation elements (contain LaTeX source for accessibility)
  body = body.replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, "");
  // Remove katex spans (multiple passes for nesting)
  for (let pass = 0; pass < 15; pass++) {
    const next = body
      .replace(/<span[^>]*class="[^"]*katex[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<span[^>]*class="[^"]*katex-display[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "");
    if (next === body) break;
    body = next;
  }
  // Also remove math-inline spans (post-build KaTeX)
  body = body.replace(/<span[^>]*class="math-inline"[^>]*>[\s\S]*?<\/span>/gi, "");

  // Also remove code blocks (pre/code) to avoid false positives from source examples
  body = body.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, "");
  body = body.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, "");

  // Strip remaining HTML tags to get visible text
  const text = body.replace(/<[^>]+>/g, " ");

  // Check for raw LaTeX commands in visible text
  for (const cmdPattern of LATEX_COMMANDS) {
    const re = new RegExp(cmdPattern.source, "g");
    const match = re.exec(text);
    if (match) {
      // Get surrounding context
      const idx = match.index;
      const context = text.substring(Math.max(0, idx - 30), idx + 50).trim();
      issues.push({
        type: "raw-latex-in-html",
        message: `Raw LaTeX in built HTML: ${match[0]}`,
        context
      });
    }
  }

  // Check for raw $...$ expressions that leaked as literal text
  // (but not currency like $1, $3.50)
  const dollarRe = /\$([a-zA-Z][^$\n]{0,60}?)\$/g;
  let dm;
  while ((dm = dollarRe.exec(text)) !== null) {
    const fullMatch = dm[0];
    const inner = dm[1];
    if (isCurrencyValue(fullMatch)) continue;
    // Check if it looks like math
    if (/\\[a-zA-Z]/.test(inner) || /[a-zA-Z]_\{/.test(inner) ||
        /^[a-z]$/i.test(inner) || /[a-zA-Z]\([a-zA-Z]\)/.test(inner) ||
        /\^[a-zA-Z]/.test(inner) || /_[a-zA-Z]/.test(inner) ||
        /^[A-Z]$/i.test(inner)) {
      const idx = dm.index;
      const context = text.substring(Math.max(0, idx - 30), idx + fullMatch.length + 30).trim();
      issues.push({
        type: "raw-inline-math-in-html",
        message: `Raw inline math leaked as text: ${fullMatch}`,
        context
      });
    }
  }

  return issues;
}

async function main() {
  // ── MODE 1: Source audit ──────────────────────────────────────
  console.log("── Source audit (Markdown) ──\n");

  const articlePaths = [];
  for await (const entry of glob(join(ARTICLES_DIR, "*.md"))) {
    articlePaths.push(entry);
  }

  let sourceIssues = 0;
  const sourceResults = [];

  for (const filePath of articlePaths.sort()) {
    const content = await readFile(filePath, "utf8");
    const slug = filePath.split("/").pop().replace(".md", "");

    // Only audit published articles
    if (!content.includes('status: "published"')) continue;

    const issues = auditArticleSource(content);
    sourceIssues += issues.length;

    if (issues.length > 0) {
      sourceResults.push({ slug, issues });
    }
  }

  if (sourceResults.length === 0) {
    console.log("✅ Source audit: No raw LaTeX found in published articles.");
  } else {
    console.log(`❌ Source audit: Found ${sourceIssues} raw LaTeX issue(s) in ${sourceResults.length} article(s).\n`);
    for (const { slug, issues } of sourceResults) {
      console.log(`## ${slug}`);
      for (const issue of issues) {
        console.log(`  Line ${issue.line || "?"}: [${issue.type}] ${issue.message}`);
        console.log(`    ${issue.context}`);
      }
      console.log();
    }
  }

  // ── MODE 2: Build audit (if build output exists) ──────────────
  let buildIssues = 0;
  const vercelStatic = join(ROOT, ".vercel", "output", "static", "articles");
  const distArticles = join(ROOT, "dist", "articles");
  const buildArticlesDir =
    existsSync(vercelStatic) ? vercelStatic :
    existsSync(distArticles) ? distArticles : null;

  if (buildArticlesDir) {
    console.log("\n── Build audit (HTML) ──\n");

    const buildSlugs = readdirSync(buildArticlesDir).filter((d) =>
      existsSync(join(buildArticlesDir, d, "index.html"))
    );

    const buildResults = [];

    for (const slug of buildSlugs) {
      const html = readFileSync(join(buildArticlesDir, slug, "index.html"), "utf8");
      const issues = auditBuiltHtml(html);
      buildIssues += issues.length;

      if (issues.length > 0) {
        buildResults.push({ slug, issues });
      }
    }

    if (buildResults.length === 0) {
      console.log("✅ Build audit: No raw LaTeX found in built article HTML.");
    } else {
      console.log(`❌ Build audit: Found ${buildIssues} raw LaTeX issue(s) in ${buildResults.length} article(s).\n`);
      for (const { slug, issues } of buildResults) {
        console.log(`## ${slug}`);
        for (const issue of issues) {
          console.log(`  [${issue.type}] ${issue.message}`);
          console.log(`    ${issue.context}`);
        }
        console.log();
      }
    }
  } else {
    console.log("\n── Build audit skipped (no build output found) ──");
  }

  // ── Summary ───────────────────────────────────────────────────
  const totalIssues = sourceIssues + buildIssues;
  if (totalIssues === 0) {
    console.log("\n✅ math-render-audit: PASS — no raw LaTeX detected.");
    process.exit(0);
  } else {
    console.log(`\n❌ math-render-audit: FAIL — ${totalIssues} total issue(s).`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("math-render-audit error:", err);
  process.exit(2);
});
