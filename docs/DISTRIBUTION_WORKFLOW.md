# SECOND / PASS — Distribution Workflow

Operational guide for publishing and distributing articles.

## Pipeline

```
approved article
→ bun run prepublish -- <slug>
→ social images generated automatically
→ bun run build
→ git push origin main (deploys to Vercel)
→ generate channel URLs
→ distribute
```

## Step-by-step

### 1. Article is approved

Human editorial approval. No auto-publish.

### 2. Prepublish

```bash
bun run prepublish -- <slug>
```

This runs:
- `article:verify` — frontmatter, quality checks
- `content:audit` — all articles
- `social:generate` — OG, portrait, square PNGs
- `astro check` — type checking
- `build` — full Astro build
- `pagefind` — search index
- HTML inspection — metadata, JSON-LD, canonical
- OG asset verification
- Metadata verification

Fails if any required element is missing.

### 3. Social images

Generated at `public/social/<slug>/`:
- `og.png` — 1200×630 (LinkedIn, X, Reddit, Slack)
- `portrait.png` — 1080×1350 (Instagram, Threads)
- `square.png` — 1080×1080 (general social)

### 4. Deploy

```bash
git add -A && git commit -m "publish: <slug>"
git push origin main
```

Vercel auto-deploys.

### 5. Distribution URLs

```bash
bun run distribute:url -- <slug> hackernews
bun run distribute:url -- <slug> reddit
bun run distribute:url -- <slug> linkedin
bun run distribute:url -- <slug> x
bun run distribute:url -- <slug> brief
bun run distribute:url -- <slug> direct
```

### 6. Distribution channels

- **Hacker News** — Submit with UTM URL
- **Reddit** — Post to relevant subreddits with UTM URL
- **X** — Post with UTM URL
- **LinkedIn** — Share with UTM URL
- **BRIEF** — Include in next newsletter edition
- **Direct outreach** — Send UTM URL directly

## Launch Safety

```bash
bun run launch:verify
```

Fails if demo content is published, providers unconfigured, or social images missing.

Do NOT set `SITE_PRELAUNCH=false` until launch:verify passes and real content replaces demos.
