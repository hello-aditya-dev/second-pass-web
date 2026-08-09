import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const site = process.env.PUBLIC_SITE_URL || "http://localhost:3000";

export default defineConfig({
  site,
  output: "static",
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
