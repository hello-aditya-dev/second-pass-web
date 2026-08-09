# Final Website QA Report

**Date:** 2026-08-10
**Build:** 24 pages, clean
**Astro check:** 0 errors, 0 warnings
**Content audit:** 0 failures (6 expected demo warnings)
**Pagefind:** Indexed via `scripts/build-search.mjs` (bunx), output in `.vercel/output/static/pagefind/`

## Architecture
- ✅ Static Astro read path — no DB, SSR, session, or API call for pageviews
- ✅ Vercel Functions for writes only (brief-subscribe, partner-lead, intelligence-lead, health)
- ✅ No read-time DB
- ✅ Beehiiv/Resend isolated behind provider modules and feature toggles

## Pagefind
- ✅ Build script indexes Vercel static output (`.vercel/output/static`)
- ✅ Pagefind assets placed in deployment output directory
- ✅ Uses `bunx pagefind` (project-standardized on Bun)
- ✅ No shell-specific `cp` commands — uses Node.js `fs` module
- ✅ **DEPLOYED VERIFIED:** `/pagefind/pagefind.js` returns 200
- ✅ **DEPLOYED VERIFIED:** `/search` performs real query successfully (7 results for "inference")

## Prelaunch Mode (SITE_PRELAUNCH) — Fail-safe
- ✅ Fail-safe default: `SITE_PRELAUNCH !== "false"` — missing/undefined → PRELAUNCH
- ✅ Centralized in BaseLayout + robots.txt.ts — no per-page edits required
- ✅ **DEPLOYED VERIFIED:** Homepage contains `<meta name="robots" content="noindex,nofollow">`
- ✅ **DEPLOYED VERIFIED:** `/robots.txt` returns `Disallow: /`
- ✅ Analytics script and custom events disabled during prelaunch
- ✅ Homepage remains accessible for QA
- ✅ Only explicit `SITE_PRELAUNCH=false` allows public indexing

## BRIEF
- ✅ Reusable BriefForm component on /brief, homepage CTA
- ✅ POST /api/brief-subscribe with validation, honeypot, same-origin
- ✅ Server-only Beehiiv credentials
- ✅ Beehiiv uses `newsletter_list_ids: [id]` (not `newsletter_id`)
- ✅ Beehiiv uses `utm_content` for placement (not `referrer`)
- ✅ `reactivate_existing: false`, `double_opt_override: "not_set"`
- ✅ Beehiiv 422 is NOT treated as success — only 2xx is success
- ✅ Success message only after actual 2xx: "You're on the list. If you were already subscribed, nothing has changed."
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
- ✅ `article:verify` quality checks (no external dependencies)
- ✅ `content:audit` content validation
- ✅ `prepublish` full pipeline (verify + audit + check + build + Pagefind + HTML inspection)
- ✅ Prepublish inspects correct Vercel/Astro build output paths
- ✅ Prepublish verifies Pagefind output exists
- ✅ Prepublish does NOT auto-approve or auto-push
- ✅ **VERIFIED:** `prepublish -- demo-api-economics` passes

## Data
- ✅ Typed provenance schema
- ✅ Pricing/benchmark/accelerator/provider structures
- ✅ Demo fixtures explicitly marked DEMO/TEST
- ✅ No fake current data

## SEO
- ✅ No example.com in canonical URLs
- ✅ Correct temporary canonical (second-pass.vercel.app)
- ✅ **DEPLOYED VERIFIED:** Canonical is `https://second-pass.vercel.app/`
- ✅ Open Graph metadata
- ✅ Twitter Card metadata
- ✅ JSON-LD Article/NewsArticle structured data
- ✅ RSS feed (excludes demo)
- ✅ Normal sitemap
- ✅ News sitemap (excludes demo, recent-only)
- ✅ robots.txt — fail-safe: Disallow when prelaunch (default), Allow only when `SITE_PRELAUNCH=false`

## Security
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy configured
- ✅ **DEPLOYED VERIFIED:** All security headers present on live responses
- ✅ Method/content-type/body-size checks on mutation endpoints
- ✅ Field max lengths enforced
- ✅ Validation on all fields
- ✅ Honeypot fields on all forms
- ✅ Same-origin discipline (Origin/Referer) — malformed Referer cannot throw
- ✅ Upstream timeout (8s) for Beehiiv and Resend
- ✅ Sanitized errors — never expose provider internals
- ✅ Request IDs via `crypto.randomUUID()` on all API responses
- ✅ **DEPLOYED VERIFIED:** `Cache-Control: no-store` on `/api/health`
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
- ✅ `document.body.dataset.analytics` (correct element)
- ✅ Analytics script does NOT load during prelaunch
- ✅ Custom events disabled during prelaunch; code correct and ready
- ✅ **DEPLOYED VERIFIED:** No `/_vercel/insights/script.js` present on live homepage
- ✅ Never sends PII

## Vercel
- ✅ Vercel adapter configured
- ✅ Build produces `.vercel/output`
- ✅ Security headers via vercel.json
- ✅ Pagefind output in `.vercel/output/static/pagefind/`

## Docs
- ✅ README updated with fail-safe prelaunch behavior
- ✅ CURRENT_STATE updated — engineering frozen
- ✅ DECISIONS updated
- ✅ .env.example updated with fail-safe SITE_PRELAUNCH
- ✅ QA report truthful — only verified items marked

## Status

**ENGINEERING FROZEN — ACTIVATION INPUTS PENDING**

Engineering is complete and frozen. No further development until provider/domain/plan activation.
