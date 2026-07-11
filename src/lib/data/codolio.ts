import "server-only";

/**
 * Codolio coding-stats layer (§5 dashboard). Codolio aggregates DSA/CP problem
 * counts across LeetCode, Code360 (codestudio), GeeksforGeeks, CodeChef, etc.
 *
 * The endpoint is Codolio's own (unofficial, undocumented) public profile API:
 *   https://api.codolio.com/profile?userKey=<profileName>
 * It needs no auth. Because it's unofficial, EVERYTHING degrades gracefully:
 * a failed/changed response falls back to hand-authored numbers so the tile
 * never shows an error or a blank.
 */

const PROFILE_NAME = "abhishek_1005";
const CODOLIO_URL = `https://api.codolio.com/profile?userKey=${PROFILE_NAME}`;
const CODOLIO_PROFILE = `https://codolio.com/profile/${PROFILE_NAME}`;
const REVALIDATE_SECONDS = 21_600; // 6h — coding stats change slowly

// Fallback numbers (last known good), shown if the live fetch fails.
const FALLBACK: CodingStats = {
  total: 700,
  isLive: false,
  profileUrl: CODOLIO_PROFILE,
  platforms: [
    { name: "LeetCode", solved: 261 },
    { name: "GeeksforGeeks", solved: 176 },
    { name: "Code360", solved: 175 },
  ],
};

// Platforms we count toward the DSA total + how to label them.
const LABELS: Record<string, string> = {
  leetcode: "LeetCode",
  geeksforgeeks: "GeeksforGeeks",
  codestudio: "Code360",
  codechef: "CodeChef",
};
// Only DSA-practice platforms count toward the "problems solved" total.
const DSA_PLATFORMS = new Set(["leetcode", "geeksforgeeks", "codestudio"]);

export type PlatformStat = { name: string; solved: number };

export type CodingStats = {
  total: number;
  isLive: boolean;
  profileUrl: string;
  platforms: PlatformStat[];
};

type CodolioResponse = {
  data?: {
    platformProfiles?: {
      platformProfiles?: Array<{
        platform: string;
        totalQuestionStats?: { totalQuestionCounts?: number | null } | null;
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

    const platforms: PlatformStat[] = [];
    let total = 0;

    for (const p of raw) {
      const count = p.totalQuestionStats?.totalQuestionCounts ?? 0;
      if (!DSA_PLATFORMS.has(p.platform)) continue;
      if (count <= 0) continue;
      platforms.push({ name: LABELS[p.platform] ?? p.platform, solved: count });
      total += count;
    }

    if (platforms.length === 0 || total === 0) return FALLBACK;

    platforms.sort((a, b) => b.solved - a.solved);
    return { total, isLive: true, profileUrl: CODOLIO_PROFILE, platforms };
  } catch {
    return FALLBACK;
  }
}
