# SECOND / PASS

**The first pass tells you what happened. The second pass tells you what it means.**

SECOND / PASS is a technical intelligence publication covering AI systems, compute, semiconductors, systems infrastructure, security, research, and source-backed technical data.

## Product philosophy

Every article starts with **FIRST PASS** — the verified facts that can be stated with confidence. Then **/ SECOND PASS** — what the mechanism, evidence, and consequence actually are beneath the first headline.

The publication does not:
- rewrite press releases;
- declare winners without preserving constraints;
- cite: a score without preserving test conditions;
- separate a number from its assumptions.

## Why Astro

Astro is a content-first, static-first framework. HTML is the default output. Zero client JavaScript ships unless an explicit island requires it. This matches a reading product: the page should load fast, stay fast, and not ship a client framework to render markdown.

Astro Content Collections with Zod validation give typed, build-time content safety without a CMS.

## Stack

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Astro 7 | Static-first, zero-JS default, content collections |
| Content | Typed MDX + Zod | Build-time validation, no CMS at launch |
| Search | Pagefind | Static, no server, no paid service |
| Social Images | sharp | Build-time SVG→PNG, no runtime, no external API |
| Typography | Bricolage Grotesque + Newsreader | Self-hosted via Fontsource, SIL OFL |
| Styling | Custom CSS | No Tailwind, no component library |
| Newsletter | Beehiiv | Subscriber system management and delivery |
| Leads | Resend | Transactional email for lead notifications |
| RSS | @astrojs/rss | Standard feed, excludes demo content |
| Sitemap | @astrojs/sitemap | Normal + news sitemap |
| Runtime JS | Tiny vanilla only | No React, no animation library |
| Deployment | Vercel (Astro adapter) | Static + serverless functions, security headers |
| Package manager | Bun | Fast install, consistent scripts |
| Node | 24.x | Pinned major, aligned with Vercel |

## Requirements

- Bun ≥ 1.2
- Node 24.x
- Vercel CLI (for deployment inspection)

## Environment variables

See `.env.example` for the complete list.

| Variable | Purpose | Default |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Canonical production origin | `https://second-pass.vercel.app` |
| `SITE_PRELAUNCH` | Fail-safe prelaunch mode (missing→prelaunch, true→prelaunch, false→public) | (missing = prelaunch) |
| `BEEHIIV_API_KEY` | Beehiiv subscription API key | (server-only) |
| `BEEHIIV_PUBLICATION_ID` | Beehiiv publication ID | (server-only) |
| `BEEHIIV_NEWSLETTER_LIST_ID` | Beehiiv newsletter list ID | (server-only) |
| `RESEND_API_KEY` | Resend transactional email key | (server-only) |
| `LEADS_TO_EMAIL` | Lead notification destination | (server-only) |
| `LEADS_FROM_EMAIL` | Lead notification sender | (server-only) |
| `PUBLIC_BRIEF_ENABLED` | Enable BRIEF subscription form | `false` |
| `PUBLIC_COMMERCIAL_FORMS_ENABLED` | Enable partner/intelligence forms | `false` |
| `PUBLIC_ANALYTICS_ENABLED` | Enable Vercel Web Analytics | `false` |

## Prelaunch mode

When `SITE_PRELAUNCH` is missing or `true` (default — fail-safe):

- All pages emit `<meta name="robots" content="noindex,nofollow">`
- `robots.txt` serves `Disallow: /`
- Vercel Web Analytics is disabled
- Homepage remains accessible for QA

When `SITE_PRELAUNCH=false`:

- Normal public SEO/indexing behavior resumes
- `robots.txt` serves `Allow: /`
- Analytics follows `PUBLIC_ANALYTICS_ENABLED`

This is implemented centrally — no per-page edits required.

## Commands

```bash
bun install                       # Install dependencies
bun run dev                       # Start dev server (port 3000)
bun run content:audit             # Validate content integrity
bun run check                     # Astro type checking
bun run build                     # Production build + Pagefind index
bun run verify                    # Check + build
bun run article:new -- slug       # Scaffold a new article
bun run article:verify -- slug    # Verify article quality
bun run social:generate -- slug   # Generate social assets for one article
bun run social:generate:all       # Generate social assets for all articles
bun run favicons:generate         # Generate PNG favicon fallbacks
bun run distribute:url -- slug ch # Generate tracked distribution URL
bun run launch:verify             # Full launch safety gate
bun run prepublish -- slug        # Full prepublish pipeline
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage: lead story, NOW rail, analysis grid, DATA band, PROOF, newsletter CTA |
| `/now` | NOW-format stories — fast, sourced |
| `/latest` | All stories, newest first |
| `/ai` | AI section |
| `/compute` | Compute / semiconductor section |
| `/systems` | Systems infrastructure section |
| `/security` | Security section |
| `/research` | Research / methodology section |
| `/data` | Reference data products |
| `/search` | Pagefind static search |
| `/brief` | / BRIEF newsletter signup |
| `/partner` | Partnership inquiries (launch-stage) |
| `/intelligence` | Intelligence service inquiries (RAPID / RESEARCH SPRINT) |
| `/authors/aditya` | Founder & Editor author page |
| `/about` | Publication identity |
| `/editorial-policy` | Editorial standards |
| `/corrections` | Corrections process |
| `/privacy` | Privacy policy |
| `/articles/[slug]` | Individual article pages |
| `/api/brief-subscribe` | BRIEF subscription endpoint (POST) |
| `/api/partner-lead` | Partner inquiry endpoint (POST) |
| `/api/intelligence-lead` | Intelligence inquiry endpoint (POST) |
| `/api/health` | Health check endpoint (GET) |
| `/rss.xml` | RSS feed (excludes demo) |
| `/news-sitemap.xml` | Google News sitemap (excludes demo, recent only) |
| `/sitemap-index.xml` | Standard sitemap |
| `/robots.txt` | Robots directives (respects SITE_PRELAUNCH) |

## Content model

Articles are typed MDX files in `src/content/articles/`. Schema validation enforces:

- `title` (≥ 8 chars), `dek` (≥ 20 chars), `slug` (kebab-case)
- `section` enum: AI, Compute, Systems, Security, Research, Data
- `format` enum: NOW, SECOND PASS, DEEP, PROOF, DATA
- `firstPass`: 2–5 verified points
- `sources`: typed with label, URL, type (primary/secondary/dataset/paper/filing/advisory/other), optional note
- `changeLog`: typed entries with date, type, note
- `adPolicy`: none / light / standard
- `demo` flag for pre-launch content
- `socialStat` / `socialStatLabel` (optional) — key number for social image emphasis

## Technical components

Available for use in articles:

- `CalculationBlock` — structured calculation display with result and sensitivity
- `ClaimCheck` — vendor claim vs independent result comparison
- `Metric` — single key metric display
- `AssumptionList` — explicit assumption listing
- `SensitivityTable` — sensitivity analysis table with horizontal scroll

All are accessible, static-first, printable, mobile-safe, visually restrained.

## Social assets

Generated at build time in `public/social/<slug>/`:

- `og.png` — 1200×630 (LinkedIn, X, Reddit, Slack previews)
- `portrait.png` — 1080×1350 (Instagram, Threads)
- `square.png` — 1080×1080 (general social cards)

Visual language: warm paper background, black typography, Signal Blue slash, controlled whitespace. No AI art, no gradients, no shadows.

## Favicon system

- SVG favicon (preferred modern): `/mark.svg`
- PNG fallbacks: 16×16, 32×32, 180×180 (apple-touch-icon), 192×192, 512×512
- manifest.webmanifest with both SVG and PNG entries

## Data foundation

Typed, source-backed data schemas in `src/data/`:
- `schema/` — Provenance, PricingEntry, BenchmarkEntry, AcceleratorEntry, CloudProvider
- `pricing/` — Demo pricing fixtures
- `benchmarks/` — Demo benchmark fixtures
- `accelerators/` — Demo accelerator fixtures
- `providers/` — Demo cloud provider fixtures

All fixtures are explicitly marked DEMO/TEST. No invented current values.

## Article publication handoff

1. Newsroom approves article
2. `bun run article:new -- story-slug`
3. Fill generated MDX from approved newsroom output
4. Add public-safe media to `public/media/story-slug/`
5. `bun run article:verify -- story-slug`
6. `bun run prepublish -- story-slug`
7. Human approves
8. Commit `publish: story-slug`
9. Push — deployment starts
10. Generate distribution URLs: `bun run distribute:url -- story-slug <channel>`

Target: under 10 minutes from approval to deployment.

## Security

- Method/content-type/body-size validation on all mutation endpoints
- Field max lengths enforced
- Honeypot fields on all forms
- Same-origin discipline (Origin/Referer check) — malformed Referer cannot throw
- Upstream timeout (8s) for Beehiiv and Resend
- Sanitized errors — never expose provider response internals
- Request IDs via `crypto.randomUUID()` on all API responses
- `Cache-Control: no-store` on all API responses
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
- No secrets committed or exposed client-side

## Intentionally absent

CMS, database, auth, accounts, real ad network, comments, React, CSP (deliberately not added without testing), in-memory rate limiting (not production-grade on serverless).

## Pre-launch state

The deployment is protected/noindex via `SITE_PRELAUNCH=true`. Beehiiv/Resend are configured. Demo stories visibly marked and excluded from RSS/news sitemap. Canonical remains `https://second-pass.vercel.app` until domain day.

## Verification

```bash
bun install
bun run content:audit   # 0 failures (expected demo warnings)
bun run check           # 0 errors
bun run build           # 28+ pages, Pagefind indexed in Vercel output
```

## Documentation

- `AGENT.md` — operating philosophy and constraints
- `CURRENT_STATE.md` — honest current state
- `DECISIONS.md` — durable architectural decisions
- `docs/OPERATIONS.md` — deployment, provider hookup, domain migration, rollback
- `docs/DISTRIBUTION_WORKFLOW.md` — publishing and distribution pipeline
- `docs/` — architecture, content model, design system, brand, UX, mobile, ad system, SEO, performance, publishing speed, newsroom handoff, open-source stack, acceptance standard, FT inspiration, interactions, monetization, launch checklist

## License

Private repository. All rights reserved during pre-launch foundation work.
