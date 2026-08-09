export const metadata = {
  title: "About",
  description: "About the HexFallow technical publication."
};

export default function AboutPage() {
  return (
    <div className="shell route-page narrow-page prose-page">
      <div className="eyebrow">About</div>
      <h1>Technical intelligence for people who need the mechanism, not the marketing.</h1>
      <p>
        HexFallow is the working name for an independent technical publication covering AI systems,
        compute, semiconductors, infrastructure, security, and original technical data.
      </p>
      <p>
        The publication is being designed around primary-source research, explicit uncertainty,
        technical comparisons, reproducible calculations, and human editorial approval.
      </p>
      <h2>AI assistance</h2>
      <p>
        AI may assist the private newsroom with discovery, research organization, verification
        support, drafting, and editing. It does not remove editorial accountability and is not used
        as permission to fabricate facts, people, tests, or reporting.
      </p>
    </div>
  );
}
