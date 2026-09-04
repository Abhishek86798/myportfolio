import statsJson from "@/data/stats.json";

/**
 * Single source of truth for Data Structures & Algorithms metrics (§5, Codolio/LeetCode).
 * All references across About, Journey, Hero, and Dashboard MUST reference this constant.
 */
export const DSA_STATS = {
  total: statsJson.total, // 852
  medium: statsJson.medium, // 393
  hard: statsJson.hard, // 55
  easy: statsJson.easy, // 272
  contestRating: statsJson.contestRating, // 1640
  contestsCount: statsJson.contestsCount, // 29
  activeDays: statsJson.activeDays, // 303
  longestStreak: statsJson.longestStreak, // 39
  capturedAt: statsJson.capturedAt, // "Sep 2026"
  profileUrl: statsJson.profileUrl,
  // Canonical formatted strings
  summary: `Solved ${statsJson.total} DSA problems (${statsJson.medium} Medium, ${statsJson.hard} Hard) across LeetCode, GeeksforGeeks, and Code360.`,
  shortSummary: `${statsJson.total} DSA (${statsJson.medium} Med, ${statsJson.hard} Hard)`,
  tag: `${statsJson.total} DSA`,
  mediumTag: `${statsJson.medium} Med`,
  hardTag: `${statsJson.hard} Hard`,
} as const;
