import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getFaqs } from "@/lib/queries";
import { services } from "@/lib/services";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;
const title = `FAQ | Digital Marketing, SEO, Web Design & Branding Questions Answered`;
const description = `Answers to the most common questions about working with ${site.name}: pricing, timelines, SEO, lead generation, website development and branding in Canada.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/faq" });

const general = [
  { question: "What is Better Businesses?", answer: `${site.name} is a Canadian digital growth agency headquartered in ${site.hq.city}, ${site.hq.province}. We provide lead generation, SEO, website development and branding to businesses across Canada.` },
  { question: "How do you price your services?", answer: "Projects such as websites and brand identities are fixed price. Ongoing programs such as SEO and lead generation are monthly retainers with clear deliverables. There are no long-term lock-in contracts." },
  { question: "Do you require long-term contracts?", answer: "No. Retainers run month to month after an initial 90-day period, which is the minimum needed to show meaningful results." },
  { question: "Who will I work with?", answer: "A dedicated senior strategist is your single point of contact, supported by specialists in media buying, SEO, design and development." },
  { question: "Do you offer services in French?", answer: "Yes. We deliver bilingual English and French websites, campaigns, content and design." },
  { question: "How do you report results?", answer: "You get a live dashboard and a monthly report covering leads, revenue, rankings, traffic and next actions." },
];

export default async function FaqPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }];
  const dbGeneral = await getFaqs("general");
  const all = [...general, ...dbGeneral, ...services.flatMap((s) => s.faqs)];
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/faq", name: title, description, type: "FAQPage" }), breadcrumbSchema(crumbs), faqSchema(all))} />
      <PageHero compact eyebrow="FAQ" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Everything you want to know, <span className="text-gold-gradient">answered plainly.</span></>} subtitle="Pricing, timelines, process and results for every service we offer." />
      <Section size="sm">
        <SectionHeader eyebrow="General" title="Working with us" align="left" className="mb-6" />
        <FaqAccordion faqs={[...general, ...dbGeneral]} />
      </Section>
      {services.map((s) => (
        <Section key={s.slug} size="sm" id={s.slug}>
          <SectionHeader eyebrow={s.name} title={<>{s.name} <span className="text-gold-gradient">questions</span></>} subtitle={<>Learn more on the <Link href={`/services/${s.slug}`} className="font-semibold text-gold-deep hover:underline">{s.name} page</Link>.</>} align="left" className="mb-6" />
          <FaqAccordion faqs={s.faqs} />
        </Section>
      ))}
      <CtaBanner />
    </>
  );
}
