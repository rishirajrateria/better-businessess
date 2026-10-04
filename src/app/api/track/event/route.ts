import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseUA } from "@/lib/ua";

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as { name?: string; path?: string; sessionId?: string; meta?: Record<string, unknown> | null };
    const path = String(b.path || "/");
    if (!b.name || !b.sessionId || path.startsWith("/admin")) return NextResponse.json({ ok: true });
    const ua = parseUA(req.headers.get("user-agent") || "");
    if (ua.isBot) return NextResponse.json({ ok: true }); // keep call/CTA counts to real people
    const meta = { ...(b.meta && typeof b.meta === "object" ? b.meta : {}), device: ua.device };
    await prisma.event.create({ data: { name: String(b.name).slice(0, 80), path: path.slice(0, 300), sessionId: String(b.sessionId).slice(0, 80), meta: JSON.stringify(meta).slice(0, 2000) } });
  } catch (e) {
    console.error("[event]", (e as Error).message);
  }
  return NextResponse.json({ ok: true });
}
