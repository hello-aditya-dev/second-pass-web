import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

export function LeadStory({ article }: { article: Article }) {
  return (
    <article className="lead-story">
      <div className="lead-art" aria-hidden="true">
        <div className="lead-grid" />
        <span>DEMO / FOUNDATION</span>
      </div>
      <div className="lead-copy">
        <div className="eyebrow">
          {article.section} / {article.format}
        </div>
        <h1>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h1>
        <p>{article.dek}</p>
        <div className="story-byline">
          {article.author} · {formatDate(article.publishedAt)} · {article.readingMinutes} min
        </div>
      </div>
    </article>
  );
}
