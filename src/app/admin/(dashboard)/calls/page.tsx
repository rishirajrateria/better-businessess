import Link from "next/link";
import { Phone, Copy } from "lucide-react";
import { getCallStats, getEarliestActivityKey } from "@/lib/analytics";
import { resolveRange, granularityNoun, type RangeParams } from "@/lib/date-range";
import { Card, StatCard, BarList, CallBars } from "@/components/admin/Charts";
import { DateRangeFilter, GroupToggle } from "@/components/admin/DateRangeFilter";
import { formatAdminDate, cn } from "@/lib/utils";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Calls" };

const BASE = "/admin/calls";

export default async function CallsPage({ searchParams }: { searchParams: Promise<RangeParams> }) {
  const sp = await searchParams;
  const r = resolveRange(sp, { earliestKey: sp.range === "all" ? await getEarliestActivityKey() : null });
  const s = await getCallStats(r);
  const pick = { preset: r.preset, label: r.label, spanLabel: r.spanLabel, fromKey: r.fromKey, toKey: r.toKey, todayKey: r.todayKey };
  const rows = [...s.series].reverse(); // newest first
  const hasActivity = s.totals.actions > 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Calls</h1>
          <p className="text-[14px] text-slate">How many people tapped or clicked {site.phone || "your phone number"} or a Call button, and how many copied the number.</p>
        </div>
        <DateRangeFilter basePath={BASE} range={pick} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Call clicks" value={s.totals.calls} change={s.totals.callsChange} hint={`${s.totals.floating} from the floating button`} />
        <StatCard label="Number copied" value={s.totals.copies} hint={s.totals.menu ? `+ ${s.totals.menu} right-click / long-press` : "selected and copied"} />
        <StatCard label="People who engaged" value={s.totals.people} hint={`${s.totals.rate}% of ${s.totals.sessions.toLocaleString("en-CA")} ${s.totals.sessions === 1 ? "visit" : "visits"}`} />
        <StatCard label="Total call actions" value={s.totals.actions} change={s.totals.actionsChange} hint="clicks + copies" />
      </div>

      <Card title={`Call activity · ${r.spanLabel}`} action={<GroupToggle basePath={BASE} range={pick} options={r.groupOptions} current={r.granularity} />}>
        <CallBars series={s.series} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Call clicks by button"><BarList rows={s.byLocation} /></Card>
        <Card title="Number copied from"><BarList rows={s.copyByLocation} /></Card>
        <Card title="Device"><BarList rows={s.byDevice} /></Card>
      </div>

      <Card title={granularityNoun(r.granularity)} action={<span className="text-[12px] text-slate">{r.spanLabel}</span>}>
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-[13.5px]">
            <thead className="sticky top-0 bg-white"><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">{r.granularity === "hour" ? "Hour" : r.granularity === "day" ? "Date" : r.granularity === "week" ? "Week" : "Month"}</th><th className="py-2 pr-4 text-right">Call clicks</th><th className="py-2 pr-4 text-right">Number copied</th><th className="py-2 pr-4 text-right">Right-click / long-press</th><th className="py-2 text-right">People</th></tr></thead>
            <tbody>
              <tr className="border-t border-line bg-cream/50 font-semibold text-ink"><td className="py-2.5 pr-4">Total</td><td className="py-2.5 pr-4 text-right">{s.totals.calls}</td><td className="py-2.5 pr-4 text-right">{s.totals.copies}</td><td className="py-2.5 pr-4 text-right">{s.totals.menu}</td><td className="py-2.5 text-right">{s.totals.people}</td></tr>
              {rows.map((d) => {
                const empty = d.calls + d.copies === 0;
                const cell = (n: number) => <span className={cn(n === 0 && "text-mist")}>{n}</span>;
                return (
                  <tr key={d.key} className={cn("border-t border-line", empty && "text-slate")}>
                    <td className="py-2 pr-4 whitespace-nowrap">{d.full}</td>
                    <td className="py-2 pr-4 text-right">{cell(d.calls)}</td>
                    <td className="py-2 pr-4 text-right">{cell(d.copiedOnly)}</td>
                    <td className="py-2 pr-4 text-right">{cell(d.menu)}</td>
                    <td className="py-2 text-right">{cell(d.people)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {r.granularity === "week" && <p className="mt-3 text-[12px] text-slate">Weeks start on Monday; the first and last week only count days inside the selected range.</p>}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Pages that drive calls" className="lg:col-span-1"><BarList rows={s.byPage} format={(k) => <Link href={k} target="_blank" className="hover:text-gold-deep">{k}</Link>} /></Card>
        <Card title="Recent activity" className="lg:col-span-2">
          {s.recent.length === 0 ? (
            <p className="text-[13.5px] text-slate">{hasActivity ? "" : "No call clicks in this period. They appear here the moment a visitor taps or clicks your number."}</p>
          ) : (
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-[13.5px]">
                <thead className="sticky top-0 bg-white"><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">When</th><th className="py-2 pr-4">Action</th><th className="py-2 pr-4">Where</th><th className="py-2 pr-4">Page</th><th className="py-2">Device</th></tr></thead>
                <tbody>
                  {s.recent.map((x) => (
                    <tr key={x.id} className="border-t border-line">
                      <td className="py-2 pr-4 whitespace-nowrap text-slate">{formatAdminDate(x.at)}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {x.kind === "call" ? <span className="inline-flex items-center gap-1.5 font-semibold text-gold-deep"><Phone size={13} /> Clicked call</span> : <span className="inline-flex items-center gap-1.5 font-semibold text-graphite"><Copy size={13} /> {x.method === "menu" ? "Right-click / long-press" : "Copied number"}</span>}
                      </td>
                      <td className="py-2 pr-4">{x.location}</td>
                      <td className="py-2 pr-4 text-slate">{x.path}</td>
                      <td className="py-2">{x.device}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.truncated && <p className="mt-3 text-[12px] text-amber-700">This range has more activity than can be listed; the figures cover the most recent 20,000 actions. Choose a shorter range for exact numbers.</p>}
        </Card>
      </div>
      <p className="text-[12.5px] text-slate">
        A click means the visitor tapped or clicked the number or a Call button; it cannot confirm the call connected. Visits from search-engine and AI bots are excluded. Dates and times are in {site.timeZoneLabel}.
        {r.comparable && <> Percent changes compare with the previous period of the same length ({r.prevSpanLabel}).</>}
      </p>
    </div>
  );
}
