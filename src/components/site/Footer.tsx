import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { LinkedinIcon, InstagramIcon, FacebookIcon, YoutubeIcon } from "./SocialIcons";
import { Logo } from "./Logo";
import { coreServices, subServices } from "@/lib/services";
import { provinces, majorCities } from "@/lib/locations";
import { site } from "@/lib/site";

const col = "text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/40";
const link = "text-[14px] text-paper/70 transition-colors hover:text-gold-light";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold-light/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark size="md" />
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-paper/65">{site.description}</p>
            <ul className="mt-6 space-y-3 text-[14px] text-paper/75">
              <li className="flex items-center gap-3"><Mail size={16} className="text-gold" /> <a href={`mailto:${site.email}`} className="hover:text-gold-light">{site.email}</a></li>
              {site.phone && <li className="flex items-center gap-3"><Phone size={16} className="text-gold" /> <a href={site.phoneHref} className="hover:text-gold-light" data-track="phone_click">{site.phone}</a></li>}
              <li className="flex items-center gap-3"><MapPin size={16} className="text-gold" /> {site.hq.city}, {site.hq.province}, Canada · Serving all provinces</li>
            </ul>
            <div className="mt-6 flex gap-2">
              {[
                { href: site.social.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
                { href: site.social.instagram, Icon: InstagramIcon, label: "Instagram" },
                { href: site.social.facebook, Icon: FacebookIcon, label: "Facebook" },
                { href: site.social.youtube, Icon: YoutubeIcon, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-paper/70 transition-all hover:border-gold hover:text-gold-light">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className={col}>Services</p>
            <ul className="mt-4 space-y-2.5">
              {coreServices.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`} className={link}>{s.name}</Link></li>
              ))}
              {subServices.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`} className={link}>{s.shortName}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={col}>Company</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["/about", "About us"],
                ["/industries", "Industries"],
                ["/projects", "Projects"],
                ["/blog", "Blog"],
                ["/faq", "FAQ"],
                ["/contact", "Contact"],
                ["/locations", "Locations"],
                ["/llms.txt", "For AI assistants"],
                ["/privacy", "Privacy policy"],
                ["/terms", "Terms of service"],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className={link}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={col}>Provinces</p>
            <ul className="mt-4 space-y-2.5">
              {provinces.map((p) => (
                <li key={p.slug}><Link href={`/locations/${p.slug}`} className={link}>{p.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={col}>Major cities</p>
            <ul className="mt-4 space-y-2.5">
              {majorCities.slice(0, 14).map((c) => (
                <li key={c.slug}><Link href={`/locations/${c.province}/${c.slug}`} className={link}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 hairline opacity-60" />
        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-[13px] text-paper/45 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {site.legalName} · {site.tagline} · Proudly Canadian</p>
          <p>
            {site.name} is a digital growth agency offering lead generation, SEO, website development and branding across Canada.
          </p>
        </div>
      </div>
    </footer>
  );
}
