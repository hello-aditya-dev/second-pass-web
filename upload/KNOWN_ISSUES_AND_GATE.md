# SECOND / PASS — Known Issues + Acceptance Gate

Repository: `witejackel-eng/second-pass-web`
Vercel project: `second-pass`

## Known issues to fix before visual polish

1. Production canonical / Open Graph origin must never fall back to `example.com`. Before a custom domain is attached, use `https://second-pass.vercel.app`; keep `PUBLIC_SITE_URL` overrideable for the final domain. Verify built/deployed HTML, RSS and sitemaps.
2. Standardize package management. Current repo mixes npm documentation with Bun scripts/deployment. Prefer Bun everywhere, add `packageManager`, regenerate `bun.lock`, remove duplicate locks and stale `nextjs_tailwind_shadcn_ts` metadata.
3. Pin the Node major used in production rather than `>=22.12.0`. Current Vercel project is on Node 24.x; use `24.x` if compatibility verification passes and keep `.nvmrc` consistent.
4. Add deliberate Vercel security headers. There is no committed `vercel.json` today. At minimum consider `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a conservative `Permissions-Policy`. Vercel already supplies HSTS. Do not add an untested CSP.
5. Rewrite README as the actual operator entrypoint: product, architecture, Astro rationale, Bun/Node, Vercel, env, routes, content model, newsroom separation, fast publishing, Pagefind, RSS/sitemaps, typography/design, mobile/tablet, ads, security, intentional omissions, verification.
6. Remove active legacy residue: stale Next.js/shadcn/HexFallow/publication-web instructions, duplicate configs/locks, TODO/FIXME/lorem, placeholder production origins. Immutable archive contents can remain as archive only.
7. Verify `/search` on the deployed build: initialization, keyboard, no-results, excerpts, mobile, Pagefind assets.
8. Keep the deployment protected/noindex until demo stories are removed and the final public origin/policies are correct.
9. Do real breakpoint QA. Existing CSS responsiveness is not proof that 1440/1024/820/768/430/390/375 were visually verified.
10. Elevate UI beyond the current good foundation: stronger homepage hierarchy, different editorial temperature for NOW/SECOND PASS/PROOF/DATA, exceptional article typography, refined tablet composition, long-headline/table/source torture testing, quiet commercial breaks, better empty states.

## Acceptance gate

### Engineering
- [ ] Correct deployed canonical origin
- [ ] Bun/npm inconsistency resolved
- [ ] Lockfile regenerated and stale starter metadata removed
- [ ] Node major pinned
- [ ] Tested Vercel security headers committed
- [ ] Active legacy residue removed
- [ ] `bun run content:audit` passes
- [ ] `bun run check` passes with 0 errors
- [ ] `bun run build` passes
- [ ] Pagefind indexes successfully
- [ ] Production deployment is READY

### SEO / publication tech
- [ ] Deployed canonical inspected
- [ ] OG URL/image inspected
- [ ] sitemap origin inspected
- [ ] news sitemap excludes demos
- [ ] RSS excludes demos
- [ ] JSON-LD structurally correct
- [ ] pre-launch noindex/protection remains intentional

### UX
- [ ] Homepage refined
- [ ] Article refined
- [ ] Search refined
- [ ] Data refined
- [ ] Brief refined
- [ ] Policy/404 coherent
- [ ] Commercial units restrained
- [ ] No generic SaaS/card-grid feeling

### Required viewports
- [ ] 1440
- [ ] 1024
- [ ] 820
- [ ] 768
- [ ] 430
- [ ] 390
- [ ] 375
- [ ] no page-level horizontal overflow
- [ ] long technical headline passes
- [ ] 8-column table passes
- [ ] evidence/source UI passes
- [ ] nav/footer passes

### Accessibility
- [ ] Keyboard navigation
- [ ] Skip link
- [ ] Visible focus
- [ ] Reduced motion
- [ ] Heading hierarchy
- [ ] Labels
- [ ] Touch targets
- [ ] Contrast reviewed

### Performance
- [ ] No unnecessary client framework
- [ ] No unnecessary third-party JS
- [ ] Font loading reviewed
- [ ] Commercial slots do not create material CLS
- [ ] Production console clean

### Documentation
- [ ] README rewritten
- [ ] `CURRENT_STATE.md` truthful
- [ ] `DECISIONS.md` contains only durable decisions
- [ ] `docs/QA_REPORT_PHASE2.md` created

Only when all applicable items pass may the final report say:

`PHASE 2: PASS — READY FOR FIRST REAL STORY`

Otherwise it must say:

`PHASE 2: FAIL — NOT READY FOR CONTENT PIPELINE`
