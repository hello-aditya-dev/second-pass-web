# Current State

**Brand:** SECOND / PASS
**Phase:** Phase 2 refinement (verified)
**Architecture:** Astro 7 static-first publication
**Date:** 2026-08-09

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
- AdBreak component with house-unit fallback architecture
- Reading progress indicator on articles
- Pagefind static search with debounced input, Escape key, no-results state
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
- All npm references replaced with bun throughout codebase
- Torture-test fixture article for layout edge cases
- Foundation archive preserved at archive/second-pass-web-foundation.zip
- GitHub repository: witejackel-eng/second-pass-web (private)
- astro check: 0 errors, 0 warnings
- content:audit: 0 failures (6 expected demo warnings)
- Production build: 22 pages, clean, Pagefind indexed

## Intentionally absent

- CMS
- database
- auth
- SaaS boilerplate
- analytics vendor
- real ad network
- newsletter vendor
- accounts/comments
- React or client framework
- CSP (deliberately not added without testing)

## Next

Replace demo stories with human-approved newsroom work through the fast publishing pipeline.
Select newsletter provider, analytics, and hosting as separate integration decisions.
