import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeResearchFigure from "./src/lib/rehype-research-figure.mjs";
import rehypeHouseObjects from "./src/lib/rehype-house-objects.mjs";
import rehypeTableWrap from "@/lib/rehype-table-wrap.mjs";

const site = process.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";
const prelaunch = process.env.SITE_PRELAUNCH !== "false";

export default defineConfig({
  site,
  output: "static",
  adapter: vercel(),
  server: { port: 3000, host: "0.0.0.0" },
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
    rehypePlugins: [rehypeKatex, rehypeResearchFigure, rehypeHouseObjects, rehypeTableWrap],
    shikiConfig: {
      theme: "github-light-default",
      wrap: true
    }
  },
  compressHTML: true
});

export { prelaunch };
