# AGENT — SECOND / PASS Web

**BEFORE ANY CONTENT/PUBLICATION WORK: READ `PUBLICATION_STANDARD.md` COMPLETELY.**

## Mission

Build and maintain the fastest, most useful, most legible technical publication experience in its
category. UX is a primary moat.

## Speed philosophy

Default behavior:
- think in hours and days, not weeks;
- ship small coherent improvements;
- parallelize independent work;
- prefer reversible decisions;
- test instead of debating;
- keep dependencies minimal;
- remove blockers immediately.

Speed never means fabricating facts, skipping security, weakening accessibility, publishing
unapproved drafts, or ignoring known build failures.

Remove delay, not correctness.

## Startup

Before work:
1. read this file;
2. read `CURRENT_STATE.md`;
3. read `DECISIONS.md`;
4. read relevant `docs/`;
5. inspect existing implementation;
6. verify before large rewrites.

## Public/private boundary

The private newsroom repo owns discovery, raw research, evidence dossiers, internal fact checking,
unpublished drafts, and source strategy.

This repo owns public pages, approved article files, public sources, diagrams, charts, public data,
UX, SEO, ads, and newsletter surfaces.

Never copy private newsroom material here.

## Framework

Astro-first. Do not migrate to T3, Open SaaS, Next.js SaaS starters, AstroWind, Astroship, Cruip, or
generic shadcn templates without explicit approval and a concrete requirement.

## JavaScript budget

Prefer:
1. HTML/CSS
2. native browser primitives
3. tiny vanilla JS
4. Astro islands only when needed

Do not add React for simple menus, disclosures, tabs, or filters.

## Design

Avoid:
- rounded card grids everywhere
- gradients as decoration
- glassmorphism
- startup hero layouts
- decorative 3D
- glowing AI imagery
- slow motion

Use:
- typography
- rules
- asymmetric editorial grids
- diagrams
- data
- the slash
- intentional density

## Devices

Every substantive UI change must consider:
- 1440 desktop
- 1024 tablet landscape
- 820 tablet portrait
- 430 mobile
- 375 mobile

Tablet is not compressed desktop. Mobile is not compressed tablet.

## Advertising

Read `docs/AD_SYSTEM.md`.

Hard bans:
- no popup/prestitial/interstitial
- no sticky bottom ad
- no sticky video
- no autoplay sound
- no ad between chart and explanation
- no ad inside data table
- no ad disguised as editorial
- no ad before FIRST PASS

## Publishing

Only human-approved content may use `status: published`.

## Completion

Before finishing:
- `bun run content:audit`
- `bun run check`
- `bun run build`
- update `CURRENT_STATE.md`

Do not claim verification you did not run.
