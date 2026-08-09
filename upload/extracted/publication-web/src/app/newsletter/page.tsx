export const metadata = {
  title: "Newsletter",
  description: "The HexFallow technical briefing."
};

export default function NewsletterPage() {
  return (
    <div className="shell route-page narrow-page">
      <div className="route-heading">
        <div className="eyebrow">Newsletter</div>
        <h1>The engineering story behind the headline.</h1>
        <p>
          The newsletter provider has not been selected. This route defines the product without
          collecting email addresses prematurely.
        </p>
      </div>
      <div className="method-box">
        <h2>Planned briefing</h2>
        <ul className="plain-list">
          <li>One consequential development</li>
          <li>Three technical signals</li>
          <li>One chart or data update</li>
          <li>One deep read worth the time</li>
        </ul>
      </div>
    </div>
  );
}
