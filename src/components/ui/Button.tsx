import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "ghost" | "glass" | "outline" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper shadow-[0_10px_30px_-12px_rgba(10,10,10,0.6)] hover:bg-ink-soft hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(193,154,62,0.45)]",
  gold: "bg-gold-gradient text-ink shadow-[0_10px_30px_-12px_rgba(193,154,62,0.7)] hover:-translate-y-0.5 hover:brightness-105",
  ghost: "text-ink hover:text-gold-deep",
  glass: "glass-pill text-ink hover:-translate-y-0.5 hover:bg-white/80",
  outline: "border border-ink/15 text-ink hover:border-gold hover:text-gold-deep hover:-translate-y-0.5",
  white: "bg-paper text-ink hover:bg-white hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]",
};
const sizes: Record<Size, string> = { sm: "h-10 px-5 text-sm", md: "h-12 px-7 text-[15px]", lg: "h-14 px-9 text-base" };

export type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
  track?: string;
  ariaLabel?: string;
};

export function Button({ href, children, variant = "primary", size = "md", className, type = "button", onClick, disabled, external, track, ariaLabel }: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={cls} data-track={track} aria-label={ariaLabel} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-track={track} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} data-track={track} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
