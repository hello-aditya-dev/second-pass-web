# Z.ai — FINAL WEBSITE COMPLETION TODAY

Work directly in `witejackel-eng/second-pass-web`.
Use the existing Vercel project `second-pass`.
Do not create another repo.

Read the entire attached completion pack first.

## Objective
Finish SECOND / PASS as a complete publication product today:
frontend + publishing backend + Beehiiv BRIEF + commercial lead backend + structured data foundation + analytics-ready events + SEO/security/operations.

Do not publish real news in this task.

## Architecture
Keep every reader-facing page static.
A pageview must not need a DB, SSR, session or API call.

Use root `/api/*.ts` Vercel Functions only for:
- POST `/api/brief-subscribe`
- POST `/api/partner-lead`
- POST `/api/intelligence-lead`
- GET `/api/health`

Do not migrate away from Astro.
Do not add Next.js, CMS, database, auth, payments or programmatic ads.

## A — Re-audit existing foundation
Before adding features, fix any remaining Phase-2 issue:
- Bun consistency
- Node consistency
- canonical/site URL
- security headers
- legacy Next/shadcn/HexFallow residue
- README
- search
- breakpoint defects
- Vercel build/deployed HTML

## B — Beehiiv `/BRIEF`
Implement exactly per `BEEHIIV_BRIEF.md` and `BACKEND_SPEC.md`.

Beehiiv Launch is the provider.
Use normal subscription API, not Send API.
Server-only credentials.
Respect publication DOI policy with `double_opt_override: "not_set"`.
Never force-reactivate an unsubscribed user.

Reusable form on `/brief`, home and article bottom.
No popups or forced gates.

If credentials are absent:
- finish code
- test with mocks
- leave production feature toggle false
- document exact hookup
- do not fake real E2E

## C — Commercial backend
Create `/partner` and `/intelligence`.

Implement accessible custom forms and the two API functions.
Use a provider-neutral notifier with Resend implementation.

No uploads.
No fake audience numbers, clients, testimonials or sponsor logos.
No mature-media rate claims.

If Resend credentials are absent, code/mocks must still be complete and the feature stays disabled until hookup.

## D — Publishing engine
Add:
- `article:verify`
- `prepublish`

Strengthen existing audit.
Prepublish must verify generated HTML, Pagefind and SEO structure.
It must NOT auto-approve or auto-push.

## E — Data foundation
Create typed provenance, pricing and benchmark schemas.
Use only explicit DEMO/TEST fixtures for rendering tests.
Do not invent current values.

## F — Analytics-ready
Prepare Vercel Web Analytics behind `PUBLIC_ANALYTICS_ENABLED`.
Do not enable commercial analytics just because code exists while prelaunch/Hobby.

Prepare safe events:
brief_signup_submit/success, partner_cta/lead_success, intelligence_cta/lead_success, source_open, data_open, search_use.
Never send PII.

## G — Security and failure behavior
Implement method/content-type/body limits, field max lengths, validation, honeypots, same-origin discipline, upstream timeout, sanitized errors/logs, request IDs, health route and server-only secrets.

Do not call in-memory rate limiting production-grade.
Do not add a DB just to rate-limit before abuse exists.

## H — Frontend final pass
New routes and forms must look native to SECOND / PASS:
Bricolage + Newsreader + mono, paper/ink/signal blue, structural slash, serious editorial density.

No SaaS form cards, gradients, glass, giant radius, animation package or generic dashboard aesthetic.

Polish all existing routes too. UX is the moat.

## I — Responsive QA
Actually browser-test:
1440 / 1024 / 820 / 768 / 430 / 390 / 375.

Test home, article, search, data, brief, partner, intelligence and 404.
Run long-headline, technical-table, long-URL and form-error torture fixtures.

Do not claim a viewport is checked from CSS inspection alone.

## J — Vercel
Do not change billing.
The project may remain protected/prelaunch on Hobby for this build/QA.

Do not make a commercial public launch on Hobby.

Deploy to the existing project.
Inspect actual build log, Pagefind, headers, canonical, APIs and protection/noindex status.

## K — Documentation
Update:
README, CURRENT_STATE, durable DECISIONS, OPERATIONS, `.env.example`.

Create:
`docs/QA_REPORT_FINAL_WEBSITE.md`.

Document provider hookup, domain migration and rollback.

## L — Verification
Use Bun consistently.
Run clean install, content audit, Astro check, production build, Pagefind, tests, secret scan, residual search and browser QA.

Use `ACCEPTANCE_GATE.md`.

Final report must separate:
1. code complete
2. real-provider E2E complete
3. E2E waiting only on user credentials/domain/plan
4. blockers
5. exact manual user actions

If engineering is complete but activation inputs are pending:
`FINAL WEBSITE: CODE COMPLETE — ACTIVATION INPUTS PENDING`

If engineering remains:
`FINAL WEBSITE: FAIL — ENGINEERING INCOMPLETE`

Do not start content work.
