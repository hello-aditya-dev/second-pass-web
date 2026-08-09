# Current State

**Brand:** SECOND / PASS
**Phase:** Engineering frozen — awaiting activation inputs
**Architecture:** Astro 7 hybrid — static read path, Vercel Functions for writes only
**Date:** 2026-08-10

## Engineering frozen

All code is complete and verified against the real Vercel deployment. No further development until provider/domain/plan activation.

## Prelaunch mode (fail-safe)

`SITE_PRELAUNCH !== "false"` — prelaunch is the default.

- Missing/undefined → PRELAUNCH (noindex, robots Disallow, analytics off)
- `SITE_PRELAUNCH=true` → PRELAUNCH
- `SITE_PRELAUNCH=false` → PUBLIC (normal indexing)

Implemented centrally in BaseLayout + robots.txt.ts. No per-page edits.

## Verified on real deployment

- Homepage: `<meta name="robots" content="noindex,nofollow">`
- robots.txt: `Disallow: /`
- `/pagefind/pagefind.js`: 200
- Search: real query returns results
- `/api/health`: 200, `brief: not_configured`, `leads: not_configured`, `Cache-Control: no-store`
- Security headers: nosniff, DENY, strict-origin-when-cross-origin, Permissions-Policy
- Analytics: script absent during prelaunch
- Canonical: `https://second-pass.vercel.app`

## Activation inputs pending

1. Beehiiv: API key + publication ID + newsletter list ID → set `PUBLIC_BRIEF_ENABLED=true`
2. Resend: API key + emails → set `PUBLIC_COMMERCIAL_FORMS_ENABLED=true`
3. Domain: secondpass.net → set `PUBLIC_SITE_URL=https://secondpass.net`
4. Vercel Pro: upgrade before commercial launch
5. Public launch: set `SITE_PRELAUNCH=false`
6. Replace demo stories with human-approved newsroom content
