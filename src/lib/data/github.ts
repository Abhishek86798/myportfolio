import "server-only";
import annotations from "@/data/commit-annotations.json";

/**
 * GitHub data layer — build-time / ISR fetching for the Live Dashboard (§5, §6).
 *
 * Contributions (the heatmap) come from the GraphQL API, which needs a token
 * (GITHUB_TOKEN env var, a read-only PAT). Repos / languages / commits come from
 * the free REST API. Everything degrades gracefully: a missing token or a failed
 * fetch returns null for that slice, and the UI renders a fallback — it never throws.
 */

const USERNAME = "Abhishek86798";
const REVALIDATE_SECONDS = 3600; // hourly, per PLAN.md §0

const REST = "https://api.github.com";
const GRAPHQL = "https://api.github.com/graphql";

// ---------- Types ----------

export type ContributionDay = {
  date: string;
  count: number;
  /** 0-4 intensity level, GitHub's own bucketing. */
  level: 0 | 1 | 2 | 3 | 4;
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
  /** Optional hand-authored "why this mattered" note, keyed by SHA (§5). */
  note?: string;
};

export type LanguageStat = {
  name: string;
  percent: number; // 0-100
};

export type GitHubStats = {
  profile: { publicRepos: number; followers: number; createdAt: string } | null;
  contributions: ContributionData | null;
  topRepos: Repo[];
  recentCommits: RecentCommit[];
  languages: LanguageStat[];
};

// ---------- Helpers ----------

function token(): string | undefined {
  return process.env.GITHUB_TOKEN;
}

async function restFetch<T>(path: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
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

// ---------- Contributions (GraphQL, needs token) ----------

const CONTRIB_LEVEL: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchContributions(): Promise<ContributionData | null> {
  const t = token();
  if (!t) return null; // no token → no heatmap, UI shows fallback

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
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
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

// ---------- Repos + languages (REST) ----------

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
  const repos = await restFetch<RawRepo[]>(
    `/users/${USERNAME}/repos?per_page=100&sort=updated`
  );
  if (!repos) return [];
  return repos.filter((r) => !r.fork);
}

function topRepos(repos: RawRepo[]): Repo[] {
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
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return [...counts.entries()]
    .map(([name, n]) => ({ name, percent: Math.round((n / total) * 100) }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);
}

// ---------- Recent commits (REST) ----------
//
// The public /events endpoint omits commit messages, so we instead pull the
// latest commit from each of the most-recently-updated repos and merge them by
// date. This gives real messages without needing a token.

type RawCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } };
};

async function fetchRecentCommits(repos: RawRepo[]): Promise<RecentCommit[]> {
  const notes = annotations as Record<string, string>;

  // Look at the 6 most-recently-updated non-fork repos, newest commit from each.
  const recentRepos = repos
    .slice()
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
    .slice(0, 6);

  const perRepo = await Promise.all(
    recentRepos.map(async (r): Promise<RecentCommit | null> => {
      const list = await restFetch<RawCommit[]>(
        `/repos/${USERNAME}/${r.name}/commits?author=${USERNAME}&per_page=1`
      );
      const c = list?.[0];
      if (!c) return null;
      return {
        sha: c.sha,
        message: c.commit.message.split("\n")[0],
        repo: r.name,
        url: c.html_url,
        date: c.commit.author.date,
        note: notes[c.sha],
      };
    })
  );

  return perRepo
    .filter((c): c is RecentCommit => c !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5);
}

// ---------- Public entry point ----------

export async function getGitHubStats(): Promise<GitHubStats> {
  const [profile, contributions, repos] = await Promise.all([
    restFetch<{
      public_repos: number;
      followers: number;
      created_at: string;
    }>(`/users/${USERNAME}`),
    fetchContributions(),
    fetchRepos(),
  ]);

  // Commits depend on the repo list, so they run after repos resolve.
  const recentCommits = await fetchRecentCommits(repos);

  return {
    profile: profile
      ? {
          publicRepos: profile.public_repos,
          followers: profile.followers,
          createdAt: profile.created_at,
        }
      : null,
    contributions,
    topRepos: topRepos(repos),
    recentCommits,
    languages: languageBreakdown(repos),
  };
}
