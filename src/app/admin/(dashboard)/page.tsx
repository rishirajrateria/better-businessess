import Link from "next/link";
import { getDashboardStats, type Range } from "@/lib/analytics";
import { Card, StatCard, TrendChart, BarList, StatusBadge } from "@/components/admin/Charts";
import { formatDate, cn } from "@/lib/utils";
import { getService } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const days = ([7, 30, 90] as Range[]).includes(Number(sp.range) as Range) ? (Number(sp.range) as Range) : 30;
  const s = await getDashboardStats(days);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="text-[14px] text-slate">Website analytics and lead performance, first-party and privacy-friendly.</p>
        </div>
        <div className="flex rounded-full border border-ink/10 bg-white p-1 text-[13px] font-semibold">
          {[7, 30, 90].map((r) => (
            <Link key={r} href={`/admin?range=${r}`} className={cn("rounded-full px-4 py-1.5", days === r ? "bg-ink text-paper" : "text-graphite hover:text-ink")}>{r}d</Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Page views" value={s.totals.views} change={s.totals.viewsChange} hint="vs previous period" />
        <StatCard label="Sessions / visitors" value={`${s.totals.sessions.toLocaleString()} / ${s.totals.visitors.toLocaleString()}`} hint="unique sessions and returning devices" />
        <StatCard label="Leads" value={s.totals.leads} change={s.totals.leadsChange} hint={`${s.totals.allTimeLeads} all time`} />
        <StatCard label="Conversion rate" value={`${s.totals.conversion}%`} hint={`${s.totals.formStarts} form starts · ${s.totals.ctaClicks} CTA clicks · ${s.totals.phoneClicks} calls`} />
      </div>

      <Card title={`Traffic & leads — last ${days} days`}>
        <TrendChart series={s.series} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Top pages"><BarList rows={s.topPages} total={s.totals.views} format={(k) => <Link href={k} target="_blank" className="hover:text-gold-deep">{k}</Link>} /></Card>
        <Card title="Top referrers"><BarList rows={s.topReferrers} /></Card>
        <Card title="Campaign sources (UTM)"><BarList rows={s.utms} /></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <Card title="Devices"><BarList rows={s.devices} /></Card>
        <Card title="Browsers"><BarList rows={s.browsers} /></Card>
        <Card title="Countries"><BarList rows={s.countries} /></Card>
        <Card title="Events"><BarList rows={s.events} /></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Leads by service"><BarList rows={s.leadsByService} format={(k) => getService(k)?.name ?? k} /></Card>
        <Card title="Leads by landing page"><BarList rows={s.leadsBySource} /></Card>
        <Card title="Pipeline status">
          <ul className="space-y-2 text-[13.5px]">
            {["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"].map((st) => (
              <li key={st} className="flex items-center justify-between"><StatusBadge status={st} /><span className="font-semibold text-ink">{s.leadsByStatus[st] ?? 0}</span></li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Recent leads" action={<Link href="/admin/leads" className="text-[13px] font-semibold text-gold-deep hover:underline">View all →</Link>}>
        {s.recentLeads.length === 0 ? (
          <p className="text-[13.5px] text-slate">No leads yet. Once the contact form is live they will appear here instantly.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Service</th><th className="py-2 pr-4">Source</th><th className="py-2 pr-4">Status</th><th className="py-2">Received</th></tr></thead>
              <tbody>
                {s.recentLeads.map((l) => (
                  <tr key={l.id} className="border-t border-line">
                    <td className="py-2.5 pr-4"><Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink hover:text-gold-deep">{l.name}</Link><br /><span className="text-slate">{l.email}</span></td>
                    <td className="py-2.5 pr-4">{getService(l.service ?? "")?.name ?? l.service ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-slate">{l.source ?? "—"}</td>
                    <td className="py-2.5 pr-4"><StatusBadge status={l.status} /></td>
                    <td className="py-2.5 text-slate">{formatDate(l.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
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
