# Acceptance Standard

The foundation is not complete merely because a homepage renders.

## Functional
- all documented routes build
- no broken internal navigation
- article dynamic paths work
- content schema rejects malformed entries
- RSS builds
- sitemap builds
- news sitemap builds
- Pagefind index builds after Astro output
- search fails gracefully during dev before index generation

## Visual
Inspect 1440, 1024, 820, 430, and 375 widths.

Check:
- masthead
- topic strip
- lead headline
- NOW rail
- section grids
- article headline
- FIRST PASS
- evidence
- tables
- ad/house break
- sources
- change log
- data page
- footer

## UX
- no ad above first reader value
- no intrusive mobile unit
- no layout overflow
- no hover-only critical interaction
- no unreadably tiny technical tables
- clear `/ END`
- no infinite article chaining

## Technical
- clean install
- `bun run content:audit`
- `bun run check`
- `bun run build`
- zero build errors
- no accidental secrets
- demo status visible
- no invented production data

## Performance
No external analytics/ad/CMS script in launch foundation.
Measure after deployment; do not invent Core Web Vitals.

## Content speed
A human-approved simple article should be publishable without architecture work.
