export type Section =
  | "AI"
  | "Compute"
  | "Infrastructure"
  | "Security"
  | "Research"
  | "Data";

export type ArticleFormat =
  | "Signal"
  | "Breakdown"
  | "Deep Dive"
  | "Explainer"
  | "Data";

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "callout"; label: string; text: string }
  | {
      type: "table";
      columns: string[];
      rows: string[][];
    };

export type PublicSource = {
  label: string;
  url?: string;
  note?: string;
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  section: Section;
  format: ArticleFormat;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  readingMinutes: number;
  featured?: boolean;
  demo: true;
  body: ArticleBlock[];
  sources?: PublicSource[];
};

export type DataModule = {
  title: string;
  description: string;
  status: "Foundation" | "Planned";
  href: string;
};
