import { StoryCard } from "@/components/StoryCard";
import { getArticlesBySection } from "@/lib/content";

export const metadata = {
  title: "AI",
  description: "Models, inference, training, APIs, agents, evaluations, and AI systems."
};

export default function Page() {
  const items = getArticlesBySection("AI");
  return (
    <div className="shell route-page">
      <div className="route-heading">
        <div className="eyebrow">Section</div>
        <h1>AI</h1>
        <p>Models, inference, training, APIs, agents, evaluations, and AI systems.</p>
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
