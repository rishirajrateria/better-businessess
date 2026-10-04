import Link from "next/link";
import { Phone, Copy } from "lucide-react";
import { getCallStats, type Range } from "@/lib/analytics";
import { Card, StatCard, BarList } from "@/components/admin/Charts";
import { formatDate, cn } from "@/lib/utils";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Calls" };

function DailyBars({ series }: { series: { date: string; calls: number; copies: number }[] }) {
  const max = Math.max(1, ...series.map((d) => d.calls + d.copies));
  return (
    <div>
      <div className="flex h-40 items-end gap-[3px]" role="img" aria-label="Call clicks and number copies per day">
        {series.map((d) => (
          <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end" title={`${d.date}: ${d.calls} call clicks, ${d.copies} copies`}>
            <div className="w-full rounded-t-sm bg-ink/25" style={{ height: `${(d.copies / max) * 100}%` }} />
            <div className={cn("w-full bg-gold-gradient", d.copies === 0 && "rounded-t-sm")} style={{ height: `${(d.calls / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11.5px] text-slate">
        <span>{series[0]?.date}</span>
        <span className="flex items-center gap-3"><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-gold" /> call clicks</span><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-ink/25" /> number copied</span></span>
        <span>{series[series.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export default async function CallsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const days = ([7, 30, 90] as Range[]).includes(Number(sp.range) as Range) ? (Number(sp.range) as Range) : 30;
  const s = await getCallStats(days);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Calls</h1>
          <p className="text-[14px] text-slate">How many people tapped or clicked {site.phone || "your phone number"} or a Call button, and how many copied the number.</p>
        </div>
        <div className="flex rounded-full border border-ink/10 bg-white p-1 text-[13px] font-semibold">
          {[7, 30, 90].map((r) => (
            <Link key={r} href={`/admin/calls?range=${r}`} className={cn("rounded-full px-4 py-1.5", days === r ? "bg-ink text-paper" : "text-graphite hover:text-ink")}>{r}d</Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Call clicks" value={s.totals.calls} hint={`${s.totals.floating} from the floating button`} />
        <StatCard label="Number copied" value={s.totals.copies} hint={s.totals.menu ? `+ ${s.totals.menu} right-click / long-press` : "selected and copied"} />
        <StatCard label="People who engaged" value={s.totals.people} hint={`${s.totals.rate}% of ${s.totals.sessions.toLocaleString("en-CA")} visits`} />
        <StatCard label="Total call actions" value={s.totals.calls + s.totals.copies + s.totals.menu} hint="clicks + copies" />
      </div>

      <Card title={`Call activity — last ${days} days`}><DailyBars series={s.series} /></Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Call clicks by button"><BarList rows={s.byLocation} /></Card>
        <Card title="Number copied from"><BarList rows={s.copyByLocation} /></Card>
        <Card title="Device"><BarList rows={s.byDevice} /></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Pages that drive calls" className="lg:col-span-1"><BarList rows={s.byPage} format={(k) => <Link href={k} target="_blank" className="hover:text-gold-deep">{k}</Link>} /></Card>
        <Card title="Recent activity" className="lg:col-span-2">
          {s.recent.length === 0 ? (
            <p className="text-[13.5px] text-slate">No call clicks yet. They appear here the moment a visitor taps or clicks your number.</p>
          ) : (
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-[13.5px]">
                <thead className="sticky top-0 bg-white"><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">When</th><th className="py-2 pr-4">Action</th><th className="py-2 pr-4">Where</th><th className="py-2 pr-4">Page</th><th className="py-2">Device</th></tr></thead>
                <tbody>
                  {s.recent.map((r) => (
                    <tr key={r.id} className="border-t border-line">
                      <td className="py-2 pr-4 whitespace-nowrap text-slate">{formatDate(r.at, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {r.kind === "call" ? <span className="inline-flex items-center gap-1.5 font-semibold text-gold-deep"><Phone size={13} /> Clicked call</span> : <span className="inline-flex items-center gap-1.5 font-semibold text-graphite"><Copy size={13} /> {r.method === "menu" ? "Right-click / long-press" : "Copied number"}</span>}
                      </td>
                      <td className="py-2 pr-4">{r.location}</td>
                      <td className="py-2 pr-4 text-slate">{r.path}</td>
                      <td className="py-2">{r.device}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      <p className="text-[12.5px] text-slate">A click means the visitor tapped or clicked the number or a Call button; it cannot confirm the call connected. Visits from search-engine and AI bots are excluded.</p>
    </div>
  );
}
