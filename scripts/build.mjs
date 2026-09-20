/**
 * Build runner: resolves the database URL (whatever it is named), sets the Prisma provider,
 * and runs prisma generate → (optional) prisma db push → next build with DATABASE_URL exported.
 * Usage: node scripts/build.mjs [--push] [--seed | --seed-if-empty] [--no-next]
 */
import { execSync } from "node:child_process";
import { resolveDatabaseUrl } from "./db-url.mjs";

const url = resolveDatabaseUrl();
const env = { ...process.env, DATABASE_URL: url };
const run = (cmd) => {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env });
};
run("node scripts/prepare-db.mjs");
run("prisma generate");
if (process.argv.includes("--push")) run("prisma db push --accept-data-loss --skip-generate");
if (process.argv.includes("--seed")) run("tsx prisma/seed.ts");
if (process.argv.includes("--seed-if-empty")) run("tsx prisma/seed-if-empty.ts");
if (!process.argv.includes("--no-next")) run("next build");
