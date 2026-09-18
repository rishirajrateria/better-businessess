import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { LogoMark } from "@/components/site/Logo";
import { Orbs } from "@/components/site/Visuals";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <Orbs />
      <div className="glass glass-strong relative w-full max-w-md rounded-glass p-8">
        <div className="flex items-center gap-3">
          <LogoMark size={44} />
          <div>
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-ink">Better <span className="text-gold-gradient">Businesses</span></p>
            <p className="text-[12px] text-slate">Admin console</p>
          </div>
        </div>
        <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink">Sign in</h1>
        <p className="mt-1 text-[14px] text-slate">Manage leads, analytics, blog posts and projects.</p>
        <LoginForm />
      </div>
    </div>
  );
}
