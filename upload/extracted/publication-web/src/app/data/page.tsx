import { DataCard } from "@/components/DataCard";
import { dataModules } from "@/lib/content";

export const metadata = {
  title: "Data",
  description: "Source-backed technical datasets and comparison tools."
};

export default function DataPage() {
  return (
    <div className="shell route-page">
      <div className="route-heading">
        <div className="eyebrow">Data desk</div>
        <h1>Reference data that keeps its assumptions attached.</h1>
        <p>
          These modules are structural previews. Live prices, specifications, and benchmark results
          will not appear until they are source-backed through the newsroom workflow.
        </p>
      </div>

      <div className="data-grid data-page-grid">
        {dataModules.map((item, index) => (
          <div id={["llm-pricing", "accelerators", "benchmarks"][index]} key={item.title}>
            <DataCard item={item} index={index} />
          </div>
        ))}
      </div>

      <section className="method-box">
        <div className="eyebrow">Data policy</div>
        <h2>No naked numbers.</h2>
        <p>
          Future datasets should preserve source, effective date, methodology, units, version, and
          important test conditions. A benchmark score without its setup is not a comparison.
        </p>
      </section>
    </div>
  );
}
