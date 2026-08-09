# Final Website QA Report

**Date:** 2026-08-10
**Build:** 28 pages, clean
**Astro check:** 0 errors, 0 warnings
**Content audit:** 0 failures (6 expected demo warnings)
**Pagefind:** Indexed via `scripts/build-search.mjs` (bunx), output in `.vercel/output/static/pagefind/`

## Providers
- ✅ Beehiiv: CONFIGURED — /BRIEF subscription form is live
- ✅ Resend: CONFIGURED — /partner and /intelligence lead forms are live
- ✅ **DEPLOYED VERIFIED:** `/api/health` returns `brief: configured, leads: configured`

## Author System
- ✅ `/authors/aditya` — editorial, restrained, truthful bio
- ✅ Person JSON-LD with name, url, jobTitle, worksFor
- ✅ No invented credentials, employers, awards, or publications
- ✅ Coverage: AI, COMPUTE, SYSTEMS, SECURITY, RESEARCH, DATA
- ✅ Methodology statement: primary sources first, vendor claims labeled, calculations state assumptions
- ✅ Recent articles section (populated when real articles exist)
- ✅ **DEPLOYED VERIFIED:** `/authors/aditya` returns 200 with Person JSON-LD

## Structured Author Data
- ✅ Article JSON-LD uses `@type: Person` for author with URL to author page
- ✅ Publisher JSON-LD uses `@type: Organization` with name, url, and logo
- ✅ Author `name` field is just "Aditya" (not "Aditya — Founder & Editor, SECOND / PASS")
- ✅ `sameAs` not invented — social profile URLs can be added later through site config

## Social Asset System
- ✅ Build-time generation via `scripts/generate-social-assets.mjs` using sharp
- ✅ OG: 1200×630 at `public/social/<slug>/og.png`
- ✅ Portrait: 1080×1350 at `public/social/<slug>/portrait.png`
- ✅ Square: 1080×1080 at `public/social/<slug>/square.png`
- ✅ Typography-first visual language: warm paper background, black typography, Signal Blue slash
- ✅ No gradients, shadows, stock photos, robot imagery, or AI art
- ✅ Optional `socialStat`/`socialStatLabel` for key-number emphasis
- ✅ Generated for all 6 demo articles
- ✅ **DEPLOYED VERIFIED:** `/social/demo-api-economics/og.png` returns 200

## Article Metadata
- ✅ `og:site_name` = "SECOND / PASS"
- ✅ `og:image` — article-specific social PNG
- ✅ `og:image:alt` — descriptive alt text
- ✅ `og:image:width` = 1200, `og:image:height` = 630
- ✅ `article:published_time` — ISO 8601
- ✅ `article:modified_time` — ISO 8601
- ✅ `article:section` — article section
- ✅ `article:tag` — one per meaningful tag
- ✅ `twitter:card` = summary_large_image
- ✅ `twitter:title`, `twitter:description`, `twitter:image`
- ✅ No invented Twitter/X handle
- ✅ **DEPLOYED VERIFIED:** All metadata present on live article pages

## Favicon System
- ✅ SVG favicon (preferred modern): `/mark.svg`
- ✅ PNG fallbacks: favicon-16x16.png, favicon-32x32.png
- ✅ apple-touch-icon.png (180×180)
- ✅ icon-192.png, icon-512.png
- ✅ manifest.webmanifest with SVG and PNG icon entries
- ✅ **DEPLOYED VERIFIED:** All favicon files return 200

## Article Share Utility
- ✅ COPY LINK, LINKEDIN, X, SHARE actions
- ✅ Native Web Share API where available
- ✅ No third-party share library, no tracking dependency
- ✅ No floating/sticky share bar, no social icon clutter
- ✅ Placed after / END, before /BRIEF
- ✅ Small, editorial, utility-like, lower hierarchy

## Distribution Tools
- ✅ `bun run distribute:url -- <slug> <channel>` — generates tracked URLs
- ✅ Channel mappings: hackernews, reddit, linkedin, x, brief, direct
- ✅ UTM parameters: utm_source, utm_medium, utm_campaign

## Technical Components
- ✅ CalculationBlock — structured calculation display
- ✅ ClaimCheck — vendor claim vs independent result
- ✅ Metric — single key metric display
- ✅ AssumptionList — explicit assumption listing
- ✅ SensitivityTable — sensitivity analysis table
- ✅ All: accessible, static-first, printable, mobile-safe, visually restrained

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

## Prelaunch Mode (SITE_PRELAUNCH) — Fail-safe
- ✅ Fail-safe default: `SITE_PRELAUNCH !== "false"` — missing/undefined → PRELAUNCH
- ✅ Centralized in BaseLayout + robots.txt.ts — no per-page edits required
- ✅ **DEPLOYED VERIFIED:** Homepage contains `<meta name="robots" content="noindex,nofollow">`
- ✅ **DEPLOYED VERIFIED:** `/robots.txt` returns `Disallow: /`
- ✅ Analytics script and custom events disabled during prelaunch
- ✅ Homepage remains accessible for QA
- ✅ Only explicit `SITE_PRELAUNCH=false` allows public indexing

## BRIEF
- ✅ Reusable BriefForm component on /brief, homepage CTA, article bottom
- ✅ POST /api/brief-subscribe with validation, honeypot, same-origin
- ✅ Server-only Beehiiv credentials
- ✅ Beehiiv uses `newsletter_list_ids: [id]` (not `newsletter_id`)
- ✅ Beehiiv uses `utm_content` for placement (not `referrer`)
- ✅ `reactivate_existing: false`, `double_opt_override: "not_set"`
- ✅ Beehiiv 422 is NOT treated as success — only 2xx is success
- ✅ BriefForm sends placement as `utm_content` (homepage-cta, article-bottom, brief-page)
- ✅ `PUBLIC_BRIEF_ENABLED` feature toggle

## Commercial
- ✅ /partner — launch-stage framing, no masthead sponsorship promises
- ✅ /partner — budget optional: Under $1,500 / $1,500–$3,000 / $3,000–$7,500 / $7,500+ / Not sure yet
- ✅ /intelligence — RAPID / RESEARCH SPRINT with process steps (01–04)
- ✅ /intelligence — budget: $1,500–$3,000 / $3,000–$7,500 / $7,500–$15,000 / $15,000+ / Discuss scope
- ✅ No fake metrics, logos, clients, or rate claims
- ✅ No Razorpay mentioned publicly

## Publishing
- ✅ `article:new` scaffold
- ✅ `article:verify` quality checks
- ✅ `content:audit` content validation
- ✅ `social:generate` / `social:generate:all` social image generation
- ✅ `distribute:url` distribution URL generation
- ✅ `launch:verify` launch safety gate
- ✅ `prepublish` full pipeline (verify + audit + social + check + build + Pagefind + HTML + OG + metadata)
- ✅ Prepublish does NOT auto-approve or auto-push

## Launch Safety
- ✅ `launch:verify` command exists
- ✅ Fails if demo articles published, providers unconfigured, social images missing
- ✅ Does NOT automatically change SITE_PRELAUNCH
- ✅ Human explicitly makes SITE_PRELAUNCH=false at launch

## SEO
- ✅ No example.com in canonical URLs
- ✅ Correct canonical (second-pass.vercel.app)
- ✅ Open Graph metadata with article-specific images
- ✅ Twitter Card metadata
- ✅ JSON-LD Article/NewsArticle + Person + Organization structured data
- ✅ RSS feed, normal sitemap, news sitemap
- ✅ robots.txt — fail-safe: Disallow when prelaunch

## Security
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy configured
- ✅ **DEPLOYED VERIFIED:** All security headers present
- ✅ `Cache-Control: no-store` on API responses
- ✅ Honeypot, field limits, same-origin, upstream timeout, sanitized errors
- ✅ Request IDs via `crypto.randomUUID()`
- ✅ No secrets committed or exposed client-side

## Status

**DISTRIBUTION-READY — ACTIVATION INPUTS PENDING**

Engineering is complete and frozen. Providers are configured. Ready for publishing at high speed.
