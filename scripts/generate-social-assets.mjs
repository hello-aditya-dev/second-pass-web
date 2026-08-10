#!/usr/bin/env node
/**
 * generate-social-assets — Build-time social image generator for SECOND / PASS articles.
 *
 * Generates OG (1200×630), portrait (1080×1350), and square (1080×1080) PNGs
 * using sharp to render SVG compositions. Typography-first, no AI art, no external APIs.
 *
 * Usage:
 *   bun run social:generate -- <slug>    Generate for one article
 *   bun run social:generate:all          Generate for all published articles
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// ── Constants ──
const ROOT = import.meta.dirname
  ? path.join(import.meta.dirname, "..")
  : process.cwd();

const PAPER = "#F2EFE7";
const INK = "#11110F";
const GRAPHITE = "#5A5953";
const RULE = "#C9C3B7";
const BLUE = "#2F5BFF";
const BLUE_DARK = "#1736A5";

const SITE_ORIGIN = process.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";

// ── Frontmatter parser ──
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const raw = match[1];
  const data = {};
  let currentKey = null;
  let inArray = false;
  let arrayItems = [];

  for (const line of raw.split("\n")) {
    // Array item
    if (inArray && /^\s+-\s+"?(.+?)"?\s*$/.test(line)) {
      const m = line.match(/^\s+-\s+"?(.+?)"?\s*$/);
      if (m) arrayItems.push(m[1]);
      continue;
    }
    // End of array
    if (inArray && /^\S/.test(line)) {
      data[currentKey] = arrayItems;
      inArray = false;
      currentKey = null;
    }
    // Key: value
    const m = line.match(/^(\w+):\s*["']?(.+?)["']?\s*$/);
    if (m) {
      if (inArray && currentKey) {
        data[currentKey] = arrayItems;
      }
      currentKey = m[1];
      data[m[1]] = m[2];
      inArray = false;
    }
    // Key: (start of array)
    const arrMatch = line.match(/^(\w+):\s*$/);
    if (arrMatch) {
      currentKey = arrMatch[1];
      inArray = true;
      arrayItems = [];
    }
  }
  if (inArray && currentKey) {
    data[currentKey] = arrayItems;
  }
  return data;
}

// ── Get article data ──
function getArticleData(slug) {
  const dir = path.join(ROOT, "src", "content", "articles");
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const c of candidates) {
    const fp = path.join(dir, c);
    if (fs.existsSync(fp)) {
      const text = fs.readFileSync(fp, "utf8");
      const data = parseFrontmatter(text);
      return data;
    }
  }
  return null;
}

// ── Get all published article slugs ──
function getAllPublishedSlugs() {
  const dir = path.join(ROOT, "src", "content", "articles");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md") || f.endsWith(".mdx"));
  const slugs = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    const data = parseFrontmatter(text);
    if (data.status === "published" && data.slug) {
      slugs.push(data.slug);
    }
  }
  return slugs;
}

// ── Text wrapping for SVG ──
function wrapText(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

// ── Escape XML special chars ──
function escXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Generate OG image (1200×630) ──
function generateOgSvg({ title, section, format, socialStat, socialStatLabel }) {
  const W = 1200, H = 630;
  const pad = 70;
  const ruleY = 86;

  // Wrap title
  const titleLines = wrapText(title, 32);
  const titleLineHeight = 62;
  const titleStartY = 175;
  const maxTitleLines = 4;

  // Truncate if too many lines
  const displayLines = titleLines.slice(0, maxTitleLines);

  // Section/format label
  const sectionLabel = `${section} / ${format}`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  // Background
  svg += `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
  // Top rule
  svg += `<line x1="${pad}" y1="${ruleY}" x2="${W - pad}" y2="${ruleY}" stroke="${INK}" stroke-width="2"/>`;
  // SECOND / PASS wordmark
  svg += `<text x="${pad}" y="62" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" fill="${INK}">SECOND</text>`;
  svg += `<text x="${pad + 132}" y="62" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="400" fill="${BLUE}">/</text>`;
  svg += `<text x="${pad + 148}" y="62" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" fill="${INK}">PASS</text>`;

  // Section label
  svg += `<text x="${W - pad}" y="62" font-family="Courier New,monospace" font-size="13" fill="${GRAPHITE}" text-anchor="end">${escXml(sectionLabel)}</text>`;

  // Title
  for (let i = 0; i < displayLines.length; i++) {
    const y = titleStartY + i * titleLineHeight;
    svg += `<text x="${pad}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="54" font-weight="700" fill="${INK}" letter-spacing="-2">${escXml(displayLines[i])}</text>`;
  }

  // Social stat (key number) if present
  let contentEndY = titleStartY + displayLines.length * titleLineHeight + 10;
  if (socialStat && socialStatLabel) {
    const statY = contentEndY + 20;
    svg += `<text x="${pad}" y="${statY}" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="700" fill="${BLUE}" letter-spacing="-3">${escXml(socialStat)}</text>`;
    const labelLines = wrapText(socialStatLabel.toUpperCase(), 24);
    for (let i = 0; i < labelLines.length; i++) {
      svg += `<text x="${pad}" y="${statY + 30 + i * 18}" font-family="Courier New,monospace" font-size="14" fill="${GRAPHITE}" letter-spacing="1">${escXml(labelLines[i])}</text>`;
    }
    contentEndY = statY + 30 + labelLines.length * 18 + 10;
  }

  // Bottom area: sources label + URL
  const bottomRuleY = H - 110;
  svg += `<line x1="${pad}" y1="${bottomRuleY}" x2="${W - pad}" y2="${bottomRuleY}" stroke="${RULE}" stroke-width="1.5"/>`;
  svg += `<text x="${pad}" y="${bottomRuleY + 24}" font-family="Courier New,monospace" font-size="13" fill="${GRAPHITE}" letter-spacing="1">PRIMARY SOURCES / ORIGINAL CALCULATIONS</text>`;
  svg += `<text x="${pad}" y="${bottomRuleY + 48}" font-family="Courier New,monospace" font-size="15" fill="${GRAPHITE}">${SITE_ORIGIN.replace("https://", "")}</text>`;

  svg += `</svg>`;
  return svg;
}

// ── Generate portrait card (1080×1350) ──
function generatePortraitSvg({ title, section, format, socialStat, socialStatLabel }) {
  const W = 1080, H = 1350;
  const pad = 64;
  const ruleY = 80;

  const titleLines = wrapText(title, 26);
  const titleLineHeight = 68;
  const titleStartY = 200;
  const displayLines = titleLines.slice(0, 5);

  const sectionLabel = `${section} / ${format}`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
  svg += `<line x1="${pad}" y1="${ruleY}" x2="${W - pad}" y2="${ruleY}" stroke="${INK}" stroke-width="2"/>`;

  // Wordmark
  svg += `<text x="${pad}" y="58" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="${INK}">SECOND</text>`;
  svg += `<text x="${pad + 120}" y="58" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="400" fill="${BLUE}">/</text>`;
  svg += `<text x="${pad + 134}" y="58" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="${INK}">PASS</text>`;
  svg += `<text x="${W - pad}" y="58" font-family="Courier New,monospace" font-size="12" fill="${GRAPHITE}" text-anchor="end">${escXml(sectionLabel)}</text>`;

  // Large slash decorative
  svg += `<text x="${W - 140}" y="520" font-family="Arial,Helvetica,sans-serif" font-size="380" font-weight="200" fill="${BLUE}" opacity="0.12">/</text>`;

  // Title
  for (let i = 0; i < displayLines.length; i++) {
    const y = titleStartY + i * titleLineHeight;
    svg += `<text x="${pad}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="58" font-weight="700" fill="${INK}" letter-spacing="-2">${escXml(displayLines[i])}</text>`;
  }

  let contentEndY = titleStartY + displayLines.length * titleLineHeight + 20;
  if (socialStat && socialStatLabel) {
    const statY = contentEndY + 30;
    svg += `<text x="${pad}" y="${statY}" font-family="Arial,Helvetica,sans-serif" font-size="80" font-weight="700" fill="${BLUE}" letter-spacing="-3">${escXml(socialStat)}</text>`;
    const labelLines = wrapText(socialStatLabel.toUpperCase(), 22);
    for (let i = 0; i < labelLines.length; i++) {
      svg += `<text x="${pad}" y="${statY + 34 + i * 18}" font-family="Courier New,monospace" font-size="14" fill="${GRAPHITE}" letter-spacing="1">${escXml(labelLines[i])}</text>`;
    }
    contentEndY = statY + 34 + labelLines.length * 18 + 20;
  }

  // Bottom
  const bottomRuleY = H - 120;
  svg += `<line x1="${pad}" y1="${bottomRuleY}" x2="${W - pad}" y2="${bottomRuleY}" stroke="${RULE}" stroke-width="1.5"/>`;
  svg += `<text x="${pad}" y="${bottomRuleY + 26}" font-family="Courier New,monospace" font-size="13" fill="${GRAPHITE}" letter-spacing="1">PRIMARY SOURCES / ORIGINAL CALCULATIONS</text>`;
  svg += `<text x="${pad}" y="${bottomRuleY + 50}" font-family="Courier New,monospace" font-size="16" fill="${GRAPHITE}">${SITE_ORIGIN.replace("https://", "")}</text>`;

  svg += `</svg>`;
  return svg;
}

// ── Generate square card (1080×1080) ──
function generateSquareSvg({ title, section, format, socialStat, socialStatLabel }) {
  const W = 1080, H = 1080;
  const pad = 64;
  const ruleY = 80;

  const titleLines = wrapText(title, 26);
  const titleLineHeight = 64;
  const titleStartY = 190;
  const displayLines = titleLines.slice(0, 4);

  const sectionLabel = `${section} / ${format}`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
  svg += `<line x1="${pad}" y1="${ruleY}" x2="${W - pad}" y2="${ruleY}" stroke="${INK}" stroke-width="2"/>`;

  // Wordmark
  svg += `<text x="${pad}" y="58" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="${INK}">SECOND</text>`;
  svg += `<text x="${pad + 120}" y="58" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="400" fill="${BLUE}">/</text>`;
  svg += `<text x="${pad + 134}" y="58" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="${INK}">PASS</text>`;
  svg += `<text x="${W - pad}" y="58" font-family="Courier New,monospace" font-size="12" fill="${GRAPHITE}" text-anchor="end">${escXml(sectionLabel)}</text>`;

  // Large slash decorative
  svg += `<text x="${W - 120}" y="420" font-family="Arial,Helvetica,sans-serif" font-size="320" font-weight="200" fill="${BLUE}" opacity="0.1">/</text>`;

  // Title
  for (let i = 0; i < displayLines.length; i++) {
    const y = titleStartY + i * titleLineHeight;
    svg += `<text x="${pad}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="56" font-weight="700" fill="${INK}" letter-spacing="-2">${escXml(displayLines[i])}</text>`;
  }

  let contentEndY = titleStartY + displayLines.length * titleLineHeight + 20;
  if (socialStat && socialStatLabel) {
    const statY = contentEndY + 20;
    svg += `<text x="${pad}" y="${statY}" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="700" fill="${BLUE}" letter-spacing="-3">${escXml(socialStat)}</text>`;
    const labelLines = wrapText(socialStatLabel.toUpperCase(), 22);
    for (let i = 0; i < labelLines.length; i++) {
      svg += `<text x="${pad}" y="${statY + 30 + i * 18}" font-family="Courier New,monospace" font-size="14" fill="${GRAPHITE}" letter-spacing="1">${escXml(labelLines[i])}</text>`;
    }
    contentEndY = statY + 30 + labelLines.length * 18 + 20;
  }

  // Bottom
  const bottomRuleY = H - 110;
  svg += `<line x1="${pad}" y1="${bottomRuleY}" x2="${W - pad}" y2="${bottomRuleY}" stroke="${RULE}" stroke-width="1.5"/>`;
  svg += `<text x="${pad}" y="${bottomRuleY + 24}" font-family="Courier New,monospace" font-size="13" fill="${GRAPHITE}" letter-spacing="1">PRIMARY SOURCES / ORIGINAL CALCULATIONS</text>`;
  svg += `<text x="${pad}" y="${bottomRuleY + 48}" font-family="Courier New,monospace" font-size="16" fill="${GRAPHITE}">${SITE_ORIGIN.replace("https://", "")}</text>`;

  svg += `</svg>`;
  return svg;
}

// ── Render SVG to PNG via sharp ──
async function renderPng(svgStr, width, height) {
  return await sharp(Buffer.from(svgStr))
    .resize(width, height)
    .png()
    .toBuffer();
}

// ── Generate all three assets for one article ──
async function generateForSlug(slug) {
  const data = getArticleData(slug);
  if (!data) {
    console.error(`FAIL: Article not found for slug "${slug}"`);
    return false;
  }

  const title = data.title || slug;
  const section = data.section || "AI";
  const format = data.format || "DEEP";
  const socialStat = data.socialStat || null;
  const socialStatLabel = data.socialStatLabel || null;

  const outDir = path.join(ROOT, "public", "social", slug);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating social assets for: ${title}`);

  // OG 1200×630
  const ogSvg = generateOgSvg({ title, section, format, socialStat, socialStatLabel });
  const ogPng = await renderPng(ogSvg, 1200, 630);
  fs.writeFileSync(path.join(outDir, "og.png"), ogPng);
  console.log(`  ✓ public/social/${slug}/og.png (1200×630)`);

  // Portrait 1080×1350
  const portraitSvg = generatePortraitSvg({ title, section, format, socialStat, socialStatLabel });
  const portraitPng = await renderPng(portraitSvg, 1080, 1350);
  fs.writeFileSync(path.join(outDir, "portrait.png"), portraitPng);
  console.log(`  ✓ public/social/${slug}/portrait.png (1080×1350)`);

  // Square 1080×1080
  const squareSvg = generateSquareSvg({ title, section, format, socialStat, socialStatLabel });
  const squarePng = await renderPng(squareSvg, 1080, 1080);
  fs.writeFileSync(path.join(outDir, "square.png"), squarePng);
  console.log(`  ✓ public/social/${slug}/square.png (1080×1080)`);

  return true;
}

// ── CLI ──
const args = process.argv.slice(2);
const allMode = args.includes("--all") || process.env.SOCIAL_GENERATE_ALL === "1";

if (allMode) {
  const slugs = getAllPublishedSlugs();
  console.log(`Generating social assets for ${slugs.length} published article(s)...`);
  let ok = true;
  for (const slug of slugs) {
    const result = await generateForSlug(slug);
    if (!result) ok = false;
  }
  console.log(ok ? "\nPASS: All social assets generated." : "\nFAIL: Some assets failed.");
  process.exit(ok ? 0 : 1);
} else {
  const slug = args.find((a, i) => args[i - 1] === "--") || args[0];
  if (!slug) {
    console.error("Usage: bun run social:generate -- <slug>");
    console.error("       bun run social:generate:all");
    process.exit(1);
  }
  const result = await generateForSlug(slug);
  process.exit(result ? 0 : 1);
}
