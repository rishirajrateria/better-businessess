import { Target, Search, Code2, Palette, Megaphone, Share2, MapPin, ShoppingBag, PenTool, Layers } from "lucide-react";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/utils";

const map = { target: Target, search: Search, code: Code2, palette: Palette, megaphone: Megaphone, share: Share2, "map-pin": MapPin, "shopping-bag": ShoppingBag, "pen-tool": PenTool, layers: Layers };

export function ServiceIcon({ icon, className, size = 22 }: { icon: Service["icon"]; className?: string; size?: number }) {
  const Icon = map[icon] ?? Target;
  return <Icon size={size} strokeWidth={1.75} className={cn(className)} aria-hidden="true" />;
}

export function IconBadge({ icon, className, dark }: { icon: Service["icon"]; className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl", dark ? "bg-white/10 text-gold-light ring-1 ring-white/10" : "bg-gold-pale text-gold-deep ring-1 ring-gold/20", className)}>
      <ServiceIcon icon={icon} />
    </span>
  );
}
