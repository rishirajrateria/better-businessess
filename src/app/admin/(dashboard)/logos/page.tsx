import { prisma } from "@/lib/db";
import { Card } from "@/components/admin/Charts";
import { LogoForm } from "@/components/admin/Forms";

export const dynamic = "force-dynamic";

export default async function LogosAdmin() {
  const items = await prisma.clientLogo.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Client logos</h1><p className="text-[14px] text-slate">The trust bar under the homepage hero.</p></div>
      <Card title="Add client logo"><LogoForm /></Card>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((l) => (
          <details key={l.id} className="rounded-3xl border border-ink/5 bg-white shadow-[0_10px_40px_-24px_rgba(10,10,10,0.25)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
              <span className="flex items-center gap-3">{l.logoUrl ? <img src={l.logoUrl} alt="" className="h-7 w-auto" /> : <span className="font-display text-lg font-semibold">{l.name}</span>}<span className="text-slate text-[13px]">{l.logoUrl ? l.name : ""}</span></span>
              {!l.published && <span className="rounded-full bg-cream px-2 py-0.5 text-[11.5px] font-semibold text-graphite">Hidden</span>}
            </summary>
            <div className="border-t border-line px-6 py-5"><LogoForm l={l} /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
