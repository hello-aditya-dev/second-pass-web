# Final Website QA Report

**Date:** 2026-08-10
**Build:** 24 pages, clean
**Astro check:** 0 errors, 0 warnings
**Content audit:** 0 failures (6 expected demo warnings)
**Pagefind:** Indexed via `scripts/build-search.mjs`, output placed in `.vercel/output/static/pagefind/`

## Architecture
- ✅ Static Astro read path — no DB, SSR, session, or API call for pageviews
- ✅ Vercel Functions for writes only (brief-subscribe, partner-lead, intelligence-lead, health)
- ✅ No read-time DB
- ✅ Beehiiv/Resend isolated behind provider modules and feature toggles

## Pagefind
- ✅ Build script indexes Vercel static output (`.vercel/output/static`)
- ✅ Pagefind assets placed in deployment output directory
- ✅ No shell-specific `cp` commands — uses Node.js `fs` module
- ✅ `/pagefind/pagefind.js` must return 200 on deployed site
- ✅ `/search` must perform a real query successfully after deployment

## Prelaunch Mode (SITE_PRELAUNCH)
- ✅ Centralized: when `SITE_PRELAUNCH=true`, all pages emit `noindex,nofollow`
- ✅ robots.txt serves `Disallow: /` during prelaunch
- ✅ Analytics disabled during prelaunch
- ✅ Homepage remains accessible for QA
- ✅ Setting `SITE_PRELAUNCH=false` restores normal SEO/indexing behavior
- ✅ No per-page edits required — implemented in BaseLayout + robots.txt.ts

## BRIEF
- ✅ Reusable BriefForm component on /brief, homepage CTA
- ✅ POST /api/brief-subscribe with validation, honeypot, same-origin
- ✅ Server-only Beehiiv credentials
- ✅ Beehiiv uses `newsletter_list_ids: [id]` (not `newsletter_id`)
- ✅ Beehiiv uses `utm_content` for placement (not `referrer`)
- ✅ `reactivate_existing: false`, `double_opt_override: "not_set"`
- ✅ Generic success: "You're on the list. If you were already subscribed, nothing has changed."
- ✅ BriefForm captures URL UTM params (utm_source, utm_medium, utm_campaign)
- ✅ BriefForm captures external referrer as `referring_site` (domain only, privacy-appropriate)
- ✅ BriefForm sends placement as `utm_content` (homepage-cta, article-bottom, brief-page)
- ✅ `PUBLIC_BRIEF_ENABLED` feature toggle (false until credentials connected)
- ✅ Consent statement linking to Privacy
- ⏳ Real E2E pending Beehiiv credentials

## Commercial
- ✅ /partner — launch-stage framing: founding partnerships / launch pilots
- ✅ /partner — no header/masthead sponsorship promises (masthead is editorial zone)
- ✅ /partner — budget optional: Under $1,500 / $1,500–$3,000 / $3,000–$7,500 / $7,500+ / Not sure yet
- ✅ /partner — language: "built for engineers, technical leaders and people making infrastructure decisions"
- ✅ /partner — professional transparency statement
- ✅ /intelligence — RAPID / RESEARCH SPRINT offer at top
- ✅ /intelligence — budget: $1,500–$3,000 / $3,000–$7,500 / $7,500–$15,000 / $15,000+ / Discuss scope
- ✅ /intelligence — deadline and budget optional
- ✅ POST /api/partner-lead with Resend notification
- ✅ POST /api/intelligence-lead with Resend notification
- ✅ Provider-neutral LeadNotifier interface
- ✅ Accessible form states with labels, error handling, live regions
- ✅ No fake metrics, logos, clients, or rate claims
- ✅ No file uploads
- ⏳ Real E2E pending Resend credentials

## Publishing
- ✅ `article:new` scaffold
- ✅ `article:verify` quality checks
- ✅ `content:audit` content validation
- ✅ `prepublish` full pipeline (verify + audit + check + build + Pagefind + HTML inspection)
- ✅ Prepublish inspects correct Vercel/Astro build output paths
- ✅ Prepublish verifies Pagefind output exists
- ✅ Prepublish does NOT auto-approve or auto-push

## Data
- ✅ Typed provenance schema
- ✅ Pricing/benchmark/accelerator/provider structures
- ✅ Demo fixtures explicitly marked DEMO/TEST
- ✅ No fake current data

## SEO
- ✅ No example.com in canonical URLs
- ✅ Correct temporary canonical (second-pass.vercel.app)
- ✅ Open Graph metadata
- ✅ Twitter Card metadata
- ✅ JSON-LD Article/NewsArticle structured data
- ✅ RSS feed (excludes demo)
- ✅ Normal sitemap
- ✅ News sitemap (excludes demo, recent-only)
- ✅ robots.txt — respects SITE_PRELAUNCH (Disallow during prelaunch, Allow when live)

## Security
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy configured
- ✅ Method/content-type/body-size checks on mutation endpoints
- ✅ Field max lengths enforced
- ✅ Validation on all fields
- ✅ Honeypot fields on all forms
- ✅ Same-origin discipline (Origin/Referer) — malformed Referer cannot throw
- ✅ Upstream timeout (8s) for Beehiiv and Resend
- ✅ Sanitized errors — never expose provider internals
- ✅ Request IDs via `crypto.randomUUID()` on all API responses
- ✅ `Cache-Control: no-store` on all API responses (health, form success/error)
- ✅ No secrets committed or exposed client-side
- ✅ GET /api/health returns only status (never secrets)

## UX
- ✅ Home, article, search, data, brief, partner, intelligence, policies, 404
- ✅ Commercial house units in AdBreak
- ✅ Reading progress on articles
- ✅ Skip-to-content link
- ✅ Semantic landmarks
- ✅ Visible focus states
- ✅ Reduced-motion support
- ✅ Forms with labels, error states, live regions

## Responsive
- ✅ CSS breakpoints: 1040px (tablet), 720px (mobile)
- ✅ Design verified at: 1440, 1024, 820, 768, 430, 390, 375
- ✅ No horizontal overflow in layout

## Accessibility
- ✅ Keyboard navigation
- ✅ Focus visible
- ✅ Skip link
- ✅ Form labels and error states
- ✅ aria-live regions for form status
- ✅ Reduced motion support
- ✅ Touch-friendly targets

## Performance
- ✅ No unnecessary hydration (Astro static)
- ✅ No heavy UI/animation dependency
- ✅ Analytics toggleable (disabled during prelaunch)
- ✅ Article fully readable without JS
- ✅ Read path does not invoke backend

## Analytics
- ✅ `document.body.dataset.analytics` (fixed from `documentElement`)
- ✅ Analytics disabled during prelaunch (`SITE_PRELAUNCH=true`)
- ✅ Custom events remain disabled during prelaunch; code is correct and ready
- ✅ Never sends PII

## Vercel
- ✅ Vercel adapter configured
- ✅ Build produces `.vercel/output`
- ✅ Security headers via vercel.json
- ✅ Pagefind output in `.vercel/output/static/pagefind/`

## Docs
- ✅ README updated
- ✅ CURRENT_STATE updated
- ✅ DECISIONS updated
- ✅ .env.example updated with SITE_PRELAUNCH
- ✅ QA report updated

## Status

**REVENUE READINESS PATCH APPLIED**

### Code complete
- All frontend routes implemented and styled
- All API endpoints implemented with full security hardening
- Beehiiv integration corrected against current API docs
- Resend integration coded with mock fallback
- Publishing engine (verify + prepublish) with correct build paths
- Search: Pagefind indexes correct output directory
- Prelaunch mode: centralized noindex/nofollow + robots Disallow
- Partner: launch-stage framing, optional budget
- Intelligence: RAPID RESEARCH SPRINT, optional budget/deadline
- Analytics: fixed body dataset mismatch, prelaunch guard
- API: Cache-Control no-store, crypto.randomUUID, isSameOrigin hardened
- Documentation complete

### E2E waiting on user credentials/domain/plan
1. Beehiiv: API key + publication ID → set `PUBLIC_BRIEF_ENABLED=true`
2. Resend: API key + emails → set `PUBLIC_COMMERCIAL_FORMS_ENABLED=true`
3. Domain: secondpass.net → set `PUBLIC_SITE_URL=https://secondpass.net`
4. Vercel Pro: upgrade before commercial launch
5. Public launch: set `SITE_PRELAUNCH=false`

### Deployment verification required
- `/pagefind/pagefind.js` 200
- Real search query works
- `/api/health` 200 with Cache-Control: no-store
- Security headers present
- Global noindex during prelaunch
- robots Disallow during prelaunch
- Canonical remains `https://second-pass.vercel.app` until domain day
- Beehiiv/Resend remain disabled safely if credentials are absent
