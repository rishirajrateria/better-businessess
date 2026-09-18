import { prisma } from "@/lib/db";
import { Card } from "@/components/admin/Charts";
import { TestimonialForm } from "@/components/admin/Forms";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdmin() {
  const items = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Testimonials</h1><p className="text-[14px] text-slate">Shown on the homepage, service and location pages.</p></div>
      <Card title="Add testimonial"><TestimonialForm /></Card>
      <div className="space-y-3">
        {items.map((t) => (
          <details key={t.id} className="group rounded-3xl border border-ink/5 bg-white shadow-[0_10px_40px_-24px_rgba(10,10,10,0.25)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
              <span><span className="font-semibold text-ink">{t.name}</span> <span className="text-slate">{[t.role, t.company].filter(Boolean).join(", ")}</span><br /><span className="text-[13px] text-graphite">“{t.quote.slice(0, 110)}{t.quote.length > 110 ? "…" : ""}”</span></span>
              <span className="flex shrink-0 items-center gap-2 text-[11.5px] font-semibold"><span className="text-gold">{"★".repeat(t.rating)}</span>{!t.published && <span className="rounded-full bg-cream px-2 py-0.5 text-graphite">Hidden</span>}{t.featured && <span className="rounded-full bg-gold-pale px-2 py-0.5 text-gold-deep">Featured</span>}</span>
            </summary>
            <div className="border-t border-line px-6 py-5"><TestimonialForm t={t} /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
