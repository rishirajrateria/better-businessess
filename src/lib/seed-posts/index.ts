import type { SeedPost } from "./types";
import { existing } from "./existing";
import { part1 } from "./part1";
import { part2 } from "./part2";
import { part3 } from "./part3";

export type { SeedPost } from "./types";

/** Every starter article. Newest first. Seeding adds any whose slug is not yet in the database. */
export const seedPosts: SeedPost[] = [...part1, ...part2, ...part3, ...existing].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
