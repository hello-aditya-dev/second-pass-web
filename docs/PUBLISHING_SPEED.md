# Publishing Speed

## Objective
After editorial approval, public publishing should take minutes.

## Git-native launch pipeline
1. newsroom creates human-approved public package
2. `bun run article:new -- story-slug`
3. fill MDX
4. add safe media to `public/media/story-slug/`
5. `bun run content:audit`
6. `bun run check`
7. `bun run build`
8. commit `publish: story-slug`
9. push/deploy

Technical handoff target: under 10 minutes when no custom interactive graphic is required.

## Breaking-story operating target
00:00 signal
00:05 significance
00:15 primary sources
00:30 angle
00:50 research package
01:10 draft
01:25 verify
01:40 edit
01:50 human approval
02:00 publishing handoff

This target never permits skipping verification.

## Live updates
Edit the same article. Update `updatedAt` only for meaningful changes. Append `/ CHANGE LOG`.
Do not create duplicate updated articles.

## CMS trigger
Do not add a CMS until Git becomes a measurable bottleneck through multiple editors, repeated
publishing mistakes, difficult previews, or sustained high volume.

Until then, Git + Z.ai is faster and cheaper.
