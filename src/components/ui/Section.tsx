import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]", dark ? "border border-white/15 bg-white/5 text-gold-light" : "glass-pill text-gold-deep", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-gold-gradient" />
      {children}
    </span>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center", dark, className, as: Tag = "h2" }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; align?: "center" | "left"; dark?: boolean; className?: string; as?: "h1" | "h2" | "h3" }) {
  return (
    <div className={cn("mb-12 md:mb-16", align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)} data-reveal>
      {eyebrow && <Eyebrow dark={dark} className="mb-5">{eyebrow}</Eyebrow>}
      <Tag className={cn("font-display text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl", dark ? "text-paper" : "text-ink")}>{title}</Tag>
      {subtitle && <p className={cn("mt-5 text-pretty text-lg leading-8", dark ? "text-paper/70" : "text-slate")}>{subtitle}</p>}
    </div>
  );
}

export function Section({ children, className, id, tone = "default", size = "default" }: { children: ReactNode; className?: string; id?: string; tone?: "default" | "cream" | "dark" | "transparent"; size?: "default" | "sm" | "lg" }) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        size === "sm" ? "py-14 md:py-20" : size === "lg" ? "py-24 md:py-36" : "py-20 md:py-28",
        tone === "cream" && "bg-cream/60",
        tone === "dark" && "bg-ink text-paper",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
