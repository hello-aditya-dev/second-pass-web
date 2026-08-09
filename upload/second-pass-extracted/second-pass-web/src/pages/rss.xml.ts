import rss from "@astrojs/rss";
import { publishedArticles } from "@/lib/content";
import { SITE } from "@/lib/site";

export async function GET(context: { site?: URL }) {
  const articles = (await publishedArticles()).filter((item) => !item.data.demo);

  return rss({
    title: SITE.plainName,
    description: SITE.description,
    site: context.site ?? "https://example.com",
    items: articles.slice(0, 50).map((item) => ({
      title: item.data.title,
      description: item.data.dek,
      pubDate: item.data.publishedAt,
      link: `/articles/${item.data.slug}`,
      categories: [item.data.section, item.data.format, ...item.data.tags]
    })),
    customData: "<language>en</language>"
  });
}
