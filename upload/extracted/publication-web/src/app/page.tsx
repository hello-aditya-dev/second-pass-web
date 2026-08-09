import Link from "next/link";
import { DataCard } from "@/components/DataCard";
import { LeadStory } from "@/components/LeadStory";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { SectionHeader } from "@/components/SectionHeader";
import { StoryCard } from "@/components/StoryCard";
import { articles, dataModules } from "@/lib/content";

export default function HomePage() {
  const lead = articles.find((article) => article.featured) ?? articles[0];
  const latest = articles.filter((article) => article.slug !== lead.slug).slice(0, 4);

  return (
    <>
      <section className="shell hero-zone">
        <div className="edition-bar">
          <span>Technical intelligence / pre-launch foundation</span>
          <span>Demo content is clearly labeled</span>
        </div>
        <LeadStory article={lead} />

        <aside className="latest-rail" aria-label="Latest demonstrations">
          <div className="rail-title">
            <strong>Latest</strong>
            <Link href="/latest">All →</Link>
          </div>
          {latest.map((article) => (
            <StoryCard key={article.slug} article={article} compact />
          ))}
        </aside>
      </section>

      <section className="shell content-section">
        <SectionHeader
          title="Analysis"
          href="/latest"
          description="Technical consequences before press-release adjectives."
        />
        <div className="story-grid">
          {articles.slice(1, 4).map((article) => (
            <StoryCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="data-band">
        <div className="shell content-section">
          <SectionHeader
            title="Data desk"
            href="/data"
            description="Structured technical references designed to become return-visit products."
          />
          <div className="data-grid">
            {dataModules.map((item, index) => (
              <DataCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="shell content-section">
        <SectionHeader
          title="Research"
          href="/research"
          description="Methods, papers, benchmarks, and what their evidence can actually support."
        />
        <div className="wide-story">
          <StoryCard article={articles[4]} />
          <div className="principles-panel">
            <span className="eyebrow">Editorial standard</span>
            <h3>Research first. Headline second.</h3>
            <p>
              Real articles enter the public product only after the private newsroom completes
              sourcing, analysis, verification, editing, and human approval.
            </p>
            <Link href="/editorial-policy">Read the editorial policy →</Link>
          </div>
        </div>
      </section>

      <div className="shell">
        <NewsletterCTA />
      </div>
    </>
  );
}
