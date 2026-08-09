import type { Article, DataModule, Section } from "@/lib/types";

export const articles: Article[] = [
  {
    slug: "demo-memory-bandwidth-is-the-story",
    title: "Demo: Peak compute is rarely the whole accelerator story",
    dek:
      "A demonstration article showing how the publication will separate headline specifications from the bottlenecks that determine real systems behavior.",
    section: "Compute",
    format: "Breakdown",
    author: "HexFallow Editorial",
    publishedAt: "2026-08-09T04:30:00.000Z",
    readingMinutes: 5,
    featured: true,
    demo: true,
    body: [
      {
        type: "callout",
        label: "Demonstration content",
        text:
          "This is product seed copy, not current reporting. Replace it with human-approved newsroom content before public launch."
      },
      {
        type: "paragraph",
        text:
          "Technical products are easy to describe with a single large number. Real systems are harder. An accelerator can add arithmetic throughput while application performance remains constrained by memory capacity, memory bandwidth, communication, utilization, software maturity, or workload shape."
      },
      {
        type: "heading",
        text: "The comparison has to start with the bottleneck"
      },
      {
        type: "paragraph",
        text:
          "A useful analysis therefore asks what resource limited the previous system, whether the new design changes that constraint, and under which workload assumptions. That is more informative than repeating a vendor's peak number without context."
      },
      {
        type: "table",
        columns: ["Question", "Weak coverage", "HexFallow standard"],
        rows: [
          ["Performance", "Repeat peak figure", "Match metric to workload"],
          ["Benchmark", "Quote ratio", "Record test conditions"],
          ["Cost", "Use list price only", "State utilization and operating assumptions"],
          ["Conclusion", "Declare a winner", "Preserve constraints and uncertainty"]
        ]
      },
      {
        type: "heading",
        text: "Evidence determines the headline"
      },
      {
        type: "paragraph",
        text:
          "The newsroom workflow is designed so that the article is written after research and verification. If the evidence does not support a strong conclusion, the headline should become narrower rather than the evidence being stretched."
      }
    ],
    sources: [
      {
        label: "No external sources",
        note: "Demonstration content only."
      }
    ]
  },
  {
    slug: "demo-api-price-is-not-total-inference-cost",
    title: "Demo: API token price is not the same thing as inference economics",
    dek:
      "A seed analysis module demonstrating how price, caching, latency, throughput, and workload shape belong in one comparison.",
    section: "AI",
    format: "Deep Dive",
    author: "HexFallow Editorial",
    publishedAt: "2026-08-08T09:00:00.000Z",
    readingMinutes: 7,
    demo: true,
    body: [
      {
        type: "callout",
        label: "Demonstration content",
        text:
          "All examples are conceptual. No live provider price is asserted in this seed article."
      },
      {
        type: "paragraph",
        text:
          "A model's nominal input and output token prices are only two variables in a production cost model. Cached-input rules, batching, latency targets, output length, retry rates, tool use, and provider-specific billing semantics can all change the useful comparison."
      },
      {
        type: "heading",
        text: "Price tables need context"
      },
      {
        type: "paragraph",
        text:
          "The future HexFallow pricing tracker is intended to preserve effective dates and source URLs so a historical article does not silently inherit today's prices."
      }
    ]
  },
  {
    slug: "demo-security-severity-is-not-exploitation",
    title: "Demo: A severe vulnerability is not automatically an exploited vulnerability",
    dek:
      "Severity, exploitability, public proof of concept, and observed exploitation are separate claims and should be sourced separately.",
    section: "Security",
    format: "Explainer",
    author: "HexFallow Editorial",
    publishedAt: "2026-08-07T13:00:00.000Z",
    readingMinutes: 4,
    demo: true,
    body: [
      {
        type: "callout",
        label: "Demonstration content",
        text: "This page contains no live vulnerability advisory."
      },
      {
        type: "paragraph",
        text:
          "Security reporting becomes misleading when several different states are compressed into the phrase 'actively exploited.' A publication should identify where each claim comes from and update the story when exploitation evidence changes."
      }
    ]
  },
  {
    slug: "demo-release-notes-beat-marketing-copy",
    title: "Demo: Release notes often contain the more useful cloud story",
    dek:
      "Marketing announces the capability. Documentation tells engineers where the constraints live.",
    section: "Infrastructure",
    format: "Signal",
    author: "HexFallow Editorial",
    publishedAt: "2026-08-06T10:00:00.000Z",
    readingMinutes: 3,
    demo: true,
    body: [
      {
        type: "callout",
        label: "Demonstration content",
        text: "This is a template story, not a report on a current cloud release."
      },
      {
        type: "paragraph",
        text:
          "A credible infrastructure story should read the release note, documentation, limits, regional availability, and pricing conditions before turning an announcement into operational advice."
      }
    ]
  },
  {
    slug: "demo-reading-a-paper-past-the-abstract",
    title: "Demo: The abstract is where paper reporting starts, not where it ends",
    dek:
      "Dataset choice, baselines, evaluator design, and ablations determine how much a research headline can actually claim.",
    section: "Research",
    format: "Explainer",
    author: "HexFallow Editorial",
    publishedAt: "2026-08-05T08:30:00.000Z",
    readingMinutes: 5,
    demo: true,
    body: [
      {
        type: "callout",
        label: "Demonstration content",
        text: "No specific paper is being summarized here."
      },
      {
        type: "paragraph",
        text:
          "Research coverage should inspect methodology when methodology determines the result. A strong-looking score can depend on baseline selection, contamination, prompting, judge models, or a narrow task definition."
      }
    ]
  }
];

export const dataModules: DataModule[] = [
  {
    title: "LLM Pricing Index",
    description:
      "Source-backed model API pricing with effective dates, cache rules, and provider conditions.",
    status: "Foundation",
    href: "/data#llm-pricing"
  },
  {
    title: "Accelerator Index",
    description:
      "GPU and accelerator specifications designed for architecture-level comparisons.",
    status: "Foundation",
    href: "/data#accelerators"
  },
  {
    title: "Benchmark Registry",
    description:
      "Results that preserve workload, hardware, precision, methodology, and who ran the test.",
    status: "Foundation",
    href: "/data#benchmarks"
  }
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesBySection(section: Section) {
  return articles.filter((article) => article.section === section);
}
