import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCard } from "@/components/site/Cards";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { Section } from "@/components/ui/Section";
import { getPublishedPosts, getPostCategories } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const revalidate = 60;
const title = "Blog | Digital Marketing, SEO & Growth Insights for Canadian Businesses";
const description = `Practical guides on lead generation, SEO, AI search, website performance and branding from the ${site.name} team.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/blog" });

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const sp = await searchParams;
  const [posts, categories] = await Promise.all([getPublishedPosts({ category: sp.category, q: sp.q }), getPostCategories()]);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }];
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/blog", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs), { "@type": "Blog", name: `${site.name} Blog`, url: `${site.url}/blog`, publisher: { "@id": `${site.url}/#organization` } })} />
      <PageHero compact eyebrow="Insights" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Growth playbooks for <span className="text-gold-gradient">Canadian businesses.</span></>} subtitle="Practical, tested advice on lead generation, SEO, AI search, web performance and branding." />
      <Section size="sm">
        <div className="mb-8 flex flex-wrap items-center gap-2" data-reveal>
          <Link href="/blog" className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium transition-all", !sp.category ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>All</Link>
          {categories.map((c) => (
            <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={cn("rounded-full px-4 py-2 text-[13.5px] font-medium transition-all", sp.category === c ? "bg-ink text-paper" : "glass-pill text-graphite hover:text-ink")}>{c}</Link>
          ))}
          <form action="/blog" className="ml-auto">
            <input name="q" defaultValue={sp.q} placeholder="Search articles…" className="glass-pill h-10 w-56 rounded-full px-4 text-[14px] outline-none placeholder:text-mist focus:ring-2 focus:ring-gold/40" aria-label="Search articles" />
          </form>
        </div>
        {posts.length === 0 ? (
          <div className="glass rounded-glass p-12 text-center" data-reveal>
            <p className="font-display text-2xl font-semibold text-ink">No articles yet{sp.q ? ` for “${sp.q}”` : ""}.</p>
            <p className="mt-2 text-slate">New insights are published regularly. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={(i % 3) * 80} className={i === 0 && !sp.category && !sp.q ? "md:col-span-2 lg:col-span-3" : ""}>
                <PostCard p={p} featured={i === 0 && !sp.category && !sp.q} />
              </div>
            ))}
          </div>
        )}
      </Section>
      <CtaBanner />
    </>
  );
}
