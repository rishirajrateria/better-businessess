import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  source: z.string().max(300).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  utmSource: z.string().max(120).optional().nullable(),
  utmMedium: z.string().max(120).optional().nullable(),
  utmCampaign: z.string().max(200).optional().nullable(),
  website_url: z.string().optional(), // honeypot
});

// naive in-memory rate limit (per instance)
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 8;
}

async function notify(lead: { name: string; email: string; phone?: string | null; company?: string | null; service?: string | null; budget?: string | null; city?: string | null; message?: string | null; source?: string | null; id: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL || site.email;
  if (!key) return;
  const rows = Object.entries({ Name: lead.name, Email: lead.email, Phone: lead.phone, Company: lead.company, Service: lead.service, Budget: lead.budget, City: lead.city, Page: lead.source, Message: lead.message })
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#6b6b6b">${k}</td><td style="padding:6px 12px;color:#0a0a0a"><strong>${String(v).replace(/</g, "&lt;")}</strong></td></tr>`)
    .join("");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || `${site.name} <leads@${site.domain}>`,
        to: [to],
        reply_to: lead.email,
        subject: `New lead: ${lead.name}${lead.service ? ` · ${lead.service}` : ""}`,
        html: `<div style="font-family:sans-serif"><h2 style="color:#0a0a0a">New lead from ${site.domain}</h2><table>${rows}</table><p><a href="${site.url}/admin/leads/${lead.id}">Open in admin →</a></p></div>`,
      }),
    });
  } catch (e) {
    console.error("[contact] notify failed", e);
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form" }, { status: 400 });
  const d = parsed.data;
  if (d.website_url) return NextResponse.json({ ok: true }); // bot filled honeypot: pretend success

  const lead = await prisma.lead.create({
    data: {
      name: d.name,
      email: d.email.toLowerCase(),
      phone: d.phone || null,
      company: d.company || null,
      website: d.website || null,
      service: d.service || null,
      budget: d.budget || null,
      city: d.city || null,
      message: d.message || null,
      source: d.source ?? null,
      referrer: d.referrer ?? null,
      utmSource: d.utmSource ?? null,
      utmMedium: d.utmMedium ?? null,
      utmCampaign: d.utmCampaign ?? null,
    },
  });
  void notify(lead);
  return NextResponse.json({ ok: true, id: lead.id });
}
