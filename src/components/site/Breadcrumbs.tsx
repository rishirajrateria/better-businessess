import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, dark }: { items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${dark ? "text-paper/60" : "text-slate"}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={dark ? "text-paper" : "text-ink"}>{c.name}</span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-gold-deep">{c.name}</Link>
              )}
              {!last && <ChevronRight size={14} className="opacity-50" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
