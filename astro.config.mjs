import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

const site = process.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";

export default defineConfig({
  site,
  output: "static",
  adapter: vercel(),
  server: { port: 3000, host: "0.0.0.0" },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light-default",
      wrap: true
    }
  },
  compressHTML: true
});
