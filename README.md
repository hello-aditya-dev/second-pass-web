# SECOND / PASS

**The first pass tells you what happened. The second pass tells you what it means.**

SECOND / PASS is a technical intelligence publication covering AI systems, compute, semiconductors, systems infrastructure, security, research, and source-backed technical data.

## Product philosophy

Every article starts with **FIRST PASS** — the verified facts that can be stated with confidence. Then **/ SECOND PASS** — what the mechanism, evidence, and consequence actually are beneath the first headline.

The publication does not:
- rewrite press releases;
- declare winners without preserving constraints;
- cite a score without preserving test conditions;
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
| RSS | @astrojs/rss | Standard feed, excludes demo content |
| Sitemap | @astrojs/sitemap | Normal + news sitemap |
| Runtime JS | Tiny vanilla only | No React, no animation library |
| Deployment | Vercel (Astro adapter) | Static output, security headers |
| Package manager | Bun | Fast install, consistent scripts |
| Node | 24.x | Pinned major, aligned with Vercel |

## Requirements

- Bun ≥ 1.2
- Node 24.x (see `.nvmrc`)
- Vercel CLI (for deployment inspection)

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Canonical production origin | `https://second-pass.vercel.app` |

No other environment variables are needed in the launch foundation.

## Commands

```bash
bun install             # Install dependencies
bun run dev             # Start dev server (port 3000)
bun run content:audit   # Validate content integrity
bun run check           # Astro type checking
bun run build           # Production build + Pagefind index
bun run verify          # Check + build
bun run article:new -- story-slug   # Scaffold a new article
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage: lead story, NOW rail, analysis grid, DATA band, PROOF, newsletter CTA |
| `/now` | NOW-format stories — fast, sourced |
| `/ai` | AI section |
| `/compute` | Compute / semiconductor section |
| `/systems` | Systems infrastructure section |
| `/security` | Security section |
| `/research` | Research / methodology section |
| `/data` | Reference data products (planned) |
| `/search` | Pagefind static search |
| `/brief` | / BRIEF newsletter product (provider not yet connected) |
| `/about` | Publication identity |
| `/editorial-policy` | Editorial standards |
| `/corrections` | Corrections process |
| `/privacy` | Privacy policy |
| `/articles/[slug]` | Individual article pages |
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

## Newsroom / web separation

Real research happens in the separate private `publication-newsroom` repository. Only human-approved content enters this repository. The public repo never requires the private newsroom at runtime.

## Article publication handoff

1. Newsroom approves article
2. `bun run article:new -- story-slug`
3. Fill generated MDX from approved newsroom output
4. Add public-safe media to `public/media/story-slug/`
5. `bun run content:audit`
6. `bun run verify`
7. Commit `publish: story-slug`
8. Push — deployment starts

Target: under 10 minutes from approval to deployment.

## Pagefind

Static search indexes at build time. The `/search` page initializes Pagefind client-side after the index is generated. During development, search shows a graceful message that the index is not yet available.

## RSS and sitemaps

- `/rss.xml`: 50 most recent non-demo articles
- `/sitemap-index.xml`: All pages (Astro sitemap integration)
- `/news-sitemap.xml`: Recent non-demo articles (2-day window) with Google News markup
- `/robots.txt`: Allows all crawlers, references both sitemaps

## Typography and design

- **Display**: Bricolage Grotesque Variable — headlines, navigation, section heads
- **Reading**: Newsreader Variable — body text, deks, descriptions
- **Mono**: System monospace — kickers, metadata, labels, source types

Color system:
- Paper `#F2EFE7` — warm background
- Ink `#11110F` — primary text
- Graphite `#5B5952` — secondary text
- Signal blue `#2F5BFF` — links, evidence, the slash, active states (limited, not washing surfaces)

The design is editorial, not SaaS. Rules and typography carry the design. No gradients, no glassmorphism, no rounded card grids.

## Mobile and tablet

The site is responsive at 1440, 1024, 820, 768, 430, 390, and 375px widths. Tablet is not compressed desktop. Mobile is not compressed tablet. Key differences:

- Masthead collapses to wordmark + actions on tablet; primary nav becomes horizontal topic strip
- Article three-column grid (rail / body / evidence) collapses to single reading column
- Tables horizontally scroll rather than shrinking to unreadable text
- NOW rail drops its border and stacks below the lead
- Data grid goes from 3 → 2 → 1 column

## Ad policy

Advertising is subordinate to reading. Explicit `<AdBreak />` components at editorial boundaries.

Hard bans: popup, prestitial, interstitial, sticky bottom, sticky video, autoplay, ad above fold, ad before FIRST PASS, ad inside table/code, fake-native ad.

Density ceilings (not targets): under 700 words → 0 inline; 700–1800 → max 1; 1800+ → max 2.

## Security

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
- Vercel supplies HSTS (no conflicting HSTS config added)
- `poweredByHeader: false` equivalent via static output
- No CSP added without testing (correct smaller policy > broken CSP)

## Intentionally absent

These are deliberate omissions, not gaps:

- CMS (Git-native publishing is faster until multi-editor bottleneck)
- Database / auth / accounts
- Analytics provider
- Ad network integration
- Newsletter provider
- Comments
- React or any client framework (not needed yet)

## Pre-launch state

The deployment is protected/noindex. Demo stories are visibly marked and excluded from RSS/news sitemap. No real news is published. The public product is frozen before content pipeline starts.

## Verification

```bash
bun install
bun run content:audit   # 0 failures (expected demo warnings)
bun run check           # 0 errors
bun run build           # 21+ pages, Pagefind indexed
```

## Documentation

- `AGENT.md` — operating philosophy and constraints
- `CURRENT_STATE.md` — honest current state
- `DECISIONS.md` — durable architectural decisions
- `docs/` — architecture, content model, design system, brand, UX, mobile, ad system, SEO, performance, publishing speed, newsroom handoff, open-source stack, operations, acceptance standard, FT inspiration, interactions, monetization, launch checklist

## License

Private repository. All rights reserved during pre-launch foundation work.
