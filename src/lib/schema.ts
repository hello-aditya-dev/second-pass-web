import type { ArticleEntry } from "@/lib/content";
import { SITE, siteUrl } from "@/lib/site";

/** Author configuration — extend when new authors are added */
const AUTHORS: Record<string, { name: string; slug: string }> = {
  "Aditya": { name: "Aditya", slug: "aditya" },
};

export function articleSchema(entry: ArticleEntry) {
  const { data } = entry;
  const url = `${siteUrl()}/articles/${data.slug}`;

  // Build author as Person with URL to their author page
  const authorConfig = AUTHORS[data.author];
  const authorObj = authorConfig
    ? {
        "@type": "Person" as const,
        name: authorConfig.name,
        url: `${siteUrl()}/authors/${authorConfig.slug}`
      }
    : {
        "@type": "Person" as const,
        name: data.author,
        url: `${siteUrl()}/about`
      };

  return {
    "@context": "https://schema.org",
    "@type": data.format === "NOW" ? "NewsArticle" : "Article",
    headline: data.title,
    description: data.seoDescription ?? data.dek,
    datePublished: data.publishedAt.toISOString(),
    dateModified: (data.updatedAt ?? data.publishedAt).toISOString(),
    mainEntityOfPage: url,
    author: authorObj,
    publisher: {
      "@type": "Organization",
      name: SITE.plainName,
      url: siteUrl(),
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl()}/mark.svg`
      }
    }
  };
}
