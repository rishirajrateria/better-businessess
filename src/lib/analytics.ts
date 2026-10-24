import { prisma } from "./db";
import { bucketsFor, bucketKey, dateKey, type ResolvedRange } from "./date-range";

const pct = (a: number, b: number) => (b === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - b) / b) * 100));
const VIEW_CAP = 100_000;
const EVENT_CAP = 50_000;

/** Local date ("YYYY-MM-DD", business time zone) of the first recorded activity, for the "All time" range. */
export async function getEarliestActivityKey(): Promise<string | null> {
  try {
    const [v, e, l] = await Promise.all([
      prisma.pageView.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
      prisma.event.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
      prisma.lead.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
    ]);
    const first = [v, e, l].filter(Boolean).map((x) => x!.createdAt.getTime());
    return first.length ? dateKey(new Date(Math.min(...first))) : null;
  } catch {
    return null;
  }
}

export async function getDashboardStats(r: ResolvedRange) {
  const inRange = { gte: r.from, lt: r.to };
  const [views, prevViews, leads, prevLeads, events, recentLeads, allTimeLeads] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: inRange, isBot: false }, select: { path: true, referrerHost: true, sessionId: true, visitorId: true, device: true, browser: true, country: true, utmSource: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: VIEW_CAP }),
    r.comparable ? prisma.pageView.count({ where: { createdAt: { gte: r.prevFrom, lt: r.prevTo }, isBot: false } }) : Promise.resolve(0),
    prisma.lead.findMany({ where: { createdAt: inRange }, select: { createdAt: true, service: true, source: true, status: true } }),
    r.comparable ? prisma.lead.count({ where: { createdAt: { gte: r.prevFrom, lt: r.prevTo } } }) : Promise.resolve(0),
    prisma.event.findMany({ where: { createdAt: inRange }, select: { name: true, path: true, createdAt: true }, take: EVENT_CAP }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.lead.count(),
  ]);

  // time series: one bucket per hour / day / week / month of the range, in the business time zone
  const buckets = bucketsFor(r);
  const series = new Map(buckets.map((b) => [b.key, { views: 0, sessions: new Set<string>(), leads: 0 }]));
  const sessions = new Set<string>();
  const visitors = new Set<string>();
  const pages: Record<string, number> = {};
  const refs: Record<string, number> = {};
  const devices: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const utms: Record<string, number> = {};
  for (const v of views) {
    const b = series.get(bucketKey(r, v.createdAt));
    if (b) {
      b.views++;
      b.sessions.add(v.sessionId);
    }
    sessions.add(v.sessionId);
    if (v.visitorId) visitors.add(v.visitorId);
    pages[v.path] = (pages[v.path] ?? 0) + 1;
    if (v.referrerHost) refs[v.referrerHost] = (refs[v.referrerHost] ?? 0) + 1;
    if (v.device) devices[v.device] = (devices[v.device] ?? 0) + 1;
    if (v.browser) browsers[v.browser] = (browsers[v.browser] ?? 0) + 1;
    if (v.country) countries[v.country] = (countries[v.country] ?? 0) + 1;
    if (v.utmSource) utms[v.utmSource] = (utms[v.utmSource] ?? 0) + 1;
  }
  for (const l of leads) {
    const b = series.get(bucketKey(r, l.createdAt));
    if (b) b.leads++;
  }
  const eventCounts: Record<string, number> = {};
  for (const e of events) eventCounts[e.name] = (eventCounts[e.name] ?? 0) + 1;
  const leadsBySource: Record<string, number> = {};
  const leadsByService: Record<string, number> = {};
  const leadsByStatus: Record<string, number> = {};
  for (const l of leads) {
    leadsBySource[l.source || "direct"] = (leadsBySource[l.source || "direct"] ?? 0) + 1;
    leadsByService[l.service || "unspecified"] = (leadsByService[l.service || "unspecified"] ?? 0) + 1;
    leadsByStatus[l.status] = (leadsByStatus[l.status] ?? 0) + 1;
  }
  const top = (o: Record<string, number>, n = 8) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);

  return {
    range: r,
    totals: {
      views: views.length,
      viewsChange: r.comparable ? pct(views.length, prevViews) : undefined,
      sessions: sessions.size,
      visitors: visitors.size,
      leads: leads.length,
      leadsChange: r.comparable ? pct(leads.length, prevLeads) : undefined,
      conversion: sessions.size ? +((leads.length / sessions.size) * 100).toFixed(2) : 0,
      ctaClicks: (eventCounts.cta_click ?? 0) + Object.entries(eventCounts).filter(([k]) => k.startsWith("cta_")).reduce((a, [, v]) => a + v, 0),
      phoneClicks: (eventCounts.phone_click ?? 0) + (eventCounts.phone_click_floating ?? 0),
      phoneCopies: eventCounts.phone_copy ?? 0,
      formStarts: eventCounts.form_start ?? 0,
      allTimeLeads,
    },
    /** True when the range holds more page views than are loaded; figures then cover the most recent ones. */
    truncated: views.length >= VIEW_CAP || events.length >= EVENT_CAP,
    series: buckets.map((b) => {
      const d = series.get(b.key)!;
      return { key: b.key, label: b.label, full: b.full, views: d.views, sessions: d.sessions.size, leads: d.leads };
    }),
    topPages: top(pages, 10),
    topReferrers: top(refs),
    devices: top(devices, 3),
    browsers: top(browsers, 5),
    countries: top(countries, 6),
    utms: top(utms, 6),
    events: top(eventCounts, 10),
    leadsBySource: top(leadsBySource, 6),
    leadsByService: top(leadsByService, 6),
    leadsByStatus,
    recentLeads,
  };
}

/* ---------------- Call tracking ---------------- */
/** Events that mean "someone tried to call": every click on the number or a Call button, including the floating button. */
export const CALL_EVENTS = ["phone_click", "phone_click_floating"];
export const COPY_EVENTS = ["phone_copy"];

type Meta = { location?: string; device?: string; method?: string; text?: string };
const parseMeta = (m: string | null): Meta => {
  try {
    return m ? (JSON.parse(m) as Meta) : {};
  } catch {
    return {};
  }
};

export async function getCallStats(r: ResolvedRange) {
  const names = [...CALL_EVENTS, ...COPY_EVENTS];
  const [events, views, prevCalls, prevCopies] = await Promise.all([
    prisma.event.findMany({ where: { name: { in: names }, createdAt: { gte: r.from, lt: r.to } }, select: { id: true, name: true, path: true, sessionId: true, meta: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 20000 }),
    prisma.pageView.findMany({ where: { createdAt: { gte: r.from, lt: r.to }, isBot: false }, select: { sessionId: true }, distinct: ["sessionId"], take: 100000 }),
    r.comparable ? prisma.event.count({ where: { name: { in: CALL_EVENTS }, createdAt: { gte: r.prevFrom, lt: r.prevTo } } }) : Promise.resolve(0),
    r.comparable ? prisma.event.count({ where: { name: { in: COPY_EVENTS }, createdAt: { gte: r.prevFrom, lt: r.prevTo } } }) : Promise.resolve(0),
  ]);
  const rows = events.map((e) => {
    const m = parseMeta(e.meta);
    const isCall = CALL_EVENTS.includes(e.name);
    return {
      id: e.id,
      kind: isCall ? ("call" as const) : ("copy" as const),
      at: e.createdAt,
      path: e.path,
      sessionId: e.sessionId,
      location: m.location || (e.name === "phone_click_floating" ? "Floating call button" : "Unknown"),
      device: m.device === "mobile" ? "Mobile" : m.device === "tablet" ? "Tablet" : m.device === "desktop" ? "Desktop" : "Unknown",
      method: m.method,
    };
  });
  const calls = rows.filter((x) => x.kind === "call");
  const copies = rows.filter((x) => x.kind === "copy");
  const tally = (list: typeof rows, key: (x: (typeof rows)[number]) => string) => {
    const o: Record<string, number> = {};
    for (const x of list) o[key(x)] = (o[key(x)] ?? 0) + 1;
    return Object.entries(o).sort((a, b) => b[1] - a[1]);
  };

  // one bucket per hour / day / week / month of the range, in the business time zone
  const buckets = bucketsFor(r);
  const series = new Map(buckets.map((b) => [b.key, { calls: 0, copies: 0, menu: 0, people: new Set<string>() }]));
  for (const x of rows) {
    const b = series.get(bucketKey(r, x.at));
    if (!b) continue;
    if (x.kind === "call") b.calls++;
    else if (x.method === "menu") b.menu++;
    else b.copies++;
    b.people.add(x.sessionId);
  }
  const sessions = views.length;
  const actors = new Set(rows.map((x) => x.sessionId)).size;
  // Engagement rate only counts engaged people who also visited in this period (a visit that started
  // before midnight can click after it), so it can never exceed 100%.
  const visitedSessions = new Set(views.map((v) => v.sessionId));
  const engagedVisitors = new Set(rows.filter((x) => visitedSessions.has(x.sessionId)).map((x) => x.sessionId)).size;
  const totalActions = calls.length + copies.length;
  const prevActions = prevCalls + prevCopies;
  return {
    range: r,
    totals: {
      calls: calls.length,
      callsChange: r.comparable ? pct(calls.length, prevCalls) : undefined,
      copies: copies.filter((c) => c.method !== "menu").length,
      menu: copies.filter((c) => c.method === "menu").length,
      actions: totalActions,
      actionsChange: r.comparable ? pct(totalActions, prevActions) : undefined,
      floating: calls.filter((c) => c.location === "Floating call button").length,
      people: actors,
      rate: sessions ? +((engagedVisitors / sessions) * 100).toFixed(1) : 0,
      sessions,
    },
    truncated: events.length >= 20000,
    series: buckets.map((b) => {
      const d = series.get(b.key)!;
      return { key: b.key, label: b.label, full: b.full, calls: d.calls, copies: d.copies + d.menu, copiedOnly: d.copies, menu: d.menu, people: d.people.size };
    }),
    byLocation: tally(calls, (x) => x.location).slice(0, 8),
    copyByLocation: tally(copies, (x) => x.location).slice(0, 8),
    byDevice: tally(rows, (x) => x.device),
    byPage: tally(rows, (x) => x.path).slice(0, 10),
    recent: rows.slice(0, 40),
  };
}
