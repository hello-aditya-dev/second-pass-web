import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand">{site.name}</div>
          <p>{site.tagline}</p>
        </div>
        <nav aria-label="Publication">
          <strong>Publication</strong>
          <Link href="/about">About</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/corrections">Corrections</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <nav aria-label="Sections">
          <strong>Sections</strong>
          {site.sections.slice(1).map((section) => (
            <Link key={section.href} href={section.href}>
              {section.label}
            </Link>
          ))}
        </nav>
        <div className="footer-note">
          <strong>Foundation build</strong>
          <p>
            Seed content is demonstration material until replaced by human-approved newsroom work.
          </p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 {site.name}</span>
        <span>Working brand · pre-launch foundation</span>
      </div>
    </footer>
  );
}
