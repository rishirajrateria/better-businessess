/** Checks for src/lib/date-range.ts. usage: npx tsx scripts/test-date-range.mts */
import { resolveRange, stepRange, bucketsFor, bucketKey, zonedStart, dateKey, hourOf, rangeQuery } from "../src/lib/date-range";

let failed = 0;
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { failed++; console.log(`FAIL ${name}\n   got  ${JSON.stringify(got)}\n   want ${JSON.stringify(want)}`); } else console.log(`ok   ${name}`);
};
// Toronto is UTC-4 in October. 03:00Z on Oct 24 is 23:00 on Oct 23 locally, so "today" must be Oct 23.
const now = new Date("2026-10-24T03:00:00Z");
const R = (sp: Record<string, string>, earliestKey?: string) => resolveRange(sp, { now, earliestKey });
const span = (r: ReturnType<typeof R>) => `${r.fromKey}..${r.toKey}`;

eq("today uses the Toronto date, not UTC", span(R({ range: "today" })), "2026-10-23..2026-10-23");
eq("today bounds are local midnight", [R({ range: "today" }).from.toISOString(), R({ range: "today" }).to.toISOString()], ["2026-10-23T04:00:00.000Z", "2026-10-24T04:00:00.000Z"]);
eq("yesterday", span(R({ range: "yesterday" })), "2026-10-22..2026-10-22");
eq("last 7 days includes today", span(R({ range: "7d" })), "2026-10-17..2026-10-23");
eq("legacy ?range=7 still works", span(R({ range: "7" })), "2026-10-17..2026-10-23");
eq("last 30 days", span(R({ range: "30d" })), "2026-09-24..2026-10-23");
eq("default is last 30 days", R({}).preset, "30d");
eq("garbage preset falls back", R({ range: "nonsense" }).preset, "30d");
eq("week to date starts Monday (Oct 23 2026 is a Friday)", span(R({ range: "wtd" })), "2026-10-19..2026-10-23");
eq("last week is Mon..Sun", span(R({ range: "lastweek" })), "2026-10-12..2026-10-18");
eq("month to date", span(R({ range: "mtd" })), "2026-10-01..2026-10-23");
eq("last month", span(R({ range: "lastmonth" })), "2026-09-01..2026-09-30");
eq("quarter to date", span(R({ range: "qtd" })), "2026-10-01..2026-10-23");
eq("year to date", span(R({ range: "ytd" })), "2026-01-01..2026-10-23");
eq("last 12 months", span(R({ range: "12m" })), "2025-10-24..2026-10-23");
eq("all time uses earliest activity", span(R({ range: "all" }, "2026-09-25")), "2026-09-25..2026-10-23");
eq("all time is not comparable", R({ range: "all" }).comparable, false);
eq("custom range", [span(R({ from: "2026-10-01", to: "2026-10-10" })), R({ from: "2026-10-01", to: "2026-10-10" }).label, R({ from: "2026-10-01", to: "2026-10-10" }).days], ["2026-10-01..2026-10-10", "Custom range", 10]);
eq("custom single day", [R({ from: "2026-10-05", to: "2026-10-05" }).label, R({ from: "2026-10-05", to: "2026-10-05" }).granularity], ["Single day", "hour"]);
eq("reversed dates are swapped", span(R({ from: "2026-10-10", to: "2026-10-01" })), "2026-10-01..2026-10-10");
eq("future end is clamped to today", span(R({ from: "2026-10-01", to: "2027-01-01" })), "2026-10-01..2026-10-23");
eq("invalid date ignored", R({ from: "2026-13-45", to: "nope" }).preset, "30d");
eq("impossible calendar date (Feb 30) is ignored; the valid end date gives the 30 days ending there", R({ from: "2026-02-30", to: "2026-03-01" }).fromKey, "2026-01-31");
eq("only a start date runs to today", span(R({ from: "2026-10-15" })), "2026-10-15..2026-10-23");
eq("span is capped at three years", R({ from: "2015-01-01", to: "2026-10-01" }).days, 1096);
eq("array params use the first value", span(resolveRange({ range: ["7d", "30d"] }, { now })), "2026-10-17..2026-10-23");

// previous period
const m = R({ range: "mtd" });
eq("previous period is equal length, directly before", [m.prevFrom.toISOString(), m.prevTo.toISOString(), m.prevSpanLabel], ["2026-09-08T04:00:00.000Z", "2026-10-01T04:00:00.000Z", "Sep 8 – Sep 30, 2026"]);

// daylight saving: 2026-03-08 (spring forward, 23h) and 2026-11-01 (fall back, 25h)
const hours = (a: string, b: string) => (zonedStart(b).getTime() - zonedStart(a).getTime()) / 3_600_000;
eq("spring-forward day is 23h", hours("2026-03-08", "2026-03-09"), 23);
eq("fall-back day is 25h", hours("2026-11-01", "2026-11-02"), 25);
eq("normal day is 24h", hours("2026-06-01", "2026-06-02"), 24);
eq("winter midnight is 05:00Z", zonedStart("2026-01-15").toISOString(), "2026-01-15T05:00:00.000Z");
eq("summer midnight is 04:00Z", zonedStart("2026-07-15").toISOString(), "2026-07-15T04:00:00.000Z");

// local date / hour of an instant
eq("02:30Z on Oct 24 is Oct 23 22:00 local", [dateKey(new Date("2026-10-24T02:30:00Z")), hourOf(new Date("2026-10-24T02:30:00Z"))], ["2026-10-23", 22]);
eq("04:00Z is local midnight (new day)", [dateKey(new Date("2026-10-24T04:00:00Z")), hourOf(new Date("2026-10-24T04:00:00Z"))], ["2026-10-24", 0]);
eq("03:59Z is the last minute of the previous day", dateKey(new Date("2026-10-24T03:59:00Z")), "2026-10-23");

// granularity
eq("single day is hourly with 24 buckets", [R({ range: "today" }).granularity, bucketsFor(R({ range: "today" })).length], ["hour", 24]);
eq("30 days is daily by default", R({ range: "30d" }).granularity, "day");
eq("last 12 months defaults to weekly", R({ range: "12m" }).granularity, "week");
eq("3 years defaults to monthly", R({ from: "2023-10-24", to: "2026-10-23" }).granularity, "month");
eq("week grouping needs 14+ days", [R({ range: "7d", group: "week" }).granularity, R({ range: "30d", group: "week" }).granularity], ["day", "week"]);
eq("month grouping needs 60+ days", [R({ range: "30d", group: "month" }).granularity, R({ range: "90d", group: "month" }).granularity], ["day", "month"]);
eq("30 days has 30 day-buckets", bucketsFor(R({ range: "30d" })).length, 30);
eq("90 days by week covers the partial first week", [bucketsFor(R({ range: "90d", group: "week" }))[0].key, bucketsFor(R({ range: "90d", group: "week" })).at(-1)!.key], ["2026-07-20", "2026-10-19"]);
eq("year to date by month = 10 buckets", bucketsFor(R({ range: "ytd", group: "month" })).length, 10);
const ytdm = R({ range: "ytd", group: "month" });
eq("event lands in the right month / week / day / hour", [bucketKey(ytdm, new Date("2026-10-24T02:30:00Z")), bucketKey({ granularity: "week" }, new Date("2026-10-24T02:30:00Z")), bucketKey({ granularity: "day" }, new Date("2026-10-24T02:30:00Z")), bucketKey({ granularity: "hour" }, new Date("2026-10-24T02:30:00Z"))], ["2026-10-01", "2026-10-19", "2026-10-23", "22"]);
const r30 = R({ range: "30d" });
eq("every day bucket key is reachable from an event in range", bucketsFor(r30).every((b) => bucketKey(r30, new Date(zonedStart(b.key).getTime() + 3_600_000)) === b.key), true);

// query strings
eq("preset query", rangeQuery(R({ range: "mtd" })), "range=mtd");
eq("custom query", rangeQuery(R({ from: "2026-10-01", to: "2026-10-10" }), { group: "week" }), "from=2026-10-01&to=2026-10-10&group=week");

// stepping with the ‹ › buttons
const S = (sp: Record<string, string>, dir: -1 | 1) => stepRange(R(sp), dir);
eq("a single day steps day by day", [S({ from: "2026-10-05", to: "2026-10-05" }, -1), S({ from: "2026-10-05", to: "2026-10-05" }, 1)], [{ from: "2026-10-04", to: "2026-10-04" }, { from: "2026-10-06", to: "2026-10-06" }]);
eq("today cannot step forward", S({ range: "today" }, 1), null);
eq("today steps back to yesterday", S({ range: "today" }, -1), { from: "2026-10-22", to: "2026-10-22" });
eq("month to date steps to the whole previous month", S({ range: "mtd" }, -1), { from: "2026-09-01", to: "2026-09-30" });
eq("a whole month steps forward into the current (partial) month", S({ from: "2026-09-01", to: "2026-09-30" }, 1), { from: "2026-10-01", to: "2026-10-23" });
eq("last month steps back a month", S({ range: "lastmonth" }, -1), { from: "2026-08-01", to: "2026-08-31" });
eq("quarter to date steps to the previous quarter", S({ range: "qtd" }, -1), { from: "2026-07-01", to: "2026-09-30" });
eq("year to date steps to the previous year", S({ range: "ytd" }, -1), { from: "2025-01-01", to: "2025-12-31" });
eq("week to date steps to the previous full week", S({ range: "wtd" }, -1), { from: "2026-10-12", to: "2026-10-18" });
eq("last week steps forward to this week (clamped to today)", S({ range: "lastweek" }, 1), { from: "2026-10-19", to: "2026-10-23" });
eq("last 7 days shifts by 7 days", S({ range: "7d" }, -1), { from: "2026-10-10", to: "2026-10-16" });
eq("last 7 days cannot step forward", S({ range: "7d" }, 1), null);
eq("an arbitrary custom range shifts by its length", S({ from: "2026-10-03", to: "2026-10-12" }, -1), { from: "2026-09-23", to: "2026-10-02" });
const first = resolveRange({ range: "today" }, { now: new Date("2026-11-01T17:00:00Z") });
eq("Today on the 1st of a month still steps one day, not a month", [first.fromKey, stepRange(first, -1)], ["2026-11-01", { from: "2026-10-31", to: "2026-10-31" }]);
eq("a custom whole-quarter steps by a quarter", S({ from: "2026-04-01", to: "2026-06-30" }, -1), { from: "2026-01-01", to: "2026-03-31" });
eq("all time cannot step", [S({ range: "all" }, -1), S({ range: "all" }, 1)], [null, null]);

console.log(failed ? `\n${failed} FAILED` : "\nall passed");
process.exit(failed ? 1 : 0);
