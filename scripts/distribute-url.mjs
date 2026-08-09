#!/usr/bin/env node
/**
 * distribute:url — Generate tracked distribution URLs for articles.
 *
 * Usage: bun run distribute:url -- <slug> <channel>
 *
 * Channels: hackernews, reddit, linkedin, x, brief, direct
 */

const CHANNEL_MAP = {
  hackernews: { utm_source: "hackernews", utm_medium: "community" },
  reddit:      { utm_source: "reddit",      utm_medium: "community" },
  linkedin:    { utm_source: "linkedin",    utm_medium: "social" },
  x:           { utm_source: "x",           utm_medium: "social" },
  brief:       { utm_source: "brief",       utm_medium: "email" },
  direct:      { utm_source: "direct",      utm_medium: "outreach" }
};

const args = process.argv.slice(2);
const slug = args.find((a, i) => args[i - 1] === "--") || args[0];
const channel = args[1];

if (!slug || !channel) {
  console.error("Usage: bun run distribute:url -- <slug> <channel>");
  console.error(`Channels: ${Object.keys(CHANNEL_MAP).join(", ")}`);
  process.exit(1);
}

const mapping = CHANNEL_MAP[channel];
if (!mapping) {
  console.error(`Unknown channel: "${channel}"`);
  console.error(`Available: ${Object.keys(CHANNEL_MAP).join(", ")}`);
  process.exit(1);
}

const origin = process.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";
const base = `${origin}/articles/${slug}`;
const params = new URLSearchParams({
  utm_source: mapping.utm_source,
  utm_medium: mapping.utm_medium,
  utm_campaign: slug
});

console.log(`${base}?${params.toString()}`);
