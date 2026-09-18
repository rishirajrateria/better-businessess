import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "./Hero";
import { ServiceVisual } from "./Visuals";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { KeyFacts } from "./KeyFacts";
import { FaqAccordion } from "./FaqAccordion";
import { CtaBanner } from "./CtaBanner";
import { ContactForm } from "./ContactForm";
import { TestimonialsSection, type TestimonialItem } from "./Testimonials";
import { ProjectCard, type ProjectCardData } from "./Cards";
import { ProcessSteps, BenefitsGrid, StatsStrip, RichBlock, InlineCta, CityLinks, ProvinceLinks } from "./Sections";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/Section";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { IconBadge } from "@/components/ui/ServiceIcon";
import type { Service, Faq } from "@/lib/services";
import { getSubServices, getService, coreServices } from "@/lib/services";
import type { City, Province } from "@/lib/locations";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export type ServicePageProps = {
  service: Service;
  crumbs: Crumb[];
  h1: React.ReactNode;
  eyebrow: string;
  subtitle: string;
  intro: string[];
  angles?: string[];
  whySection?: { title: string; paragraphs: string[] };
  industries?: { title: string; text: string }[];
  faqs: Faq[];
  keyFacts: string[];
  testimonials: TestimonialItem[];
  projects: ProjectCardData[];
  locationName?: string;
  cityLinks?: { cities: City[]; hrefFor: (c: City) => string; title: React.ReactNode; eyebrow?: string; subtitle?: string; columns?: 3 | 4 | 5 };
  provinceLinks?: { provinces: Province[]; hrefFor: (p: Province) => string; title: React.ReactNode; subtitle?: string };
  siblingLinks?: { label: string; href: string }[];
  defaultCity?: string;
};

export function ServicePageTemplate(p: ServicePageProps) {
  const s = p.service;
  const subs = getSubServices(s.slug);
  const parent = s.parent ? getService(s.parent) : undefined;
  const loc = p.locationName ? ` in ${p.locationName}` : "";

  return (
    <>
      <PageHero eyebrow={p.eyebrow} breadcrumbs={<Breadcrumbs items={p.crumbs} />} title={p.h1} subtitle={p.subtitle} visual={<ServiceVisual slug={s.slug} />}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg" track="cta_service_hero">Get a free proposal <ArrowIcon /></Button>
          <Button href="#pricing-faq" variant="glass" size="lg">See FAQs &amp; pricing</Button>
        </div>
        <p className="mt-6 text-[14px] text-slate">
          Starts from <span className="font-display text-lg font-semibold text-ink">{formatPrice(s.startingPrice.amount)} CAD</span>{s.startingPrice.unit === "month" ? " per month" : " per project"}. Fixed quotes after a free consultation.
        </p>
        {parent && (
          <p className="mt-3 text-[14px] text-slate">Part of our <Link href={`/services/${parent.slug}`} className="font-semibold text-gold-deep hover:underline">{parent.name}</Link> service.</p>
        )}
      </PageHero>

      {/* Intro + key facts */}
      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 text-[17px] leading-8 text-graphite lg:col-span-7" data-reveal>
            {p.intro.map((para) => (
              <p key={para.slice(0, 50)}>{para}</p>
            ))}
            {p.angles?.map((para) => (
              <p key={para.slice(0, 50)}>{para}</p>
            ))}
            <div className="glass rounded-glass p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">What is {s.noun}?</p>
              <p className="mt-2 text-[15.5px] leading-7 text-graphite" data-speakable>{s.whatIsIt}</p>
            </div>
          </div>
          <div className="lg:col-span-5" data-reveal data-reveal-delay={120}>
            <KeyFacts facts={p.keyFacts} />
            <div className="glass-dark mt-5 rounded-glass p-6 text-paper">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">Typical outcomes</p>
              <dl className="mt-4 space-y-4">
                {s.outcomes.map((o) => (
                  <div key={o.label} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-0">
                    <dt className="text-[13.5px] text-paper/70">{o.label}</dt>
                    <dd className="font-display text-xl font-semibold text-gold-gradient">{o.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* Deliverables */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow className="mb-5">What&apos;s included</Eyebrow>
            <h2 className="font-display text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-ink md:text-4xl">Everything you need for {s.noun}{loc}, done properly.</h2>
            <p className="mt-5 text-[16px] leading-8 text-graphite">No black boxes. Every deliverable is documented, reported on and owned by you.</p>
            <div className="mt-8"><Button href="/contact" track="cta_service_deliverables">Scope my project <ArrowIcon /></Button></div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {s.deliverables.map((d, i) => (
              <li key={d} data-reveal data-reveal-delay={i * 50} className="glass flex items-start gap-3 rounded-2xl p-4 text-[15px] font-medium text-ink">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink"><Check size={13} /></span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {p.whySection && (
        <RichBlock eyebrow="Local expertise" title={p.whySection.title} paragraphs={p.whySection.paragraphs} visual={<div className="glass rounded-glass p-6"><StatsStrip className="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-2" items={s.outcomes.slice(0, 2).concat([{ label: "Client retention", value: site.stats.retention }, { label: "Projects delivered", value: site.stats.projects }])} /></div>} />
      )}

      <ProcessSteps steps={s.process} title={<>How our {s.noun} engagement <span className="text-gold-gradient">works.</span></>} />
      <BenefitsGrid items={s.benefits} title={<>Why {site.name} for {s.noun}{loc}.</>} />

      {p.industries && p.industries.length > 0 && (
        <Section size="sm">
          <SectionHeader eyebrow="Industries" title={<>Experience across {p.locationName}&apos;s <span className="text-gold-gradient">key sectors.</span></>} align="left" className="mb-8" />
          <div className="grid gap-4 sm:grid-cols-2">
            {p.industries.map((ind, i) => (
              <div key={ind.title} data-reveal data-reveal-delay={i * 60} className="glass rounded-glass p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{ind.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-slate">{ind.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Ideal for */}
      <Section size="sm">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow className="mb-5">Who it&apos;s for</Eyebrow>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">Ideal for businesses like yours.</h2>
            <p className="mt-4 text-[16px] leading-8 text-graphite">We tailor {s.noun} to the realities of your industry, sales cycle and margins.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {s.idealFor.map((x, i) => (
              <li key={x} data-reveal data-reveal-delay={i * 50} className="glass-pill rounded-2xl px-5 py-4 text-[15px] font-medium text-ink">{x}</li>
            ))}
          </ul>
        </div>
        <InlineCta text={`Get a free ${s.shortName.toLowerCase()} audit${loc}.`} />
      </Section>

      {subs.length > 0 && (
        <Section tone="cream" size="sm">
          <SectionHeader eyebrow="Specialties" title={<>{s.name} <span className="text-gold-gradient">specialties.</span></>} align="left" className="mb-8" />
          <div className="grid gap-4 md:grid-cols-2">
            {subs.map((sub) => (
              <Link key={sub.slug} href={`/services/${sub.slug}`} className="group glass flex items-start gap-4 rounded-glass p-6 transition-all hover:-translate-y-1 hover:shadow-float" data-reveal>
                <IconBadge icon={sub.icon} />
                <span className="flex-1">
                  <span className="flex items-center justify-between font-display text-lg font-semibold tracking-tight text-ink">{sub.name} <ArrowUpRight size={16} className="text-mist group-hover:text-gold" /></span>
                  <span className="mt-1 block text-[14.5px] leading-6 text-slate">{sub.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {p.projects.length > 0 && (
        <Section size="sm">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
            <SectionHeader eyebrow="Case studies" title={<>{s.shortName} results <span className="text-gold-gradient">we&apos;re proud of.</span></>} align="left" className="mb-0" />
            <Button href="/projects" variant="outline">All projects <ArrowIcon /></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {p.projects.slice(0, 3).map((pr, i) => (
              <div key={pr.slug} data-reveal data-reveal-delay={i * 90}><ProjectCard p={pr} /></div>
            ))}
          </div>
        </Section>
      )}

      <TestimonialsSection items={p.testimonials} title={<>What clients say about our <span className="text-gold-gradient">{s.noun}.</span></>} />

      <Section id="pricing-faq" size="sm">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <SectionHeader eyebrow="FAQ" title={<>{s.shortName}{loc}: <span className="text-gold-gradient">your questions.</span></>} align="left" className="mb-6" />
            <p className="text-[15px] leading-7 text-slate">Straight answers on pricing, timelines and how we work. Still curious? <Link href="/contact" className="font-semibold text-gold-deep hover:underline">Ask us anything.</Link></p>
            <div className="mt-8 space-y-2">
              {coreServices.filter((c) => c.slug !== s.slug && c.slug !== s.parent).slice(0, 3).map((c) => (
                <Link key={c.slug} href={`/services/${c.slug}`} className="flex items-center justify-between rounded-2xl border border-ink/5 bg-white/50 px-4 py-3 text-[14.5px] font-medium text-graphite hover:border-gold/40 hover:text-ink">
                  {c.name} <ArrowUpRight size={15} className="text-gold" />
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8" data-reveal data-reveal-delay={100}><FaqAccordion faqs={p.faqs} /></div>
        </div>
      </Section>

      {p.cityLinks && <CityLinks {...p.cityLinks} />}
      {p.provinceLinks && <ProvinceLinks {...p.provinceLinks} />}

      {p.siblingLinks && p.siblingLinks.length > 0 && (
        <Section size="sm">
          <SectionHeader eyebrow="Related" title="Explore related pages" align="left" className="mb-6" />
          <div className="flex flex-wrap gap-2">
            {p.siblingLinks.map((l) => (
              <Link key={l.href} href={l.href} className="glass-pill rounded-full px-4 py-2 text-[13.5px] font-medium text-graphite transition-all hover:-translate-y-0.5 hover:text-ink">{l.label}</Link>
            ))}
          </div>
        </Section>
      )}

      <Section id="contact" tone="dark">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <Eyebrow dark className="mb-5">Start today</Eyebrow>
            <h2 className="font-display text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Get a free {s.shortName.toLowerCase()} proposal{loc}.</h2>
            <p className="mt-5 text-lg leading-8 text-paper/70">Tell us about your goals. A senior strategist will review your current presence and reply within one business day with a clear, fixed-price plan.</p>
            <ul className="mt-8 space-y-3 text-[15px] text-paper/80">
              {["Free audit of your current digital presence", "Fixed pricing, no lock-in contracts", "Senior specialists on every account", "Transparent reporting on leads and revenue"].map((x) => (
                <li key={x} className="flex items-center gap-3"><Check size={16} className="text-gold" /> {x}</li>
              ))}
            </ul>
            {site.phone && <p className="mt-8 text-[15px] text-paper/60">Prefer to talk? <a href={site.phoneHref} className="font-semibold text-gold-light hover:underline" data-track="phone_click">Call {site.phone}</a></p>}
          </div>
          <div className="lg:col-span-7" data-reveal data-reveal-delay={100}>
            <ContactForm defaultService={s.slug} defaultCity={p.defaultCity} dark />
          </div>
        </div>
      </Section>
      <CtaBanner compact title={<>Ready to grow with {s.noun}{loc}?</>} subtitle="Book a free 30-minute strategy call and leave with a plan, whether or not you hire us." />
    </>
  );
}
