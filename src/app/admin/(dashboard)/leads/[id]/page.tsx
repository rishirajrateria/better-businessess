import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, StatusBadge } from "@/components/admin/Charts";
import { LeadForm } from "./LeadForm";
import { formatDate } from "@/lib/utils";
import { getService } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const lead = await prisma.lead.findUnique({ where: { id: (await params).id } });
  if (!lead) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${lead.email}`} className="text-gold-deep hover:underline">{lead.email}</a>],
    ["Phone", lead.phone ? <a key="p" href={`tel:${lead.phone}`} className="text-gold-deep hover:underline">{lead.phone}</a> : "—"],
    ["Company", lead.company ?? "—"],
    ["Website", lead.website ? <a key="w" href={lead.website} target="_blank" rel="noreferrer" className="text-gold-deep hover:underline">{lead.website}</a> : "—"],
    ["Service", getService(lead.service ?? "")?.name ?? lead.service ?? "—"],
    ["Budget", lead.budget ?? "—"],
    ["City", lead.city ?? "—"],
    ["Submitted from", lead.source ?? "—"],
    ["Referrer", lead.referrer ?? "—"],
    ["UTM", [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"],
    ["Received", formatDate(lead.createdAt, { dateStyle: "medium", timeStyle: "short" })],
  ];
  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="text-[13px] font-semibold text-slate hover:text-ink">← All leads</Link>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{lead.name}</h1>
        <StatusBadge status={lead.status} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Details" className="lg:col-span-2">
          <dl className="grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="border-b border-line pb-2"><dt className="text-[11.5px] uppercase tracking-wider text-slate">{k}</dt><dd className="mt-0.5 text-ink">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5"><p className="text-[11.5px] uppercase tracking-wider text-slate">Message</p><p className="mt-1 whitespace-pre-wrap rounded-2xl bg-cream p-4 text-[14px] leading-6 text-ink">{lead.message || "—"}</p></div>
        </Card>
        <Card title="Manage"><LeadForm lead={lead} /></Card>
      </div>
    </div>
  );
}
