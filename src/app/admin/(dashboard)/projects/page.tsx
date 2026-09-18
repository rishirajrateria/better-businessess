import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card } from "@/components/admin/Charts";
import { formatDate } from "@/lib/utils";
import { splitList } from "@/lib/queries";
import { getService } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Projects</h1><p className="text-[14px] text-slate">Case studies shown on the homepage, service pages and /projects.</p></div>
        <Link href="/admin/projects/new" className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper hover:bg-ink-soft">+ New project</Link>
      </div>
      <Card>
        {projects.length === 0 ? <p className="text-[13.5px] text-slate">No projects yet.</p> : (
          <table className="w-full text-[13.5px]">
            <thead><tr className="text-left text-[11.5px] uppercase tracking-wider text-slate"><th className="py-2 pr-4">Project</th><th className="py-2 pr-4">Services</th><th className="py-2 pr-4">Status</th><th className="py-2">Updated</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-line hover:bg-cream/50">
                  <td className="py-3 pr-4"><Link href={`/admin/projects/${p.id}`} className="font-semibold text-ink hover:text-gold-deep">{p.title}</Link><br /><span className="text-slate">{p.client}{p.location ? ` · ${p.location}` : ""}</span></td>
                  <td className="py-3 pr-4 text-slate">{splitList(p.services).map((s) => getService(s)?.shortName ?? s).join(", ") || "—"}</td>
                  <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${p.published ? "bg-emerald-50 text-emerald-700" : "bg-cream text-graphite"}`}>{p.published ? "Published" : "Draft"}</span>{p.featured && <span className="ml-2 rounded-full bg-gold-pale px-2.5 py-1 text-[11.5px] font-semibold text-gold-deep">Featured</span>}</td>
                  <td className="py-3 text-slate">{formatDate(p.updatedAt, { dateStyle: "medium" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
