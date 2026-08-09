import type { ArticleEntry } from "@/lib/content";
import { SITE, siteUrl } from "@/lib/site";

export function articleSchema(entry: ArticleEntry) {
  const { data } = entry;
  const url = `${siteUrl()}/articles/${data.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": data.format === "NOW" ? "NewsArticle" : "Article",
    headline: data.title,
    description: data.seoDescription ?? data.dek,
    datePublished: data.publishedAt.toISOString(),
    dateModified: (data.updatedAt ?? data.publishedAt).toISOString(),
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: data.author,
      url: `${siteUrl()}/about`
    },
    publisher: {
      "@type": "Organization",
      name: SITE.plainName,
      url: siteUrl()
    }
  };
}
