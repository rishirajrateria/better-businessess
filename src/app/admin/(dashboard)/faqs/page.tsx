import { prisma } from "@/lib/db";
import { Card } from "@/components/admin/Charts";
import { FaqForm } from "@/components/admin/Forms";
import { getService } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function FaqsAdmin() {
  const items = await prisma.faq.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">FAQs</h1><p className="text-[14px] text-slate">Custom FAQs are added to the built-in ones and output with FAQ schema for Google and AI search.</p></div>
      <Card title="Add FAQ"><FaqForm /></Card>
      <div className="space-y-3">
        {items.map((f) => (
          <details key={f.id} className="rounded-3xl border border-ink/5 bg-white shadow-[0_10px_40px_-24px_rgba(10,10,10,0.25)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
              <span><span className="font-semibold text-ink">{f.question}</span><br /><span className="text-[13px] text-slate">{f.answer.slice(0, 120)}{f.answer.length > 120 ? "…" : ""}</span></span>
              <span className="flex shrink-0 gap-2 text-[11.5px] font-semibold"><span className="rounded-full bg-gold-pale px-2 py-0.5 text-gold-deep">{f.category === "general" ? "General" : getService(f.category)?.shortName ?? f.category}</span>{!f.published && <span className="rounded-full bg-cream px-2 py-0.5 text-graphite">Hidden</span>}</span>
            </summary>
            <div className="border-t border-line px-6 py-5"><FaqForm f={f} /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
