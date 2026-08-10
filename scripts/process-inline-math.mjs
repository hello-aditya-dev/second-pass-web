#!/usr/bin/env node
/**
 * process-inline-math.mjs
 *
 * Post-build script that finds <imath>...</imath> patterns in built HTML
 * and replaces them with KaTeX-rendered inline math spans.
 *
 * This runs AFTER astro build and BEFORE the output is deployed.
 *
 * Usage: node scripts/process-inline-math.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import katex from "katex";

const DIST_DIR = ".vercel/output/static";

async function main() {
  // Find all HTML files in the build output
  const htmlFiles = await glob("**/*.html", {
    cwd: DIST_DIR,
    absolute: true,
  });

  let totalReplacements = 0;

  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, "utf8");

    if (!content.includes("<imath>")) continue;

    // Replace <imath>...</imath> with KaTeX-rendered spans
    const newContent = content.replace(
      /<imath>([\s\S]*?)<\/imath>/g,
      (match, mathContent) => {
        try {
          const rendered = katex.renderToString(mathContent.trim(), {
            throwOnError: false,
            strict: false,
            trust: true,
            displayMode: false,
          });
          totalReplacements++;
          return `<span class="math-inline">${rendered}</span>`;
        } catch (e) {
          totalReplacements++;
          return `<em class="math-inline-error">${mathContent}</em>`;
        }
      }
    );

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
    }
  }

  console.log(`[process-inline-math] Replaced ${totalReplacements} <imath> elements with KaTeX`);
}

main().catch((err) => {
  console.error("[process-inline-math] Error:", err.message);
  process.exit(1);
});
