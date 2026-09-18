import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Section, SectionHeader, Eyebrow } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { IconBadge } from "@/components/ui/ServiceIcon";
import { Button, ArrowIcon } from "@/components/ui/Button";
import type { Service } from "@/lib/services";
import { coreServices, getSubServices } from "@/lib/services";
import type { City, Province } from "@/lib/locations";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------- Services grid ---------- */
export function ServicesGrid({ title, subtitle, eyebrow = "What we do", locationName, hrefFor }: { title?: React.ReactNode; subtitle?: string; eyebrow?: string; locationName?: string; hrefFor?: (s: Service) => string }) {
  return (
    <Section id="services">
      <SectionHeader eyebrow={eyebrow} title={title ?? <>Four disciplines. <span className="text-gold-gradient">One growth system.</span></>} subtitle={subtitle ?? "Each service is powerful alone. Together they compound: brand builds trust, websites convert, SEO scales reach and lead generation fills the calendar."} />
      <div className="grid gap-5 md:grid-cols-2">
        {coreServices.map((s, i) => {
          const subs = getSubServices(s.slug);
          const href = hrefFor ? hrefFor(s) : `/services/${s.slug}`;
          return (
            <div key={s.slug} data-reveal data-reveal-delay={(i % 2) * 100}>
              <GlassCard as="article" className="group flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <IconBadge icon={s.icon} />
                  <Link href={href} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition-all group-hover:border-gold group-hover:bg-gold-gradient" aria-label={`Learn about ${s.name}`}>
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
                  <Link href={href} className="transition-colors hover:text-gold-deep">{s.name}{locationName ? ` in ${locationName}` : ""}</Link>
                </h3>
                <p className="mt-2 text-[15.5px] leading-7 text-slate">{s.tagline}</p>
                <ul className="mt-5 grid gap-2 text-[14.5px] text-graphite sm:grid-cols-2">
                  {s.deliverables.slice(0, 4).map((d) => (
                    <li key={d} className="flex items-start gap-2"><Check size={16} className="mt-1 shrink-0 text-gold" /> {d}</li>
                  ))}
                </ul>
                {subs.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                    {subs.map((sub) => (
                      <Link key={sub.slug} href={`/services/${sub.slug}`} className="rounded-full bg-ink/5 px-3 py-1.5 text-[13px] font-medium text-graphite transition-colors hover:bg-gold-pale hover:text-gold-deep">
                        {sub.shortName}
                      </Link>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- Process ---------- */
export function ProcessSteps({ steps, title, eyebrow = "How we work", dark }: { steps: { title: string; text: string }[]; title?: React.ReactNode; eyebrow?: string; dark?: boolean }) {
  return (
    <Section tone={dark ? "dark" : "default"}>
      <SectionHeader dark={dark} eyebrow={eyebrow} title={title ?? <>A process built for <span className="text-gold-gradient">clarity and momentum.</span></>} />
      <ol className="grid gap-4 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.title} data-reveal data-reveal-delay={i * 80} className={cn("relative rounded-glass p-6", dark ? "glass-dark" : "glass")}>
            <span className={cn("font-display text-4xl font-semibold", dark ? "text-gold-light/40" : "text-gold/40")}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={cn("mt-4 font-display text-lg font-semibold tracking-tight", dark ? "text-paper" : "text-ink")}>{s.title}</h3>
            <p className={cn("mt-2 text-[14.5px] leading-6", dark ? "text-paper/65" : "text-slate")}>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------- Stats strip ---------- */
export function StatsStrip({ items, className }: { items: { label: string; value: string }[]; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((s, i) => (
        <div key={s.label} data-reveal data-reveal-delay={i * 70} className="glass rounded-glass p-6 text-center">
          <p className="font-display text-4xl font-semibold tracking-tight text-gold-gradient md:text-5xl">{s.value}</p>
          <p className="mt-2 text-[13.5px] font-medium text-slate">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Feature list (benefits) ---------- */
export function BenefitsGrid({ items, title, eyebrow = "Why it works" }: { items: { title: string; text: string }[]; title?: React.ReactNode; eyebrow?: string }) {
  return (
    <Section tone="cream">
      <SectionHeader eyebrow={eyebrow} title={title ?? <>Built to deliver <span className="text-gold-gradient">measurable outcomes.</span></>} align="left" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b, i) => (
          <div key={b.title} data-reveal data-reveal-delay={i * 80} className="glass rounded-glass p-6">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient text-ink"><Check size={16} /></span>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">{b.title}</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-slate">{b.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Rich text block (two columns with visual) ---------- */
export function RichBlock({ eyebrow, title, paragraphs, visual, reverse, children, id }: { eyebrow?: string; title: React.ReactNode; paragraphs: string[]; visual?: React.ReactNode; reverse?: boolean; children?: React.ReactNode; id?: string }) {
  return (
    <Section id={id} size="sm">
      <div className={cn("grid items-center gap-12 lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2")}>
        <div data-reveal>
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <h2 className="font-display text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-ink md:text-4xl">{title}</h2>
          <div className="mt-6 space-y-5 text-[16px] leading-8 text-graphite">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          {children}
        </div>
        {visual && <div data-reveal data-reveal-delay={120}>{visual}</div>}
      </div>
    </Section>
  );
}

/* ---------- Location link grids ---------- */
export function CityLinks({ cities, hrefFor, title, eyebrow = "Service areas", subtitle, columns = 4 }: { cities: City[]; hrefFor: (c: City) => string; title: React.ReactNode; eyebrow?: string; subtitle?: string; columns?: 3 | 4 | 5 }) {
  return (
    <Section size="sm">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-8" />
      <ul className={cn("grid gap-2 sm:grid-cols-2", columns === 3 ? "lg:grid-cols-3" : columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
        {cities.map((c) => (
          <li key={c.slug}>
            <Link href={hrefFor(c)} className="group flex items-center justify-between rounded-2xl border border-ink/5 bg-white/50 px-4 py-3 text-[14.5px] font-medium text-graphite transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-white hover:text-ink">
              {c.name}
              <ArrowUpRight size={15} className="text-mist transition-colors group-hover:text-gold" />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ProvinceLinks({ provinces, hrefFor, title, eyebrow = "Across Canada", subtitle }: { provinces: Province[]; hrefFor: (p: Province) => string; title: React.ReactNode; eyebrow?: string; subtitle?: string }) {
  return (
    <Section size="sm">
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-8" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {provinces.map((p) => (
          <li key={p.slug}>
            <Link href={hrefFor(p)} className="group glass flex items-center justify-between rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-float">
              <span>
                <span className="block font-display text-[16px] font-semibold tracking-tight text-ink">{p.name}</span>
                <span className="block text-[12.5px] text-slate">{p.largestCity} · {p.population}</span>
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink transition-all group-hover:border-gold group-hover:bg-gold-gradient"><ArrowUpRight size={16} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------- Inline CTA row ---------- */
export function InlineCta({ text = "Want this for your business?", cta = "Talk to a strategist", href = "/contact" }: { text?: string; cta?: string; href?: string }) {
  return (
    <div className="glass mt-10 flex flex-col items-start justify-between gap-4 rounded-glass p-6 sm:flex-row sm:items-center" data-reveal>
      <p className="font-display text-lg font-semibold tracking-tight text-ink">{text}</p>
      <div className="flex gap-2">
        <Button href={href} size="sm" track="cta_inline">{cta} <ArrowIcon /></Button>
        {site.phone && <Button href={site.phoneHref} size="sm" variant="outline" track="phone_click">Call us</Button>}
      </div>
    </div>
  );
}
