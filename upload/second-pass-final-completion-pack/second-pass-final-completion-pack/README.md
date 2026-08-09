# SECOND / PASS — Final Website Completion Pack

Modify the existing private repository: `witejackel-eng/second-pass-web`.
Use the existing Vercel project: `second-pass`.

This ZIP is an instruction/reference pack, not a replacement starter.

## Goal today
Finish frontend + operational backend without adding unnecessary app complexity:
- full Astro publication UX
- Beehiiv `/BRIEF` signup
- sponsor and intelligence lead capture
- publishing validation engine
- structured data foundations
- analytics-ready event layer
- ad/sponsor configuration model
- security/abuse controls
- Vercel/domain readiness
- rollback/operations docs
- complete breakpoint QA

Do not publish real news in this phase.

## Architecture rule
Reading stays static/CDN-first. Only actual writes use Vercel Functions.

## Provider choices
- Beehiiv Launch: newsletter subscriber system.
- Resend Free: low-volume transactional lead notifications.
- Vercel Web Analytics: activate when commercial launch is on Pro.
- No CMS, database, auth, payments, or programmatic ads yet.

## Prompts
- `prompts/01_EXECUTE_TODAY_MASTER.md`
- `prompts/02_CONNECT_CREDENTIALS.md`
- `prompts/03_DOMAIN_DAY.md`
- `prompts/04_GO_COMMERCIAL_ON_PRO.md`
- `prompts/05_FINAL_PRE_CONTENT_AUDIT.md`
