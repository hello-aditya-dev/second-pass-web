import { StoryCard } from "@/components/StoryCard";
import { getArticlesBySection } from "@/lib/content";

export const metadata = {
  title: "Security",
  description: "Security reporting that separates severity, exploitability, and observed exploitation."
};

export default function Page() {
  const items = getArticlesBySection("Security");
  return (
    <div className="shell route-page">
      <div className="route-heading">
        <div className="eyebrow">Section</div>
        <h1>Security</h1>
        <p>Security reporting that separates severity, exploitability, and observed exploitation.</p>
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
