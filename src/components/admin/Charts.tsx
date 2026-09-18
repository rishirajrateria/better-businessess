import { cn } from "@/lib/utils";

export function Card({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={cn("rounded-3xl border border-ink/5 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(10,10,10,0.25)]", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, change, hint }: { label: string; value: string | number; change?: number; hint?: string }) {
  return (
    <div className="rounded-3xl border border-ink/5 bg-white p-5 shadow-[0_10px_40px_-24px_rgba(10,10,10,0.25)]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{typeof value === "number" ? value.toLocaleString("en-CA") : value}</p>
      <p className="mt-1 text-[12.5px] text-slate">
        {change !== undefined && <span className={cn("mr-2 rounded-full px-2 py-0.5 font-semibold", change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>{change >= 0 ? "+" : ""}{change}%</span>}
        {hint}
      </p>
    </div>
  );
}

/** Dual-series area chart (views) with bars (leads), pure SVG. */
export function TrendChart({ series }: { series: { date: string; views: number; sessions: number; leads: number }[] }) {
  const W = 720, H = 220, P = 28;
  const maxV = Math.max(1, ...series.map((s) => s.views));
  const maxL = Math.max(1, ...series.map((s) => s.leads));
  const x = (i: number) => P + (i / Math.max(1, series.length - 1)) * (W - P * 2);
  const yV = (v: number) => H - P - (v / maxV) * (H - P * 2);
  const line = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${yV(s.views).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1)} ${H - P} L${x(0)} ${H - P} Z`;
  const sLine = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${yV(s.sessions).toFixed(1)}`).join(" ");
  const bw = Math.max(3, ((W - P * 2) / series.length) * 0.5);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Page views, sessions and leads over time">
      <defs>
        <linearGradient id="tcFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C19A3E" stopOpacity="0.35" /><stop offset="1" stopColor="#C19A3E" stopOpacity="0" /></linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={P} x2={W - P} y1={yV(maxV * f)} y2={yV(maxV * f)} stroke="rgba(10,10,10,0.06)" />)}
      {series.map((s, i) => s.leads > 0 && <rect key={s.date} x={x(i) - bw / 2} y={H - P - (s.leads / maxL) * (H - P * 2) * 0.6} width={bw} height={(s.leads / maxL) * (H - P * 2) * 0.6} rx="2" fill="#0A0A0A" opacity="0.85" />)}
      <path d={area} fill="url(#tcFill)" />
      <path d={line} fill="none" stroke="#C19A3E" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={sLine} fill="none" stroke="#9A7628" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      {(() => {
        const step = Math.ceil(series.length / 8);
        const last = series.length - 1;
        return series.map((s, i) => {
          const regular = i % step === 0 && last - i >= step / 2;
          if (!regular && i !== last) return null;
          return <text key={s.date} x={x(i)} y={H - 8} fontSize="10" textAnchor="middle" fill="#6b6b6b">{s.date.slice(5)}</text>;
        });
      })()}
      <g fontSize="10" fill="#6b6b6b"><text x={P} y={14}>views · sessions (dashed) · leads (bars)</text><text x={W - P} y={14} textAnchor="end">max {maxV}</text></g>
    </svg>
  );
}

export function BarList({ rows, total, format }: { rows: [string, number][]; total?: number; format?: (k: string) => React.ReactNode }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  const t = total ?? rows.reduce((a, r) => a + r[1], 0);
  if (!rows.length) return <p className="text-[13.5px] text-slate">No data yet.</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map(([k, v]) => (
        <li key={k} className="text-[13.5px]">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-graphite">{format ? format(k) : k}</span>
            <span className="shrink-0 font-semibold text-ink">{v.toLocaleString("en-CA")} <span className="text-slate font-normal">· {t ? Math.round((v / t) * 100) : 0}%</span></span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-gold-gradient" style={{ width: `${(v / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { NEW: "bg-gold-pale text-gold-deep", CONTACTED: "bg-blue-50 text-blue-700", QUALIFIED: "bg-violet-50 text-violet-700", WON: "bg-emerald-50 text-emerald-700", LOST: "bg-red-50 text-red-600" };
  return <span className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wide", map[status] ?? "bg-cream text-graphite")}>{status}</span>;
}
