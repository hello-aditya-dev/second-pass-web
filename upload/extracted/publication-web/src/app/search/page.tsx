export const metadata = {
  title: "Search",
  description: "Search the HexFallow publication."
};

export default function SearchPage() {
  return (
    <div className="shell route-page narrow-page">
      <div className="route-heading">
        <div className="eyebrow">Search</div>
        <h1>Search the publication.</h1>
        <p>
          Search infrastructure is intentionally not connected in the foundation. Choose the
          implementation after the real content store is selected.
        </p>
      </div>
      <form className="search-demo" role="search">
        <label htmlFor="q">Search query</label>
        <div>
          <input id="q" name="q" placeholder="GPU memory, inference, CVE…" disabled />
          <button className="button" type="button" disabled>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
