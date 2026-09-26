# Research outputs

`out/cities/<slug>.json` and `out/articles/<slug>.json` are written by research sessions
(one file per city / article, pushed on `claude/research-*` branches). They are consumed by
`scripts/gen-city-data.mjs` (→ `src/lib/city-data.generated.ts`) and
`scripts/apply-citations.mts` (→ `src/lib/seed-posts/part*.ts`) and are not shipped with the site.
