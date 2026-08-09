import { StoryCard } from "@/components/StoryCard";
import { getArticlesBySection } from "@/lib/content";

export const metadata = {
  title: "Compute",
  description: "Accelerators, memory, networking, silicon, and data-center compute."
};

export default function Page() {
  const items = getArticlesBySection("Compute");
  return (
    <div className="shell route-page">
      <div className="route-heading">
        <div className="eyebrow">Section</div>
        <h1>Compute</h1>
        <p>Accelerators, memory, networking, silicon, and data-center compute.</p>
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
