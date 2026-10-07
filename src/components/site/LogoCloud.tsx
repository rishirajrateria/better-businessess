export type LogoItem = { id: string; name: string; logoUrl?: string | null; website?: string | null };

/**
 * Client logos, converted to single-colour marks in the brand ink so the strip matches the site
 * (regenerate with `node scripts/make-client-logos.mjs`). Heights are tuned per mark so wide
 * wordmarks and compact symbols carry similar visual weight. Logos added in Admin → Client logos
 * replace this list.
 */
const clients: { name: string; src: string; h: number }[] = [
  { name: "C&Co", src: "/clients/c-and-co.png", h: 40 },
  { name: "Lèlior", src: "/clients/lelior.png", h: 22 },
  { name: "Calfo", src: "/clients/calfo.png", h: 18 },
  { name: "Universal Studios Singapore", src: "/clients/universal-studios-singapore.png", h: 30 },
  { name: "R", src: "/clients/r-stamp.png", h: 30 },
  { name: "Venuti Mayoka", src: "/clients/venuti-mayoka.png", h: 20 },
  { name: "Drain", src: "/clients/drain.png", h: 30 },
  { name: "BIA", src: "/clients/bia.png", h: 24 },
];

export function LogoCloud({ logos, title = "Trusted by growing Canadian businesses" }: { logos: LogoItem[]; title?: string }) {
  const items: React.ReactNode[] = logos.length
    ? logos.map((l) =>
        l.logoUrl ? <img key={l.id} src={l.logoUrl} alt={l.name} className="h-7 w-auto object-contain grayscale" loading="lazy" /> : <span key={l.id} className="font-display text-xl font-semibold tracking-tight">{l.name}</span>,
      )
    : clients.map((c) => <img key={c.name} src={c.src} alt={c.name} style={{ height: c.h }} className="w-auto select-none" decoding="async" draggable={false} />);
  const row = [...items, ...items];

  return (
    <section className="relative py-8 md:py-10" aria-label="Client logos">
      <div className="hairline mx-auto max-w-5xl opacity-70" />
      <p className="mt-7 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">{title}</p>
      {/* Contained to the page width with wide, soft edge fades so logos dissolve in and out instead of being sliced by the screen edge. */}
      <div className="relative mx-auto mt-5 max-w-6xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_22%,#000_78%,transparent)] md:[mask-image:linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)]">
        {/* Spacing lives on each item (not gap/padding) so the doubled row is exactly 2× one set and the -50% loop is seamless. */}
        <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {row.map((node, i) => (
            <li key={i} aria-hidden={i >= items.length || undefined} className="flex h-12 shrink-0 items-center pr-14 md:pr-20 text-graphite/55 opacity-60 transition-[color,opacity] duration-500 hover:text-ink hover:opacity-100">
              {node}
            </li>
          ))}
        </ul>
      </div>
      <div className="hairline mx-auto mt-7 max-w-5xl opacity-70" />
    </section>
  );
}
