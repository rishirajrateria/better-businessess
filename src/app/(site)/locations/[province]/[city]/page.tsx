import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CityLinks, ServicesGrid, InlineCta } from "@/components/site/Sections";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { KeyFacts } from "@/components/site/KeyFacts";
import { ContactForm } from "@/components/site/ContactForm";
import { TestimonialsSection } from "@/components/site/Testimonials";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cities, getCity, getProvince, isCityIndexable } from "@/lib/locations";
import { coreServices, subServices } from "@/lib/services";
import { cityHubContent } from "@/lib/content";
import { getTestimonials } from "@/lib/queries";
import { getRelatedGuides } from "@/lib/related-guides";
import { RelatedGuides } from "@/components/site/RelatedGuides";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, placeSchema, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 86400;
export function generateStaticParams() {
  return cities.map((c) => ({ province: c.province, city: c.slug }));
}
type Props = { params: Promise<{ province: string; city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { province, city } = await params;
  const c = getCity(city);
  if (!c || c.province !== province) return {};
  const content = cityHubContent(c);
  return buildMetadata({ title: content.title, description: content.description, path: `/locations/${province}/${city}`, noIndex: !isCityIndexable(c) });
}

export default async function CityPage({ params }: Props) {
  const { province, city } = await params;
  const c = getCity(city);
  const p = getProvince(province);
  if (!c || !p || c.province !== p.slug) notFound();
  const content = cityHubContent(c);
  const path = `/locations/${p.slug}/${c.slug}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: p.name, path: `/locations/${p.slug}` }, { name: c.name, path }];
  const [testimonials, guides] = await Promise.all([getTestimonials({ limit: 3 }), getRelatedGuides({ city: c })]);
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: content.title, description: content.description }), placeSchema(c, p), breadcrumbSchema(crumbs), faqSchema(content.faqs))} />
      <PageHero eyebrow={`${c.name}, ${p.code}`} breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Digital marketing agency in <span className="text-gold-gradient">{c.name}.</span></>} subtitle={content.intro[0]} />
      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 text-[17px] leading-8 text-graphite lg:col-span-7" data-reveal>
            <p>{content.intro[1]}</p>
            <div className="glass rounded-glass p-6">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep"><MapPin size={14} /> Areas we serve in {c.name}</p>
              <p className="mt-2 text-[15px] text-graphite">{c.areas.join(" · ")}</p>
            </div>
          </div>
          <div className="lg:col-span-5" data-reveal data-reveal-delay={100}><KeyFacts facts={content.keyFacts} /></div>
        </div>
      </Section>
      <ServicesGrid eyebrow={`Services in ${c.name}`} title={<>What we do for <span className="text-gold-gradient">{c.name} businesses.</span></>} subtitle={`Each service has a dedicated ${c.name} page with local insight, pricing guidance and FAQs.`} locationName={c.name} hrefFor={(s) => `/services/${s.slug}/${p.slug}/${c.slug}`} />
      <Section tone="cream" size="sm">
        <SectionHeader eyebrow="Specialties" title={<>More ways we help in <span className="text-gold-gradient">{c.name}.</span></>} align="left" className="mb-6" />
        <div className="flex flex-wrap gap-2" data-reveal>
          {subServices.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-2 text-[13.5px] font-medium text-graphite ring-1 ring-ink/5 transition-all hover:-translate-y-0.5 hover:text-ink">
              {s.name} <ArrowUpRight size={13} className="text-gold" />
            </Link>
          ))}
        </div>
        <InlineCta text={`Ready to grow in ${c.name}?`} cta="Get a free audit" />
      </Section>
      <CityLinks cities={content.nearby} hrefFor={(ci) => `/locations/${ci.province}/${ci.slug}`} title={<>Also serving communities <span className="text-gold-gradient">near {c.name}.</span></>} eyebrow="Nearby" columns={3} />
      <RelatedGuides guides={guides} title={<>Marketing guides for <span className="text-gold-gradient">{c.name} businesses.</span></>} subtitle={`Playbooks chosen for ${c.name}'s leading sectors: ${c.industries.slice(0, 3).join(", ").toLowerCase()}.`} />
      <TestimonialsSection items={testimonials} />
      <Section size="sm">
        <SectionHeader eyebrow="FAQ" title={<>{c.name} <span className="text-gold-gradient">questions.</span></>} align="left" className="mb-8" />
        <FaqAccordion faqs={content.faqs} />
        <div className="mt-6 flex flex-wrap gap-2">
          {coreServices.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}/${p.slug}/${c.slug}`} className="glass-pill rounded-full px-4 py-2 text-[13.5px] font-medium text-graphite hover:text-ink">{s.name} in {c.name}</Link>
          ))}
          <Link href={`/locations/${p.slug}`} className="glass-pill rounded-full px-4 py-2 text-[13.5px] font-medium text-graphite hover:text-ink">All of {p.name}</Link>
        </div>
      </Section>
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">Let&apos;s grow your {c.name} business.</h2>
            <p className="mt-5 text-lg leading-8 text-paper/70">Free audit of your website, rankings, ads and brand. Fixed pricing. Reply within one business day.</p>
            {site.phone && <p className="mt-6 text-paper/60">Or call <a href={site.phoneHref} className="font-semibold text-gold-light" data-track="phone_click">{site.phone}</a></p>}
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay={100}><ContactForm dark defaultCity={`${c.name}, ${p.code}`} /></div>
        </div>
      </Section>
      <CtaBanner compact />
    </>
  );
}
