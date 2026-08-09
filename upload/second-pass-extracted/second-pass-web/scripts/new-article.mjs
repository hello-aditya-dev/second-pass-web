import fs from "node:fs";
import path from "node:path";

const raw = process.argv[2];
if (!raw) {
  console.error("Usage: npm run article:new -- story-slug");
  process.exit(1);
}
const slug = raw
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

if (!slug) {
  console.error("Invalid slug.");
  process.exit(1);
}

const target = path.join("src", "content", "articles", `${slug}.mdx`);
if (fs.existsSync(target)) {
  console.error(`Article already exists: ${target}`);
  process.exit(1);
}

const now = new Date().toISOString();
const template = `---
title: "REPLACE: precise headline"
dek: "REPLACE: one or two sentences that add information beyond the headline."
slug: "${slug}"
section: "AI"
format: "SECOND PASS"
author: "Second Pass Editorial"
publishedAt: ${now}
status: "draft"
firstPass:
  - "REPLACE verified point one."
  - "REPLACE verified point two."
featured: false
demo: false
tags: []
adPolicy: "light"
sources:
  - label: "REPLACE primary source"
    url: "https://example.com"
    type: "primary"
    note: "REPLACE what this source supports."
changeLog: []
---

## / SECOND PASS

REPLACE WITH HUMAN-APPROVED PUBLIC DRAFT.

`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, template);
console.log(`Created ${target}`);
