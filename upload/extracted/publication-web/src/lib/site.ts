export const site = {
  name: "HexFallow",
  shortName: "HexFallow",
  tagline: "Deep systems. Hard evidence.",
  description:
    "Technical intelligence on AI systems, compute, semiconductors, infrastructure, security, and original data.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  sections: [
    { label: "Latest", href: "/latest" },
    { label: "AI", href: "/ai" },
    { label: "Compute", href: "/compute" },
    { label: "Infrastructure", href: "/infrastructure" },
    { label: "Security", href: "/security" },
    { label: "Research", href: "/research" },
    { label: "Data", href: "/data" }
  ]
} as const;
