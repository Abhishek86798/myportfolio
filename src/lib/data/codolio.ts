import "server-only";

/**
 * Codolio coding-stats layer (§5 dashboard). Codolio aggregates DSA/CP problem
 * counts across LeetCode, Code360 (codestudio), GeeksforGeeks, CodeChef, etc.
 *
 * The endpoint is Codolio's public profile API:
 *   https://api.codolio.com/profile?userKey=<profileName>
 */

const PROFILE_NAME = "abhishek_1005";
const CODOLIO_URL = `https://api.codolio.com/profile?userKey=${PROFILE_NAME}`;
const CODOLIO_PROFILE = `https://codolio.com/profile/${PROFILE_NAME}`;
const REVALIDATE_SECONDS = 21_600; // 6h — coding stats change slowly

import statsJson from "@/data/stats.json";

export type CodingStats = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  contestsCount: number;
  activeDays: number;
  longestStreak: number;
  capturedAt: string;
  isLive: boolean;
  profileUrl: string;
  dailySubmissions: Record<string, number>;
};

// Verified baseline numbers grounded in dated repository snapshot (§5)
const FALLBACK: CodingStats = {
  total: statsJson.total,
  easy: statsJson.easy,
  medium: statsJson.medium,
  hard: statsJson.hard,
  contestRating: statsJson.contestRating,
  contestsCount: statsJson.contestsCount,
  activeDays: statsJson.activeDays,
  longestStreak: statsJson.longestStreak,
  capturedAt: statsJson.capturedAt,
  isLive: false,
  profileUrl: statsJson.profileUrl || CODOLIO_PROFILE,
  dailySubmissions: {},
};

type CodolioResponse = {
  data?: {
    platformProfiles?: {
      platformProfiles?: Array<{
        platform: string;
        userStats?: {
          currentRating?: number | null;
        } | null;
        totalQuestionStats?: {
          totalQuestionCounts?: number | null;
          easyQuestionCounts?: number | null;
          mediumQuestionCounts?: number | null;
          hardQuestionCounts?: number | null;
        } | null;
        dailyActivityStatsResponse?: {
          submissionCalendar?: Record<string, number> | null;
        } | null;
      }>;
    };
  };
};

export async function getCodingStats(): Promise<CodingStats> {
  try {
    const res = await fetch(CODOLIO_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return FALLBACK;

    const json = (await res.json()) as CodolioResponse;
    const raw = json.data?.platformProfiles?.platformProfiles;
    if (!raw || raw.length === 0) return FALLBACK;

    let total = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let contestRating = FALLBACK.contestRating;
    const dailySubmissions: Record<string, number> = {};

    for (const p of raw) {
      const q = p.totalQuestionStats;
      if (q) {
        total += q.totalQuestionCounts ?? 0;
        easy += q.easyQuestionCounts ?? 0;
        medium += q.mediumQuestionCounts ?? 0;
        hard += q.hardQuestionCounts ?? 0;
      }
      if (p.platform === "leetcode" && p.userStats?.currentRating) {
        contestRating = p.userStats.currentRating;
      }

      // Aggregate daily submissions across all platforms (LeetCode, GfG, CodeStudio, CodeChef)
      const cal = p.dailyActivityStatsResponse?.submissionCalendar;
      if (cal) {
        for (const [ts, count] of Object.entries(cal)) {
          const tsNum = parseInt(ts, 10);
          if (!isNaN(tsNum) && typeof count === "number" && count > 0) {
            try {
              const d = new Date(tsNum * 1000).toISOString().split("T")[0];
              dailySubmissions[d] = (dailySubmissions[d] || 0) + count;
            } catch {
              // ignore invalid date
            }
          }
        }
      }
    }

    if (total === 0) return FALLBACK;

    // Ensure verified minimums for depth signals
    return {
      total: Math.max(total, FALLBACK.total),
      easy: Math.max(easy, FALLBACK.easy),
      medium: Math.max(medium, FALLBACK.medium),
      hard: Math.max(hard, FALLBACK.hard),
      contestRating,
      contestsCount: 29,
      activeDays: FALLBACK.activeDays,
      longestStreak: FALLBACK.longestStreak,
      capturedAt: FALLBACK.capturedAt,
      isLive: true,
      profileUrl: CODOLIO_PROFILE,
      dailySubmissions,
    };
  } catch {
    return FALLBACK;
  }
}
