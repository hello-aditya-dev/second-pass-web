# Current State

**Brand:** SECOND / PASS
**Phase:** LIVE PUBLICATION
**Architecture:** Astro 7 hybrid — static read path, Vercel Functions for writes only
**Date:** 2026-08-10
**Launch date:** 2026-08-10

## Publication state

- Site state: LIVE / PUBLIC
- robots: public
- noindex: off (requires SITE_PRELAUNCH=false)
- Canonical: `https://second-pass.vercel.app`

## Providers

- **Beehiiv**: CONFIGURED — /BRIEF form is live
- **Resend**: CONFIGURED — /partner and /intelligence forms are live
- **Vercel**: Hosting and serverless functions

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

## Article metadata

- `og:site_name`, `og:image` (article-specific), `og:image:alt`, `og:image:width/height`
- `article:published_time`, `article:modified_time`, `article:section`, `article:tag`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Person JSON-LD author, Organization JSON-LD publisher with logo

## Technical components

- `CalculationBlock`, `ClaimCheck`, `Metric`, `AssumptionList`, `SensitivityTable`
- Accessible, static-first, printable, mobile-safe, visually restrained

## Privacy and legal

- **Privacy**: Production notice active (effective 2026-08-10)
- **Terms**: Active (effective 2026-08-10)
- **Newsletter consent**: Present in BriefForm and /brief page
- **Partner form privacy note**: Present
- **Intelligence form privacy note**: Present
- **Cookie banner**: NOT REQUIRED — no non-essential cookies/storage/access technologies
- **Analytics**: Vercel Web Analytics behind feature toggle (PUBLIC_ANALYTICS_ENABLED), currently off by default
- **Verified privacy contact**: MISSING — LEGAL CONTACT BLOCKER

## Legal/formality routes

- /privacy — Production privacy notice
- /terms — Terms of use
- /about — Publication about
- /editorial-policy — Editorial standards
- /corrections — Corrections policy

## Cookie and storage audit

- Cookies: None set by the application
- localStorage: Not used
- sessionStorage: Not used
- IndexedDB: Not used
- Service workers: None
- Tracking pixels: None
- Ad scripts: None
- Session replay: None
- Fingerprinting: None
- CAPTCHA: None
- Non-essential third-party scripts: None
- **Cookie banner required: NO** — zero non-essential storage/access technologies

## Published articles

- `a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem` — COMPUTE / SECOND PASS — 2026-08-10 — FEATURED
  - 5 charts (SVG+PNG+CSV), XLSX workbook, 7 research CSVs
  - 6 sources, 5 FIRST PASS bullets, 2 CLAIM CHECKs
  - Full math (KaTeX), house editorial objects (/ QUESTION, / ASSUMPTION, / CALCULATION, / CLAIM CHECK, / INTELLIGENCE)
- `when-flops-stop-mattering-hbm-roofline-llm-inference` — COMPUTE / PROOF — 2026-08-10 — FEATURED
  - 5 charts (SVG+PNG+CSV), XLSX workbook, 7 research CSVs + 1 input template CSV
  - 6 sources, 5 FIRST PASS bullets, 2 CLAIM CHECKs, 1 CALCULATION
  - Full math (KaTeX, 37 display blocks, 74 $$ delimiters), house editorial objects (/ QUESTION, / CALCULATION, / CLAIM CHECK, / INTELLIGENCE)

## Research SVG audit

- All 24 research SVGs pass structural audit (valid XML, valid viewBox, nonzero dimensions, no duplicate IDs, no control characters)
- GB300 thermal chart text padding fixed (increased left padding to ~22pt)

## Data products

- **Published DATA**: AI Inference Price Surface, AI Rack Facility Capacity, HBM Roofline Inference
- **In development**: Model Pricing Index, Accelerator Index, Benchmark Registry

## Activation inputs still pending

1. Domain: secondpass.net → set `PUBLIC_SITE_URL=https://secondpass.net`
2. Vercel Pro: upgrade before commercial launch
3. Verified privacy contact — LEGAL CONTACT BLOCKER
4. Author social profiles (optional: add sameAs URLs when available)
