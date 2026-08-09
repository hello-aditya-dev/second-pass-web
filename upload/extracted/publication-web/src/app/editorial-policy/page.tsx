export const metadata = {
  title: "Editorial Policy",
  description: "Editorial standards for HexFallow."
};

export default function EditorialPolicyPage() {
  return (
    <div className="shell route-page narrow-page prose-page">
      <div className="eyebrow">Trust</div>
      <h1>Editorial policy</h1>
      <p>
        Accuracy, relevance, evidence quality, and information gain take priority over publishing
        volume.
      </p>
      <h2>Sources</h2>
      <p>
        Primary sources are preferred for material technical claims. Vendor claims are attributed
        as vendor claims. Independent evidence is distinguished from interested-party evidence.
      </p>
      <h2>AI</h2>
      <p>
        AI can assist newsroom work, but the publication does not invent reporters, interviews,
        first-hand testing, benchmarks, quotations, or sources.
      </p>
      <h2>Sponsorship</h2>
      <p>
        Sponsored material must be clearly labeled. Advertising does not purchase editorial
        conclusions.
      </p>
    </div>
  );
}
