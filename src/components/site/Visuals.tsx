import { cn } from "@/lib/utils";

/* ---------- Ambient floating orbs ---------- */
export function Orbs({ className, variant = "light" }: { className?: string; variant?: "light" | "dark" }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className={cn("absolute -left-32 -top-32 h-[38rem] w-[38rem] rounded-full blur-3xl animate-float-slow", variant === "light" ? "bg-gold/20" : "bg-gold/25")} />
      <div className={cn("absolute right-[-10%] top-[10%] h-[30rem] w-[30rem] rounded-full blur-3xl animate-float", variant === "light" ? "bg-gold-light/30" : "bg-gold-light/10")} style={{ animationDelay: "-3s" }} />
      <div className={cn("absolute bottom-[-20%] left-[30%] h-[28rem] w-[28rem] rounded-full blur-3xl animate-float-slow", variant === "light" ? "bg-ink/5" : "bg-white/5")} style={{ animationDelay: "-6s" }} />
    </div>
  );
}

/* ---------- Growth line chart (SEO) ---------- */
export function GrowthChart({ className, accent = "#C19A3E" }: { className?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={cn("w-full", className)} aria-hidden="true">
      <defs>
        <linearGradient id="gcFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gcLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#9A7628" />
          <stop offset="1" stopColor="#E3C97F" />
        </linearGradient>
      </defs>
      {[30, 70, 110, 150].map((y) => (
        <line key={y} x1="20" x2="300" y1={y} y2={y} stroke="rgba(10,10,10,0.06)" />
      ))}
      <path d="M20 150 C 60 145, 80 130, 110 120 S 160 100, 190 80 S 240 50, 300 22 L 300 160 L 20 160 Z" fill="url(#gcFill)" />
      <path d="M20 150 C 60 145, 80 130, 110 120 S 160 100, 190 80 S 240 50, 300 22" fill="none" stroke="url(#gcLine)" strokeWidth="3" strokeLinecap="round" />
      {[
        [110, 120],
        [190, 80],
        [300, 22],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="9" fill={accent} opacity="0.18" className="animate-pulse-soft" />
          <circle cx={x} cy={y} r="4" fill="#fff" stroke={accent} strokeWidth="2.5" />
        </g>
      ))}
      <g fontFamily="var(--font-display)" fontSize="10" fill="#6b6b6b">
        <text x="20" y="175">Jan</text>
        <text x="150" y="175">Jun</text>
        <text x="282" y="175">Dec</text>
      </g>
    </svg>
  );
}

/* ---------- Funnel (lead generation) ---------- */
export function FunnelVisual({ className }: { className?: string }) {
  const rows = [
    { w: 260, label: "Impressions", v: "184k" },
    { w: 200, label: "Clicks", v: "9,420" },
    { w: 140, label: "Leads", v: "612" },
    { w: 90, label: "Customers", v: "148" },
  ];
  return (
    <svg viewBox="0 0 320 200" className={cn("w-full", className)} aria-hidden="true">
      <defs>
        <linearGradient id="fnGold" x1="0" x2="1">
          <stop offset="0" stopColor="#9A7628" />
          <stop offset="1" stopColor="#E3C97F" />
        </linearGradient>
      </defs>
      {rows.map((r, i) => {
        const y = 14 + i * 46;
        const x = (320 - r.w) / 2;
        const last = i === rows.length - 1;
        return (
          <g key={r.label}>
            <rect x={x} y={y} width={r.w} height="34" rx="17" fill={last ? "url(#fnGold)" : "rgba(10,10,10,0.06)"} stroke={last ? "none" : "rgba(10,10,10,0.08)"} />
            <text x="160" y={y + 21} textAnchor="middle" fontSize="11" fontWeight="600" fill={last ? "#0A0A0A" : "#3a3a3a"} fontFamily="var(--font-display)">
              {r.label} · {r.v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Browser mockup (web development) ---------- */
export function BrowserMockup({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("glass-strong glass overflow-hidden rounded-3xl", className)} aria-hidden="true">
      <div className="flex items-center gap-2 border-b border-ink/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-ink/5 text-[10px] leading-5 text-slate pl-3 font-medium">betterbusinesses.ca</span>
      </div>
      <div className="p-5">
        {children ?? (
          <>
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-ink/80" />
              <div className="flex gap-2">
                <div className="h-2 w-10 rounded bg-ink/10" />
                <div className="h-2 w-10 rounded bg-ink/10" />
                <div className="h-5 w-14 rounded-full bg-gold-gradient" />
              </div>
            </div>
            <div className="mt-6 h-5 w-3/4 rounded bg-ink/80" />
            <div className="mt-2 h-5 w-1/2 rounded bg-ink/80" />
            <div className="mt-4 h-2 w-2/3 rounded bg-ink/10" />
            <div className="mt-2 h-2 w-1/2 rounded bg-ink/10" />
            <div className="mt-5 flex gap-2">
              <div className="h-7 w-24 rounded-full bg-ink" />
              <div className="h-7 w-24 rounded-full border border-ink/15" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-gradient-to-br from-gold-pale to-white ring-1 ring-ink/5" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Brand swatches (branding) ---------- */
export function BrandVisual({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 gap-3", className)} aria-hidden="true">
      <div className="col-span-2 row-span-2 flex items-center justify-center rounded-2xl bg-ink">
        <svg viewBox="0 0 64 64" className="h-16 w-16">
          <path d="M31 16h-9.5c-5 0-8.5 3.2-8.5 7.6 0 2.9 1.6 5.2 4 6.3-3 1-5 3.6-5 7 0 4.9 3.7 8.1 9 8.1H31V40h-8.4c-2.1 0-3.4-1.2-3.4-3s1.3-3 3.4-3H31v-5.2h-8c-2 0-3.1-1.1-3.1-2.8s1.1-2.8 3.1-2.8h8V16z" fill="#fff" />
          <path d="M33 16h9.5c5 0 8.5 3.2 8.5 7.6 0 2.9-1.6 5.2-4 6.3 3 1 5 3.6 5 7 0 4.9-3.7 8.1-9 8.1H33V40h8.4c2.1 0 3.4-1.2 3.4-3s-1.3-3-3.4-3H33v-5.2h8c2 0 3.1-1.1 3.1-2.8s-1.1-2.8-3.1-2.8h-8V16z" fill="#C19A3E" />
        </svg>
      </div>
      <div className="rounded-2xl bg-gold-gradient" />
      <div className="rounded-2xl bg-gold-pale ring-1 ring-gold/20" />
      <div className="rounded-2xl bg-paper ring-1 ring-ink/10" />
      <div className="rounded-2xl bg-graphite" />
      <div className="col-span-4 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-ink/5">
        <span className="font-display text-lg font-semibold tracking-tight">Aa</span>
        <span className="font-sans text-sm text-slate">Bricolage · Instrument</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold-deep">Identity system</span>
      </div>
    </div>
  );
}

/* ---------- Pick visual by service ---------- */
export function ServiceVisual({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case "lead-generation":
    case "google-ads":
    case "social-media-advertising":
      return (
        <div className={cn("glass rounded-glass p-5", className)}>
          <FunnelVisual />
        </div>
      );
    case "seo":
    case "local-seo":
      return (
        <div className={cn("glass rounded-glass p-5", className)}>
          <GrowthChart />
        </div>
      );
    case "website-development":
    case "ecommerce-development":
      return <BrowserMockup className={className} />;
    default:
      return (
        <div className={cn("glass rounded-glass p-5", className)}>
          <BrandVisual />
        </div>
      );
  }
}

/* ---------- Abstract gradient tile for projects without images ---------- */
export function ProjectTile({ seed, accent, className, title }: { seed: string; accent?: string; className?: string; title?: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const a = accent ?? ["#C19A3E", "#9A7628", "#E3C97F", "#1C1C1C", "#3A3A3A"][h % 5];
  const rot = (h % 60) - 30;
  return (
    <div className={cn("relative overflow-hidden bg-ink", className)} aria-hidden="true">
      <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-70 blur-2xl" style={{ background: a, transform: `rotate(${rot}deg)` }} />
      <div className="absolute -bottom-16 left-1/4 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ background: "#E3C97F" }} />
      {title && <span className="absolute bottom-5 left-5 font-display text-xl font-semibold tracking-tight text-paper/90">{title}</span>}
    </div>
  );
}
