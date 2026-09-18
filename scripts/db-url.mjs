/**
 * Find the database connection string no matter what the hosting provider named it.
 * Vercel storage integrations create variables like STORAGE_URL, STORAGE_POSTGRES_URL,
 * PRISMA_DATABASE_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING … depending on the prefix chosen.
 * Preference: DATABASE_URL → direct postgres:// URLs → prisma+postgres:// URLs → sqlite/mysql.
 */
const isPg = (v) => /^postgres(ql)?:\/\//i.test(v);
const isPrismaPg = (v) => /^prisma\+postgres:\/\//i.test(v);
const isMysql = (v) => /^mysql:\/\//i.test(v);
const isSqlite = (v) => /^file:/i.test(v);
const isDbUrl = (v) => typeof v === "string" && (isPg(v) || isPrismaPg(v) || isMysql(v) || isSqlite(v));

export function resolveDatabaseUrl(env = process.env) {
  const direct = env.DATABASE_URL;
  if (isDbUrl(direct) && !isPrismaPg(direct)) return direct;
  const candidates = Object.entries(env)
    .filter(([k, v]) => /URL/i.test(k) && isDbUrl(v))
    .sort(([a], [b]) => score(b) - score(a));
  const pg = candidates.find(([, v]) => isPg(v));
  if (pg) return pg[1];
  const ppg = candidates.find(([, v]) => isPrismaPg(v)) || (isPrismaPg(direct) ? ["DATABASE_URL", direct] : null);
  if (ppg) return ppg[1];
  const other = candidates[0];
  return other ? other[1] : direct || "file:./dev.db";
}

function score(key) {
  let s = 0;
  if (/NON_POOLING|UNPOOLED|DIRECT/i.test(key)) s += 5; // best for migrations and serverless functions alike
  if (/POSTGRES/i.test(key)) s += 3;
  if (/DATABASE/i.test(key)) s += 2;
  if (/PRISMA/i.test(key)) s += 1;
  return s;
}

export function providerFor(url) {
  if (isPg(url) || isPrismaPg(url)) return "postgresql";
  if (isMysql(url)) return "mysql";
  return "sqlite";
}
