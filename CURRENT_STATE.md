# Current State

**Brand:** SECOND / PASS
**Phase:** Launch foundation (verified)
**Architecture:** Astro 7 static-first publication
**Date:** 2026-08-09

## Included

- SECOND / PASS identity with slash as structural language
- Bricolage Grotesque Variable + Newsreader Variable typography (Fontsource)
- Custom CSS design system (signal blue #2F5BFF, paper #F2EFE7, ink #11110F)
- Responsive editorial layouts (desktop 1440, tablet 1024/820/768, mobile 430/390/375)
- Typed MDX content collections with Zod schema validation
- Article anatomy: FIRST PASS, / SECOND PASS, evidence panel, sources, change log, / END
- AdBreak component with house-unit fallback architecture
- Reading progress indicator on articles
- Pagefind static search foundation with custom UI
- RSS feed (excludes demo content)
- News sitemap (excludes demo, recent-only)
- Astro sitemap and robots.txt
- JSON-LD Article/NewsArticle structured data
- Open Graph and Twitter Card metadata
- Skip-to-content link, semantic landmarks, visible focus, reduced-motion support
- Content audit script and article scaffolding script
- Publishing speed pipeline documented (target: <10 min after approval)
- All 16 docs: architecture, brand, content model, design, FT inspiration, interactions, mobile, ad system, newsroom handoff, open-source stack, operations, performance, publishing speed, SEO, UX spec, acceptance
- Foundation archive preserved at archive/second-pass-web-foundation.zip
- GitHub repository: witejackel-eng/second-pass-web (private)
- astro check: 0 errors, 0 warnings
- content:audit: 0 failures (5 expected demo warnings)
- Production build: 21 pages, clean

## Intentionally absent

- CMS
- database
- auth
- SaaS boilerplate
- analytics vendor
- real ad network
- newsletter vendor
- accounts/comments
- Pagefind index (requires `npm run build` first)

## Next

Replace demo stories with human-approved newsroom work through the fast publishing pipeline.
Select newsletter provider, analytics, and hosting as separate integration decisions.
