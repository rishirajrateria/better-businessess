import type { SeedPost } from "./types";
import { part1 } from "./part1";
import { part2 } from "./part2";
import { part3 } from "./part3";
import { part6 } from "./part6";
import { part5 } from "./part5";
import { part4 } from "./part4";

export type { SeedPost } from "./types";

/** Every starter article. Newest first. Seeding adds any whose slug is not yet in the database. */
export const seedPosts: SeedPost[] = [...part6, ...part1, ...part5, ...part4, ...part2, ...part3].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
