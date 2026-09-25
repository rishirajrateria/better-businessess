import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCard } from "@/components/site/Cards";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { Section } from "@/components/ui/Section";
import { getPublishedPosts, getPostCategories, countPublishedPosts } from "@/lib/queries";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const PAGE_SIZE = 24;
export const blogTitle = "Blog: SEO & Marketing Guides for Canada";
export const blogDescription = `Practical guides on lead generation, SEO, AI search, website performance and branding from the ${site.name} team.`;
export const blogPagePath = (n: number) => (n <= 1 ? "/blog" : `/blog/page/${n}`);

/**
 * Shared blog index. Page 1 lives at /blog; later pages at /blog/page/N with their own canonical
 * URL so every article stays within two clicks of the index. Category and search views are
 * unpaginated filters of /blog (they canonicalise to /blog).
 */
export async function BlogListing({ page = 1, category, q }: { page?: number; category?: string; q?: string }) {
  const filtered = Boolean(category || q);
  const [posts, categories, total] = await Promise.all([
    getPublishedPosts(filtered ? { category, q } : { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    getPostCategories(),
    filtered ? Promise.resolve(0) : countPublishedPosts(),
  ]);
  const pages = filtered ? 1 : Math.max(1, Math.ceil(total / PAGE_SIZE));
  const path = blogPagePath(page);
  const crumbs = page > 1 ? [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: `Page ${page}`, path }] : [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }];
  const showFeatured = page === 1 && !filtered;
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: page > 1 ? `${blogTitle} – Page ${page}` : blogTitle, description: blogDescription, type: "CollectionPage" }), breadcrumbSchema(crumbs), { "@type": "Blog", "@id": `${site.url}/blog#blog`, name: `${site.name} Blog`, url: `${site.url}/blog`, publisher: { "@id": `${site.url}/#organization` } })} />
      <PageHero compact eyebrow={page > 1 ? `Insights · Page ${page} of ${pages}` : "Insights"} breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Growth playbooks for <span className="text-gold-gradient">Canadian businesses.</span></>} subtitle="Practical, tested advice on lead generation, SEO, AI search, web performance and branding." />
      <Section size="sm">
        <div className="mb-8 flex flex-wrap items-center gap-2" data-reveal>
          <Link href="/blog" className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium transition-all", !category ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>All</Link>
          {categories.map((c) => (
            <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium transition-all", category === c ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>{c}</Link>
          ))}
          <form action="/blog" className="ml-auto">
            <input name="q" defaultValue={q} placeholder="Search articles…" className="glass-pill h-10 w-56 rounded-full px-4 text-[14px] outline-none placeholder:text-mist focus:ring-2 focus:ring-gold/40" aria-label="Search articles" />
          </form>
        </div>
        <h2 className="sr-only">{page > 1 ? `Articles, page ${page}` : "All articles"}</h2>
        {posts.length === 0 ? (
          <div className="glass rounded-glass p-12 text-center" data-reveal>
            <p className="font-display text-2xl font-semibold text-ink">No articles yet{q ? ` for “${q}”` : ""}.</p>
            <p className="mt-2 text-slate">New insights are published regularly. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={(i % 3) * 80} className={i === 0 && showFeatured ? "md:col-span-2 lg:col-span-3" : ""}>
                <PostCard p={p} featured={i === 0 && showFeatured} />
              </div>
            ))}
          </div>
        )}
        {pages > 1 && (
          <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pages">
            {page > 1 ? (
              <Link href={blogPagePath(page - 1)} className="glass-pill inline-flex h-10 items-center gap-1 rounded-full px-4 text-[14px] font-medium text-graphite hover:text-ink"><ChevronLeft size={16} /> Newer</Link>
            ) : (
              <span className="inline-flex h-10 items-center gap-1 rounded-full px-4 text-[14px] text-mist"><ChevronLeft size={16} /> Newer</span>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link key={n} href={blogPagePath(n)} aria-current={n === page ? "page" : undefined} className={cn("inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[14px] font-medium", n === page ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>{n}</Link>
            ))}
            {page < pages ? (
              <Link href={blogPagePath(page + 1)} className="glass-pill inline-flex h-10 items-center gap-1 rounded-full px-4 text-[14px] font-medium text-graphite hover:text-ink">Older <ChevronRight size={16} /></Link>
            ) : (
              <span className="inline-flex h-10 items-center gap-1 rounded-full px-4 text-[14px] text-mist">Older <ChevronRight size={16} /></span>
            )}
          </nav>
        )}
      </Section>
      <CtaBanner />
    </>
  );
}
