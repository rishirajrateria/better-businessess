import { Button, ArrowIcon } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CtaBanner({ title, subtitle, primary = "Get a free proposal", primaryHref = "/contact", className, compact }: { title?: React.ReactNode; subtitle?: string; primary?: string; primaryHref?: string; className?: string; compact?: boolean }) {
  return (
    <section className={cn("relative", compact ? "py-10" : "py-20 md:py-28", className)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-14 text-paper md:px-16 md:py-20" data-reveal>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-20 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold/25 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-gold-light/15 blur-3xl animate-float" />
          </div>
          <div className="relative grid items-center gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">Ready when you are</p>
              <h2 className="mt-4 font-display text-balance text-3xl font-medium leading-[1.06] tracking-tight md:text-5xl">{title ?? <>Ready to grow? <span className="text-gold-light">Let&apos;s talk about your next quarter.</span></>}</h2>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-paper/70">{subtitle ?? "Book a free 30-minute strategy call. We'll audit your current presence and show you the three highest-impact moves for your market."}</p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-2 lg:items-end">
              <Button href={primaryHref} variant="gold" size="lg" track="cta_banner_primary" className="w-full sm:w-auto">
                {primary} <ArrowIcon />
              </Button>
              {site.phone && (
                <Button href={site.phoneHref} variant="glass" size="lg" track="phone_click" className="w-full sm:w-auto !bg-white/10 !border-white/15 !text-paper hover:!bg-white/15">
                  Call {site.phone}
                </Button>
              )}
              <p className="text-[13px] text-paper/50">No commitment. Response within one business day.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
