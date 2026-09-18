import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, StatusBadge } from "@/components/admin/Charts";
import { formatDate, cn } from "@/lib/utils";
import { getService } from "@/lib/services";

export const dynamic = "force-dynamic";
const statuses = ["ALL", "NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && statuses.includes(sp.status) ? sp.status : "ALL";
  const q = sp.q?.trim();
  const leads = await prisma.lead.findMany({
    where: { ...(status !== "ALL" ? { status } : {}), ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { company: { contains: q } }, { message: { contains: q } }] } : {}) },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const csv = `/admin/leads/export${status !== "ALL" ? `?status=${status}` : ""}`;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Leads</h1><p className="text-[14px] text-slate">Every enquiry from the website, with source attribution.</p></div>
        <a href={csv} className="rounded-full border border-ink/15 px-4 py-2 text-[13px] font-semibold text-ink hover:border-gold">Export CSV</a>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((st) => (
          <Link key={st} href={`/admin/leads?status=${st}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold", status === st ? "bg-ink text-paper" : "bg-white text-graphite ring-1 ring-ink/10 hover:text-ink")}>{st}</Link>
        ))}
        <form className="ml-auto"><input type="hidden" name="status" value={status} /><input name="q" defaultValue={q} placeholder="Search leads…" className="h-9 w-56 rounded-full border border-ink/10 bg-white px-4 text-[13.5px] outline-none focus:border-gold" /></form>
      </div>
      <Card>
        {leads.length === 0 ? (
          <p className="text-[13.5px] text-slate">No leads match.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">Lead</th><th className="py-2 pr-4">Company</th><th className="py-2 pr-4">Service</th><th className="py-2 pr-4">Budget</th><th className="py-2 pr-4">Source</th><th className="py-2 pr-4">Status</th><th className="py-2">Received</th></tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-line align-top hover:bg-cream/50">
                    <td className="py-3 pr-4"><Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink hover:text-gold-deep">{l.name}</Link><br /><span className="text-slate">{l.email}{l.phone ? ` · ${l.phone}` : ""}</span></td>
                    <td className="py-3 pr-4">{l.company ?? "—"}<br /><span className="text-slate">{l.city ?? ""}</span></td>
                    <td className="py-3 pr-4">{getService(l.service ?? "")?.name ?? l.service ?? "—"}</td>
                    <td className="py-3 pr-4">{l.budget ?? "—"}</td>
                    <td className="py-3 pr-4 text-slate">{l.source ?? "—"}{l.utmSource ? <><br />utm: {l.utmSource}</> : null}</td>
                    <td className="py-3 pr-4"><StatusBadge status={l.status} /></td>
                    <td className="py-3 text-slate">{formatDate(l.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
