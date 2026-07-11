import { ArrowUpRight, BookOpen, Code2, GitCommitHorizontal, Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Heatmap } from "@/components/dashboard/heatmap";
import { siteConfig } from "@/data/site.config";
import type { GitHubStats } from "@/lib/data/github";
import type { CodingStats } from "@/lib/data/codolio";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Shared card chrome — dashboard density (p-5), consistent across the bento grid.
const CARD = "rounded-2xl border border-border bg-surface p-5";

export function Dashboard({
  stats,
  coding,
}: {
  stats: GitHubStats;
  coding: CodingStats;
}) {
  const { contributions, recentCommits, topRepos, languages, profile } = stats;

  const hasNoData =
    !contributions && recentCommits.length === 0 && topRepos.length === 0;

  return (
    <Section id="dashboard">
      <SectionHeading eyebrow="What I'm up to">Live Dashboard</SectionHeading>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          value={profile ? String(profile.publicRepos) : "—"}
          label="Public repos"
        />
        <StatTile
          value={contributions ? contributions.total.toLocaleString() : "—"}
          label="Contributions this year"
        />
        <StatTile
          value={coding.isLive ? String(coding.total) : `${coding.total}+`}
          label="DSA problems solved"
        />
        <StatTile
          value={
            <span className="flex items-center gap-2 text-body-lg">
              <BookOpen className="h-5 w-5 shrink-0 text-accent" aria-hidden />
              <span className="line-clamp-2 font-medium">
                {siteConfig.dashboard.reading}
              </span>
            </span>
          }
          label="Currently reading"
        />
      </div>

      {/* Heatmap — full width (needs the horizontal room for 52 weeks) */}
      {contributions ? (
        <Reveal className={`mt-4 ${CARD}`}>
          <Heatmap data={contributions} />
        </Reveal>
      ) : null}

      {/* Bento row: commits (left, tall) | repos + coding stacked (right) */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent commits */}
        {recentCommits.length > 0 ? (
          <Reveal className={CARD}>
            <h3 className="flex items-center gap-2 text-body-lg font-semibold text-foreground">
              <GitCommitHorizontal className="h-5 w-5 text-accent" aria-hidden />
              Recent commits
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {recentCommits.slice(0, 4).map((c) => (
                <li key={c.sha}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-11 touch-manipulation flex-col justify-center rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <p className="font-mono text-small text-foreground transition-colors group-hover:text-accent">
                      {c.message}
                    </p>
                    {c.note ? (
                      <p className="mt-1 text-small text-foreground-muted">
                        {c.note}
                      </p>
                    ) : null}
                    <p className="mt-1 text-small text-foreground-subtle">
                      {c.repo.split("/")[1] ?? c.repo} · {relativeTime(c.date)}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/* Right column — repos + coding stacked */}
        <div className="flex flex-col gap-4">
          {/* Top repos */}
          {topRepos.length > 0 ? (
            <Reveal className={CARD}>
              <h3 className="text-body-lg font-semibold text-foreground">
                Top repositories
              </h3>
              <ul className="mt-3 flex flex-col gap-3">
                {topRepos.map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex touch-manipulation items-start justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-small font-medium text-foreground transition-colors group-hover:text-accent">
                          {r.name}
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                        </span>
                        {r.description ? (
                          <span className="mt-0.5 block truncate text-small text-foreground-subtle">
                            {r.description}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex shrink-0 items-center gap-3 text-small text-foreground-subtle">
                        {r.language ? <span>{r.language}</span> : null}
                        {r.stars > 0 ? (
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" aria-hidden />
                            {r.stars}
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {/* Coding practice (Codolio) — languages folded in as a footer strip */}
          {coding.platforms.length > 0 ? (
            <Reveal className={CARD}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="flex items-center gap-2 text-body-lg font-semibold text-foreground">
                  <Code2 className="h-5 w-5 text-accent" aria-hidden />
                  Coding practice
                </h3>
                <a
                  href={coding.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex touch-manipulation items-center gap-1 rounded-md text-small font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  View on Codolio
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                {coding.platforms.map((p) => (
                  <div key={p.name}>
                    <div className="text-body-lg font-semibold tabular-nums text-foreground">
                      {p.solved}
                    </div>
                    <div className="mt-0.5 truncate text-small text-foreground-muted">
                      {p.name}
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width: `${Math.round((p.solved / coding.total) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Languages folded in as a quiet footer strip */}
              {languages.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-small">
                  <span className="text-foreground-subtle">Mostly:</span>
                  {languages.slice(0, 4).map((l) => (
                    <span key={l.name} className="flex items-baseline gap-1">
                      <span className="font-medium text-foreground">
                        {l.name}
                      </span>
                      <span className="text-foreground-subtle">{l.percent}%</span>
                    </span>
                  ))}
                </div>
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </div>

      {/* Fallback when no data at all (token missing + API down) */}
      {hasNoData ? (
        <p className={`mt-4 ${CARD} text-body text-foreground-muted`}>
          Live stats are resting — check back shortly, or find me on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover"
          >
            GitHub
          </a>
          .
        </p>
      ) : null}
    </Section>
  );
}

function StatTile({
  value,
  label,
  labelClass,
}: {
  value: React.ReactNode;
  label: string;
  labelClass?: string;
}) {
  return (
    <Reveal className={`flex flex-col justify-between ${CARD}`}>
      <div className="text-title font-semibold tracking-tight tabular-nums text-foreground">
        {value}
      </div>
      <div className={`mt-2 text-small text-foreground-muted ${labelClass ?? ""}`}>
        {label}
      </div>
    </Reveal>
  );
}
