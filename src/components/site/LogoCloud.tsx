import { Hexagon, Triangle, Circle, Layers, Mountain, Waves, Zap, Leaf, Anchor, Compass, Feather, Aperture, Box, Sun, Shield, Gem, Flame, Droplet, Cloud, Sparkle } from "lucide-react";

export type LogoItem = { id: string; name: string; logoUrl?: string | null; website?: string | null };

/**
 * Placeholder brand marks shown until real client logos are added in the admin
 * (Admin → Client logos). Each is an icon + wordmark in a different typographic style
 * so the strip reads like a real client list.
 */
const dummy: { name: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; style: string }[] = [
  { name: "Northwind", Icon: Compass, style: "font-display font-semibold tracking-tight" },
  { name: "HARBOURLINE", Icon: Anchor, style: "font-sans font-bold tracking-[0.18em] text-[14px]" },
  { name: "Maple Ridge", Icon: Leaf, style: "font-display font-medium italic" },
  { name: "Summit Logistics", Icon: Mountain, style: "font-sans font-semibold tracking-tight" },
  { name: "aurora", Icon: Sun, style: "font-display font-semibold lowercase tracking-tighter text-2xl" },
  { name: "Pacific Peak", Icon: Waves, style: "font-sans font-medium tracking-wide" },
  { name: "VOLT", Icon: Zap, style: "font-display font-bold tracking-[0.25em]" },
  { name: "Stratus", Icon: Cloud, style: "font-sans font-semibold tracking-tight" },
  { name: "Keystone", Icon: Hexagon, style: "font-display font-medium" },
  { name: "Trident Legal", Icon: Shield, style: "font-sans font-semibold tracking-[0.06em] uppercase text-[13px]" },
  { name: "Ember & Co.", Icon: Flame, style: "font-display font-semibold italic" },
  { name: "Lumen", Icon: Aperture, style: "font-sans font-bold tracking-tight text-2xl" },
  { name: "Cobalt Build", Icon: Box, style: "font-display font-semibold" },
  { name: "Riverstone", Icon: Droplet, style: "font-sans font-medium tracking-wide" },
  { name: "Quill", Icon: Feather, style: "font-display font-medium italic text-2xl" },
  { name: "Delta Prime", Icon: Triangle, style: "font-sans font-bold tracking-[0.12em] uppercase text-[13px]" },
  { name: "Orbit Dental", Icon: Circle, style: "font-display font-semibold tracking-tight" },
  { name: "Strata", Icon: Layers, style: "font-sans font-semibold tracking-[0.2em] uppercase text-[13px]" },
  { name: "Gemline", Icon: Gem, style: "font-display font-medium" },
  { name: "Northstar Realty", Icon: Sparkle, style: "font-sans font-medium tracking-tight" },
];

export function LogoCloud({ logos, title = "Trusted by growing Canadian businesses" }: { logos: LogoItem[]; title?: string }) {
  const items: React.ReactNode[] = logos.length
    ? logos.map((l) =>
        l.logoUrl ? <img key={l.id} src={l.logoUrl} alt={l.name} className="h-7 w-auto object-contain" loading="lazy" /> : <span key={l.id} className="font-display text-xl font-semibold tracking-tight">{l.name}</span>,
      )
    : dummy.map(({ name, Icon, style }) => (
        <span key={name} className="flex items-center gap-2.5" aria-hidden="true">
          <Icon size={22} strokeWidth={2} />
          <span className={`text-xl leading-none ${style}`}>{name}</span>
        </span>
      ));
  const row = [...items, ...items];

  return (
    <section className="relative py-8 md:py-10" aria-label="Client logos">
      <div className="hairline mx-auto max-w-5xl opacity-70" />
      <p className="mt-7 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">{title}</p>
      <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-16 px-8 hover:[animation-play-state:paused]">
          {row.map((node, i) => (
            <li key={i} className="flex h-10 shrink-0 items-center text-graphite/55 transition-colors duration-500 hover:text-ink">
              {node}
            </li>
          ))}
        </ul>
      </div>
      <div className="hairline mx-auto mt-7 max-w-5xl opacity-70" />
    </section>
  );
}
