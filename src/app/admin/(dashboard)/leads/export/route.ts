import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const status = new URL(req.url).searchParams.get("status");
  const leads = await prisma.lead.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" } });
  const cols = ["createdAt", "name", "email", "phone", "company", "website", "service", "budget", "city", "message", "source", "referrer", "utmSource", "utmMedium", "utmCampaign", "status", "notes"] as const;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => esc(c === "createdAt" ? l.createdAt.toISOString() : l[c])).join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
