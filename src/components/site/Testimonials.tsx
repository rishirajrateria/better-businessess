import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export type TestimonialItem = { id: string; name: string; role?: string | null; company?: string | null; location?: string | null; quote: string; rating: number; avatarUrl?: string | null };

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-gold", className)} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < n ? "currentColor" : "none"} strokeWidth={1.5} className={i < n ? "" : "opacity-30"} />
      ))}
    </span>
  );
}

export function TestimonialCard({ t, className }: { t: TestimonialItem; className?: string }) {
  return (
    <figure className={cn("glass flex h-full flex-col rounded-glass p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-float", className)}>
      <Quote size={22} className="text-gold/70" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-[16px] leading-7 text-ink-soft">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold-gradient font-display text-sm font-semibold text-ink">
          {t.avatarUrl ? <img src={t.avatarUrl} alt="" className="h-full w-full object-cover" /> : t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </span>
        <span>
          <span className="block font-display text-[15px] font-semibold tracking-tight text-ink">{t.name}</span>
          <span className="block text-[13px] text-slate">{[t.role, t.company].filter(Boolean).join(", ")}{t.location ? ` · ${t.location}` : ""}</span>
        </span>
        <Stars n={t.rating} className="ml-auto" />
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection({ items, title, eyebrow = "Client results", subtitle }: { items: TestimonialItem[]; title?: React.ReactNode; eyebrow?: string; subtitle?: string }) {
  if (!items.length) return null;
  return (
    <section className="relative py-20 md:py-28" id="testimonials">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader eyebrow={eyebrow} title={title ?? <>Trusted by Canadian businesses <span className="text-gold-gradient">that measure results.</span></>} subtitle={subtitle ?? "Real outcomes from real owners and marketing leaders across Canada."} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((t, i) => (
            <div key={t.id} data-reveal data-reveal-delay={(i % 3) * 90}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
