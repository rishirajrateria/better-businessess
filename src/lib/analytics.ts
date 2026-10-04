import { prisma } from "./db";

export type Range = 7 | 30 | 90;

const since = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export async function getDashboardStats(days: Range = 30) {
  const from = since(days);
  const prevFrom = since(days * 2);
  const [views, prevViews, leads, prevLeads, events, recentLeads, allTimeLeads] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: { gte: from }, isBot: false }, select: { path: true, referrerHost: true, sessionId: true, visitorId: true, device: true, browser: true, country: true, utmSource: true, createdAt: true }, orderBy: { createdAt: "asc" }, take: 100000 }),
    prisma.pageView.count({ where: { createdAt: { gte: prevFrom, lt: from }, isBot: false } }),
    prisma.lead.findMany({ where: { createdAt: { gte: from } }, select: { createdAt: true, service: true, source: true, status: true } }),
    prisma.lead.count({ where: { createdAt: { gte: prevFrom, lt: from } } }),
    prisma.event.findMany({ where: { createdAt: { gte: from } }, select: { name: true, path: true, createdAt: true } , take: 50000 }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.lead.count(),
  ]);

  // daily series
  const daily: Record<string, { views: number; sessions: Set<string>; leads: number }> = {};
  for (let i = days - 1; i >= 0; i--) daily[dayKey(since(i))] = { views: 0, sessions: new Set(), leads: 0 };
  const sessions = new Set<string>();
  const visitors = new Set<string>();
  const pages: Record<string, number> = {};
  const refs: Record<string, number> = {};
  const devices: Record<string, number> = {};
  const browsers: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const utms: Record<string, number> = {};
  for (const v of views) {
    const k = dayKey(v.createdAt);
    if (daily[k]) {
      daily[k].views++;
      daily[k].sessions.add(v.sessionId);
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
    const k = dayKey(l.createdAt);
    if (daily[k]) daily[k].leads++;
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
  const pct = (a: number, b: number) => (b === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - b) / b) * 100));

  return {
    days,
    totals: {
      views: views.length,
      viewsChange: pct(views.length, prevViews),
      sessions: sessions.size,
      visitors: visitors.size,
      leads: leads.length,
      leadsChange: pct(leads.length, prevLeads),
      conversion: sessions.size ? +((leads.length / sessions.size) * 100).toFixed(2) : 0,
      ctaClicks: (eventCounts.cta_click ?? 0) + Object.entries(eventCounts).filter(([k]) => k.startsWith("cta_")).reduce((a, [, v]) => a + v, 0),
      phoneClicks: (eventCounts.phone_click ?? 0) + (eventCounts.phone_click_floating ?? 0),
      phoneCopies: eventCounts.phone_copy ?? 0,
      formStarts: eventCounts.form_start ?? 0,
      allTimeLeads,
    },
    series: Object.entries(daily).map(([date, d]) => ({ date, views: d.views, sessions: d.sessions.size, leads: d.leads })),
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

export async function getCallStats(days: Range = 30) {
  const from = since(days);
  const [events, views] = await Promise.all([
    prisma.event.findMany({ where: { name: { in: [...CALL_EVENTS, ...COPY_EVENTS] }, createdAt: { gte: from } }, select: { id: true, name: true, path: true, sessionId: true, meta: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 20000 }),
    prisma.pageView.findMany({ where: { createdAt: { gte: from }, isBot: false }, select: { sessionId: true }, distinct: ["sessionId"], take: 100000 }),
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
  const calls = rows.filter((r) => r.kind === "call");
  const copies = rows.filter((r) => r.kind === "copy");
  const tally = (list: typeof rows, key: (r: (typeof rows)[number]) => string) => {
    const o: Record<string, number> = {};
    for (const r of list) o[key(r)] = (o[key(r)] ?? 0) + 1;
    return Object.entries(o).sort((a, b) => b[1] - a[1]);
  };
  const daily: Record<string, { calls: number; copies: number }> = {};
  for (let i = days - 1; i >= 0; i--) daily[dayKey(since(i))] = { calls: 0, copies: 0 };
  for (const r of rows) {
    const d = daily[dayKey(r.at)];
    if (d) r.kind === "call" ? d.calls++ : d.copies++;
  }
  const sessions = views.length;
  const actors = new Set(rows.map((r) => r.sessionId)).size;
  return {
    days,
    totals: {
      calls: calls.length,
      copies: copies.filter((c) => c.method !== "menu").length,
      menu: copies.filter((c) => c.method === "menu").length,
      floating: calls.filter((c) => c.location === "Floating call button").length,
      people: actors,
      rate: sessions ? +((actors / sessions) * 100).toFixed(1) : 0,
      sessions,
    },
    series: Object.entries(daily).map(([date, d]) => ({ date, ...d })),
    byLocation: tally(calls, (r) => r.location).slice(0, 8),
    copyByLocation: tally(copies, (r) => r.location).slice(0, 8),
    byDevice: tally(rows, (r) => r.device),
    byPage: tally(rows, (r) => r.path).slice(0, 10),
    recent: rows.slice(0, 40),
  };
}
