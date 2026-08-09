export function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "https://second-pass.vercel.app";
  return new Response(
`User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
Sitemap: ${origin}/news-sitemap.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
