import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageSquare, CalendarCheck, FileSearch, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/Hero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { TestimonialsSection } from "@/components/site/Testimonials";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { getTestimonials } from "@/lib/queries";
import { buildMetadata, breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { coreServices } from "@/lib/services";
import { majorCities } from "@/lib/locations";

export const revalidate = 3600;
const title = `Contact Us | Free Growth Audit & Proposal`;
const description = `Contact ${site.name} for a free digital growth audit. Lead generation, SEO, web development and branding for Canadian businesses. One-business-day reply.`;
export const metadata: Metadata = buildMetadata({ title, description, path: "/contact" });

const faqs = [
  { question: "What happens after I submit the form?", answer: "A senior strategist reviews your website, search visibility, advertising and brand, then replies within one business day to schedule a 30-minute call. You receive a written summary of opportunities whether or not you hire us." },
  { question: "Is the audit really free?", answer: "Yes. No credit card, no obligation. We invest the time because most businesses who see the audit choose to work with us." },
  { question: "Do you work with small businesses?", answer: "Yes. Our clients range from solo professionals and local trades to national brands. Programs are sized to your budget and growth stage." },
  { question: "Which areas do you serve?", answer: "All of Canada, remotely. Our headquarters is in Toronto, Ontario, and we work with clients in every province and territory in English and French." },
];

export default async function ContactPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  const testimonials = await getTestimonials({ limit: 3 });
  return (
    <>
      <JsonLd data={graph(webPageSchema({ path: "/contact", name: title, description, type: "ContactPage" }), breadcrumbSchema(crumbs), faqSchema(faqs))} />
      <PageHero compact eyebrow="Contact" breadcrumbs={<Breadcrumbs items={crumbs} />} title={<>Let&apos;s talk about <span className="text-gold-gradient">your growth.</span></>} subtitle="Tell us where you are and where you want to be. We'll show you the fastest route, free." />

      <Section size="sm">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal>
            <ContactForm heading="Request your free growth audit" />
          </div>
          <aside className="space-y-4 lg:col-span-5" data-reveal data-reveal-delay={100}>
            <div className="glass-dark rounded-glass p-7 text-paper">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">Talk to a human</p>
              <ul className="mt-4 space-y-4 text-[15px]">
                {site.phone && (
                  <li className="flex items-start gap-3"><Phone size={18} className="mt-0.5 text-gold" /><span><a href={site.phoneHref} className="font-semibold hover:text-gold-light" data-track="phone_click">{site.phone}</a><br /><span className="text-paper/60">{site.hours}</span></span></li>
                )}
                <li className="flex items-start gap-3"><Mail size={18} className="mt-0.5 text-gold" /><span><a href={`mailto:${site.email}`} className="font-semibold hover:text-gold-light" data-track="email_click">{site.email}</a><br /><span className="text-paper/60">Reply within one business day</span></span></li>
                <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 text-gold" /><span>{site.hq.city}, {site.hq.province}, Canada<br /><span className="text-paper/60">Serving all provinces and territories</span></span></li>
                <li className="flex items-start gap-3"><Clock size={18} className="mt-0.5 text-gold" /><span>{site.hours}</span></li>
              </ul>
              <div className="mt-6 grid gap-2">
                {site.phone && <Button href={site.phoneHref} variant="gold" track="phone_click">Call now <Phone size={16} /></Button>}
                <Button href={`mailto:${site.email}?subject=Growth%20audit%20request`} variant="glass" className="!bg-white/10 !border-white/15 !text-paper hover:!bg-white/15" track="email_click">Email us <ArrowIcon /></Button>
              </div>
            </div>
            <div className="glass rounded-glass p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">Three ways to start</p>
              <ul className="mt-4 space-y-4">
                {[
                  { Icon: FileSearch, t: "Free growth audit", d: "We review your site, rankings, ads and brand and send written findings." },
                  { Icon: CalendarCheck, t: "30-minute strategy call", d: "Talk through goals and get a clear plan, no pitch." },
                  { Icon: MessageSquare, t: "Project quote", d: "Know what you need? Get a fixed price within 48 hours." },
                ].map(({ Icon, t, d }) => (
                  <li key={t} className="flex items-start gap-3"><span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-pale text-gold-deep"><Icon size={17} /></span><span><span className="block font-display text-[15px] font-semibold text-ink">{t}</span><span className="text-[13.5px] text-slate">{d}</span></span></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="cream" size="sm">
        <SectionHeader eyebrow="Get a quote by service" title={<>Know what you need? <span className="text-gold-gradient">Jump straight in.</span></>} align="left" className="mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {coreServices.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}#contact`} data-reveal data-reveal-delay={i * 60} className="group glass flex flex-col rounded-glass p-6 transition-all hover:-translate-y-1 hover:shadow-float" data-track="cta_contact_service">
              <span className="flex items-center justify-between font-display text-lg font-semibold tracking-tight text-ink">{s.name} <ArrowUpRight size={16} className="text-mist group-hover:text-gold" /></span>
              <span className="mt-2 text-[14px] leading-6 text-slate">{s.tagline}</span>
              <span className="mt-4 text-[13.5px] font-semibold text-gold-deep">Get a {s.shortName.toLowerCase()} quote</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <SectionHeader eyebrow="Before you reach out" title={<>Common <span className="text-gold-gradient">questions.</span></>} align="left" className="mb-6" />
            <p className="text-[15px] leading-7 text-slate">We serve businesses in {majorCities.slice(0, 6).map((c) => c.name).join(", ")} and every other Canadian community. <Link href="/locations" className="font-semibold text-gold-deep hover:underline">See all locations.</Link></p>
            <div className="mt-6"><Button href="#main" variant="outline" track="cta_contact_scroll">Back to the form <ArrowIcon className="rotate-[-90deg]" /></Button></div>
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay={100}><FaqAccordion faqs={faqs} /></div>
        </div>
      </Section>

      <TestimonialsSection items={testimonials} title={<>Businesses that reached out <span className="text-gold-gradient">and never looked back.</span></>} />
    </>
  );
}
