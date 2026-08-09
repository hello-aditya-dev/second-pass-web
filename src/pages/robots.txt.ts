export function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "https://second-pass.vercel.app";
  const prelaunch = import.meta.env.SITE_PRELAUNCH === "true";

  const body = prelaunch
    ? `User-agent: *
Disallow: /

Sitemap: ${origin}/sitemap-index.xml
Sitemap: ${origin}/news-sitemap.xml
`
    : `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
Sitemap: ${origin}/news-sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
