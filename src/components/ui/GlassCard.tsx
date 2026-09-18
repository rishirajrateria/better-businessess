import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className, dark, strong, hover = true, as: Tag = "div" }: { children: ReactNode; className?: string; dark?: boolean; strong?: boolean; hover?: boolean; as?: "div" | "article" | "li" | "section" }) {
  return (
    <Tag className={cn("rounded-glass p-7 md:p-8", dark ? "glass-dark" : "glass", strong && !dark && "glass-strong", hover && "transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-float", className)}>
      {children}
    </Tag>
  );
}
