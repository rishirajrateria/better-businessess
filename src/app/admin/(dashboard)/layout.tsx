import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const newLeads = await prisma.lead.count({ where: { status: "NEW" } }).catch(() => 0);
  return (
    <div className="grid min-h-screen bg-cream/60 lg:grid-cols-[260px_1fr]">
      <div className="hidden lg:block"><Sidebar newLeads={newLeads} userName={session.name} /></div>
      <div className="min-w-0">
        <div className="lg:hidden"><Sidebar newLeads={newLeads} userName={session.name} /></div>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
