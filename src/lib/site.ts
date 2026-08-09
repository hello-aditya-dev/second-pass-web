export const SITE = {
  name: "SECOND / PASS",
  plainName: "Second Pass",
  description:
    "Technical intelligence on AI, compute, systems, security, research, and the consequences beneath the first headline.",
  tagline:
    "The first pass tells you what happened. The second pass tells you what it means.",
  topics: [
    { label: "NOW", href: "/now" },
    { label: "AI", href: "/ai" },
    { label: "COMPUTE", href: "/compute" },
    { label: "SYSTEMS", href: "/systems" },
    { label: "SECURITY", href: "/security" },
    { label: "RESEARCH", href: "/research" },
    { label: "DATA", href: "/data" }
  ]
} as const;

export const siteUrl = () =>
  import.meta.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";
