import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { ServicesGrid, ProcessSteps } from "@/components/site/Sections";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Section, SectionHeader } from "@/components/ui/Section";
import { IconBadge } from "@/components/ui/ServiceIcon";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/seo";
import { services, subServices } from "@/lib/services";
import { site } from "@/lib/site";

const title = `Digital Marketing Services in Canada | Lead Gen, SEO, Web & Branding`;
const description = `Explore ${site.name}' services: lead generation, SEO, website development and branding, plus Google Ads, social advertising, local SEO, e-commerce, logo and graphic design for Canadian businesses.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/services" });

const faqs = [
  { question: "Which service should I start with?", answer: "If you need customers now, start with lead generation. If your website is slow or dated, fix that first because every other channel depends on it. If you are launching or repositioning, begin with branding. SEO is the long-term asset we recommend layering in as early as possible. A free audit tells you exactly where the biggest gap is." },
  { question: "Can I bundle services?", answer: "Yes. Most clients combine two or more services under one monthly retainer with a single strategist, unified reporting and preferred pricing." },
  { question: "Do you work with businesses outside major cities?", answer: "Absolutely. We serve businesses in every province and territory, including smaller communities where strong digital presence creates a decisive advantage." },
  { question: "Do you offer one-time projects or only retainers?", answer: "Both. Websites, brand identities and audits are typically fixed-price projects. Lead generation and SEO work best as ongoing programs." },
];

export default function ServicesPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }];
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/services", name: title, description, type: "CollectionPage" }), breadcrumbSchema(crumbs), faqSchema(faqs), { "@type": "ItemList", itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${site.url}/services/${s.slug}` })) })} />
      <PageHero eyebrow="Services" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Everything a Canadian business needs to <span className="text-gold-gradient">grow online.</span></>} subtitle={`${site.name} offers four core services and six specialties, delivered by one senior team so every part of your digital presence works together.`} />
      <ServicesGrid eyebrow="Core services" title={<>Start with one. <span className="text-gold-gradient">Scale with all four.</span></>} />
      <Section tone="cream" size="sm">
        <SectionHeader eyebrow="Specialties" title={<>Focused expertise <span className="text-gold-gradient">when you need it.</span></>} align="left" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subServices.map((s, i) => (
            <li key={s.slug} data-reveal data-reveal-delay={i * 60}>
              <Link href={`/services/${s.slug}`} className="group glass flex h-full items-start gap-4 rounded-glass p-6 transition-all hover:-translate-y-1 hover:shadow-float">
                <IconBadge icon={s.icon} />
                <span className="flex-1">
                  <span className="flex items-center justify-between font-display text-lg font-semibold tracking-tight text-ink">{s.name} <ArrowUpRight size={16} className="text-mist group-hover:text-gold" /></span>
                  <span className="mt-1 block text-[14px] leading-6 text-slate">{s.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <ProcessSteps steps={[{ title: "Audit", text: "Understand where you stand." }, { title: "Strategy", text: "Prioritize the biggest wins." }, { title: "Build", text: "Ship assets and campaigns." }, { title: "Launch", text: "Track everything that matters." }, { title: "Compound", text: "Optimize every week." }]} />
      <Section size="sm">
        <SectionHeader eyebrow="FAQ" title="Common questions about our services" align="left" className="mb-8" />
        <FaqAccordion faqs={faqs} />
      </Section>
      <CtaBanner />
    </>
  );
}
