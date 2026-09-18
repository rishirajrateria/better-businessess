import { Plus } from "lucide-react";
import type { Faq } from "@/lib/services";

/** Native <details> accordion: fully crawlable, keyboard accessible, zero JS. */
export function FaqAccordion({ faqs, className }: { faqs: Faq[]; className?: string }) {
  return (
    <div className={className}>
      <dl className="divide-y divide-line rounded-glass glass overflow-hidden">
        {faqs.map((f, i) => (
          <details key={f.question} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left font-display text-[17px] font-semibold tracking-tight text-ink transition-colors hover:text-gold-deep md:px-8 [&::-webkit-details-marker]:hidden">
              <dt>{f.question}</dt>
              <Plus size={18} className="shrink-0 text-gold-deep transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
            </summary>
            <dd className="px-6 pb-6 -mt-1 text-[15.5px] leading-7 text-graphite md:px-8">{f.answer}</dd>
          </details>
        ))}
      </dl>
    </div>
  );
}
