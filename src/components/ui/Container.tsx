import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className, size = "default" }: { children: ReactNode; className?: string; size?: "default" | "narrow" | "wide" }) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8", size === "narrow" ? "max-w-3xl" : size === "wide" ? "max-w-[88rem]" : "max-w-7xl", className)}>{children}</div>;
}
