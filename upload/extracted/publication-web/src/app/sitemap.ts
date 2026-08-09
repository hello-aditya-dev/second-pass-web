import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/latest",
    "/ai",
    "/compute",
    "/infrastructure",
    "/security",
    "/research",
    "/data",
    "/about",
    "/editorial-policy",
    "/corrections",
    "/privacy",
    "/newsletter"
  ];

  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: new Date("2026-08-09"),
      changeFrequency: route === "" || route === "/latest" ? "daily" as const : "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...articles.map((article) => ({
      url: `${site.url}/articles/${article.slug}`,
      lastModified: new Date(article.modifiedAt ?? article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: article.featured ? 0.9 : 0.75
    }))
  ];
}
