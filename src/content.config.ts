import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const fullSource = z.object({
  label: z.string(),
  url: z.url().optional(),
  type: z.enum(["primary", "secondary", "dataset", "paper", "filing", "advisory", "other"]),
  note: z.string().optional()
});

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(8),
    dek: z.string().min(20),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    section: z.enum(["AI", "Compute", "Systems", "Security", "Research", "Data"]),
    format: z.enum(["NOW", "SECOND PASS", "DEEP", "PROOF", "DATA"]),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(["draft", "review", "published"]),
    firstPass: z.array(z.string()).min(2).max(5),
    featured: z.boolean().default(false),
    demo: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    adPolicy: z.enum(["none", "light", "standard"]).default("light"),
    sources: z.array(fullSource).default([]),
    changeLog: z.array(z.object({
      at: z.coerce.date(),
      type: z.enum(["published", "update", "clarification", "correction"]),
      note: z.string()
    })).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    socialStat: z.string().optional(),
    socialStatLabel: z.string().optional()
  })
});

export const collections = { articles };
