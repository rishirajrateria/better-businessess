"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { PRESETS, rangeQuery, stepRange, granularityLabel, type Granularity, type PresetId } from "@/lib/date-range";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type RangeProps = { preset: PresetId | "custom"; label: string; spanLabel: string; fromKey: string; toKey: string; todayKey: string };

const dateInput = "h-10 w-full min-w-0 rounded-xl border border-ink/10 bg-white px-3 text-[14px] text-ink outline-none focus:border-gold focus:ring-4 focus:ring-gold/15";
const arrow = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-gold";

/**
 * Date range picker for the admin reports: quick ranges (today … all time), a custom from/to range
 * (set both to the same date for a single day), and ‹ › buttons that step to the previous or next
 * period. State lives in the URL, so every view is bookmarkable and works without JavaScript apart
 * from opening the panel.
 */
export function DateRangeFilter({ basePath, range }: { basePath: string; range: RangeProps }) {
  const { preset, label, spanLabel, fromKey, toKey, todayKey } = range;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [preset, fromKey, toKey]); // close after choosing a range
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (q: string) => `${basePath}?${q}`;
  const step = (dir: -1 | 1) => {
    const s = stepRange({ preset, fromKey, toKey, todayKey }, dir);
    return s ? href(new URLSearchParams({ from: s.from, to: s.to }).toString()) : null;
  };
  const prev = step(-1);
  const next = step(1);
  const pill = (active: boolean) => cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition", active ? "bg-ink text-paper" : "bg-cream text-graphite hover:bg-gold-pale hover:text-ink");

  return (
    <div ref={root} className="relative flex items-center gap-2">
      {prev ? (
        <Link href={prev} className={arrow} aria-label="Previous period" title="Previous period"><ChevronLeft size={18} /></Link>
      ) : (
        <span className={cn(arrow, "cursor-not-allowed opacity-40")} aria-disabled="true" aria-label="No previous period"><ChevronLeft size={18} /></span>
      )}
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2.5 rounded-full border border-ink/10 bg-white px-4 text-left text-[13px] transition hover:border-gold"
      >
        <CalendarDays size={16} className="shrink-0 text-gold" />
        <span className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-2">
          <span className="font-semibold text-ink">{label}</span>
          <span className="text-[12px] text-slate">{spanLabel}</span>
        </span>
        <ChevronDown size={15} className={cn("shrink-0 text-slate transition", open && "rotate-180")} />
      </button>
      {next ? (
        <Link href={next} className={arrow} aria-label="Next period" title="Next period"><ChevronRight size={18} /></Link>
      ) : (
        <span className={cn(arrow, "cursor-not-allowed opacity-40")} aria-disabled="true" aria-label="No next period"><ChevronRight size={18} /></span>
      )}

      {open && (
        <div role="dialog" aria-label="Choose a date range" className="fixed inset-x-3 top-24 z-40 max-h-[80vh] overflow-auto rounded-3xl border border-ink/5 bg-white p-5 shadow-[0_30px_80px_-30px_rgba(10,10,10,0.45)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[560px]">
          {(["recent", "calendar"] as const).map((g) => (
            <div key={g} className="mb-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">{g === "recent" ? "Recent" : "Calendar"}</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.filter((x) => x.group === g).map((x) => (
                  <Link key={x.id} href={href(`range=${x.id}`)} className={pill(preset === x.id)} aria-current={preset === x.id ? "true" : undefined}>{x.label}</Link>
                ))}
              </div>
            </div>
          ))}
          <form key={`${fromKey}${toKey}`} action={basePath} method="get" className="border-t border-line pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">Custom range or single day</p>
            <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="block text-[12px] font-semibold text-graphite">From<input type="date" name="from" required defaultValue={fromKey} max={todayKey} className={cn(dateInput, "mt-1 font-normal")} /></label>
              <label className="block text-[12px] font-semibold text-graphite">To<input type="date" name="to" required defaultValue={toKey} max={todayKey} className={cn(dateInput, "mt-1 font-normal")} /></label>
              <button type="submit" className="col-span-2 h-10 rounded-full bg-ink px-5 text-[13px] font-semibold text-paper transition hover:bg-ink-soft sm:col-span-1">Apply</button>
            </div>
            <p className="mt-3 text-[12px] leading-5 text-slate">Pick the same date in both boxes to see a single day hour by hour. Weeks start on Monday. Dates and times are in {site.timeZoneLabel}.</p>
          </form>
        </div>
      )}
    </div>
  );
}

/** Day / Week / Month switch for the chart; hidden when the range only supports one view. */
export function GroupToggle({ basePath, range, options, current }: { basePath: string; range: Pick<RangeProps, "preset" | "fromKey" | "toKey">; options: Granularity[]; current: Granularity }) {
  if (options.length < 2) return null;
  return (
    <div className="flex rounded-full border border-ink/10 bg-white p-0.5 text-[12px] font-semibold" role="group" aria-label="Group chart by">
      {options.map((g) => (
        <Link key={g} href={`${basePath}?${rangeQuery(range, { group: g })}`} scroll={false} className={cn("rounded-full px-3 py-1", current === g ? "bg-ink text-paper" : "text-graphite hover:text-ink")} aria-current={current === g ? "true" : undefined}>{granularityLabel(g)}</Link>
      ))}
    </div>
  );
}
