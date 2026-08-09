import { getCollection, type CollectionEntry } from "astro:content";

export type ArticleEntry = CollectionEntry<"articles">;

export async function publishedArticles() {
  const entries = await getCollection("articles", ({ data }) =>
    import.meta.env.PROD ? data.status === "published" : data.status !== "draft"
  );

  return entries.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
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
