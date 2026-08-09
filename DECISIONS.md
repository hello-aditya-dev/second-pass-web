# Durable Decisions

## Brand
The publication is **SECOND / PASS**. The slash is part of the visual identity.

## Promise
The first pass tells readers what happened. The second pass tells them what it means.

## Architecture
Astro static-first. Git-native MDX publishing first. No CMS until Git becomes a real bottleneck. Vercel Functions for writes only — a pageview must not need a DB, SSR, session, or API call.

## UX
Optimize reader lifetime value and return rate before ad density. UX is the moat.

## Visual
Custom editorial system. No SaaS/blog starter template.

## Typography
Bricolage Grotesque Variable for display; Newsreader Variable for long-form reading.

## JavaScript
Native HTML/CSS and tiny vanilla scripts before client frameworks.

## Color
Signal blue (#2F5BFF) limited to active states, links, evidence, the slash, and key data. Not washing entire surfaces.

## Content model
Git-native MDX content collections with Zod schema validation. No CMS at launch.

## Advertising
Advertising is subordinate to reading. Explicit AdBreak components at editorial boundaries. Density ceilings enforced. Sponsor money never buys coverage, conclusions, or editorial review rights.

## FT inspiration
Financial Times editorial density and hierarchy principles absorbed without copying visual assets, typography, color, or layout.

## Private repository during foundation work
GitHub repository created as private to protect the pre-launch foundation.

## Newsletter provider
Beehiiv Launch. The website owns signup UX; Beehiiv owns subscriber records, unsubscribe/compliance, and delivery. Use normal subscription API, NOT Send API. Respect publication DOI policy.

## Lead notifications
Resend for transactional email. Provider-neutral notifier interface. Server-only credentials. Reply-To = submitter email.

## Commercial ethics
No fake traffic numbers, inflated reach claims, mature-media rate cards, or client logos. Partnership preserves editorial integrity.

## Security
Strict validation + honeypot + same-origin + upstream timeout on mutation endpoints. No in-memory rate limiting (not production-grade on serverless). Add durable rate limiting only if abuse becomes real.

## Data
Versionable, typed, source-backed data files. No database today. DEMO fixtures explicitly marked. No invented current values.

## Analytics
Vercel Web Analytics behind feature toggle. Safe custom events only — never PII. Activate on Vercel Pro at commercial launch.

## Vercel
Hobby for pre-launch QA. Pro before commercial public launch. Z.ai never changes billing.

## Author system
Real human author represented as Person JSON-LD. Author page at /authors/<slug>. Publisher is Organization, separate from author. No invented credentials.

## Social images
Build-time generation via sharp (SVG→PNG). No runtime generation, no external API, no browser screenshot. Typography-first visual language matching publication identity.

## Distribution
Tracked URLs via UTM parameters. Share utility uses native Web Share API. No third-party share library, no tracking dependency.

## Favicon
SVG favicon as preferred modern format. PNG fallbacks derived from same mark.svg. No second logo.

## Launch safety
launch:verify command prevents accidental public launch. SITE_PRELAUNCH requires explicit human change.
