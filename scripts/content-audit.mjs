import fs from "node:fs";
import path from "node:path";

const dir = path.join("src", "content", "articles");
const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
let failures = 0;
let warnings = 0;

for (const file of files) {
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  const published = /status:\s*["']?published["']?/.test(text);
  const demo = /demo:\s*true/.test(text);

  if (published && /REPLACE:|REPLACE WITH|https:\/\/example\.com/.test(text)) {
    console.error(`FAIL ${file}: published content contains unresolved template markers.`);
    failures++;
  }

  if (published && demo) {
    console.warn(`WARN ${file}: demo story is published in the foundation; remove before launch.`);
    warnings++;
  }

  if (!/firstPass:\s*\n/.test(text)) {
    console.error(`FAIL ${file}: missing firstPass block.`);
    failures++;
  }
}

console.log(`Audited ${files.length} article files. ${warnings} warning(s), ${failures} failure(s).`);
if (failures) process.exit(1);
