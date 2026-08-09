import Link from "next/link";
import type { DataModule } from "@/lib/types";

export function DataCard({ item, index }: { item: DataModule; index: number }) {
  return (
    <Link className="data-card" href={item.href}>
      <div className="data-card-top">
        <span>0{index + 1}</span>
        <span>{item.status}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="data-link">Open module →</span>
    </Link>
  );
}
