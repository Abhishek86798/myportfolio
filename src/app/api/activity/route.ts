import { NextResponse } from "next/server";
import { getGitHubStats, mergeUnifiedContributions } from "@/lib/data/github";
import { getCodingStats } from "@/lib/data/codolio";

export const revalidate = 60; // 1-minute caching for near-live freshness

export async function GET() {
  try {
    const [ghStats, codingStats] = await Promise.all([
      getGitHubStats(),
      getCodingStats(),
    ]);

    const unified = mergeUnifiedContributions(
      ghStats.contributions,
      codingStats.dailySubmissions
    );

    return NextResponse.json({
      success: true,
      contributions: unified.contributions,
      activeDays: unified.activeDays,
      longestStreak: unified.longestStreak,
      weeklySparkline: unified.weeklySparkline,
      total: unified.total,
      updatedAt: "just now",
      breakdown: {
        githubActiveDays: ghStats.activeDays,
        codolioActiveDays: codingStats.activeDays,
        dsaTotal: codingStats.total,
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
