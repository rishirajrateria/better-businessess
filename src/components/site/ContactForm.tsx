"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { track } from "./Analytics";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-[15px] text-ink placeholder:text-mist outline-none transition-all focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15";
const label = "mb-1.5 block text-[13px] font-semibold text-graphite";

export function ContactForm({ defaultService, defaultCity, compact, dark, heading }: { defaultService?: string; defaultCity?: string; compact?: boolean; dark?: boolean; heading?: string }) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [started, setStarted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: pathname, referrer: document.referrer || null, utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign") }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setState("done");
      track("form_submit", { service: data.service });
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className={cn("rounded-glass p-8 text-center", dark ? "glass-dark text-paper" : "glass")} role="status">
        <CheckCircle2 size={44} className="mx-auto text-gold" />
        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">Thank you. We&apos;re on it.</h3>
        <p className={cn("mt-2 text-[15px] leading-7", dark ? "text-paper/70" : "text-slate")}>Your request has been received. A strategist will reply within one business day with next steps and a time to talk.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("rounded-glass p-6 md:p-8", dark ? "glass-dark text-paper" : "glass glass-strong")} onFocus={() => { if (!started) { setStarted(true); track("form_start"); } }} noValidate>
      {heading && <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">{heading}</h2>}
      {/* honeypot */}
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
        <div>
          <label className={label} htmlFor="name">Full name *</label>
          <input id="name" name="name" required className={input} placeholder="Jordan Lee" autoComplete="name" />
        </div>
        <div>
          <label className={label} htmlFor="email">Work email *</label>
          <input id="email" name="email" type="email" required className={input} placeholder="you@company.ca" autoComplete="email" />
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" className={input} placeholder="+1 (___) ___-____" autoComplete="tel" />
        </div>
        <div>
          <label className={label} htmlFor="company">Company</label>
          <input id="company" name="company" className={input} placeholder="Company name" autoComplete="organization" />
        </div>
        <div>
          <label className={label} htmlFor="service">What do you need help with? *</label>
          <select id="service" name="service" required defaultValue={defaultService ?? ""} className={cn(input, "appearance-none")}>
            <option value="" disabled>Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
            <option value="multiple">Multiple services / not sure</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="budget">Monthly budget</label>
          <select id="budget" name="budget" defaultValue="" className={cn(input, "appearance-none")}>
            <option value="">Prefer not to say</option>
            <option>Under $1,500</option>
            <option>$1,500 – $3,000</option>
            <option>$3,000 – $7,500</option>
            <option>$7,500 – $15,000</option>
            <option>$15,000+</option>
            <option>One-time project</option>
          </select>
        </div>
        {!compact && (
          <div>
            <label className={label} htmlFor="city">City</label>
            <input id="city" name="city" className={input} placeholder="Toronto, ON" defaultValue={defaultCity ?? ""} autoComplete="address-level2" />
          </div>
        )}
        {!compact && (
          <div>
            <label className={label} htmlFor="site">Current website</label>
            <input id="site" name="website" type="url" className={input} placeholder="https://" />
          </div>
        )}
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={label} htmlFor="message">Tell us about your goals</label>
          <textarea id="message" name="message" rows={compact ? 3 : 4} className={cn(input, "resize-y")} placeholder="What are you trying to achieve in the next 6–12 months?" />
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant={dark ? "gold" : "primary"} size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
          {state === "loading" ? <Loader2 className="animate-spin" size={18} /> : null}
          {state === "loading" ? "Sending…" : "Request my free proposal"} {state !== "loading" && <ArrowIcon />}
        </Button>
        <p className={cn("text-[12.5px]", dark ? "text-paper/50" : "text-slate")}>We reply within one business day. No spam, ever.</p>
      </div>
    </form>
  );
}
