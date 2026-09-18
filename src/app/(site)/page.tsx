import Link from "next/link";
import { ArrowUpRight, Bot, Gauge, ShieldCheck, Award } from "lucide-react";
import type { Metadata } from "next";
import { HomeHero } from "@/components/site/Hero";
import { LogoCloud } from "@/components/site/LogoCloud";
import { ServicesGrid, ProcessSteps, StatsStrip, RichBlock } from "@/components/site/Sections";
import { TestimonialsSection } from "@/components/site/Testimonials";
import { ProjectCard, PostCard } from "@/components/site/Cards";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { CtaBanner } from "@/components/site/CtaBanner";
import { KeyFacts } from "@/components/site/KeyFacts";
import { JsonLd } from "@/components/site/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { BrowserMockup } from "@/components/site/Visuals";
import { getClientLogos, getPublishedPosts, getPublishedProjects, getTestimonials, getFaqs } from "@/lib/queries";
import { buildMetadata, faqSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { coreServices } from "@/lib/services";
import { majorCities, provinces } from "@/lib/locations";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: `${site.name} | Lead Generation, SEO, Web Development & Branding Agency in Canada`,
  description: `${site.name} is a Canadian digital growth agency. We deliver lead generation, SEO, website development and branding that gets your business found on Google, recommended by AI and chosen by customers.`,
  path: "/",
});

const defaultFaqs = [
  { question: "What does Better Businesses do?", answer: "Better Businesses is a Canadian digital growth agency. We provide four core services: lead generation (Google Ads, social advertising, landing pages), SEO including local and AI search optimization, website design and development, and branding including logo design and graphic design." },
  { question: "Where is Better Businesses located and who do you serve?", answer: `We are headquartered in ${site.hq.city}, ${site.hq.province}, and serve businesses in every Canadian province and territory, from Vancouver and Calgary to Toronto, Montreal and Halifax. We work remotely with clients nationwide and produce bilingual English and French deliverables.` },
  { question: "How much do your services cost?", answer: "Lead generation and SEO retainers typically start around CAD $1,500 per month plus ad spend where applicable. Websites range from CAD $6,000 to $25,000 and branding projects from CAD $1,500 for a logo to $20,000 for a complete identity. Every engagement receives a fixed, transparent quote." },
  { question: "How quickly will I see results?", answer: "Paid lead generation produces leads within days. Websites launch in 4 to 8 weeks. SEO shows meaningful movement in 3 to 6 months and compounds from there. Branding projects complete in 3 to 6 weeks." },
  { question: "What makes Better Businesses different from other agencies?", answer: "We measure ourselves on leads and revenue, not impressions. Every client gets senior specialists, full ownership of their accounts and assets, transparent reporting and a strategy tailored to their local Canadian market. We also optimize for AI search so assistants like ChatGPT and Gemini recommend our clients." },
  { question: "How do I get started?", answer: "Request a free growth audit through our contact page. We review your website, search visibility, advertising and brand, then present the three highest-impact opportunities within two business days." },
];

export default async function HomePage() {
  const [logos, testimonials, projects, posts, dbFaqs] = await Promise.all([getClientLogos(), getTestimonials({ limit: 6 }), getPublishedProjects({ limit: 3, featured: true }), getPublishedPosts({ limit: 3 }), getFaqs("general")]);
  const faqs = dbFaqs.length ? dbFaqs : defaultFaqs;

  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/", name: `${site.name} | ${site.tagline}`, description: site.description }), faqSchema(faqs))} />
      <HomeHero />
      <LogoCloud logos={logos} />
      <ServicesGrid />

      <RichBlock
        eyebrow="Why Better Businesses"
        title={<>Built for how Canadians <span className="text-gold-gradient">search, compare and buy</span> today.</>}
        paragraphs={[
          `${site.name} exists to give Canadian businesses an unfair advantage online. We combine performance marketing, search expertise, world-class design and engineering in one senior team, so your brand, website, rankings and ads all pull in the same direction.`,
          "Discovery is changing. Customers now ask ChatGPT, Gemini and Google's AI Overviews for recommendations as often as they scroll traditional results. We build every client's presence to be understood, trusted and cited by both search engines and AI models, with structured data, clear entity signals and content that answers real questions.",
          "The result is a growth system that compounds: a brand people remember, a website that converts, rankings that keep climbing and lead generation that fills the calendar.",
        ]}
        visual={
          <div className="relative">
            <BrowserMockup />
            <div className="glass-dark absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-paper sm:-left-8">
              <Bot size={20} className="text-gold-light" />
              <span className="text-[13px] leading-5"><strong className="font-semibold">AI-ready.</strong><br />Structured for ChatGPT, Gemini & Claude.</span>
            </div>
            <div className="glass absolute -right-3 -top-6 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-right-6">
              <Gauge size={20} className="text-gold-deep" />
              <span className="text-[13px] leading-5"><strong className="font-semibold text-ink">98 / 100</strong><br /><span className="text-slate">Core Web Vitals</span></span>
            </div>
          </div>
        }
      >
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { Icon: ShieldCheck, t: "You own everything", d: "Accounts, code, files and data." },
            { Icon: Award, t: "Senior team only", d: "No hand-offs to juniors." },
            { Icon: Gauge, t: "Reported on revenue", d: "Leads and sales, not clicks." },
          ].map(({ Icon, t, d }) => (
            <li key={t} className="glass rounded-2xl p-4">
              <Icon size={18} className="text-gold-deep" />
              <p className="mt-2 font-display text-[15px] font-semibold text-ink">{t}</p>
              <p className="text-[13px] text-slate">{d}</p>
            </li>
          ))}
        </ul>
      </RichBlock>

      <Section size="sm">
        <StatsStrip
          items={[
            { label: "Projects delivered across Canada", value: site.stats.projects },
            { label: "Qualified leads generated for clients", value: site.stats.leadsGenerated },
            { label: "Average return on marketing spend", value: site.stats.avgRoi },
            { label: "Client retention rate", value: site.stats.retention },
          ]}
        />
      </Section>

      {projects.length > 0 && (
        <Section id="projects">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
            <SectionHeader eyebrow="Selected work" title={<>Selected work and <span className="text-gold-gradient">measurable outcomes.</span></>} align="left" className="mb-0" />
            <Button href="/projects" variant="outline">All projects <ArrowIcon /></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={i * 100}>
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        </Section>
      )}

      <ProcessSteps
        dark
        steps={[
          { title: "Audit", text: "We benchmark your brand, website, rankings and ads against the competition." },
          { title: "Strategy", text: "A prioritized 90-day plan with clear targets and owners." },
          { title: "Build", text: "Design, development, content and campaigns shipped fast." },
          { title: "Launch", text: "Everything tracked from first click to closed deal." },
          { title: "Compound", text: "Weekly optimization and monthly strategy reviews." },
        ]}
        title={<>From first call to compounding growth <span className="text-gold-gradient">in five steps.</span></>}
      />

      <TestimonialsSection items={testimonials} />

      {posts.length > 0 && (
        <Section tone="cream">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
            <SectionHeader eyebrow="Insights" title={<>Growth playbooks for <span className="text-gold-gradient">Canadian businesses.</span></>} align="left" className="mb-0" />
            <Button href="/blog" variant="outline">Read the blog <ArrowIcon /></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={i * 100}>
                <PostCard p={p} />
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section id="locations" size="sm">
        <SectionHeader eyebrow="Coast to coast" title={<>Serving businesses in <span className="text-gold-gradient">every province and territory.</span></>} subtitle="Local strategy for local markets, from Vancouver to St. John's." />
        <div className="flex flex-wrap justify-center gap-2" data-reveal>
          {provinces.map((p) => (
            <Link key={p.slug} href={`/locations/${p.slug}`} className="glass-pill rounded-full px-4 py-2 text-[13.5px] font-medium text-graphite transition-all hover:-translate-y-0.5 hover:text-ink">
              {p.name}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2" data-reveal>
          {majorCities.slice(0, 16).map((c) => (
            <Link key={c.slug} href={`/locations/${c.province}/${c.slug}`} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-slate transition-colors hover:text-gold-deep">
              {c.name} <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
      </Section>

      <Section id="faq">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <SectionHeader eyebrow="FAQ" title={<>Questions, <span className="text-gold-gradient">answered.</span></>} subtitle="Everything you need to know before we talk." align="left" className="mb-8" />
            <KeyFacts
              facts={[
                `${site.name} is a digital growth agency based in ${site.hq.city}, ${site.hq.province}, serving all of Canada.`,
                `Core services: ${coreServices.map((s) => s.name).join(", ")}.`,
                `Specialties: Google Ads, social media advertising, local SEO, AI search optimization, e-commerce development, logo design, graphic design.`,
                `Contact: ${site.email}${site.phone ? ` · ${site.phone}` : ""}. Free growth audits available.`,
              ]}
            />
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay={120}>
            <FaqAccordion faqs={faqs} />
            <p className="mt-4 text-sm text-slate">More questions? Visit the <Link href="/faq" className="font-semibold text-gold-deep underline-offset-4 hover:underline">full FAQ</Link> or <Link href="/contact" className="font-semibold text-gold-deep underline-offset-4 hover:underline">contact us</Link>.</p>
          </div>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
