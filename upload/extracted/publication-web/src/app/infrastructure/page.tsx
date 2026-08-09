import { StoryCard } from "@/components/StoryCard";
import { getArticlesBySection } from "@/lib/content";

export const metadata = {
  title: "Infrastructure",
  description: "Cloud, databases, distributed systems, observability, networking, and production platforms."
};

export default function Page() {
  const items = getArticlesBySection("Infrastructure");
  return (
    <div className="shell route-page">
      <div className="route-heading">
        <div className="eyebrow">Section</div>
        <h1>Infrastructure</h1>
        <p>Cloud, databases, distributed systems, observability, networking, and production platforms.</p>
      </div>
      {items.length > 0 ? (
        <div className="article-list">
          {items.map((article) => (
            <StoryCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>No approved stories yet.</strong>
          <p>This section will populate from the newsroom after human approval.</p>
        </div>
      )}
    </div>
  );
}
