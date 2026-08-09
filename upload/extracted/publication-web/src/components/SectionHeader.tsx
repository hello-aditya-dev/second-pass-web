import Link from "next/link";

export function SectionHeader({
  title,
  href,
  description
}: {
  title: string;
  href?: string;
  description?: string;
}) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && <Link href={href}>View all →</Link>}
    </div>
  );
}
