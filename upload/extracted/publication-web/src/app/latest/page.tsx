import { StoryCard } from "@/components/StoryCard";
import { articles } from "@/lib/content";

export const metadata = {
  title: "Latest",
  description: "All seed stories currently present in the public foundation."
};

export default function Page() {
  return (
    <div className="shell route-page">
      <div className="route-heading">
        <div className="eyebrow">Section</div>
        <h1>Latest</h1>
        <p>All seed stories currently present in the public foundation.</p>
      </div>
      <div className="article-list">
        {articles.map((article) => (
          <StoryCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
