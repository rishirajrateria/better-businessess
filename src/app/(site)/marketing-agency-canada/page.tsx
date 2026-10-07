import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Phone } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ServicesGrid, ProcessSteps, ProvinceLinks, RichBlock } from "@/components/site/Sections";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { ContactForm } from "@/components/site/ContactForm";
import { CtaBanner } from "@/components/site/CtaBanner";
import { JsonLd } from "@/components/site/JsonLd";
import { KeyFacts } from "@/components/site/KeyFacts";
import { RelatedGuides } from "@/components/site/RelatedGuides";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/Section";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { provinces, cities, getCitiesInProvince } from "@/lib/locations";
import { services, coreServices } from "@/lib/services";
import { getPublishedPosts } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, webPageSchema, orgId } from "@/lib/seo";
import { site, fullAddress, absoluteUrl } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

const path = "/marketing-agency-canada";
const title = "Marketing Agency in Canada";
const description = `${site.name} is a Canadian marketing agency for lead generation, SEO, websites and branding, serving every province and territory. Free consultation.`;
export const metadata: Metadata = buildMetadata({ title, description, path, keywords: ["marketing agency Canada", "digital marketing agency Canada", "Canadian marketing agency", "online marketing agency Canada", "marketing company Canada"] });

const price = (s: (typeof services)[number]) => `${formatPrice(s.startingPrice.amount)} CAD${s.startingPrice.unit === "month" ? " per month" : " per project"}`;
const cheapest = (unit: "month" | "project") => services.filter((s) => s.startingPrice.unit === unit).sort((a, b) => a.startingPrice.amount - b.startingPrice.amount)[0];
const fromMonthly = cheapest("month");
const fromProject = cheapest("project");
const territories = provinces.filter((p) => p.type === "territory").length;
const provinceCount = provinces.length - territories;

const GUIDE_SLUGS = ["how-to-choose-a-digital-marketing-agency-canada", "how-much-does-seo-cost-in-canada", "how-much-does-a-website-cost-in-canada", "google-ads-cost-canada-cpc-benchmarks", "bill-96-bilingual-website-marketing-quebec", "casl-compliance-guide-lead-generation-email-canada"];

const faqs = [
  {
    question: "What does a marketing agency in Canada do?",
    answer: `A marketing agency plans and runs the work that brings a business new customers: lead generation (Google Ads, social media ads and landing pages), search engine optimization, website design and development, and branding. ${site.name} covers all four, so strategy, creative, websites and reporting sit with one team instead of several vendors.`,
  },
  {
    question: "How much does a marketing agency cost in Canada?",
    answer: `It depends on the service and scope. At ${site.name}, ongoing programs start from ${price(fromMonthly)} (${fromMonthly.name}) and one-time projects start from ${price(fromProject)} (${fromProject.name}). Ad spend for Google or Meta is paid separately to the platform. You receive a fixed quote after a free consultation, and pricing for every service is listed on this page.`,
  },
  {
    question: "Do you work with businesses outside Toronto?",
    answer: `Yes. Our office is at ${fullAddress}, and we work with clients in all ${provinceCount} provinces and ${territories} territories through video calls, shared dashboards and a project portal. We have dedicated pages for ${cities.length} Canadian cities that explain how we approach each local market.`,
  },
  {
    question: "Can you market my business in French as well as English?",
    answer: "Yes. We produce French and English websites, ads and content. Businesses selling to customers in Quebec must meet the Charter of the French Language, as strengthened by Bill 96, so we build French versions of websites and campaigns from the start rather than translating at the end.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Paid lead generation can bring the first enquiries within days of launch, with cost per lead stabilizing over the first 60 to 90 days. SEO compounds more slowly: local and long-tail rankings often move within one to two months, while competitive terms usually take four to nine months. Most business websites launch within four to eight weeks, and brand identity projects take three to six weeks.",
  },
  {
    question: "Do you require long-term contracts?",
    answer: "No. Projects such as websites and brand identities are fixed price. Ongoing programs such as SEO and lead generation run month to month after an initial 90-day period, and you own every account, asset and piece of content we create.",
  },
  {
    question: "How do I choose the right marketing agency in Canada?",
    answer: "Look for an agency that reports on leads and revenue rather than impressions, shows real case studies from businesses like yours, explains its pricing up front, gives you ownership of your ad accounts and website, and understands Canadian rules such as CASL for email and Bill 96 for Quebec. Our guide to choosing a digital marketing agency in Canada walks through each check.",
  },
  {
    question: "How do I get started?",
    answer: `Request a free call back using the short form on this page${site.phone ? ` or call ${site.phone}` : ""}. A strategist reviews your website, search visibility, advertising and brand, then outlines a fixed-price plan. There is no obligation to hire us.`,
  },
];

export default async function MarketingAgencyCanadaPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Marketing agency in Canada", path }];
  const guides = (await getPublishedPosts({})).filter((p) => GUIDE_SLUGS.includes(p.slug)).sort((a, b) => GUIDE_SLUGS.indexOf(a.slug) - GUIDE_SLUGS.indexOf(b.slug)).slice(0, 3);

  const serviceNode = {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: "Marketing agency services in Canada",
    serviceType: "Digital marketing agency",
    description,
    url: absoluteUrl(path),
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Canada" },
    availableLanguage: ["English", "French"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marketing services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/services/${s.slug}`) },
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "CAD", minPrice: s.startingPrice.amount, description: s.startingPrice.unit === "month" ? "Starting price per month" : "Starting price per project" },
      })),
    },
  };
  const provinceList = {
    "@type": "ItemList",
    name: "Provinces and territories served",
    itemListElement: provinces.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: `Marketing agency in ${p.name}`, url: absoluteUrl(`/locations/${p.slug}`) })),
  };

  return (
    <>
      <JsonLd data={graph(webPageSchema({ path, name: title, description }), serviceNode, provinceList, breadcrumbSchema(crumbs), faqSchema(faqs))} />
      <PageHero
        eyebrow="Marketing agency · Canada"
        breadcrumbs={<Breadcrumbs items={crumbs} />}
        title={<>The marketing agency for <span className="text-gold-gradient">Canadian businesses.</span></>}
        subtitle={`${site.name} is a Canadian marketing agency that plans and runs lead generation, SEO, websites and branding for businesses in every province and territory, measured on the leads and revenue it produces.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="#contact" size="lg" track="cta_canada_hero">Get a free proposal <ArrowIcon /></Button>
          {site.phone && <Button href={site.phoneHref} variant="glass" size="lg">Call {site.phone} <Phone size={16} /></Button>}
        </div>
      </PageHero>

      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-5 text-[17px] leading-8 text-graphite lg:col-span-7" data-reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">What we do for businesses across Canada.</h2>
            <p data-speakable>
              A marketing agency in Canada has to win customers in very different markets: dense, competitive cities like Toronto, Montreal and Vancouver; fast-growing suburbs; resource and agricultural regions; and bilingual Quebec. {site.name} builds each program around how people in your market actually search, compare and buy, then reports on the enquiries, calls and sales it produces.
            </p>
            <p>
              We combine four disciplines under one roof. <Link href="/services/lead-generation" className="font-semibold text-gold-deep hover:underline">Lead generation</Link> fills your pipeline through Google Ads, social media advertising and landing pages. <Link href="/services/seo" className="font-semibold text-gold-deep hover:underline">SEO</Link> grows organic traffic from Google and makes your business easier for AI assistants to recommend. <Link href="/services/website-development" className="font-semibold text-gold-deep hover:underline">Website development</Link> turns that traffic into customers, and <Link href="/services/branding" className="font-semibold text-gold-deep hover:underline">branding</Link> makes you the obvious choice when people compare options.
            </p>
            <p>
              Our office is at {fullAddress}. Clients outside the Greater Toronto Area work with us through video calls, shared reporting dashboards and a project portal, with deliverables in English and French.
            </p>
          </div>
          <div className="lg:col-span-5" data-reveal data-reveal-delay={100}>
            <KeyFacts
              title="At a glance"
              facts={[
                `${site.name}: a Canadian marketing agency for lead generation, SEO, website development and branding.`,
                `Office: ${fullAddress}.${site.phone ? ` Phone: ${site.phone}.` : ""}`,
                `Serves all ${provinceCount} provinces and ${territories} territories, with local pages for ${cities.length} cities.`,
                `Ongoing programs from ${price(fromMonthly)}; projects from ${price(fromProject)}.`,
                "Fixed quotes, no long-term contracts, English and French deliverables.",
              ]}
            />
          </div>
        </div>
      </Section>

      <ServicesGrid eyebrow="Services" title={<>Marketing services for <span className="text-gold-gradient">Canadian businesses.</span></>} subtitle="Every service has its own page with deliverables, process and FAQs, plus local pages for each province and city we serve." />

      <Section tone="cream" size="sm" id="pricing">
        <SectionHeader eyebrow="Pricing" title={<>What a marketing agency <span className="text-gold-gradient">costs in Canada.</span></>} subtitle="Starting prices in Canadian dollars. Ad spend is paid directly to Google or Meta. You receive a fixed quote after a free consultation." align="left" className="mb-8" />
        <div className="overflow-x-auto rounded-glass border border-ink/5 bg-white/70" data-reveal>
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <caption className="sr-only">{site.name} starting prices in Canadian dollars</caption>
            <thead className="text-[12px] uppercase tracking-[0.12em] text-slate">
              <tr className="border-b border-ink/5"><th scope="col" className="px-5 py-4">Service</th><th scope="col" className="px-5 py-4">What it covers</th><th scope="col" className="px-5 py-4 text-right">Starts from</th></tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.slug} className="border-b border-ink/5 last:border-0">
                  <th scope="row" className="px-5 py-4 font-display font-semibold text-ink"><Link href={`/services/${s.slug}`} className="hover:text-gold-deep">{s.name}</Link></th>
                  <td className="px-5 py-4 text-slate">{s.tagline}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-ink">{formatPrice(s.startingPrice.amount)} <span className="font-normal text-slate">{s.startingPrice.unit === "month" ? "/ month" : "/ project"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <RichBlock
        eyebrow="Canadian specifics"
        title="What a Canadian marketing agency should handle for you."
        paragraphs={[
          "Marketing in Canada comes with rules and market differences that a generic campaign ignores. Commercial email and text messages fall under Canada's Anti-Spam Legislation (CASL), which requires consent and identification in every message, so lead-generation funnels and follow-up sequences have to be built for it from day one.",
          "Businesses that sell to customers in Quebec must meet the Charter of the French Language, strengthened by Bill 96, which affects websites, advertising and signage. Regulated professions such as law, dentistry, real estate, mortgage brokerage and financial advice also follow provincial advertising rules on testimonials, claims and pricing.",
          "Costs differ by market too: Google Ads clicks in competitive Toronto and Vancouver categories cost more than in smaller cities, and search behaviour shifts between provinces. We plan budgets, keywords and messaging city by city instead of copying one national campaign everywhere.",
        ]}
        visual={
          <div className="glass rounded-glass p-6">
            <Eyebrow className="mb-4">Guides for Canadian businesses</Eyebrow>
            <ul className="space-y-3 text-[15px]">
              {[
                ["CASL compliance for lead generation", "/blog/casl-compliance-guide-lead-generation-email-canada"],
                ["Bill 96 and bilingual websites", "/blog/bill-96-bilingual-website-marketing-quebec"],
                ["Google Ads cost in Canada", "/blog/google-ads-cost-canada-cpc-benchmarks"],
                ["How much SEO costs in Canada", "/blog/how-much-does-seo-cost-in-canada"],
                ["Industry marketing guides", "/industries"],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 font-medium text-graphite hover:bg-white hover:text-ink">{label} <ArrowUpRight size={15} className="text-gold" /></Link></li>
              ))}
            </ul>
          </div>
        }
      />

      <Section size="sm">
        <SectionHeader eyebrow="Choosing an agency" title={<>How to choose a marketing agency <span className="text-gold-gradient">in Canada.</span></>} align="left" className="mb-8" />
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            ["Reports on leads and revenue", "Ask for reporting tied to enquiries, calls and sales, not impressions or follower counts."],
            ["Clear, published pricing", "You should know what you pay each month and what is included before you sign anything."],
            ["You own your accounts", "Your Google Ads, analytics, website and content should be in your name, not the agency's."],
            ["Knows Canadian rules", "CASL for email and SMS, Bill 96 in Quebec, and advertising rules for regulated professions."],
            ["Local market experience", "Strategy for your city and industry, not one national template copied everywhere."],
            ["No long lock-in", "Month-to-month programs after an initial period show an agency that expects to keep earning your business."],
          ].map(([t, d]) => (
            <li key={t} className="glass flex items-start gap-3 rounded-2xl p-5" data-reveal>
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink"><Check size={13} /></span>
              <span><span className="block font-display text-[16px] font-semibold text-ink">{t}</span><span className="text-[14.5px] leading-6 text-slate">{d}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-slate">Read the full checklist in our <Link href="/blog/how-to-choose-a-digital-marketing-agency-canada" className="font-semibold text-gold-deep hover:underline">guide to choosing a digital marketing agency in Canada</Link>.</p>
      </Section>

      <ProvinceLinks provinces={provinces} hrefFor={(p) => `/locations/${p.slug}`} title={<>Marketing agency in every <span className="text-gold-gradient">province and territory.</span></>} subtitle="Choose your province for local market insight, city pages and service pages." />

      <Section tone="cream" size="sm" id="cities">
        <SectionHeader eyebrow="Cities" title={<>Find your city.</>} subtitle={`Local marketing pages for ${cities.length} Canadian cities and communities, each with census figures and local market notes.`} align="left" className="mb-8" />
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {provinces.map((p) => {
            const list = getCitiesInProvince(p.slug);
            if (!list.length) return null;
            return (
              <div key={p.slug}>
                <h3 className="font-display text-[16px] font-semibold text-ink"><Link href={`/locations/${p.slug}`} prefetch={false} className="hover:text-gold-deep">{p.name}</Link></h3>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[14px]">
                  {list.map((c) => (
                    <li key={c.slug}><Link href={`/locations/${c.province}/${c.slug}`} prefetch={false} className="text-slate hover:text-ink">{c.name}</Link></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <ProcessSteps
        steps={[
          { title: "Free audit", text: "We review your website, rankings, ads and brand against your local competitors." },
          { title: "Plan", text: "A prioritized 90-day plan with fixed pricing and clear targets." },
          { title: "Build", text: "Campaigns, pages, content and creative shipped by senior specialists." },
          { title: "Measure", text: "Calls, form leads and sales tracked from first click to closed deal." },
          { title: "Compound", text: "Monthly optimization of what works across every channel." },
        ]}
        title={<>How working with us <span className="text-gold-gradient">works.</span></>}
      />

      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <SectionHeader eyebrow="FAQ" title={<>Marketing agency in Canada: <span className="text-gold-gradient">your questions.</span></>} align="left" className="mb-6" />
            <div className="space-y-2">
              {coreServices.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}/canada`} className="flex items-center justify-between rounded-2xl border border-ink/5 bg-white/50 px-4 py-3 text-[14.5px] font-medium text-graphite hover:border-gold/40 hover:text-ink">
                  {s.name} in Canada <ArrowUpRight size={15} className="text-gold" />
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal data-reveal-delay={100}><FaqAccordion faqs={faqs} /></div>
        </div>
      </Section>

      <RelatedGuides guides={guides} title={<>Guides for <span className="text-gold-gradient">Canadian businesses.</span></>} subtitle="In-depth, Canada-specific answers on cost, choosing an agency and the rules that apply to your marketing." />

      <Section id="contact" tone="dark">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow dark className="mb-5">Start today</Eyebrow>
            <h2 className="font-display text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Talk to a Canadian marketing agency.</h2>
            <p className="mt-5 text-lg leading-8 text-paper/70">Leave your name and number. A senior strategist will call you within one business day to understand your goals and outline a fixed-price plan.</p>
            {site.phone && <p className="mt-8 text-[15px] text-paper/60">Prefer to talk now? <a href={site.phoneHref} className="font-semibold text-gold-light hover:underline">Call {site.phone}</a></p>}
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay={100}><ContactForm dark defaultService="multiple" defaultCity="Canada" /></div>
        </div>
      </Section>
      <CtaBanner compact />
    </>
  );
}
