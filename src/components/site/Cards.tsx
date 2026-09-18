import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { ProjectTile } from "./Visuals";
import { formatDate } from "@/lib/utils";
import { splitList } from "@/lib/queries";
import { getService } from "@/lib/services";

export type PostCardData = { slug: string; title: string; excerpt: string; coverImage?: string | null; coverAlt?: string | null; category?: string | null; publishedAt?: Date | null; readingMinutes: number };
export type ProjectCardData = { slug: string; title: string; client: string; industry?: string | null; location?: string | null; services?: string | null; summary: string; coverImage?: string | null; coverAlt?: string | null; accentColor?: string | null; results?: string | null };

export function PostCard({ p, featured }: { p: PostCardData; featured?: boolean }) {
  return (
    <article className={`group glass flex h-full flex-col overflow-hidden rounded-glass transition-all duration-500 hover:-translate-y-1 hover:shadow-float ${featured ? "md:col-span-2 md:flex-row" : ""}`}>
      <Link href={`/blog/${p.slug}`} className={`block overflow-hidden ${featured ? "md:w-1/2" : ""}`} aria-hidden="true" tabIndex={-1}>
        {p.coverImage ? (
          <img src={p.coverImage} alt={p.coverAlt ?? p.title} className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
        ) : (
          <ProjectTile seed={p.slug} className="aspect-[16/10] h-full w-full" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center gap-3 text-[12px] font-medium text-slate">
          {p.category && <span className="rounded-full bg-gold-pale px-2.5 py-1 text-gold-deep">{p.category}</span>}
          <span>{formatDate(p.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {p.readingMinutes} min</span>
        </div>
        <h3 className={`mt-4 font-display font-semibold tracking-tight text-ink ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
          <Link href={`/blog/${p.slug}`} className="transition-colors group-hover:text-gold-deep">{p.title}</Link>
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-7 text-slate">{p.excerpt}</p>
        <Link href={`/blog/${p.slug}`} className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-ink transition-colors hover:text-gold-deep">
          Read article <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export function ProjectCard({ p, large }: { p: ProjectCardData; large?: boolean }) {
  const svc = splitList(p.services).map((s) => getService(s)?.shortName ?? s);
  const results = (() => {
    try {
      return p.results ? (JSON.parse(p.results) as { label: string; value: string }[]) : [];
    } catch {
      return [];
    }
  })();
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-glass glass transition-all duration-500 hover:-translate-y-1 hover:shadow-float">
      <Link href={`/projects/${p.slug}`} className="block overflow-hidden" aria-hidden="true" tabIndex={-1}>
        {p.coverImage ? (
          <img src={p.coverImage} alt={p.coverAlt ?? p.title} className={`${large ? "aspect-[16/9]" : "aspect-[4/3]"} w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]`} loading="lazy" />
        ) : (
          <ProjectTile seed={p.slug} accent={p.accentColor ?? undefined} className={`${large ? "aspect-[16/9]" : "aspect-[4/3]"} w-full`} title={p.client} />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap gap-2 text-[12px] font-medium">
          {svc.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-gold-pale px-2.5 py-1 text-gold-deep">{s}</span>
          ))}
          {p.industry && <span className="rounded-full bg-ink/5 px-2.5 py-1 text-graphite">{p.industry}</span>}
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
          <Link href={`/projects/${p.slug}`} className="transition-colors group-hover:text-gold-deep">{p.title}</Link>
        </h3>
        <p className="mt-1 text-[13px] text-slate">{p.client}{p.location ? ` · ${p.location}` : ""}</p>
        <p className="mt-3 flex-1 text-[15px] leading-7 text-slate">{p.summary}</p>
        {results.length > 0 && (
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5">
            {results.slice(0, 3).map((r) => (
              <div key={r.label}>
                <dt className="text-[11px] uppercase tracking-wider text-slate">{r.label}</dt>
                <dd className="font-display text-lg font-semibold text-gold-gradient">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
