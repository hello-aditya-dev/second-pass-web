# Public Content Model

## Article

Required conceptual fields:

```ts
type Article = {
  slug: string;
  title: string;
  dek: string;
  section: Section;
  format: "signal" | "breakdown" | "deep-dive" | "explainer" | "data";
  author: Author;
  publishedAt: string;
  modifiedAt?: string;
  readingMinutes: number;
  featured?: boolean;
  demo?: boolean;
  body: ArticleBlock[];
  sources?: PublicSource[];
  correction?: Correction;
};
```

## Article blocks

The renderer should eventually support:
- paragraph
- heading
- quote
- code
- table
- figure
- chart
- callout
- equation
- key points
- source note

Avoid storing entire articles as unsafe arbitrary HTML.

## Author

Use real identities or an explicit editorial desk identity. Never invent human profiles.

## Source

Public source presentation is not the same as private newsroom evidence. Only expose what is
appropriate to readers.

## Correction

Must preserve:
- timestamp
- description
- whether the correction changed the central conclusion

## CMS requirement

The CMS must preserve structured technical objects instead of flattening everything into a rich
text blob.
