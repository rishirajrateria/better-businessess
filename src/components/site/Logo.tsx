import Link from "next/link";
import { cn } from "@/lib/utils";

/** Interlocking "BB" mark inspired by the brand logo: black B mirrored, gold B forward. */
export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn(className)} aria-hidden="true">
      <defs>
        <linearGradient id="bbGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E3C97F" />
          <stop offset="0.5" stopColor="#C19A3E" />
          <stop offset="1" stopColor="#9A7628" />
        </linearGradient>
        <linearGradient id="bbGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1eee6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#bbGlass)" stroke="rgba(10,10,10,0.08)" />
      {/* mirrored black B */}
      <path d="M31 16h-9.5c-5 0-8.5 3.2-8.5 7.6 0 2.9 1.6 5.2 4 6.3-3 1-5 3.6-5 7 0 4.9 3.7 8.1 9 8.1H31V40h-8.4c-2.1 0-3.4-1.2-3.4-3s1.3-3 3.4-3H31v-5.2h-8c-2 0-3.1-1.1-3.1-2.8s1.1-2.8 3.1-2.8h8V16z" fill="#0A0A0A" />
      {/* gold B */}
      <path d="M33 16h9.5c5 0 8.5 3.2 8.5 7.6 0 2.9-1.6 5.2-4 6.3 3 1 5 3.6 5 7 0 4.9-3.7 8.1-9 8.1H33V40h8.4c2.1 0 3.4-1.2 3.4-3s-1.3-3-3.4-3H33v-5.2h8c2 0 3.1-1.1 3.1-2.8s-1.1-2.8-3.1-2.8h-8V16z" fill="url(#bbGold)" />
    </svg>
  );
}

export function Logo({ className, dark, size = "md" }: { className?: string; dark?: boolean; size?: "sm" | "md" | "lg" }) {
  const mark = size === "lg" ? 48 : size === "sm" ? 32 : 40;
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label="Better Businesses home">
      <LogoMark size={mark} className="transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-semibold tracking-[0.12em] uppercase", size === "lg" ? "text-lg" : "text-[15px]", dark ? "text-paper" : "text-ink")}>
          Better <span className="text-gold-gradient">Businesses</span>
        </span>
        <span className={cn("mt-1 whitespace-nowrap text-[9.5px] font-medium uppercase tracking-[0.22em]", dark ? "text-paper/50" : "text-slate")}>Strategy. Growth. Results.</span>
      </span>
    </Link>
  );
}
