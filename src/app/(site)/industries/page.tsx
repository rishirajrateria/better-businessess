import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { KeyFacts } from "@/components/site/KeyFacts";
import { ServicesGrid } from "@/components/site/Sections";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getPublishedPosts } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 300;
const title = "Industries We Serve in Canada";
const description = `Marketing guides for Canadian trades, healthcare, professional services, hospitality, retail and more. See how ${site.name} grows your industry.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/industries" });

/** Map a guide to a sector by keywords in its slug/title so the hub groups sensibly. */
const sectors: { name: string; match: RegExp }[] = [
  { name: "Trades and home services", match: /plumb|hvac|electric|roof|renovat|contractor|paint|clean|pest|mov|tree|landscap|snow|pool|hot-tub|solar|heat-pump|home-services/ },
  { name: "Health and wellness", match: /dental|dentist|physio|chiro|therap|counsel|massage|optom|veterin|vet-|medical-spa|aesthetic|gym|fitness|salon|barber|home-care|senior/ },
  { name: "Professional and financial services", match: /law|legal|account|cpa|bookkeep|mortgage|insurance|financial|immigration|it-services|msp|staffing|recruit|coach|consult|property-management/ },
  { name: "Real estate and construction", match: /real-estate|realtor|property|construction|manufactur|industrial|trucking|logistics/ },
  { name: "Retail, hospitality and consumer", match: /restaurant|retail|ecommerce|e-commerce|hotel|tourism|hospitality|wedding|event|car-dealer|auto|cannabis|brewer|winer|pet|daycare|childcare|tutoring|education|funeral|nonprofit|charity|saas|startup/ },
];

export default async function IndustriesPage() {
  const posts = await getPublishedPosts({ category: "Industry Guides" });
  // First matching sector wins, so a guide never appears twice.
  const claimed = new Set<string>();
  const grouped = sectors.map((s) => {
    const group = posts.filter((p) => !claimed.has(p.id) && s.match.test(`${p.slug} ${p.title}`.toLowerCase()));
    group.forEach((p) => claimed.add(p.id));
    return { ...s, posts: group };
  });
  const other = posts.filter((p) => !claimed.has(p.id));
  if (other.length) grouped.push({ name: "More industries", match: /./, posts: other });
  const crumbs = [{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }];

  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/industries", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs), { "@type": "ItemList", itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `${site.url}/blog/${p.slug}` })) })} />
      <PageHero eyebrow="Industries" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Marketing that understands <span className="text-gold-gradient">your industry.</span></>} subtitle="Every sector has its own buyers, regulators, seasonality and review platforms. Our industry guides show exactly how businesses like yours get found and chosen across Canada." />
      <Section size="sm">
        <KeyFacts facts={[`${site.name} provides lead generation, SEO, website development and branding to businesses in ${posts.length || "dozens of"} industries across Canada.`, "Each guide covers how customers choose a provider, the advertising and professional-conduct rules that apply in Canada, cost benchmarks in CAD, seasonality and a 90-day plan.", `Contact ${site.email} for an industry-specific growth audit.`]} />
      </Section>
      {grouped.filter((g) => g.posts.length).map((g) => (
        <Section key={g.name} size="sm">
          <SectionHeader eyebrow="Industry guides" title={g.name} align="left" className="mb-6" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.posts.sort((a, b) => a.title.localeCompare(b.title)).map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} prefetch={false} className="group glass flex h-full items-start justify-between gap-3 rounded-glass p-5 transition-all hover:-translate-y-0.5 hover:shadow-float">
                  <span>
                    <span className="block font-display text-[16px] font-semibold leading-snug tracking-tight text-ink">{p.title}</span>
                    <span className="mt-2 block text-[13.5px] leading-6 text-slate">{p.excerpt}</span>
                  </span>
                  <ArrowUpRight size={16} className="mt-1 shrink-0 text-mist group-hover:text-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
      {posts.length === 0 && (
        <Section size="sm">
          <div className="glass rounded-glass p-12 text-center"><p className="font-display text-2xl font-semibold text-ink">Industry guides are on their way.</p><p className="mt-2 text-slate">In the meantime, <Link href="/contact" className="font-semibold text-gold-deep">tell us about your industry</Link> and we will share relevant results.</p></div>
        </Section>
      )}
      <ServicesGrid eyebrow="Services" title={<>The same four services, <span className="text-gold-gradient">tuned to your sector.</span></>} />
      <CtaBanner title={<>Want a plan built for <span className="text-gold-light">your industry?</span></>} subtitle="Book a free strategy call. We will review your market, your competitors and the rules that apply to you." />
    </>
  );
}
