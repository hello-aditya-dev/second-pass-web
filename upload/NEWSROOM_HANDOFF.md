# Newsroom → Web Handoff

## Goal
Publishing mechanics should take minutes after human approval.

## Public package
For each approved story, the newsroom should hand off:

- final headline
- dek
- slug
- section
- format
- author/byline
- publish timestamp
- update timestamp when meaningful
- FIRST PASS bullets
- approved public body
- public source list
- change log
- tags/entities
- hero/diagram requirements
- explicit ad policy: none/light/standard
- SEO title/description only if different

## Z.ai handoff command
Open `second-pass-web` and say:

> Read AGENT.md and docs/PUBLISHING_SPEED.md. Publish the attached human-approved newsroom package.
> Create the article with the existing schema, preserve factual wording, add only public-safe media,
> run content audit/check/build, update CURRENT_STATE.md if needed, and commit as
> `publish: <slug>`. Do not redesign unrelated UI.

## Fast lane
No custom visual required: target <10 minutes from handoff to push.
Custom chart/diagram: ship text first if the article is time-sensitive, then add the verified visual
as a meaningful update with a change-log entry.

## Never
Do not ask the web agent to research the story again unless a technical publishing inconsistency is
found. Research belongs in the newsroom.
