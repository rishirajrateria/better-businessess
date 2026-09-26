/**
 * First-deploy seeding. Loads the starter articles, projects, testimonials and FAQs
 * only when the database has no posts yet, so a fresh deployment is never empty and
 * later deployments never resurrect content the owner deleted.
 */
import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "../src/lib/db-url";
import { seedStarterContent, refreshStarterPosts } from "../src/lib/seed-content";

const prisma = new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

async function main() {
  const posts = await prisma.post.count();
  if (posts > 0) {
    // Existing site: only refresh starter articles the owner has never edited (new citations,
    // corrections). Nothing is added back and nothing edited in the admin is overwritten.
    const refreshed = await refreshStarterPosts(prisma, { addMissing: false });
    console.log(`[seed-if-empty] ${posts} posts already present; ${refreshed.length ? refreshed.join(", ") : "no starter articles to refresh"}.`);
    return;
  }
  const created = await seedStarterContent(prisma);
  console.log(created.length ? `[seed-if-empty] first deploy, seeded: ${created.join(", ")}` : "[seed-if-empty] nothing to seed");
}

main()
  .catch((e) => {
    // Never fail the build over seeding; the admin can load content manually.
    console.warn("[seed-if-empty] skipped:", (e as Error).message);
  })
  .finally(() => prisma.$disconnect());
