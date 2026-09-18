/**
 * Sets the Prisma datasource provider from the resolved database URL so the same repo
 * works with SQLite locally and Postgres in production without hand-editing schema.prisma.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolveDatabaseUrl, providerFor } from "./db-url.mjs";

const url = resolveDatabaseUrl();
const provider = providerFor(url);
const path = new URL("../prisma/schema.prisma", import.meta.url);
const schema = readFileSync(path, "utf8");
const next = schema.replace(/provider\s*=\s*"(sqlite|postgresql|mysql)"/, `provider = "${provider}"`);
if (next !== schema) writeFileSync(path, next);
console.log(`[prepare-db] provider "${provider}" · url from ${process.env.DATABASE_URL === url ? "DATABASE_URL" : "auto-detected variable"} (${url.replace(/\/\/([^@]+)@/, "//***@").slice(0, 60)}…)`);
