/**
 * Date ranges for the admin reports (dashboard, calls). Everything is calendar-based in the
 * business time zone (site.timeZone), so "Today", "Month to date" or a single day mean the same
 * thing the owner sees on their clock, wherever the server runs (UTC on Vercel).
 *
 * A range is a pair of inclusive local dates (fromKey..toKey, "YYYY-MM-DD") plus the UTC instants
 * [from, to) that bound it for database queries. This module is pure (no database access).
 */
import { site } from "./site";

export const TZ = site.timeZone;
const MAX_DAYS = 1096; // three years: keeps queries and charts bounded

export type PresetId = "today" | "yesterday" | "7d" | "14d" | "30d" | "90d" | "wtd" | "lastweek" | "mtd" | "lastmonth" | "qtd" | "ytd" | "12m" | "all";
export type Granularity = "hour" | "day" | "week" | "month";
type Param = string | string[] | undefined;
export type RangeParams = { range?: Param; from?: Param; to?: Param; group?: Param };

export const PRESETS: { id: PresetId; label: string; group: "recent" | "calendar" }[] = [
  { id: "today", label: "Today", group: "recent" },
  { id: "yesterday", label: "Yesterday", group: "recent" },
  { id: "7d", label: "Last 7 days", group: "recent" },
  { id: "14d", label: "Last 14 days", group: "recent" },
  { id: "30d", label: "Last 30 days", group: "recent" },
  { id: "90d", label: "Last 90 days", group: "recent" },
  { id: "wtd", label: "Week to date", group: "calendar" },
  { id: "lastweek", label: "Last week", group: "calendar" },
  { id: "mtd", label: "Month to date", group: "calendar" },
  { id: "lastmonth", label: "Last month", group: "calendar" },
  { id: "qtd", label: "Quarter to date", group: "calendar" },
  { id: "ytd", label: "Year to date", group: "calendar" },
  { id: "12m", label: "Last 12 months", group: "calendar" },
  { id: "all", label: "All time", group: "calendar" },
];

export type ResolvedRange = {
  preset: PresetId | "custom";
  label: string;
  spanLabel: string;
  prevSpanLabel: string;
  fromKey: string;
  toKey: string;
  todayKey: string;
  days: number;
  /** [from, to) in UTC instants. */
  from: Date;
  to: Date;
  /** The period of equal length immediately before. */
  prevFrom: Date;
  prevTo: Date;
  /** False for "All time", where a previous period is meaningless. */
  comparable: boolean;
  granularity: Granularity;
  groupOptions: Granularity[];
};

/* ---------------- calendar-key arithmetic (pure UTC maths on YYYY-MM-DD) ---------------- */
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const parseKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return { y, m, d };
};
export const addDays = (k: string, n: number) => {
  const { y, m, d } = parseKey(k);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
const diffDays = (a: string, b: string) => {
  const A = parseKey(a), B = parseKey(b);
  return Math.round((Date.UTC(B.y, B.m - 1, B.d) - Date.UTC(A.y, A.m - 1, A.d)) / 86_400_000);
};
const mondayOf = (k: string) => {
  const { y, m, d } = parseKey(k);
  return addDays(k, -((new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7));
};
/** First day of the month n months after k's month. */
const addMonths = (k: string, n: number) => {
  const { y, m } = parseKey(k);
  const t = y * 12 + (m - 1) + n;
  return ymd(Math.floor(t / 12), (t % 12) + 1, 1);
};
const endOfMonth = (k: string) => addDays(addMonths(k, 1), -1);
const monthsSpanned = (a: string, b: string) => {
  const A = parseKey(a), B = parseKey(b);
  return (B.y - A.y) * 12 + (B.m - A.m) + 1;
};
export const isValidKey = (k: string) => /^\d{4}-\d{2}-\d{2}$/.test(k) && addDays(k, 0) === k;
const one = (v: Param) => (Array.isArray(v) ? v[0] : v);

/* ---------------- time zone handling ---------------- */
const dtf = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
const partsOf = (d: Date) => {
  const o: Record<string, string> = {};
  for (const p of dtf.formatToParts(d)) o[p.type] = p.value;
  return o;
};
// Local date/hour only change on quarter-hour boundaries (every real zone offset is a multiple of
// 15 minutes), so one lookup per 15-minute slot serves every event in it.
const slotCache = new Map<number, { key: string; hour: number }>();
const slot = (d: Date) => {
  const id = Math.floor(d.getTime() / 900_000);
  let v = slotCache.get(id);
  if (!v) {
    const p = partsOf(new Date(id * 900_000));
    v = { key: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
    if (slotCache.size > 50_000) slotCache.clear();
    slotCache.set(id, v);
  }
  return v;
};
/** Local calendar date ("YYYY-MM-DD") of an instant in the business time zone. */
export const dateKey = (d: Date) => slot(d).key;
export const hourOf = (d: Date) => slot(d).hour;

const offsetMs = (at: Date) => {
  const p = partsOf(at);
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(at.getTime() / 1000) * 1000;
};
/** The UTC instant at which a local date starts (midnight in the business time zone). */
export function zonedStart(key: string): Date {
  const { y, m, d } = parseKey(key);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - offsetMs(new Date(guess));
  t = guess - offsetMs(new Date(t)); // second pass settles days that contain a DST change
  return new Date(t);
}

/* ---------------- labels ---------------- */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fmt = (k: string, year: boolean) => {
  const { y, m, d } = parseKey(k);
  return `${MONTHS[m - 1]} ${d}${year ? `, ${y}` : ""}`;
};
export function spanText(fromKey: string, toKey: string) {
  if (fromKey === toKey) return fmt(fromKey, true);
  const sameYear = fromKey.slice(0, 4) === toKey.slice(0, 4);
  return `${fmt(fromKey, !sameYear)} – ${fmt(toKey, true)}`;
}
const LABELS = Object.fromEntries(PRESETS.map((p) => [p.id, p.label])) as Record<PresetId, string>;

/* ---------------- resolving a range ---------------- */
function normalizePreset(raw: string | undefined): PresetId {
  if (raw && raw in LABELS) return raw as PresetId;
  if (raw && /^(7|14|30|90)$/.test(raw)) return `${raw}d` as PresetId; // links from the old 7/30/90 switcher
  return "30d";
}
function presetBounds(preset: PresetId, today: string, earliest?: string | null): { fromKey: string; toKey: string } {
  const { y, m } = parseKey(today);
  switch (preset) {
    case "today": return { fromKey: today, toKey: today };
    case "yesterday": return { fromKey: addDays(today, -1), toKey: addDays(today, -1) };
    case "7d": return { fromKey: addDays(today, -6), toKey: today };
    case "14d": return { fromKey: addDays(today, -13), toKey: today };
    case "30d": return { fromKey: addDays(today, -29), toKey: today };
    case "90d": return { fromKey: addDays(today, -89), toKey: today };
    case "wtd": return { fromKey: mondayOf(today), toKey: today };
    case "lastweek": return { fromKey: addDays(mondayOf(today), -7), toKey: addDays(mondayOf(today), -1) };
    case "mtd": return { fromKey: ymd(y, m, 1), toKey: today };
    case "lastmonth": { const f = addMonths(today, -1); return { fromKey: f, toKey: endOfMonth(f) }; }
    case "qtd": return { fromKey: ymd(y, Math.floor((m - 1) / 3) * 3 + 1, 1), toKey: today };
    case "ytd": return { fromKey: ymd(y, 1, 1), toKey: today };
    case "12m": return { fromKey: addDays(today, -364), toKey: today };
    case "all": return { fromKey: earliest && isValidKey(earliest) && earliest <= today ? earliest : addDays(today, -29), toKey: today };
  }
}
const groupOptionsFor = (days: number): Granularity[] => (days <= 1 ? ["hour"] : (["day", ...(days >= 14 ? ["week"] : []), ...(days >= 60 ? ["month"] : [])] as Granularity[]));
const autoGranularity = (days: number): Granularity => (days <= 1 ? "hour" : days <= 92 ? "day" : days <= 400 ? "week" : "month");

export function resolveRange(sp: RangeParams = {}, opts: { now?: Date; earliestKey?: string | null } = {}): ResolvedRange {
  const todayKey = dateKey(opts.now ?? new Date());
  const qFrom = one(sp.from), qTo = one(sp.to);
  const customFrom = qFrom && isValidKey(qFrom) ? qFrom : null;
  const customTo = qTo && isValidKey(qTo) ? qTo : null;

  let preset: ResolvedRange["preset"];
  let fromKey: string, toKey: string;
  if (customFrom || customTo) {
    preset = "custom";
    toKey = customTo ?? todayKey;
    fromKey = customFrom ?? addDays(toKey, -29);
    if (fromKey > toKey) [fromKey, toKey] = [toKey, fromKey];
    if (toKey > todayKey) toKey = todayKey; // nothing has happened in the future yet
    if (fromKey > toKey) fromKey = toKey;
  } else {
    preset = normalizePreset(one(sp.range));
    ({ fromKey, toKey } = presetBounds(preset, todayKey, opts.earliestKey));
  }
  if (diffDays(fromKey, toKey) + 1 > MAX_DAYS) fromKey = addDays(toKey, -(MAX_DAYS - 1));

  const days = diffDays(fromKey, toKey) + 1;
  const prevFromKey = addDays(fromKey, -days);
  const prevToKey = addDays(fromKey, -1);
  const groupOptions = groupOptionsFor(days);
  const requested = one(sp.group) as Granularity | undefined;
  const granularity = requested && groupOptions.includes(requested) ? requested : autoGranularity(days);

  return {
    preset,
    label: preset === "custom" ? (fromKey === toKey ? "Single day" : "Custom range") : LABELS[preset],
    spanLabel: spanText(fromKey, toKey),
    prevSpanLabel: spanText(prevFromKey, prevToKey),
    fromKey,
    toKey,
    todayKey,
    days,
    from: zonedStart(fromKey),
    to: zonedStart(addDays(toKey, 1)),
    prevFrom: zonedStart(prevFromKey),
    prevTo: zonedStart(fromKey),
    comparable: preset !== "all",
    granularity,
    groupOptions,
  };
}

/** Query string that reproduces a range (presets stay short and readable, custom ranges carry both dates). */
export function rangeQuery(r: Pick<ResolvedRange, "preset" | "fromKey" | "toKey">, extra: Record<string, string> = {}) {
  const q = new URLSearchParams(r.preset === "custom" ? { from: r.fromKey, to: r.toKey } : { range: r.preset });
  for (const [k, v] of Object.entries(extra)) q.set(k, v);
  return q.toString();
}

/**
 * The previous / next window for the ‹ › buttons. Calendar-aligned ranges step by calendar units
 * (month to date → the whole previous month, year to date → the previous year, a week → a week),
 * everything else shifts by its own length (a single day → the day before). Returns null when
 * there is nothing to step to.
 */
export function stepRange(r: Pick<ResolvedRange, "preset" | "fromKey" | "toKey" | "todayKey">, dir: -1 | 1): { from: string; to: string } | null {
  const { fromKey, toKey, todayKey } = r;
  if (r.preset === "all") return null;
  const days = diffDays(fromKey, toKey) + 1;
  const fp = parseKey(fromKey);

  let monthSpan = 0;
  if (r.preset === "mtd" || r.preset === "lastmonth") monthSpan = 1;
  else if (r.preset === "qtd") monthSpan = 3;
  else if (r.preset === "ytd") monthSpan = 12;
  else if (fp.d === 1 && days >= 28 && (parseKey(addDays(toKey, 1)).d === 1 || toKey === todayKey)) monthSpan = monthsSpanned(fromKey, toKey); // whole calendar months

  let nf: string, nt: string;
  if (monthSpan > 0) {
    const first = addMonths(fromKey, dir * monthSpan);
    nf = first;
    nt = endOfMonth(addMonths(first, monthSpan - 1));
  } else if (r.preset === "wtd" || r.preset === "lastweek" || (days === 7 && fromKey === mondayOf(fromKey))) {
    nf = addDays(mondayOf(fromKey), dir * 7);
    nt = addDays(nf, 6);
  } else {
    nf = addDays(fromKey, dir * days);
    nt = addDays(toKey, dir * days);
  }
  if (nf > todayKey) return null;
  if (nt > todayKey) nt = todayKey;
  return { from: nf, to: nt };
}

/* ---------------- time buckets for charts and day-by-day tables ---------------- */
export type Bucket = { key: string; label: string; full: string };

export function bucketsFor(r: Pick<ResolvedRange, "granularity" | "fromKey" | "toKey">): Bucket[] {
  const out: Bucket[] = [];
  const multiYear = r.fromKey.slice(0, 4) !== r.toKey.slice(0, 4);
  if (r.granularity === "hour") {
    for (let h = 0; h < 24; h++) {
      const label = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
      const next = (h + 1) % 24;
      const nl = next === 0 ? "12 AM" : next < 12 ? `${next} AM` : next === 12 ? "12 PM" : `${next - 12} PM`;
      out.push({ key: pad(h), label, full: `${label} – ${nl}` });
    }
  } else if (r.granularity === "day") {
    for (let k = r.fromKey; k <= r.toKey; k = addDays(k, 1)) {
      const { y, m, d } = parseKey(k);
      out.push({ key: k, label: `${MONTHS[m - 1]} ${d}`, full: `${WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}, ${MONTHS[m - 1]} ${d}, ${y}` });
    }
  } else if (r.granularity === "week") {
    for (let k = mondayOf(r.fromKey); k <= r.toKey; k = addDays(k, 7)) {
      const end = addDays(k, 6);
      out.push({ key: k, label: fmt(k, false), full: `Week of ${spanText(k, end)}` });
    }
  } else {
    for (let k = addMonths(r.fromKey, 0); k <= r.toKey; k = addMonths(k, 1)) {
      const { y, m } = parseKey(k);
      out.push({ key: k, label: multiYear ? `${MONTHS[m - 1]} ${String(y).slice(2)}` : MONTHS[m - 1], full: `${MONTHS_LONG[m - 1]} ${y}` });
    }
  }
  return out;
}

/** Which bucket (see bucketsFor) an instant falls into. */
export function bucketKey(r: Pick<ResolvedRange, "granularity">, d: Date): string {
  const s = slot(d);
  if (r.granularity === "hour") return pad(s.hour);
  if (r.granularity === "day") return s.key;
  if (r.granularity === "week") return mondayOf(s.key);
  return `${s.key.slice(0, 7)}-01`;
}

export const granularityNoun = (g: Granularity) => (g === "hour" ? "Hour by hour" : g === "day" ? "Day by day" : g === "week" ? "Week by week" : "Month by month");
export const granularityLabel = (g: Granularity) => (g === "hour" ? "Hour" : g === "day" ? "Day" : g === "week" ? "Week" : "Month");
