import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as { name?: string; path?: string; sessionId?: string; meta?: unknown };
    if (!b.name || !b.sessionId) return NextResponse.json({ ok: true });
    await prisma.event.create({ data: { name: String(b.name).slice(0, 80), path: String(b.path || "/").slice(0, 300), sessionId: String(b.sessionId).slice(0, 80), meta: b.meta ? JSON.stringify(b.meta).slice(0, 2000) : null } });
  } catch (e) {
    console.error("[event]", (e as Error).message);
  }
  return NextResponse.json({ ok: true });
}
