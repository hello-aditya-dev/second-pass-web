import { publishedArticles } from "@/lib/content";

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;"
  })[char] ?? char);

export async function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "https://second-pass.vercel.app";
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = (await publishedArticles()).filter(
    (item) => !item.data.demo && item.data.publishedAt.valueOf() >= cutoff
  );

  const urls = recent.map((item) => `
  <url>
    <loc>${escapeXml(`${origin}/articles/${item.data.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>Second Pass</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${item.data.publishedAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(item.data.title)}</news:title>
    </news:news>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
