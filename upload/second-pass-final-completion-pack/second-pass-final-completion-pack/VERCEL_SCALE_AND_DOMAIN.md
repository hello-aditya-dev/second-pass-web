# Vercel Scale and Domain Plan

## Today
Keep the existing Vercel project `second-pass`.
Protected/prelaunch QA may remain on Hobby.

Hobby is for personal/non-commercial use. Do not make a commercial public launch on Hobby.

Z.ai must never change billing or activate a trial without explicit user action.

## Before public commercial launch
Move to Vercel Pro or an explicitly activated eligible Pro trial.

## Static scale
Reader-facing pages stay static. Functions handle only writes.
Do not replatform because traffic grows.

## Domain
When purchased:
Primary: `https://secondpass.net`
Redirect: `https://www.secondpass.net` → apex.

Set:
`PUBLIC_SITE_URL=https://secondpass.net`

Verify canonical, OG, JSON-LD URLs, sitemap, news sitemap, RSS, robots and share URLs.

The Vercel alias may remain operational but must not become a competing canonical.

If Beehiiv needs a newsletter/custom domain, use a non-conflicting subdomain only according to Beehiiv's current official instructions.

Verify the domain separately in Resend according to Resend's current official DNS instructions.

## Rollback
Document known-good deployment rollback in operations docs.
No irreversible deployment choreography.

## Reassess architecture only when
- static build time is a measured bottleneck
- content volume materially stresses builds
- paid/authenticated data products exist
- data update frequency outgrows static workflow
- APIs receive meaningful recurring load
