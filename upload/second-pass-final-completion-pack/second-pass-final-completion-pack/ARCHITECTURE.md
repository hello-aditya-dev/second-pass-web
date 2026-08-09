# Architecture

## Static read path
Reader → Vercel CDN → Astro static HTML/CSS/assets.

Applies to home, articles, sections, search shell/index, data/reference pages, policies, RSS and sitemaps.

A pageview must not require a database, SSR, auth, or an API call.

## Mutation path
Use root `/api/*.ts` Vercel Functions only for:
- POST `/api/brief-subscribe`
- POST `/api/partner-lead`
- POST `/api/intelligence-lead`
- GET `/api/health`

## Private/public boundary
`publication-newsroom` owns raw research, rejected drafts, fact-check work, advertiser negotiations and confidential client work.

`second-pass-web` owns approved public content, public sources, public data, UX, SEO and commercial surfaces.

## Scale principle
If an article gets millions of reads, backend mutation traffic should barely change.

Future auth, billing, paid data API and institutional products must remain separable from the free publication.
