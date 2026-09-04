import { NextResponse } from "next/server";
import { getGitHubStats } from "@/lib/data/github";

export const revalidate = 60; // 1-minute caching for near-live freshness

export async function GET() {
  try {
    const ghStats = await getGitHubStats();

    return NextResponse.json({
      success: true,
      contributions: ghStats.contributions,
      activeDays: ghStats.activeDays,
      longestStreak: ghStats.longestStreak,
      weeklySparkline: ghStats.weeklySparkline,
      total: ghStats.contributions.total,
      recentCommits: ghStats.recentCommits,
      updatedAt: "just now",
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
