/** Runtime twin of scripts/db-url.mjs: locate the database URL regardless of the variable name. */
const isPg = (v: string) => /^postgres(ql)?:\/\//i.test(v);
const isPrismaPg = (v: string) => /^prisma\+postgres:\/\//i.test(v);
const isDbUrl = (v: unknown): v is string => typeof v === "string" && (isPg(v) || isPrismaPg(v) || /^mysql:\/\//i.test(v) || /^file:/i.test(v));
const score = (k: string) => (/NON_POOLING|UNPOOLED|DIRECT/i.test(k) ? 5 : 0) + (/POSTGRES/i.test(k) ? 3 : 0) + (/DATABASE/i.test(k) ? 2 : 0) + (/PRISMA/i.test(k) ? 1 : 0);

export function resolveDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const direct = env.DATABASE_URL;
  if (isDbUrl(direct) && !isPrismaPg(direct)) return direct;
  const candidates = Object.entries(env).filter(([k, v]) => /URL/i.test(k) && isDbUrl(v)).sort(([a], [b]) => score(b) - score(a)) as [string, string][];
  const pg = candidates.find(([, v]) => isPg(v));
  if (pg) return pg[1];
  const ppg = candidates.find(([, v]) => isPrismaPg(v));
  if (ppg) return ppg[1];
  if (isDbUrl(direct)) return direct;
  return candidates[0]?.[1] ?? "file:./dev.db";
}
