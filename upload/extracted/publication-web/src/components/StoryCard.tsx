import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

export function StoryCard({
  article,
  compact = false
}: {
  article: Article;
  compact?: boolean;
}) {
  return (
    <article className={compact ? "story-card compact" : "story-card"}>
      <div className="story-meta">
        <span>{article.section}</span>
        <span>{article.format}</span>
      </div>
      <h3>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      {!compact && <p>{article.dek}</p>}
      <div className="story-byline">
        {formatDate(article.publishedAt)} · {article.readingMinutes} min
      </div>
    </article>
  );
}
