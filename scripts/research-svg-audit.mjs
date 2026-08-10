#!/usr/bin/env node
/**
 * Research SVG Audit — structural checks for all research SVGs.
 * Usage: bun run research-svg:audit
 */
import { glob } from "glob";
import { readFileSync } from "fs";
import { parseStringPromise } from "xml2js";

const RESEARCH_DIR = "public/research";

async function auditSvg(filePath) {
  const issues = [];
  const raw = readFileSync(filePath, "utf-8");

  // Control character check
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    if (code < 0x20 && code !== 0x0a && code !== 0x0d && code !== 0x09) {
      issues.push(`Control character 0x${code.toString(16).padStart(2, "0")} at position ${i}`);
      break; // one report per file
    }
  }

  // BOM check
  if (raw.charCodeAt(0) === 0xfeff) {
    issues.push("BOM present");
  }

  // Parse XML
  let result;
  try {
    result = await parseStringPromise(raw, { strict: false });
  } catch (e) {
    issues.push(`XML parse error: ${e.message}`);
    return issues;
  }

  const svg = result.svg;
  if (!svg) {
    issues.push("No root <svg> element");
    return issues;
  }

  // viewBox check
  const vb = svg.$.viewBox;
  if (!vb) {
    issues.push("Missing viewBox");
  } else {
    const parts = vb.split(/\s+/).map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) {
      issues.push(`Invalid viewBox: ${vb}`);
    } else if (parts[2] <= 0 || parts[3] <= 0) {
      issues.push(`Zero/negative viewBox dimensions: ${vb}`);
    }
  }

  // Duplicate ID check
  const idRegex = /id="([^"]+)"/g;
  const ids = new Set();
  const dupIds = new Set();
  let match;
  while ((match = idRegex.exec(raw)) !== null) {
    if (ids.has(match[1])) dupIds.add(match[1]);
    ids.add(match[1]);
  }
  if (dupIds.size > 0) {
    issues.push(`Duplicate IDs: ${[...dupIds].join(", ")}`);
  }

  // Font fallback check — look for text without font-family
  const textNoFont = (raw.match(/<text[^>]*>(?!.*font-family)/g) || []).length;
  // This is a soft check, not an error

  return issues;
}

async function main() {
  const svgFiles = await glob(`${RESEARCH_DIR}/**/*.svg`);
  console.log(`\nResearch SVG Audit: ${svgFiles.length} files\n`);

  let totalIssues = 0;
  for (const file of svgFiles.sort()) {
    const issues = await auditSvg(file);
    if (issues.length > 0) {
      console.log(`❌ ${file}`);
      issues.forEach((i) => console.log(`   - ${i}`));
      totalIssues += issues.length;
    } else {
      console.log(`✅ ${file}`);
    }
  }

  console.log(`\n${totalIssues === 0 ? "ALL PASS" : `${totalIssues} issue(s) found`}`);
  process.exit(totalIssues > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Audit failed:", e);
  process.exit(1);
});
