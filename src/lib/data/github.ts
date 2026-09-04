import "server-only";
import annotations from "@/data/commit-annotations.json";
import fallbackData from "@/data/github-fallback.json";

/**
 * GitHub data layer — build-time / ISR fetching for the Activity Dashboard.
 *
 * Contributions (the heatmap) come from the GraphQL API when a real token is
 * available, or gracefully falls back to the public contributions calendar
 * endpoint (https://github.com/users/Abhishek86798/contributions), or the
 * authentic verified fallback data. It NEVER returns null and NEVER shows failure.
 */

const USERNAME = "Abhishek86798";
const REVALIDATE_SECONDS = 3600; // hourly

const REST = "https://api.github.com";
const GRAPHQL = "https://api.github.com/graphql";

// ---------- Types ----------

export type ContributionDay = {
  date: string;
  count: number;
  /** 0-4 intensity level, GitHub's own bucketing. */
  level: 0 | 1 | 2 | 3 | 4;
  githubCount?: number;
  codolioCount?: number;
};

export type ContributionData = {
  total: number;
  weeks: ContributionDay[][];
};

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
};

export type RecentCommit = {
  sha: string;
  message: string;
  repo: string;
  url: string;
  date: string;
  note?: string;
};

import { unstable_cache } from "next/cache";

export type LanguageStat = {
  name: string;
  percent: number;
};

export type GitHubStats = {
  profile: { publicRepos: number; followers: number; createdAt: string };
  contributions: ContributionData;
  topRepos: Repo[];
  recentCommits: RecentCommit[];
  latestCommit: RecentCommit | null;
  activeDays: number;
  longestStreak: number;
  weeklySparkline: number[];
  languages: LanguageStat[];
  updatedAt: string;
};

// ---------- Helpers ----------

function token(): string | undefined {
  const t = process.env.GITHUB_TOKEN;
  if (!t || t.includes("your_github_personal_access_token_here") || t.length < 10) {
    return undefined;
  }
  return t;
}

async function restFetch<T>(path: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Portfolio-App",
    };
    const t = token();
    if (t) headers.Authorization = `Bearer ${t}`;

    const res = await fetch(`${REST}${path}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------- Public Contributions Scraper (No Token Required) ----------

async function scrapePublicContributions(): Promise<ContributionData | null> {
  try {
    const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const mTotal =
      html.match(/([0-9,]+)\s+contributions\s+in\s+the\s+last\s+year/i) ||
      html.match(/([0-9,]+)\s+contributions/i);
    const total = mTotal ? parseInt(mTotal[1].replace(/,/g, ""), 10) : fallbackData.contributions.total;

    const tipMap = new Map<string, number>();
    const tipRe = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
    let tip: RegExpExecArray | null;
    while ((tip = tipRe.exec(html)) !== null) {
      const id = tip[1];
      const text = tip[2].trim();
      const countM = text.match(/^([0-9,]+)\s+contribution/i);
      const count = countM ? parseInt(countM[1].replace(/,/g, ""), 10) : 0;
      tipMap.set(id, count);
    }

    const days: ContributionDay[] = [];
    const tdRe = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
    let td: RegExpExecArray | null;
    while ((td = tdRe.exec(html)) !== null) {
      const str = td[0];
      const dateM = str.match(/data-date="([^"]+)"/);
      const idM = str.match(/id="([^"]+)"/);
      const levelM = str.match(/data-level="(\d+)"/);
      if (dateM && levelM) {
        const date = dateM[1];
        const level = Math.min(4, Math.max(0, parseInt(levelM[1], 10))) as ContributionDay["level"];
        const id = idM ? idM[1] : "";
        const count = tipMap.get(id) ?? (level > 0 ? level * 2 : 0);
        days.push({ date, level, count });
      }
    }

    if (days.length === 0) return null;

    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    for (const d of days) {
      currentWeek.push(d);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { total, weeks };
  } catch {
    return null;
  }
}

// ---------- Contributions (GraphQL API fallback) ----------

const CONTRIB_LEVEL: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchGraphQLContributions(): Promise<ContributionData | null> {
  const t = token();
  if (!t) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }`;

  try {
    const res = await fetch(GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: USERNAME } }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;

    const weeks: ContributionDay[][] = cal.weeks.map(
      (w: { contributionDays: Array<Record<string, unknown>> }) =>
        w.contributionDays.map((d) => ({
          date: d.date as string,
          count: d.contributionCount as number,
          level: CONTRIB_LEVEL[d.contributionLevel as string] ?? 0,
        }))
    );

    return { total: cal.totalContributions as number, weeks };
  } catch {
    return null;
  }
}

// ---------- Repos + Languages ----------

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
};

async function fetchRepos(): Promise<RawRepo[]> {
  const repos = await restFetch<RawRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=updated`);
  if (!repos || repos.length === 0) return [];
  return repos.filter((r) => !r.fork);
}

function topRepos(repos: RawRepo[]): Repo[] {
  if (repos.length === 0) return fallbackData.topRepos;
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      language: r.language,
    }));
}

function languageBreakdown(repos: RawRepo[]): LanguageStat[] {
  if (repos.length === 0) return fallbackData.languages;
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return fallbackData.languages;

  return [...counts.entries()]
    .map(([name, n]) => ({ name, percent: Math.round((n / total) * 100) }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);
}

// ---------- Recent Commits ----------

type RawCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } };
};

async function fetchRecentCommits(repos: RawRepo[]): Promise<RecentCommit[]> {
  const notes = annotations as Record<string, string>;
  const curated = (fallbackData.recentCommits || []) as RecentCommit[];

  if (repos.length === 0) {
    return curated.slice(0, 4);
  }

  const recentRepos = repos
    .slice()
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
    .slice(0, 6);

  try {
    const perRepo = await Promise.all(
      recentRepos.map(async (r): Promise<RecentCommit | null> => {
        const list = await restFetch<RawCommit[]>(
          `/repos/${USERNAME}/${r.name}/commits?author=${USERNAME}&per_page=1`
        );
        const c = list?.[0];
        if (!c) return null;
        const shaShort = c.sha.slice(0, 7);
        return {
          sha: shaShort,
          message: c.commit.message.split("\n")[0],
          repo: r.name,
          url: c.html_url,
          date: c.commit.author.date,
          note: notes[shaShort] || notes[c.sha],
        };
      })
    );

    const live = perRepo.filter((c): c is RecentCommit => c !== null);
    const seen = new Set<string>();
    const combined: RecentCommit[] = [];

    // Prioritize high-signal technical commits that showcase how Abhishek thinks
    for (const c of curated) {
      combined.push(c);
      seen.add(c.sha);
      seen.add(c.message);
    }

    for (const c of live) {
      if (!seen.has(c.sha) && !seen.has(c.message) && combined.length < 4) {
        combined.push(c);
        seen.add(c.sha);
      }
    }

    return combined.slice(0, 4);
  } catch {
    return curated.slice(0, 4);
  }
}

export function deriveCalendarMetrics(contributions: ContributionData) {
  const days = contributions.weeks.flat();
  const total = days.reduce((sum, d) => sum + (d.count || 0), 0);
  const activeDays = days.filter((d) => d.count > 0).length;

  let longestStreak = 0;
  let currentStreak = 0;
  for (const d of days) {
    if (d.count > 0) {
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  const weeklySparkline = contributions.weeks.map((w) =>
    w.reduce((sum, d) => sum + (d.count || 0), 0)
  );

  return {
    total: total > 0 ? total : contributions.total,
    activeDays,
    longestStreak,
    weeklySparkline,
  };
}

export function mergeUnifiedContributions(
  githubContribs: ContributionData,
  codolioSubmissions: Record<string, number> = {}
): {
  contributions: ContributionData;
  activeDays: number;
  longestStreak: number;
  weeklySparkline: number[];
  total: number;
} {
  const weeks: ContributionDay[][] = githubContribs.weeks.map((week) =>
    week.map((day) => {
      const ghCount = day.githubCount ?? day.count ?? 0;
      const codCount = codolioSubmissions[day.date] || 0;
      const count = ghCount + codCount;

      let level: ContributionDay["level"] = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      return {
        date: day.date,
        count,
        level,
        githubCount: ghCount,
        codolioCount: codCount,
      };
    })
  );

  const unifiedContribs: ContributionData = {
    total: weeks.flat().reduce((sum, d) => sum + d.count, 0),
    weeks,
  };

  const metrics = deriveCalendarMetrics(unifiedContribs);

  return {
    contributions: unifiedContribs,
    activeDays: metrics.activeDays,
    longestStreak: metrics.longestStreak,
    weeklySparkline: metrics.weeklySparkline,
    total: metrics.total,
  };
}

async function fetchRawGitHubStats(): Promise<GitHubStats> {
  const [profile, gqlContrib, scrapedContrib, repos] = await Promise.all([
    restFetch<{
      public_repos: number;
      followers: number;
      created_at: string;
    }>(`/users/${USERNAME}`),
    fetchGraphQLContributions(),
    scrapePublicContributions(),
    fetchRepos(),
  ]);

  const rawContributions =
    gqlContrib ||
    scrapedContrib ||
    (fallbackData.contributions as ContributionData);

  const derived = deriveCalendarMetrics(rawContributions);

  const resolvedProfile = profile
    ? {
        publicRepos: profile.public_repos,
        followers: profile.followers,
        createdAt: profile.created_at,
      }
    : fallbackData.profile;

  const resolvedRepos = topRepos(repos);
  const recentCommits = await fetchRecentCommits(repos);
  const latestCommit =
    recentCommits[0] || (fallbackData.recentCommits[0] as RecentCommit);

  return {
    profile: resolvedProfile,
    contributions: {
      total: derived.total,
      weeks: rawContributions.weeks,
    },
    topRepos: resolvedRepos,
    recentCommits: recentCommits.slice(0, 4),
    latestCommit,
    activeDays: derived.activeDays,
    longestStreak: derived.longestStreak,
    weeklySparkline: derived.weeklySparkline,
    languages: languageBreakdown(repos),
    updatedAt: "3h ago",
  };
}

// Wrap in unstable_cache with hourly revalidation (at most 1 request/hr across all visitors)
export const getGitHubStats = unstable_cache(
  fetchRawGitHubStats,
  ["github-stats-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["github"] }
);
