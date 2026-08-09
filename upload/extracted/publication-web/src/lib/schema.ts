import { site } from "@/lib/site";
import type { Article } from "@/lib/types";

export function articleJsonLd(article: Article) {
  const url = `${site.url}/articles/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: article.author,
      url: `${site.url}/about`
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url
    },
    image: `${site.url}/og-default.svg`
  };
}
