# SECOND / PASS

**The first pass tells you what happened. The second pass tells you what it means.**

Public website foundation for a technical intelligence publication covering AI systems, compute,
semiconductors, systems infrastructure, security, research, and source-backed technical data.

## Stack

- Astro 7
- TypeScript strictest
- Astro Content Collections
- MDX
- Pagefind static search
- Astro RSS
- Astro Sitemap
- self-hosted open-source typography through Fontsource
- custom CSS
- tiny vanilla JavaScript only where interaction earns it

This deliberately avoids SaaS starters and generic news templates.

## Publishing

Real research happens in the separate private `publication-newsroom` repository.

Only human-approved content enters this repository.

Fast path:

1. newsroom approves article
2. open this repo in Z.ai
3. `npm run article:new -- story-slug`
4. fill generated MDX from the approved newsroom output
5. add public-safe media to `public/media/story-slug/`
6. `npm run content:audit`
7. `npm run verify`
8. commit `publish: story-slug`
9. deployment starts

See `docs/PUBLISHING_SPEED.md`.

## UX

Reader experience is the moat. Advertising is subordinate to reading.

Read:
- `docs/UX_SPEC.md`
- `docs/MOBILE_TABLET.md`
- `docs/AD_SYSTEM.md`
- `docs/BRAND_SYSTEM.md`
- `docs/INTERACTIONS.md`

## Commands

```bash
npm install
npm run dev
npm run content:audit
npm run check
npm run build
npm run verify
```

## Routes

`/`, `/now`, `/ai`, `/compute`, `/systems`, `/security`, `/research`, `/data`, `/search`,
`/brief`, `/about`, `/editorial-policy`, `/corrections`, `/privacy`, `/articles/[slug]`,
`/rss.xml`, `/news-sitemap.xml`, `/robots.txt`.

Demo content is visibly marked and must be replaced before launch.
