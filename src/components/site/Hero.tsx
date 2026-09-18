import Link from "next/link";
import { ArrowUpRight, TrendingUp, Users, Zap } from "lucide-react";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Orbs, GrowthChart } from "./Visuals";
import { Stars } from "./Testimonials";
import { site } from "@/lib/site";
import { coreServices } from "@/lib/services";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <Orbs />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <Eyebrow>Canadian digital growth agency</Eyebrow>
          <h1 className="mt-6 font-display text-balance text-[2.75rem] font-medium leading-[1.0] tracking-tight text-ink sm:text-6xl md:text-7xl">
            Strategy. Growth.
            <br />
            <span className="shimmer-text">Results.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-graphite md:text-xl" data-speakable>
            {site.name} helps Canadian companies get found on Google, recommended by AI, and chosen by customers through <strong className="font-semibold text-ink">lead generation, SEO, website development and branding</strong>.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" size="lg" track="cta_hero_primary">
              Get a free growth audit <ArrowIcon />
            </Button>
            <Button href="/projects" variant="glass" size="lg" track="cta_hero_secondary">
              See our work
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13.5px] text-slate">
            <span className="inline-flex items-center gap-2"><Stars n={5} /> Rated 5.0 by clients</span>
            <span className="inline-flex items-center gap-2"><Users size={15} className="text-gold" /> {site.stats.projects} projects delivered</span>
            <span className="inline-flex items-center gap-2"><TrendingUp size={15} className="text-gold" /> {site.stats.avgRoi} average client ROI</span>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {coreServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="glass-pill inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-medium text-graphite transition-all hover:-translate-y-0.5 hover:text-ink">
                  {s.name} <ArrowUpRight size={14} className="text-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual composition */}
        <div className="relative lg:col-span-5" data-reveal data-reveal-delay={150} aria-hidden="true">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white via-cream to-gold-pale shadow-glass" />
                        {/* main glass card */}
            <div className="glass glass-strong absolute left-6 right-6 top-8 rounded-3xl p-5 animate-float">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Organic growth</span>
                <span className="rounded-full bg-gold-pale px-2 py-0.5 text-[11px] font-semibold text-gold-deep">+187%</span>
              </div>
              <GrowthChart className="mt-2" />
            </div>
            {/* floating lead card */}
            <div className="glass-dark absolute -left-2 bottom-24 w-56 rounded-2xl p-4 text-paper animate-float-slow sm:-left-8" style={{ animationDelay: "-4s" }}>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light"><Zap size={12} /> New lead</div>
              <p className="mt-2 font-display text-[15px] font-semibold">Quote request · Calgary</p>
              <p className="text-[12px] text-paper/60">Google Ads · $18.40 CPL</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full w-4/5 rounded-full bg-gold-gradient" /></div>
            </div>
            {/* floating brand card */}
            <div className="glass absolute -right-2 bottom-8 w-48 rounded-2xl p-4 animate-float sm:-right-6" style={{ animationDelay: "-7s" }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Brand system</p>
              <div className="mt-3 flex gap-1.5">
                <span className="h-7 w-7 rounded-lg bg-ink" />
                <span className="h-7 w-7 rounded-lg bg-gold-gradient" />
                <span className="h-7 w-7 rounded-lg bg-gold-pale ring-1 ring-gold/30" />
                <span className="h-7 w-7 rounded-lg bg-paper ring-1 ring-ink/10" />
              </div>
              <p className="mt-3 font-display text-[15px] font-semibold tracking-tight">Aa · Bricolage</p>
            </div>
            {/* AI badge */}
            <div className="glass-pill absolute right-6 top-2 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-ink animate-float-slow" style={{ animationDelay: "-2s" }}>
              Cited in AI search results
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, subtitle, children, breadcrumbs, compact, visual }: { eyebrow?: string; title: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode; breadcrumbs?: React.ReactNode; compact?: boolean; visual?: React.ReactNode }) {
  return (
    <section className={`relative overflow-hidden ${compact ? "pb-10 pt-6 md:pb-14 md:pt-10" : "pb-14 pt-6 md:pb-20 md:pt-12"}`}>
      <Orbs />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {breadcrumbs && <div className="mb-8">{breadcrumbs}</div>}
        <div className={`grid items-center gap-12 ${visual ? "lg:grid-cols-12" : ""}`}>
          <div className={visual ? "lg:col-span-7" : "max-w-4xl"} data-reveal>
            {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
            <h1 className="font-display text-balance text-4xl font-medium leading-[1.04] tracking-tight text-ink sm:text-5xl md:text-6xl">{title}</h1>
            {subtitle && <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-graphite md:text-xl" data-speakable>{subtitle}</p>}
            {children}
          </div>
          {visual && <div className="lg:col-span-5" data-reveal data-reveal-delay={150}>{visual}</div>}
        </div>
      </div>
    </section>
  );
}
