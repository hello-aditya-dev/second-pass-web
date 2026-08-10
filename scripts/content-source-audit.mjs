#!/usr/bin/env node
// content-source-audit.mjs — Source-level validation before build
// Runs BEFORE astro build. Exits 1 on any hard failure.

import fs from "node:fs";
import path from "node:path";

const ARTICLES_DIR = "./src/content/articles";
const SENTINELS = [24182, 24183, 24190, 24191];
const REAL_ARTICLES = [
  "cheapest-ai-model-not-cheapest-system",
  "cheapest-ai-model-not-cheapest-system-proof",
  "ai-inference-price-surface-v0-1",
  "no-universal-long-context-premium",
  "prompt-cache-second-use-break-even",
  "sonnet-5-price-effective-date"
];

// ── Helpers ─────────────────────────────────────────────────────────────

function readFrontmatter(text) {
  // Extract YAML frontmatter between --- delimiters
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  // Simple slug extraction from frontmatter
  const slugMatch = yaml.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
  return { slug: slugMatch ? slugMatch[1].trim() : null };
}

function getBody(text) {
  // Return content after frontmatter
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return match ? match[2] : text;
}

function isInCodeBlock(lines, lineIndex) {
  // Check if a line is inside a fenced code block (```)
  let inBlock = false;
  for (let i = 0; i < lineIndex; i++) {
    if (lines[i].match(/^```/)) inBlock = !inBlock;
  }
  return inBlock;
}

function isInMathBlock(text, position) {
  // Check if a position is inside a $$...$$ display math block
  // Simple heuristic: count $$ before position
  const before = text.substring(0, position);
  const doubleDollarCount = (before.match(/\$\$/g) || []).length;
  return doubleDollarCount % 2 === 1;
}

// ── Gather source files ────────────────────────────────────────────────

const allFiles = fs.readdirSync(ARTICLES_DIR)
  .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));

const results = {};
let anyFail = false;

// ── Check 1: Duplicate slug across .md/.mdx ────────────────────────────

let check1Pass = true;
const check1Details = [];
const basenames = new Map(); // basename without ext → [filenames]

for (const file of allFiles) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  if (!basenames.has(base)) basenames.set(base, []);
  basenames.get(base).push(file);
}

for (const [base, files] of basenames) {
  if (files.length > 1) {
    check1Pass = false;
    check1Details.push(`  ${base}: ${files.join(", ")}`);
  }
}

results["Check 1 (duplicate .md/.mdx)"] = { pass: check1Pass, details: check1Details };

// ── Check 2: Duplicate slug in frontmatter ──────────────────────────────

let check2Pass = true;
const check2Details = [];
const slugToFiles = new Map();

for (const file of allFiles) {
  const text = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const fm = readFrontmatter(text);
  if (fm.slug) {
    if (!slugToFiles.has(fm.slug)) slugToFiles.set(fm.slug, []);
    slugToFiles.get(fm.slug).push(file);
  }
}

for (const [slug, files] of slugToFiles) {
  if (files.length > 1) {
    check2Pass = false;
    check2Details.push(`  slug "${slug}": ${files.join(", ")}`);
  }
}

results["Check 2 (duplicate slug)"] = { pass: check2Pass, details: check2Details };

// ── Check 3: Sentinel values in source files ────────────────────────────

let check3Pass = true;
const check3Details = [];

for (const file of allFiles) {
  const text = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // Skip lines inside fenced code blocks
    if (isInCodeBlock(lines, i)) continue;
    for (const sentinel of SENTINELS) {
      const re = new RegExp(`(?<![\\d.])${sentinel}(?![\\d.])`, "g");
      if (re.test(lines[i])) {
        check3Pass = false;
        check3Details.push(`  ${file}:${i + 1}: found sentinel ${sentinel}`);
      }
    }
  }
}

results["Check 3 (sentinel values)"] = { pass: check3Pass, details: check3Details };

// ── Check 4: Duplicate body H1 for real articles ────────────────────────

let check4Pass = true;
const check4Details = [];

for (const slug of REAL_ARTICLES) {
  // Find the file for this slug
  const mdxFile = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const mdFile = path.join(ARTICLES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxFile) ? mdxFile : (fs.existsSync(mdFile) ? mdFile : null);
  if (!filePath) continue;

  const text = fs.readFileSync(filePath, "utf8");
  const body = getBody(text);
  const bodyLines = body.split("\n");

  for (let i = 0; i < bodyLines.length; i++) {
    if (isInCodeBlock(bodyLines, i)) continue;
    if (bodyLines[i].match(/^#\s/)) {
      check4Pass = false;
      check4Details.push(`  ${slug}: body starts with H1 "${bodyLines[i].substring(0, 60)}"`);
      break;
    }
  }
}

results["Check 4 (duplicate body H1)"] = { pass: check4Pass, details: check4Details };

// ── Check 5: Body metadata block in real articles ───────────────────────

let check5Pass = true;
const check5Details = [];
const META_PATTERNS = [
  /SECTION\s*\/\s*/,
  /FORMAT\s*\/\s*/,
  /AUTHOR\s*\/\s*/,
  /PUBLISHER\s*\/\s*/
];

for (const slug of REAL_ARTICLES) {
  const mdxFile = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const mdFile = path.join(ARTICLES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxFile) ? mdxFile : (fs.existsSync(mdFile) ? mdFile : null);
  if (!filePath) continue;

  const text = fs.readFileSync(filePath, "utf8");
  const body = getBody(text);
  // Check first 50 lines of body for metadata block patterns
  const bodyLines = body.split("\n").slice(0, 50);

  for (let i = 0; i < bodyLines.length; i++) {
    if (isInCodeBlock(bodyLines, i)) continue;
    for (const pat of META_PATTERNS) {
      if (pat.test(bodyLines[i])) {
        check5Pass = false;
        check5Details.push(`  ${slug}: metadata pattern "${pat.source}" at body line ${i + 1}`);
      }
    }
  }
}

results["Check 5 (body metadata block)"] = { pass: check5Pass, details: check5Details };

// ── Check 6: Body / FIRST PASS in real articles ─────────────────────────

let check6Pass = true;
const check6Details = [];

for (const slug of REAL_ARTICLES) {
  const mdxFile = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const mdFile = path.join(ARTICLES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxFile) ? mdxFile : (fs.existsSync(mdFile) ? mdFile : null);
  if (!filePath) continue;

  const text = fs.readFileSync(filePath, "utf8");
  const body = getBody(text);
  const bodyLines = body.split("\n");

  for (let i = 0; i < bodyLines.length; i++) {
    if (isInCodeBlock(bodyLines, i)) continue;
    if (bodyLines[i].match(/##\s*\/\s*FIRST\s+PASS/i)) {
      check6Pass = false;
      check6Details.push(`  ${slug}: "## / FIRST PASS" at body line ${i + 1}`);
    }
  }
}

results["Check 6 (body / FIRST PASS)"] = { pass: check6Pass, details: check6Details };

// ── Check 7: Raw LaTeX without math delimiters ─────────────────────────

let check7Pass = true;
const check7Details = [];
const LATEX_PATTERNS = [
  /\\frac\{/,
  /\\boxed\{/,
  /\\arg\\min/,
  /\\Delta\s*C/
];

for (const file of allFiles) {
  const text = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const lines = text.split("\n");
  let inMathBlock = false;
  let inFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track frontmatter (--- delimited)
    if (line.trim() === "---") {
      if (i === 0) { inFrontmatter = true; continue; }
      else if (inFrontmatter) { inFrontmatter = false; continue; }
    }
    if (inFrontmatter) continue;

    // Track $$ math blocks
    // Each $$ toggles the state; even count = no net change, odd = flip
    const dollarDollarMatches = line.match(/\$\$/g);
    if (dollarDollarMatches && dollarDollarMatches.length % 2 !== 0) {
      inMathBlock = !inMathBlock;
    }

    // Skip lines inside fenced code blocks
    if (isInCodeBlock(lines, i)) continue;

    // Skip lines inside $$ math blocks (whole line is math)
    if (inMathBlock) continue;

    // Check for raw LaTeX outside math delimiters
    // For inline math $$...$$ on the same line, split by $$ delimiters
    // and only check even-indexed segments (outside math)
    const segments = line.split(/\$\$/);
    for (let s = 0; s < segments.length; s += 2) {
      const segment = segments[s];
      for (const pat of LATEX_PATTERNS) {
        if (pat.test(segment)) {
          check7Pass = false;
          check7Details.push(`  ${file}:${i + 1}: raw LaTeX "${pat.source}" outside math delimiters`);
        }
      }
    }
  }
}

results["Check 7 (raw LaTeX outside math)"] = { pass: check7Pass, details: check7Details };

// ── Check 8: Package/local paths ────────────────────────────────────────

let check8Pass = true;
const check8Details = [];
const LOCAL_PATH_PATTERNS = [
  { pattern: /\/mnt\/data\//, name: "/mnt/data/" },
  { pattern: /sandbox:/, name: "sandbox:" },
  { pattern: /\.\.\/05_CHARTS\//, name: "../05_CHARTS/" },
  { pattern: /\.\.\/04_DATA\//, name: "../04_DATA/" },
  { pattern: /file:\/\//, name: "file://" },
  { pattern: /C:\\\\/, name: "C:\\" }
];

for (const file of allFiles) {
  const text = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (isInCodeBlock(lines, i)) continue;
    for (const { pattern, name } of LOCAL_PATH_PATTERNS) {
      if (pattern.test(lines[i])) {
        check8Pass = false;
        check8Details.push(`  ${file}:${i + 1}: local path "${name}"`);
      }
    }
  }
}

results["Check 8 (package/local paths)"] = { pass: check8Pass, details: check8Details };

// ── Check 9: Placeholders in published content ──────────────────────────

let check9Pass = true;
const check9Details = [];
const PLACEHOLDER_PATTERNS = [
  { pattern: /\bTODO\b/, name: "TODO" },
  { pattern: /\bTBD\b/, name: "TBD" },
  { pattern: /\[DATE\]/, name: "[DATE]" },
  { pattern: /\[NUMBER\]/, name: "[NUMBER]" }
];

for (const file of allFiles) {
  const text = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  // Only check published articles
  if (!/status:\s*["']?published["']?/.test(text)) continue;

  const body = getBody(text);
  const lines = body.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (isInCodeBlock(lines, i)) continue;
    for (const { pattern, name } of PLACEHOLDER_PATTERNS) {
      if (pattern.test(lines[i])) {
        check9Pass = false;
        check9Details.push(`  ${file}: body line ${i + 1}: placeholder "${name}"`);
      }
    }
  }
}

results["Check 9 (placeholders in published)"] = { pass: check9Pass, details: check9Details };

// ── Source Identity Check ───────────────────────────────────────────────

const identityDetails = [];
let identityPass = true;

for (const slug of REAL_ARTICLES) {
  const mdxExists = fs.existsSync(path.join(ARTICLES_DIR, `${slug}.mdx`));
  const mdExists = fs.existsSync(path.join(ARTICLES_DIR, `${slug}.md`));
  const sources = [];
  if (mdxExists) sources.push({ file: `${slug}.mdx`, format: "mdx" });
  if (mdExists) sources.push({ file: `${slug}.md`, format: "md" });

  if (sources.length === 0) {
    identityPass = false;
    identityDetails.push(`  ${slug}: NO SOURCE FILE FOUND`);
  } else if (sources.length > 1) {
    identityPass = false;
    identityDetails.push(`  ${slug}: MULTIPLE SOURCES: ${sources.map((s) => s.file).join(", ")}`);
  } else {
    identityDetails.push(`  SLUG: ${slug}`);
    identityDetails.push(`    SOURCE: src/content/articles/${sources[0].file}`);
    identityDetails.push(`    FORMAT: ${sources[0].format}`);
  }
}

// ── Output ──────────────────────────────────────────────────────────────

console.log("CONTENT SOURCE AUDIT");
console.log("═══════════════════");

for (const [name, result] of Object.entries(results)) {
  const status = result.pass ? "PASS" : "FAIL";
  console.log(`${name}: ${status}`);
  if (!result.pass && result.details.length > 0) {
    for (const d of result.details) console.log(d);
  }
}

console.log("───────────────────");
console.log("Source identity:");
for (const line of identityDetails) console.log(line);

if (!identityPass) {
  console.log("Source identity: FAIL");
}

const allPass = Object.values(results).every((r) => r.pass) && identityPass;

console.log("═══════════════════");
console.log(`RESULT: ${allPass ? "PASS" : "FAIL"}`);

process.exit(allPass ? 0 : 1);
