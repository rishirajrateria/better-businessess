/**
 * Seed: creates the first admin user (ADMIN_EMAIL / ADMIN_PASSWORD) and starter content.
 * Safe to re-run. The same logic is available from the admin UI (Account → Load starter content)
 * and the admin user is also created automatically on first login, so running this is optional.
 */
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "../src/lib/db-url";
import { ensureAdmin, seedStarterContent } from "../src/lib/seed-content";

const prisma = new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

async function main() {
  const admin = await ensureAdmin(prisma);
  console.log(`✔ Admin user ready: ${admin.email}`);
  const created = await seedStarterContent(prisma);
  console.log(created.length ? `✔ Seeded: ${created.join(", ")}` : "✔ Starter content already present");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
