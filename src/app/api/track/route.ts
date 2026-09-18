import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseUA } from "@/lib/ua";

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as Record<string, string | null | undefined>;
    if (!b.path || !b.sessionId || String(b.path).startsWith("/admin")) return NextResponse.json({ ok: true });
    const ua = parseUA(req.headers.get("user-agent") || "");
    let referrerHost: string | null = null;
    try {
      if (b.referrer) {
        const h = new URL(b.referrer).hostname.replace(/^www\./, "");
        referrerHost = h && !h.endsWith(new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://betterbusinesses.ca").hostname.replace(/^www\./, "")) ? h : null;
      }
    } catch {}
    await prisma.pageView.create({
      data: {
        path: String(b.path).slice(0, 300),
        referrer: b.referrer ? String(b.referrer).slice(0, 500) : null,
        referrerHost,
        sessionId: String(b.sessionId).slice(0, 80),
        visitorId: b.visitorId ? String(b.visitorId).slice(0, 80) : null,
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
        country: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null,
        region: req.headers.get("x-vercel-ip-country-region") || null,
        city: req.headers.get("x-vercel-ip-city") ? decodeURIComponent(req.headers.get("x-vercel-ip-city")!) : null,
        utmSource: b.utmSource ? String(b.utmSource).slice(0, 120) : null,
        utmMedium: b.utmMedium ? String(b.utmMedium).slice(0, 120) : null,
        utmCampaign: b.utmCampaign ? String(b.utmCampaign).slice(0, 200) : null,
        isBot: ua.isBot,
      },
    });
  } catch (e) {
    console.error("[track]", (e as Error).message);
  }
  return NextResponse.json({ ok: true });
}
