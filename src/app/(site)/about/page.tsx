import type { Metadata } from "next";
import Link from "next/link";
import { Check, Compass, Heart, Lightbulb, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { StatsStrip, RichBlock, ProcessSteps } from "@/components/site/Sections";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { KeyFacts } from "@/components/site/KeyFacts";
import { TestimonialsSection } from "@/components/site/Testimonials";
import { BrandVisual } from "@/components/site/Visuals";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getTestimonials } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { coreServices, subServices } from "@/lib/services";

export const revalidate = 3600;
const title = `About Us | Canadian Digital Growth Agency`;
const description = `${site.name} is a Canadian digital growth agency. Learn about our mission, values and how we deliver lead generation, SEO, web development and branding.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/about" });

const values = [
  { Icon: Compass, t: "Strategy first", d: "We never start with tactics. Every engagement begins with your numbers, market and goals." },
  { Icon: ShieldCheck, t: "Radical transparency", d: "You see every dollar, every lead and every result. You own every account and asset." },
  { Icon: Lightbulb, t: "Craft and speed", d: "Senior specialists who ship quickly without cutting corners on quality." },
  { Icon: Heart, t: "Partnership", d: "We win when you win. Most clients stay with us for years, and refer their friends." },
];

export default async function AboutPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }];
  const testimonials = await getTestimonials({ limit: 3 });
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/about", name: title, description, type: "AboutPage" }), breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="About us" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>We build businesses that get <span className="text-gold-gradient">found, chosen and remembered.</span></>} subtitle={`${site.name} is a Canadian digital growth agency. Since ${site.foundedYear} we have helped companies from coast to coast turn strategy into growth through lead generation, SEO, website development and branding.`} visual={<div className="glass rounded-glass p-6"><BrandVisual /></div>} />

      <Section size="sm">
        <StatsStrip items={[{ label: "Projects delivered", value: site.stats.projects }, { label: "Leads generated", value: site.stats.leadsGenerated }, { label: "Average client ROI", value: site.stats.avgRoi }, { label: "Years of experience", value: site.stats.yearsExperience }]} />
      </Section>

      <RichBlock
        eyebrow="Our story"
        title={<>Born from a simple frustration with <span className="text-gold-gradient">agency theatre.</span></>}
        paragraphs={[
          `${site.name} was founded in ${site.foundedYear} by marketers and engineers who were tired of watching Canadian business owners pay for reports full of impressions and "brand awareness" while their phones stayed quiet. We set out to build an agency measured on the only outcomes that matter: qualified leads, revenue and a brand people trust.`,
          "Our name is our promise. Every website, campaign, ranking and logo we deliver should leave our client a measurably better business than before. Today we serve companies in every province and territory, from solo trades and clinics to multi-location groups and national brands.",
          "We are also shaping how businesses get discovered in the age of AI. Our team pioneered AI search optimization practices that help clients get cited and recommended by ChatGPT, Gemini, Claude and Perplexity alongside Google.",
        ]}
        visual={<KeyFacts title="Company facts" facts={[`Name: ${site.name} (${site.legalName}).`, `Founded: ${site.foundedYear}. Headquarters: ${site.hq.city}, ${site.hq.province}, Canada.`, `Services: ${coreServices.map((s) => s.name).join(", ")}.`, `Specialties: ${subServices.map((s) => s.shortName).join(", ")}.`, `Markets: all Canadian provinces and territories. Languages: English and French.`, `Contact: ${site.email}${site.phone ? ` · ${site.phone}` : ""}.`]} />}
      />

      <Section tone="cream">
        <SectionHeader eyebrow="Values" title={<>What we <span className="text-gold-gradient">stand for.</span></>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, t, d }, i) => (
            <div key={t} data-reveal data-reveal-delay={i * 80} className="glass rounded-glass p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-pale text-gold-deep ring-1 ring-gold/20"><Icon size={20} /></span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">{t}</h3>
              <p className="mt-2 text-[14.5px] leading-6 text-slate">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <ProcessSteps dark steps={[{ title: "Listen", text: "We learn your business, market and goals before proposing anything." }, { title: "Diagnose", text: "A full audit shows exactly where growth is leaking." }, { title: "Plan", text: "A prioritized 90-day roadmap with clear targets." }, { title: "Execute", text: "Senior specialists deliver, weekly." }, { title: "Prove", text: "Reporting tied to leads and revenue, not vanity metrics." }]} title={<>How we <span className="text-gold-gradient">work with you.</span></>} />

      <Section size="sm">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6" data-reveal>
            <SectionHeader eyebrow="Our promise" title={<>Every client gets <span className="text-gold-gradient">the same standard.</span></>} align="left" className="mb-6" />
            <ul className="space-y-3 text-[15.5px] text-graphite">
              {["A dedicated senior strategist as your single point of contact", "Full ownership of accounts, code, designs and data", "Fixed, transparent pricing with no long-term lock-in", "Live dashboards plus monthly strategy reviews", "Bilingual English and French deliverables on request", "Compliance with CASL, PIPEDA and provincial privacy law"].map((x) => (
                <li key={x} className="flex items-start gap-3"><Check size={18} className="mt-1 shrink-0 text-gold" /> {x}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6" data-reveal data-reveal-delay={100}>
            <div className="glass-dark rounded-glass p-8 text-paper">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">Looking for something specific?</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[["/services", "Our services"], ["/projects", "Case studies"], ["/locations", "Where we work"], ["/blog", "Insights"], ["/faq", "FAQ"], ["/contact", "Contact us"]].map(([h, l]) => (
                  <Link key={h} href={h} className="rounded-2xl border border-white/10 px-4 py-3 text-[14.5px] font-medium transition-colors hover:border-gold hover:text-gold-light">{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <TestimonialsSection items={testimonials} />
      <CtaBanner />
    </>
  );
}
