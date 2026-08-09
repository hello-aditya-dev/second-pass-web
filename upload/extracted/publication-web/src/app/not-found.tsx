import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell route-page narrow-page">
      <div className="eyebrow">404</div>
      <h1>That page is not in the stack.</h1>
      <p>The route may have moved or may not have been published yet.</p>
      <Link className="button" href="/">
        Return home
      </Link>
    </div>
  );
}
