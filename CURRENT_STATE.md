# Current State

**Brand:** SECOND / PASS
**Phase:** Distribution-ready — awaiting real content and public launch
**Architecture:** Astro 7 hybrid — static read path, Vercel Functions for writes only
**Date:** 2026-08-10

## Distribution-ready

All engineering for distribution, authorship, social assets, and commercial activation is complete. The site is verified against the real Vercel deployment. Ready for publishing at high speed.

## Providers

- **Beehiiv**: CONFIGURED — /BRIEF form is live
- **Resend**: CONFIGURED — /partner and /intelligence forms are live

## Author system

- `/authors/aditya` — Person JSON-LD, truthful bio, coverage, methodology
- Article JSON-LD uses `Person` author type with URL to author page
- Publisher is `Organization` with logo
- No invented credentials

## Social asset system

- Build-time generation via `scripts/generate-social-assets.mjs` (sharp)
- OG: 1200×630, Portrait: 1080×1350, Square: 1080×1080
- Typography-first visual language: paper bg, ink type, Signal Blue slash
- Optional `socialStat`/`socialStatLabel` for key-number emphasis
- Generated for all 6 demo articles

## Article metadata

- `og:site_name`, `og:image` (article-specific), `og:image:alt`, `og:image:width/height`
- `article:published_time`, `article:modified_time`, `article:section`, `article:tag`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Person JSON-LD author, Organization JSON-LD publisher with logo

## Favicon system

- SVG favicon (preferred modern) + PNG fallbacks (16, 32, 180, 192, 512)
- Manifest with both SVG and PNG icon entries

## Distribution tools

- `bun run social:generate -- <slug>` — generate social assets for one article
- `bun run social:generate:all` — generate for all published articles
- `bun run distribute:url -- <slug> <channel>` — generate tracked distribution URLs
- `bun run launch:verify` — full launch safety gate
- `bun run prepublish -- <slug>` — complete publishing pipeline

## Technical components

- `CalculationBlock`, `ClaimCheck`, `Metric`, `AssumptionList`, `SensitivityTable`
- Accessible, static-first, printable, mobile-safe, visually restrained

## Prelaunch mode (fail-safe)

`SITE_PRELAUNCH !== "false"` — prelaunch is the default.

- Missing/undefined → PRELAUNCH (noindex, robots Disallow, analytics off)
- `SITE_PRELAUNCH=true` → PRELAUNCH
- `SITE_PRELAUNCH=false` → PUBLIC (normal indexing)

## Verified on real deployment

- Homepage: `<meta name="robots" content="noindex,nofollow">`
- robots.txt: `Disallow: /`
- `/pagefind/pagefind.js`: 200>200
- `/api/health`: 200, `brief: configured`, `leads: configured`, `Cache-Control: no-store`
- Security headers: nosniff, DENY, strict-origin-when-cross-origin, Permissions-Policy
- Analytics: script absent during prelaunch
- Canonical: `https://second-pass.vercel.app`
- `/authors/aditya`: 200 with Person JSON-LD
- OG images: 200 for all demo article social assets
- Favicon PNGs: 200 for all sizes
- Share utility: present in article pages
- Article metadata: og:image, article:published_time, article:section, article:tag all present

## Published articles

- `a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem` — COMPUTE / SECOND PASS — 2026-08-10 — FEATURED
  - 5 charts (SVG+PNG+CSV), XLSX workbook, 7 research CSVs
  - 6 sources, 5 FIRST PASS bullets, 2 CLAIM CHECKs
  - Full math (KaTeX), house editorial objects (/ QUESTION, / ASSUMPTION, / CALCULATION, / CLAIM CHECK, / INTELLIGENCE)

## Activation inputs still pending

1. Domain: secondpass.net → set `PUBLIC_SITE_URL=https://secondpass.net`
2. Vercel Pro: upgrade before commercial launch
3. Public launch: set `SITE_PRELAUNCH=false` (after `launch:verify` passes)
4. Replace demo stories with human-approved newsroom content
5. Author social profiles (optional: add sameAs URLs when available)
