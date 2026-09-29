import { Phone } from "lucide-react";
import { site } from "@/lib/site";

/** Always-visible call button, bottom-left on every public page. Hidden when no phone is configured. */
export function FloatingCall() {
  if (!site.phone) return null;
  return (
    <a
      href={site.phoneHref}
      data-track="phone_click_floating"
      aria-label={`Call ${site.name} at ${site.phone}`}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-30 inline-flex h-14 items-center gap-2.5 rounded-full bg-gold-gradient pl-4 pr-4 text-ink shadow-[0_12px_32px_-8px_rgba(10,10,10,0.45)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 sm:bottom-6 sm:left-6 sm:pr-5"
    >
      <span className="relative inline-flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-ink/15 motion-reduce:hidden" aria-hidden="true" />
        <Phone size={20} strokeWidth={2.25} className="relative" aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold whitespace-nowrap">
        <span className="sm:hidden">Call now</span>
        <span className="hidden sm:inline">Call {site.phone}</span>
      </span>
    </a>
  );
}
