#!/usr/bin/env node
/**
 * convert-inline-math — Convert $...$ inline math to <imath>...</imath> tags.
 *
 * This is a one-time conversion script for articles that use single-dollar
 * inline math, which doesn't render because singleDollarTextMath is disabled.
 *
 * Rules:
 *   - Skips $$...$$ (display math — leave as-is)
 *   - Skips currency values ($1, $3, $4.50, $15,000+)
 *   - Skips frontmatter
 *   - Skips code blocks
 *   - Converts $math$ → <imath>math</imath> for all other cases
 *
 * Usage: node scripts/convert-inline-math.mjs <file1> [file2] ...
 */

import { readFileSync, writeFileSync } from "node:fs";

function isCurrencyValue(str) {
  return /^\$[\d,]+(\.\d+)?\+?$/.test(str.trim()) ||
         /^\$\d/.test(str.trim());
}

function convertLine(line) {
  // Tokenize: find all $ positions
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '$') {
      let count = 0;
      while (i + count < line.length && line[i + count] === '$') count++;
      tokens.push({ pos: i, count });
      i += count;
    } else {
      i += 1;
    }
  }

  if (tokens.length < 2) return line;

  // Walk tokens and convert $...$ pairs (not $$...$$ pairs)
  let result = "";
  let lastEnd = 0;
  let j = 0;

  while (j < tokens.length) {
    const tok = tokens[j];

    if (tok.count >= 2) {
      // $$ — display math. Find matching $$
      let k = j + 1;
      while (k < tokens.length && tokens[k].count < 2) k++;
      if (k < tokens.length) {
        // Copy up to and including the $$ pair
        result += line.substring(lastEnd, tokens[k].pos + tokens[k].count);
        lastEnd = tokens[k].pos + tokens[k].count;
        j = k + 1;
      } else {
        // No closing $$ — copy rest
        result += line.substring(lastEnd);
        lastEnd = line.length;
        j = tokens.length;
      }
      continue;
    }

    // Single $ — find matching single $ (not part of $$)
    let k = j + 1;
    if (k < tokens.length && tokens[k].count >= 2) {
      // This $ is immediately followed by $$ — ambiguous, skip
      result += line.substring(lastEnd, tok.pos + 1);
      lastEnd = tok.pos + 1;
      j = k;
      continue;
    }

    let endIdx = -1;
    while (k < tokens.length) {
      if (tokens[k].count === 1) {
        endIdx = k;
        break;
      }
      k++;
    }

    if (endIdx === -1) {
      // No closing $ — copy rest
      result += line.substring(lastEnd);
      lastEnd = line.length;
      j = tokens.length;
      continue;
    }

    // Extract the $...$ content
    const start = tok.pos + 1; // after opening $
    const end = tokens[endIdx].pos; // before closing $
    const inner = line.substring(start, end);
    const fullMatch = line.substring(tok.pos, tokens[endIdx].pos + 1);

    // Skip currency values
    if (isCurrencyValue(fullMatch)) {
      result += line.substring(lastEnd, tokens[endIdx].pos + 1);
      lastEnd = tokens[endIdx].pos + 1;
      j = endIdx + 1;
      continue;
    }

    // Skip plain numbers ($1,500-$3,000)
    if (/^\d[\d,]*$/.test(inner) || /^\d[\d,]*\.\d+$/.test(inner)) {
      result += line.substring(lastEnd, tokens[endIdx].pos + 1);
      lastEnd = tokens[endIdx].pos + 1;
      j = endIdx + 1;
      continue;
    }

    // Convert to <imath>
    result += line.substring(lastEnd, tok.pos);
    result += `<imath>${inner}</imath>`;
    lastEnd = tokens[endIdx].pos + 1;
    j = endIdx + 1;
  }

  result += line.substring(lastEnd);
  return result;
}

function convertFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  let inFrontmatter = false;
  let frontmatterDone = false;
  let inCodeBlock = false;
  let converted = 0;

  const newLines = lines.map((line, i) => {
    const trimmed = line.trim();

    // Track frontmatter
    if (i === 0 && trimmed === "---") { inFrontmatter = true; return line; }
    if (inFrontmatter && trimmed === "---") { inFrontmatter = false; frontmatterDone = true; return line; }
    if (inFrontmatter) return line;

    // Track code blocks
    if (trimmed.startsWith("```")) { inCodeBlock = !inCodeBlock; return line; }
    if (inCodeBlock) return line;

    // Count conversions
    const before = line;
    const after = convertLine(line);
    if (before !== after) {
      const count = (after.match(/<imath>/g) || []).length - (before.match(/<imath>/g) || []).length;
      converted += Math.max(0, count);
    }
    return after;
  });

  const newContent = newLines.join("\n");
  if (newContent !== content) {
    writeFileSync(filePath, newContent, "utf8");
    console.log(`✓ ${filePath}: converted ${converted} inline math expression(s)`);
  } else {
    console.log(`  ${filePath}: no changes needed`);
  }
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/convert-inline-math.mjs <file1> [file2] ...");
  process.exit(1);
}

for (const f of files) {
  convertFile(f);
}
