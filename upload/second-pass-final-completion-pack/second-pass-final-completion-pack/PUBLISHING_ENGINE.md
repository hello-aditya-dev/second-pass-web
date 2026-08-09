# Publishing Engine

Keep:
- `bun run article:new -- <slug>`
- `bun run content:audit`
- `bun run check`
- `bun run build`

Add:
- `bun run article:verify -- <slug>`
- `bun run prepublish -- <slug>`

## `article:verify`
Check:
- file exists
- unique slug
- slug/frontmatter consistency
- approved/public status rules
- demo flag
- title/dek sanity
- valid section/format
- FIRST PASS count
- author
- publishedAt
- updatedAt >= publishedAt
- source URL syntax
- public media paths
- alt text
- change log
- no `REPLACE`, TODO, example URLs
- no private newsroom paths
- no obvious secret-token patterns

## `prepublish`
For an already human-approved article:
1. article verify
2. content audit
3. Astro check
4. production build
5. Pagefind output check
6. generated article HTML inspection for title, description, canonical, JSON-LD, FIRST PASS and sources
7. print clear PASS/FAIL

Do not auto-approve, silently rewrite claims or auto-push without explicit action.

Live updates edit the same canonical article, set truthful updatedAt and append change log.
