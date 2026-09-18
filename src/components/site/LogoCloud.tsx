export type LogoItem = { id: string; name: string; logoUrl?: string | null; website?: string | null };

export function LogoCloud({ logos, title = "Trusted by growing Canadian businesses" }: { logos: LogoItem[]; title?: string }) {
  if (!logos.length) return null;
  const doubled = [...logos, ...logos];
  return (
    <section className="relative py-12" aria-label="Client logos">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">{title}</p>
      </div>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-14 px-7 hover:[animation-play-state:paused]">
          {doubled.map((l, i) => (
            <li key={`${l.id}-${i}`} className="flex h-12 shrink-0 items-center opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
              {l.logoUrl ? (
                <img src={l.logoUrl} alt={l.name} className="h-8 w-auto object-contain" loading="lazy" />
              ) : (
                <span className="font-display text-xl font-semibold tracking-tight text-ink">{l.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
