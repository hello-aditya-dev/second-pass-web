#!/usr/bin/env node
/**
 * Production-State Audit — search built output for stale launch/pre-launch language.
 * Usage: bun run production-state:audit
 */
import { glob } from "glob";
import { readFileSync } from "fs";

const DIST_DIR = "dist/client";

// Deliberate denylist of obviously prohibited stale markers
const STALE_PATTERNS = [
  { pattern: /Pre-launch privacy notice/i, label: "Pre-launch privacy notice" },
  { pattern: /launch-stage publication/i, label: "launch-stage publication" },
  { pattern: /ADVERTISEMENT \/ RESERVED/i, label: "ADVERTISEMENT / RESERVED" },
  { pattern: /BRIEF Launch Pilot/i, label: "BRIEF Launch Pilot" },
  { pattern: /DATA Launch Pilot/i, label: "DATA Launch Pilot" },
];

async function main() {
  const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
  console.log(`\nProduction-State Audit: ${htmlFiles.length} HTML files\n`);

  if (htmlFiles.length === 0) {
    console.log("No built HTML found. Run `astro build` first.");
    process.exit(1);
  }

  let totalIssues = 0;
  for (const file of htmlFiles.sort()) {
    const content = readFileSync(file, "utf-8");
    const fileIssues = [];

    for (const { pattern, label } of STALE_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        fileIssues.push(label);
      }
    }

    if (fileIssues.length > 0) {
      const relPath = file.replace(DIST_DIR, "");
      console.log(`❌ ${relPath}`);
      fileIssues.forEach((i) => console.log(`   - ${i}`));
      totalIssues += fileIssues.length;
    }
  }

  if (totalIssues === 0) {
    console.log("✅ ALL PASS — no stale production-state markers found");
  } else {
    console.log(`\n❌ ${totalIssues} stale marker(s) found`);
  }
  process.exit(totalIssues > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Audit failed:", e);
  process.exit(1);
});
