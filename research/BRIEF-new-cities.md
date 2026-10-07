# Research brief: new city / district pages

You are a research session for the Better Businesses website. For each place assigned to you in your
prompt, produce ONE verified JSON file at `research/data/cities/<slug>.json`, commit it and push it to the
branch named in your prompt. Work autonomously to the end; do not ask questions.

## Setup
1. `git checkout -b <your branch>`
2. Nothing to install. Do not modify any file other than your own `research/data/cities/<slug>.json` files.

## Tools and hard limits
- Only **WebSearch** works. WebFetch and curl to the public web are blocked by network policy; do not try them.
- You have about 200 WebSearch calls for the whole session. Spend at most **15 per place** (about 10 to
  research, 5 to cross-check). Keep a running count. Do **not** spawn subagents; they share the budget.
- Every URL you write MUST be copied verbatim from a WebSearch result list. Never construct or guess a URL.
- Useful queries: `<place> population 2021 census` (Wikipedia infobox snippets usually give 2021 and 2016
  population, % change and land area); `Focus on Geography Series 2021 <place>` and
  `<place> census profile 2021` with allowed_domains `["www12.statcan.gc.ca"]`; `<place> median household
  income 2020`; `<place> median age 2021`; the municipality's own site and economic-development office.
  French-language results are fine for Quebec.

## Per place
A. **Figures for the MUNICIPALITY** (census subdivision) named in your prompt — never the metro area (CMA) or
   census division. For a Toronto *district* (Etobicoke, North York, Scarborough) the geography is the
   former municipality / its City of Toronto community-council or ward-group profile; use only figures a
   source states for that whole district and say exactly which geography in `geographyNote`.
   Fields: population2021, population2016, growthPct, medianAge, medianHouseholdIncome2020,
   privateDwellings (occupied by usual residents), landAreaKm2.
   **Verification rule:** keep a figure only when TWO results from DIFFERENT domains state the same value
   (within 1%). Otherwise null. Never estimate. Record one source URL per kept figure in `figureSources`.
B. `censusProfileUrl`: the Statistics Canada 2021 Census Profile URL for the municipality, copied from a
   result (title names the place and says "[Census subdivision]" or City/Town/Ville/District); "" if none.
C. `facts`: 3 to 5 specific, current, verifiable local-economy facts useful to a business owner (largest
   employers, dominant industries with numbers, business counts, major developments or investments,
   institutions, tourism volumes). One sentence each, under 200 characters, present tense, in English,
   stating the detail exactly as the source's snippet states it, with `url` (verbatim from results),
   `publisher` and `evidence` (the snippet). Prefer official sources (statcan.gc.ca, the municipality or its
   economic-development agency, provincial government, universities, major news outlets).
D. `meta` (used to build the page — must be true; nothing promotional):
   - `populationApprox`: the 2021 census population as a number, even if only ONE source states it (used
     only to label the page; null if no source states it).
   - `descriptor`: a short factual phrase that reads correctly after "<Place> is ", lowercase start, no
     trailing period, under 80 characters. Example: `a fast-growing town in Halton Region`.
   - `fact`: one distinctive verified detail phrased to read correctly after "<Place> is ", lowercase start,
     under 110 characters, taken from one of your verified facts. Example: `home to Cambridge Memorial Hospital and a large advanced-manufacturing base`.
   - `industries`: 4 to 6 leading sectors, chosen ONLY from this list and supported by your sources:
     Healthcare, Retail, Education, Technology, Manufacturing, Tourism, Construction, Agriculture,
     Government, Professional services, Logistics, Mining, Finance, Energy, Transportation, Insurance,
     Aerospace, Real estate, Forestry, Agri-food, Food processing, Automotive, Life sciences, Hospitality.
   - `areas`: 4 to 6 real neighbourhoods, villages or communities inside the municipality (or the district),
     as named on the municipality's site or Wikipedia.
E. `copy`, written only from verified figures and facts: `overview` = 1–2 short paragraphs, 60–110 words in
   total, plain, factual, Canadian spelling, no hype, no emoji, no em dashes, explaining what the figures
   mean for a local business competing for customers there. `byService` = one sentence of 18–32 words for
   each of `lead-generation`, `seo`, `website-development`, `branding`, saying how the figures and facts change
   the plan for that service there; vary sentence structure. The ONLY numbers allowed in the copy are the
   verified figures (populations may be rounded, e.g. 1,306,784 → "1.3 million") and the years 2016, 2020,
   2021. Do not mention a figure that is null.

## Output — exactly this shape (JSON numbers, nulls where unverified, no extra keys)
```json
{"slug":"<slug>","geographyNote":"City of X (census subdivision)","censusProfileUrl":"",
 "figures":{"population2021":null,"population2016":null,"growthPct":null,"medianAge":null,"medianHouseholdIncome2020":null,"privateDwellings":null,"landAreaKm2":null},
 "figureSources":{"population2021":"<url>"},
 "facts":[{"text":"...","url":"...","publisher":"...","evidence":"..."}],
 "meta":{"populationApprox":null,"descriptor":"...","fact":"...","industries":["..."],"areas":["..."]},
 "copy":{"overview":["..."],"byService":{"lead-generation":"...","seo":"...","website-development":"...","branding":"..."}}}
```
After EACH place: `git add research/data/cities/<slug>.json && git commit -m "research: <slug>" && git push -u origin <your branch>`
(retry the push up to 3 times on network errors). Commit a place even when little could be verified. Do not
open a pull request. When all places are pushed, reply with one line per place: slug, verified figures,
facts, searches used.
