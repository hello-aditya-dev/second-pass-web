import { getCollection, type CollectionEntry } from "astro:content";

export type ArticleEntry = CollectionEntry<"articles">;

export async function publishedArticles() {
  const entries = await getCollection("articles", ({ data }) =>
    import.meta.env.PROD ? data.status === "published" : data.status !== "draft"
  );

  // Deterministic sort:
  //   1. publishedAt descending (newest first)
  //   2. editorialOrder descending (higher = newer/higher in section list)
  //   3. slug ascending (stable tie-breaker)
  return entries.sort((a, b) => {
    const dateDiff = b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    if (dateDiff !== 0) return dateDiff;

    const orderDiff = (b.data.editorialOrder ?? 0) - (a.data.editorialOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;

    return a.data.slug.localeCompare(b.data.slug);
  });
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

export function sectionSlug(section: string) {
  return section.toLowerCase();
}
