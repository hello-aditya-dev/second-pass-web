# Open-Source Stack

## Chosen
- Astro — MIT; content-first, static-first, zero-JS by default.
- @astrojs/mdx — official MDX integration.
- @astrojs/sitemap — official sitemap integration.
- @astrojs/rss — official RSS helper.
- Pagefind — MIT static search.
- Fontsource packages — self-host open-source fonts.
- Bricolage Grotesque — SIL OFL font.
- Newsreader — SIL OFL font.

## Explicitly skipped

### T3 Stack
Excellent application stack, wrong problem. We do not need auth/tRPC/database complexity.

### Open SaaS by Wasp
Billing/auth/product SaaS concerns are irrelevant to launch.

### Next.js SaaS starters
Optimize an authenticated app, not a reading product.

### AstroWind / Astroship
Useful templates, but their architecture would make the site feel templated.

### Cruip
Marketing/product patterns pull toward SaaS aesthetics.

### shadcn / Radix
Good component sources, unnecessary for the launch foundation. Add primitives later only for real
interaction needs.

## Rule
A package must save more complexity than it introduces.
