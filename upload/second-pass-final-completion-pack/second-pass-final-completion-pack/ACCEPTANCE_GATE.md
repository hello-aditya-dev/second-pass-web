# Final Acceptance Gate

Do not start the real content pipeline until all applicable checks pass.

## Architecture
- static Astro reading path
- only writes use Vercel Functions
- no read-time DB
- Beehiiv/Resend isolated behind providers

## BRIEF
- reusable form
- API
- server-only key
- validation/honeypot
- attribution
- publication DOI policy respected
- duplicate behavior
- failure/429 behavior
- real E2E after credentials

## Commercial
- partner route + API
- intelligence route + API
- Resend adapter
- accessible form states
- no fake metrics/logos/rates

## Publishing
- article:new
- article:verify
- content:audit
- prepublish
- build
- Pagefind
- generated HTML checks
- human approval gate

## Data
- typed provenance
- pricing/benchmark structures
- fixtures marked DEMO/TEST
- no fake current data

## SEO
- no example.com
- correct temporary/final canonical
- OG
- JSON-LD
- RSS
- sitemaps
- protected/noindex prelaunch

## Security
- headers
- no secrets
- body/method/content-type checks
- validation
- honeypot
- origin discipline
- upstream timeout
- sanitized errors/logs
- secret scan

## UX
home, article, search, data, brief, partner, intelligence, policies, 404, commercial slots.

## Responsive
1440 / 1024 / 820 / 768 / 430 / 390 / 375.
No x-overflow. Long headline/table/long URL/forms all pass.

## Accessibility
keyboard, focus, skip link, form labels/errors, reduced motion, contrast, touch targets.

## Performance
no unnecessary hydration, no heavy UI/animation dependency, analytics toggleable, article fully readable without JS, read path does not invoke backend.

## Vercel
deployment READY, clean build log, Pagefind built, deployed headers and canonical inspected, APIs verified to the level credentials allow, prelaunch state intentional.

## Docs
README, CURRENT_STATE, DECISIONS, OPERATIONS, env docs, provider docs, domain runbook, rollback, final QA report.

Status:
`FINAL WEBSITE: PASS — READY FOR ACTIVATION`
or
`FINAL WEBSITE: FAIL — DO NOT START CONTENT PIPELINE`
