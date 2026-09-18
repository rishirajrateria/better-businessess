import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CityLinks, ServicesGrid, StatsStrip, InlineCta } from "@/components/site/Sections";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { KeyFacts } from "@/components/site/KeyFacts";
import { ContactForm } from "@/components/site/ContactForm";
import { TestimonialsSection } from "@/components/site/Testimonials";
import { Section, SectionHeader } from "@/components/ui/Section";
import { provinces, getProvince } from "@/lib/locations";
import { coreServices } from "@/lib/services";
import { provinceHubContent } from "@/lib/content";
import { getTestimonials } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, placeSchema, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 86400;
export function generateStaticParams() {
  return provinces.map((p) => ({ province: p.slug }));
}
type Props = { params: Promise<{ province: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProvince((await params).province);
  if (!p) return {};
  const c = provinceHubContent(p);
  return buildMetadata({ title: c.title, description: c.description, path: `/locations/${p.slug}` });
}

export default async function ProvincePage({ params }: Props) {
  const p = getProvince((await params).province);
  if (!p) notFound();
  const c = provinceHubContent(p);
  const path = `/locations/${p.slug}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: p.name, path }];
  const testimonials = await getTestimonials({ limit: 3 });
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: c.title, description: c.description }), placeSchema(undefined, p), breadcrumbSchema(crumbs), faqSchema(c.faqs))} />
      <PageHero eyebrow={`${p.type === "territory" ? "Territory" : "Province"} · ${p.code}`} breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Digital marketing agency in <span className="text-gold-gradient">{p.name}.</span></>} subtitle={c.intro[0]} />
      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 text-[17px] leading-8 text-graphite lg:col-span-7" data-reveal>
            <p>{c.intro[1]}</p>
            <p>{p.economy} Key industries include {p.industries.slice(0, 5).join(", ").toLowerCase()}. We adapt strategy, messaging and channel mix to each of them.</p>
            <StatsStrip className="!grid-cols-2 lg:!grid-cols-2" items={[{ label: "Population", value: p.population }, { label: "Cities with dedicated pages", value: String(c.cities.length) }]} />
          </div>
          <div className="lg:col-span-5" data-reveal data-reveal-delay={100}><KeyFacts facts={c.keyFacts} /></div>
        </div>
      </Section>
      <ServicesGrid eyebrow={`Services in ${p.name}`} title={<>Our services across <span className="text-gold-gradient">{p.name}.</span></>} subtitle={`Each service has a dedicated ${p.name} page with local insight, FAQs and pricing guidance.`} locationName={p.name} hrefFor={(s) => `/services/${s.slug}/${p.slug}`} />
      <CityLinks cities={c.cities} hrefFor={(ci) => `/locations/${p.slug}/${ci.slug}`} title={<>Cities we serve in <span className="text-gold-gradient">{p.name}.</span></>} subtitle="Local market pages with services, FAQs and nearby areas." columns={3} />
      <Section size="sm">
        <SectionHeader eyebrow="Service + city" title={<>Popular {p.name} <span className="text-gold-gradient">service pages.</span></>} align="left" className="mb-6" />
        <div className="flex flex-wrap gap-2" data-reveal>
          {c.cities.slice(0, 6).flatMap((ci) => coreServices.map((s) => (
            <Link key={`${s.slug}-${ci.slug}`} href={`/services/${s.slug}/${p.slug}/${ci.slug}`} className="inline-flex items-center gap-1 rounded-full border border-ink/5 bg-white/50 px-3.5 py-2 text-[13px] font-medium text-graphite transition-all hover:border-gold/40 hover:text-ink">
              {s.shortName} in {ci.name} <ArrowUpRight size={12} className="text-gold" />
            </Link>
          )))}
        </div>
        <InlineCta text={`Growing a business in ${p.name}? Let's talk.`} />
      </Section>
      <TestimonialsSection items={testimonials} />
      <Section size="sm">
        <SectionHeader eyebrow="FAQ" title={<>{p.name} <span className="text-gold-gradient">questions.</span></>} align="left" className="mb-8" />
        <FaqAccordion faqs={c.faqs} />
      </Section>
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">Start growing in {p.name}.</h2>
            <p className="mt-5 text-lg leading-8 text-paper/70">Free audit, fixed pricing, senior team. Reply within one business day.</p>
            {site.phone && <p className="mt-6 text-paper/60">Or call <a href={site.phoneHref} className="font-semibold text-gold-light" data-track="phone_click">{site.phone}</a></p>}
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay={100}><ContactForm dark defaultCity={`${p.largestCity}, ${p.code}`} /></div>
        </div>
      </Section>
      <CtaBanner compact />
    </>
  );
}
