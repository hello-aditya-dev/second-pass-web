# Current State

**Brand:** SECOND / PASS
**Phase:** Revenue-readiness patch applied
**Architecture:** Astro 7 hybrid — static read path, Vercel Functions for writes only
**Date:** 2026-08-10

## Included

- SECOND / PASS identity with slash as structural language
- Bricolage Grotesque Variable + Newsreader Variable typography (Fontsource)
- Custom CSS design system with editorial temperature differentiation
  - signal blue #2F5BFF, paper #F2EFE7, ink #11110F
  - Section-specific visual treatment (NOW blue border, PROOF italic serif)
  - Enhanced FIRST PASS with blue ghost gradient background
  - Improved article typography: overflow-wrap, hyphenation, better rhythm
- Responsive editorial layouts (desktop 1440, tablet 1024/820/768, mobile 430/390/375)
- Typed MDX content collections with Zod schema validation
- Article anatomy: FIRST PASS, / SECOND PASS, evidence panel, sources, change log, / END
- AdBreak component with house-unit fallback architecture and commercial slot model
- Reading progress indicator on articles
- Pagefind static search — indexes Vercel static output, placed in `.vercel/output/static/pagefind/`
- RSS feed (excludes demo content)
- News sitemap (excludes demo, recent-only)
- Astro sitemap and robots.txt
- JSON-LD Article/NewsArticle structured data
- Open Graph and Twitter Card metadata
- Web manifest for PWA support
- Skip-to-content link, semantic landmarks, visible focus, reduced-motion support
- Content audit script and article scaffolding script
- Publishing speed pipeline documented (target: <10 min after approval)
- Correct canonical origin: `https://second-pass.vercel.app` (overridable via `PUBLIC_SITE_URL`)
- Security headers via committed `vercel.json`
- Node pinned to `24.x` with `.nvmrc`
- Bun package manager with `packageManager` field in `package.json`
- Torture-test fixture article for layout edge cases
- Foundation archive preserved at archive/second-pass-web-foundation.zip
- GitHub repository: witejackel-eng/second-pass-web (private)

### Prelaunch mode (SITE_PRELAUNCH)
- When `SITE_PRELAUNCH=true`: all pages emit `noindex,nofollow`; `robots.txt` serves `Disallow: /`; analytics disabled
- When `SITE_PRELAUNCH=false`: normal public SEO/indexing behavior resumes
- Homepage remains accessible for QA during prelaunch
- Implemented centrally in BaseLayout + robots.txt.ts — no per-page edits needed

### Backend / BRIEF
- POST `/api/brief-subscribe` — Beehiiv subscriber creation with validation, honeypot, same-origin
- Beehiiv API uses `newsletter_list_ids: [id]` (not `newsletter_id`)
- Beehiiv API uses `utm_content` for placement (not `referrer`)
- Beehiiv `reactivate_existing: false`, `double_opt_override: "not_set"`
- Reusable BriefForm component on `/brief`, homepage CTA, article bottom
- BriefForm captures UTM params from URL (utm_source, utm_medium, utm_campaign) and external referrer as `referring_site`
- BriefForm sends placement as `utm_content` (e.g. "homepage-cta", "article-bottom", "brief-page")
- Generic success message: "You're on the list. If you were already subscribed, nothing has changed."
- `PUBLIC_BRIEF_ENABLED` feature toggle (false until credentials connected)
- Server-only credentials (no PUBLIC_BEEHIIV_API_KEY)

### Backend / Commercial
- POST `/api/partner-lead` — Partner inquiry with Resend notification
- POST `/api/intelligence-lead` — Intelligence inquiry with Resend notification
- `/partner` — Launch-stage framing: founding partnerships / launch pilots, not mature-media CPM inventory
  - Budget ranges: Under $1,500 / $1,500–$3,000 / $3,000–$7,500 / $7,500+ / Not sure yet
  - Budget and timing are optional
  - No header/masthead sponsorship promises — masthead is editorial zone
  - Language: "built for engineers, technical leaders and people making infrastructure decisions"
  - Professional transparency statement, not defensive language
- `/intelligence` — RAPID / RESEARCH SPRINT offer at top
  - Budget ranges: $1,500–$3,000 / $3,000–$7,500 / $7,500–$15,000 / $15,000+ / Discuss scope
  - Deadline and budget are optional
- Provider-neutral LeadNotifier interface with Resend implementation
- `PUBLIC_COMMERCIAL_FORMS_ENABLED` feature toggle
- No fake metrics, logos, clients, or rate claims
- No file uploads in forms

### Backend / Health
- GET `/api/health` — Returns `{status, brief, leads}` without secrets, `Cache-Control: no-store`

### Security
- Method/content-type/body-size validation on all mutation endpoints
- Field max lengths enforced
- Honeypot fields on all forms
- Same-origin discipline (Origin/Referer check) — malformed Referer cannot throw
- Upstream timeout (8s) for Beehiiv and Resend
- Sanitized errors — never expose provider response internals
- Request IDs via `crypto.randomUUID()` (with fallback) on all API responses
- `Cache-Control: no-store` on all API responses
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- No secrets committed or exposed client-side

### Analytics
- Vercel Web Analytics behind `PUBLIC_ANALYTICS_ENABLED`
- `document.body.dataset.analytics` (fixed from `documentElement`)
- Analytics disabled during prelaunch (`SITE_PRELAUNCH=true`)
- Safe custom events: brief_signup_submit/success, partner_cta/lead_success, intelligence_cta/lead_success, source_open, data_open, search_use
- Never sends PII

### Data Foundation
- Typed provenance schema with source URL/title/type, observedAt, lastVerifiedAt, conditions
- Pricing schema with provider, product, tier, unit, effectiveDate, provenance
- Benchmark schema with workload, hardware, precision, metric, operator, methodology
- Accelerator schema with architecture-level specifications
- DEMO fixtures explicitly marked (demoProvenance helper)
- No invented current data values

### Publishing Engine
- `bun run article:new -- <slug>` — Scaffold new article
- `bun run article:verify -- <slug>` — Verify article quality checks
- `bun run content:audit` — Audit all content for markers and issues
- `bun run prepublish -- <slug>` — Full prepublish pipeline (verify + audit + check + build + Pagefind + HTML inspection)
- Prepublish inspects Vercel/Astro build output (not stale `dist/articles/...` paths)
- Prepublish verifies Pagefind output exists
- Prepublish does NOT auto-approve or auto-push

### Search (Pagefind)
- Build script (`scripts/build-search.mjs`) indexes against Vercel static output directory
- Pagefind assets placed in `.vercel/output/static/pagefind/` for deployment
- Portable: no shell-specific `cp` commands; uses Node.js `fs` module

## Intentionally absent

- CMS
- database
- auth
- SaaS boilerplate
- real ad network
- real newsletter provider (code ready, awaiting credentials)
- real lead notification (code ready, awaiting credentials)
- accounts/comments
- React or client framework (Astro islands only)
- CSP (deliberately not added without testing)
- in-memory rate limiting (not production-grade on serverless; strict validation + honeypot instead)

## Activation inputs pending

1. Beehiiv: API key, publication ID, optional newsletter list ID
2. Resend: API key, lead destination email, sender email
3. Domain: secondpass.net DNS configuration
4. Vercel: Pro plan upgrade before commercial launch

## Next

Set `SITE_PRELAUNCH=false` when ready for public indexing
Connect Beehiiv credentials → set `PUBLIC_BRIEF_ENABLED=true`
Connect Resend credentials → set `PUBLIC_COMMERCIAL_FORMS_ENABLED=true`
Domain day → set `PUBLIC_SITE_URL=https://secondpass.net`
Commercial launch → upgrade to Vercel Pro, set `PUBLIC_ANALYTICS_ENABLED=true`
Replace demo stories with human-approved newsroom content
