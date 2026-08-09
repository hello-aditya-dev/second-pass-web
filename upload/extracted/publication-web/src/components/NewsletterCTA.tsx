import Link from "next/link";

export function NewsletterCTA() {
  return (
    <section className="newsletter-cta" aria-labelledby="newsletter-title">
      <div>
        <div className="eyebrow">The briefing</div>
        <h2 id="newsletter-title">Technical developments worth understanding.</h2>
      </div>
      <p>
        The eventual newsletter will compress the strongest engineering stories, charts, and
        research into one useful briefing. No provider is connected in this foundation.
      </p>
      <Link className="button" href="/newsletter">
        Join the pre-launch list
      </Link>
    </section>
  );
}
