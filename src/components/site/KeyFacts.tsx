
/**
 * "At a glance" block. Plain, factual sentences that LLMs and answer engines
 * can quote verbatim. Marked with data-speakable for the WebPage schema.
 */
export function KeyFacts({ facts, title = "At a glance" }: { facts: string[]; title?: string }) {
  return (
    <aside className="glass rounded-glass p-6 md:p-7" data-speakable aria-label={title}>
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
        <span className="h-px w-5 bg-gold" aria-hidden="true" /> {title}
      </div>
      <ul className="space-y-3 text-[15px] leading-7 text-graphite">
        {facts.map((f) => (
          <li key={f} className="flex gap-3">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-gradient" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
