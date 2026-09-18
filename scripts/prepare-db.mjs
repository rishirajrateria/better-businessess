/**
 * Picks the Prisma datasource provider from DATABASE_URL so the same repo
 * works with SQLite locally and Postgres in production (Vercel, Neon, Supabase…)
 * without editing schema.prisma by hand. Runs automatically before `prisma generate`.
 */
import { readFileSync, writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || "";
const provider = /^postgres(ql)?:/i.test(url) ? "postgresql" : /^mysql:/i.test(url) ? "mysql" : "sqlite";
const path = new URL("../prisma/schema.prisma", import.meta.url);
const schema = readFileSync(path, "utf8");
const next = schema.replace(/provider\s*=\s*"(sqlite|postgresql|mysql)"/, `provider = "${provider}"`);
if (next !== schema) {
  writeFileSync(path, next);
  console.log(`[prepare-db] Prisma provider set to "${provider}"`);
} else {
  console.log(`[prepare-db] Prisma provider already "${provider}"`);
}
if (!process.env.DATABASE_URL && (process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL)) {
  console.warn("[prepare-db] DATABASE_URL is not set. Set DATABASE_URL to your Postgres connection string (Vercel Postgres exposes POSTGRES_PRISMA_URL — copy it to DATABASE_URL).");
}
