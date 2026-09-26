import { ExternalLink } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import type { City, Province } from "@/lib/locations";
import type { CityMarketData } from "@/lib/city-data";
import { formatNumber, formatDate } from "@/lib/utils";

const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toLocaleString("en-CA", { maximumFractionDigits: 1 })}%`;

/**
 * "Local market snapshot": census figures and cited local facts that make each city page factually
 * distinct — the block search engines and AI assistants can quote, with the source beside every number.
 */
export function LocalMarket({ data, city, province, serviceSlug }: { data: CityMarketData; city: City; province: Province; serviceSlug?: string }) {
  const f = data.figures;
  const rows: { label: string; value: string; note?: string; field: keyof CityMarketData["figures"] }[] = [];
  if (f.population2021 != null) rows.push({ label: "Population (2021 Census)", value: formatNumber(f.population2021), field: "population2021" });
  if (f.growthPct != null) rows.push({ label: "Population change, 2016 to 2021", value: fmtPct(f.growthPct), note: f.population2016 != null ? `from ${formatNumber(f.population2016)}` : undefined, field: "growthPct" });
  if (f.medianAge != null) rows.push({ label: "Median age", value: f.medianAge.toLocaleString("en-CA", { maximumFractionDigits: 1 }), field: "medianAge" });
  if (f.medianHouseholdIncome2020 != null) rows.push({ label: "Median household income (2020)", value: `$${formatNumber(f.medianHouseholdIncome2020)}`, field: "medianHouseholdIncome2020" });
  if (f.privateDwellings != null) rows.push({ label: "Private dwellings occupied", value: formatNumber(f.privateDwellings), field: "privateDwellings" });
  if (f.landAreaKm2 != null) rows.push({ label: "Land area", value: `${f.landAreaKm2.toLocaleString("en-CA", { maximumFractionDigits: 1 })} km²`, field: "landAreaKm2" });
  const serviceLine = serviceSlug ? data.byService[serviceSlug] : undefined;
  const census = data.censusProfileUrl || rows.map((r) => data.figureSources[r.field]).find((u) => u && /statcan\.gc\.ca/.test(u));

  return (
    <Section tone="cream" size="sm">
      <SectionHeader eyebrow="Local market snapshot" title={<>{city.name} <span className="text-gold-gradient">by the numbers.</span></>} subtitle={`Verified figures and local facts we use to plan campaigns in ${city.name}, ${province.code}.`} align="left" className="mb-8" />
      <div className="grid gap-8 lg:grid-cols-12">
        {rows.length > 0 && (
          <div className="lg:col-span-5" data-reveal>
            <dl className="glass divide-y divide-ink/5 rounded-glass">
              {rows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 px-6 py-4">
                  <dt className="text-[14px] text-slate">{r.label}</dt>
                  <dd className="text-right font-display text-lg font-semibold text-ink">
                    {r.value}
                    {r.note && <span className="block text-[12px] font-normal text-mist">{r.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[12.5px] leading-5 text-mist">
              Source: Statistics Canada, 2021 Census of Population{data.geographyNote ? ` (${data.geographyNote})` : ""}.{" "}
              {census && (
                <a href={census} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-slate underline decoration-ink/20 hover:text-ink">
                  Census Profile <ExternalLink size={11} />
                </a>
              )}
            </p>
          </div>
        )}
        <div className={rows.length > 0 ? "space-y-6 lg:col-span-7" : "space-y-6 lg:col-span-12"} data-reveal data-reveal-delay={100}>
          {data.overview.map((p) => (
            <p key={p.slice(0, 40)} className="text-[16px] leading-8 text-graphite" data-speakable>{p}</p>
          ))}
          {serviceLine && <p className="glass rounded-glass p-5 text-[15.5px] leading-7 text-ink">{serviceLine}</p>}
          {data.facts.length > 0 && (
            <ul className="space-y-3">
              {data.facts.map((fact) => (
                <li key={fact.url + fact.text.slice(0, 20)} className="flex gap-3 text-[15px] leading-7 text-graphite">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span>
                    {fact.text}{" "}
                    <a href={fact.url} target="_blank" rel="noopener" className="whitespace-nowrap text-[13px] text-slate underline decoration-ink/20 hover:text-ink">
                      {fact.publisher} <ExternalLink size={11} className="inline" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-[12.5px] text-mist">Figures and facts checked against their sources on {formatDate(data.checkedOn)}.</p>
        </div>
      </div>
    </Section>
  );
}
