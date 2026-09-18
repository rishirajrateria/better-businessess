"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, FileText, FolderKanban, MessageSquareQuote, Building2, HelpCircle, UserCircle2, ExternalLink, LogOut } from "lucide-react";
import { LogoMark } from "@/components/site/Logo";
import { logoutAction } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", Icon: Inbox },
  { href: "/admin/posts", label: "Blog posts", Icon: FileText },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/logos", label: "Client logos", Icon: Building2 },
  { href: "/admin/faqs", label: "FAQs", Icon: HelpCircle },
  { href: "/admin/account", label: "Account", Icon: UserCircle2 },
];

export function Sidebar({ newLeads, userName }: { newLeads: number; userName: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full flex-col border-r border-ink/5 bg-white/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-5">
        <LogoMark size={36} />
        <div className="leading-tight">
          <p className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">Better <span className="text-gold-gradient">Businesses</span></p>
          <p className="text-[11px] text-slate">Admin console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition", active ? "bg-ink text-paper" : "text-graphite hover:bg-cream hover:text-ink")}>
              <Icon size={17} /> {label}
              {label === "Leads" && newLeads > 0 && <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold", active ? "bg-gold text-ink" : "bg-gold-pale text-gold-deep")}>{newLeads}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-ink/5 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-graphite hover:bg-cream"><ExternalLink size={17} /> View website</a>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] text-graphite hover:bg-cream"><LogOut size={17} /> Sign out <span className="ml-auto truncate text-[12px] text-slate">{userName}</span></button>
        </form>
      </div>
    </aside>
  );
}
