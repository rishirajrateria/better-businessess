/**
 * Verified local market data for city pages. Every figure is a 2021 Census of Population value for
 * the municipality (census subdivision) and every fact carries the URL of the page that states it.
 * Values were researched and independently cross-checked; anything that could not be confirmed is
 * null/omitted. Regenerate with scripts/city-data (see README) rather than editing by hand.
 */
import { cityMarketData } from "./city-data.generated";

export type CityFigures = {
  population2021: number | null;
  population2016: number | null;
  growthPct: number | null;
  medianAge: number | null;
  medianHouseholdIncome2020: number | null;
  privateDwellings: number | null;
  landAreaKm2: number | null;
};
export type CityFact = { text: string; url: string; publisher: string };
export type CityMarketData = {
  slug: string;
  geographyNote: string;
  censusProfileUrl: string;
  figures: CityFigures;
  figureSources: Partial<Record<keyof CityFigures, string>>;
  facts: CityFact[];
  overview: string[];
  byService: Partial<Record<string, string>>;
  checkedOn: string; // ISO date the research and cross-check were run
};

export const getCityData = (slug: string): CityMarketData | null => cityMarketData[slug] ?? null;
export const hasCityData = (d: CityMarketData | null): d is CityMarketData => !!d && (Object.values(d.figures).some((v) => v != null) || d.facts.length > 0);
