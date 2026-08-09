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
| Typography | Bricolage Grotesque + Newsreader | Self-hosted via Fontsource, SIL OFL |
| Styling | Custom CSS | No Tailwind, no component library |
| Newsletter | Beehiiv Launch | Subscriber system management and delivery |
| Leads | Resend | Transactional email for lead notifications |
| RSS | @astrojs/rss | Standard feed, excludes demo content |
| Sitemap | @astrojs/sitemap | Normal + news sitemap |
| Runtime JS | Tiny vanilla only | No React, no animation library |
| Deployment | Vercel (Astro adapter) | Static + serverless functions, security headers |
| Package manager | Bun | Fast install, consistent scripts |
| Node | 24.x | Pinned major, aligned with Vercel |

## Requirements

- Bun ≥ 1.2
- Node 24.x (see `.nvmrc`)
- Vercel CLI (for deployment inspection)

## Environment variables

See `.env.example` for the complete list.

| Variable | Purpose | Default |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Canonical production origin | `https://second-pass.vercel.app` |
| `BEEHIIV_API_KEY` | Beehiiv subscription API key | (server-only) |
| `BEEHIIV_PUBLICATION_ID` | Beehiiv publication ID | (server-only) |
| `RESEND_API_KEY` | Resend transactional email key | (server-only) |
| `LEADS_TO_EMAIL` | Lead notification destination | (server-only) |
| `LEADS_FROM_EMAIL` | Lead notification sender | (server-only) |
| `PUBLIC_BRIEF_ENABLED` | Enable BRIEF subscription form | `false` |
| `PUBLIC_COMMERCIAL_FORMS_ENABLED` | Enable partner/intelligence forms | `false` |
| `PUBLIC_ANALYTICS_ENABLED` | Enable Vercel Web Analytics | `false` |

## Commands

```bash
bun install                    # Install dependencies
bun run dev                    # Start dev server (port 3000)
bun run content:audit          # Validate content integrity
bun run check                  # Astro type checking
bun run build                  # Production build + Pagefind index
bun run verify                 # Check + build
bun run article:new -- slug    # Scaffold a new article
bun run article:verify -- slug # Verify article quality
bun run prepublish -- slug     # Full prepublish pipeline
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
| `/partner` | Partnership inquiries |
| `/intelligence` | Intelligence service inquiries |
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
| `/robots.txt` | Robots directives |

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

## Data foundation

Typed, source-backed data schemas in `src/data/`:
- `schema/` — Provenance, PricingEntry, BenchmarkEntry, AcceleratorEntry, CloudProvider
- `pricing/` — Demo pricing fixtures
- `benchmarks/` — Demo benchmark fixtures
- `accelerators/` — Demo accelerator fixtures
- `providers/` — Demo cloud provider fixtures

All fixtures are explicitly marked DEMO/TEST. No invented current values.

## Newsroom / web separation

Real research happens in the separate private `publication-newsroom` repository. Only human-approved content enters this repository. The public repo never requires the private newsroom at runtime.

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

Target: under 10 minutes from approval to deployment.

## Security

- Method/content-type/body-size validation on all mutation endpoints
- Field max lengths enforced
- Honeypot fields on all forms
- Same-origin discipline (Origin/Referer check)
- Upstream timeout (8s) for Beehiiv and Resend
- Sanitized errors — never expose provider response internals
- Request IDs on all API responses
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
- No secrets committed or exposed client-side

## Intentionally absent

CMS, database, auth, accounts, real ad network, comments, React, CSP (deliberately not added without testing), in-memory rate limiting (not production-grade on serverless).

## Pre-launch state

The deployment is protected/noindex. Demo stories are visibly marked and excluded from RSS/news sitemap. No real news is published. The public product is frozen before content pipeline starts.

## Verification

```bash
bun install
bun run content:audit   # 0 failures (expected demo warnings)
bun run check           # 0 errors
bun run build           # 24+ pages, Pagefind indexed
```

## Documentation

- `AGENT.md` — operating philosophy and constraints
- `CURRENT_STATE.md` — honest current state
- `DECISIONS.md` — durable architectural decisions
- `docs/OPERATIONS.md` — deployment, provider hookup, domain migration, rollback
- `docs/` — architecture, content model, design system, brand, UX, mobile, ad system, SEO, performance, publishing speed, newsroom handoff, open-source stack, acceptance standard, FT inspiration, interactions, monetization, launch checklist

## License

Private repository. All rights reserved during pre-launch foundation work.
