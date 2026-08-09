import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="shell masthead">
          <Link className="brand" href="/" aria-label={`${site.name} home`}>
            <span className="brand-mark" aria-hidden="true">
              H
            </span>
            <span>{site.name}</span>
          </Link>

          <nav className="primary-nav" aria-label="Primary navigation">
            {site.sections.map((section) => (
              <Link key={section.href} href={section.href}>
                {section.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/search">Search</Link>
            <Link className="button button-small" href="/newsletter">
              Subscribe
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
