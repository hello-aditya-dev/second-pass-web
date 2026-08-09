import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { StoryCard } from "@/components/StoryCard";
import { articles, getArticle } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd } from "@/lib/schema";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.dek,
    alternates: {
      canonical: `/articles/${article.slug}`
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      images: ["/og-default.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
      images: ["/og-default.svg"]
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const related = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2);

  const jsonLd = articleJsonLd(article);

  return (
    <>
      <article className="shell article-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <header className="article-header">
          <div className="eyebrow">
            {article.section} / {article.format}
          </div>
          <h1>{article.title}</h1>
          <p className="article-dek">{article.dek}</p>
          <div className="article-info">
            <span>{article.author}</span>
            <span>Published {formatDate(article.publishedAt)}</span>
            {article.modifiedAt && <span>Updated {formatDate(article.modifiedAt)}</span>}
            <span>{article.readingMinutes} min read</span>
          </div>
        </header>

        <div className="article-layout">
          <aside className="article-side">
            <div className="demo-badge">DEMO</div>
            <p>
              Product seed content. Do not treat as current reporting.
            </p>
          </aside>

          <ArticleBody blocks={article.body} />
        </div>

        <section className="source-box" aria-labelledby="sources-title">
          <div className="eyebrow" id="sources-title">
            Sources
          </div>
          {article.sources?.map((source) => (
            <div key={source.label} className="source-row">
              <strong>{source.label}</strong>
              {source.note && <span>{source.note}</span>}
            </div>
          )) ?? <p>Public sources will appear here for real newsroom content.</p>}
        </section>

        <section className="related">
          <h2>Continue reading</h2>
          <div className="story-grid two">
            {related.map((item) => (
              <StoryCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      </article>

      <div className="shell">
        <NewsletterCTA />
      </div>
    </>
  );
}
