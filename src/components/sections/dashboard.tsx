import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";
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
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const CARD = "rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm";

export function Dashboard({
  stats,
  coding,
}: {
  stats: GitHubStats;
  coding: CodingStats;
}) {
  const { contributions, recentCommits } = stats;

  const totalDsa = coding.medium + coding.hard + coding.easy;
  const mediumPct = totalDsa > 0 ? Math.round((coding.medium / totalDsa) * 100) : 54;
  const hardPct = totalDsa > 0 ? Math.round((coding.hard / totalDsa) * 100) : 8;
  const easyPct = totalDsa > 0 ? 100 - mediumPct - hardPct : 38;

  return (
    <Section id="dashboard" variant="base">
      <SectionHeading id="dashboard" eyebrow="What I'm up to">Activity & Depth</SectionHeading>

      {/* Optimal Shape: Heatmap, full width */}
      <Reveal className={CARD}>
        <Heatmap
          data={contributions}
          updatedAt={stats.updatedAt}
        />
      </Reveal>

      {/* Optimal Shape: Two columns below */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        {/* Left Column: Recent Commits (4, with real engineering depth) */}
        <Reveal className={`${CARD} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="flex items-center gap-2 text-body-lg font-semibold text-foreground">
                <GitCommitHorizontal className="h-5 w-5 text-accent" aria-hidden />
                Recent Commits
              </h3>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-mono text-xs text-foreground-subtle transition-colors hover:text-accent"
              >
                <span>github.com/Abhishek86798</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" aria-hidden />
              </a>
            </div>

            <ul className="mt-4 flex flex-col divide-y divide-border/40">
              {recentCommits.slice(0, 4).map((c) => (
                <li key={c.sha} className="py-3.5 first:pt-0 last:pb-0">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block transition-colors"
                  >
                    <p className="font-mono text-small font-medium text-foreground transition-colors group-hover:text-accent">
                      {c.message}
                    </p>
                    {c.note ? (
                      <p className="mt-1 text-small text-foreground-muted leading-relaxed">
                        {c.note}
                      </p>
                    ) : null}
                    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-foreground-subtle">
                      <span className="rounded bg-background-subtle px-1.5 py-0.5 border border-border/60 text-foreground-muted">
                        {c.repo.split("/").pop()}
                      </span>
                      <span>·</span>
                      <span>{relativeTime(c.date)}</span>
                      <span className="opacity-0 transition-opacity group-hover:opacity-100 text-accent">
                        ↗
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Right Column: Difficulty Mix + 1640 Rating */}
        <Reveal className={`${CARD} flex flex-col justify-between`}>
          <div>
            {/* 1640 Rating Block */}
            <div className="border-b border-border/50 pb-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
                    {coding.contestRating || 1640}
                  </div>
                  <div className="mt-1 text-body font-medium text-foreground-muted">
                    Contest Rating
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                    Top ~15%
                  </span>
                  <div className="mt-1.5 font-mono text-[11px] text-foreground-subtle">
                    {coding.activeDays} active days · {coding.longestStreak} streak
                  </div>
                </div>
              </div>
              <p className="mt-2 font-mono text-xs text-foreground-subtle">
                LeetCode rating · {coding.contestsCount || 29} contests attended
              </p>
            </div>

            {/* Difficulty Mix Block */}
            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-body font-semibold text-foreground">
                    Problem Depth
                  </h4>
                  <span className="font-mono text-[11px] text-foreground-subtle">
                    (as of {coding.capturedAt || "Sep 2026"})
                  </span>
                </div>
                <span className="font-mono text-xs text-foreground-muted">
                  {coding.total} total solved
                </span>
              </div>

              {/* High-signal metric tiles: 393 Medium / 55 Hard */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-accent/40 bg-accent/5 p-3">
                  <div className="font-mono text-2xl font-semibold text-accent">
                    {coding.medium}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-foreground">
                    Medium
                  </div>
                  <div className="mt-1 text-[11px] text-foreground-subtle">
                    Core signal
                  </div>
                </div>

                <div className="rounded-lg border border-border/80 bg-background-subtle p-3">
                  <div className="font-mono text-2xl font-semibold text-foreground">
                    {coding.hard}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-foreground">
                    Hard
                  </div>
                  <div className="mt-1 text-[11px] text-foreground-subtle">
                    Advanced
                  </div>
                </div>

                <div className="rounded-lg border border-border/80 bg-background-subtle p-3">
                  <div className="font-mono text-2xl font-semibold text-foreground-muted">
                    {coding.easy}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-foreground-muted">
                    Easy
                  </div>
                  <div className="mt-1 text-[11px] text-foreground-subtle">
                    Foundational
                  </div>
                </div>
              </div>

              {/* Fast-reading Stacked Horizontal Bar */}
              <div className="mt-5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-border/50 flex">
                  <div
                    style={{ width: `${mediumPct}%` }}
                    className="h-full bg-accent"
                    title={`${coding.medium} Medium (${mediumPct}%)`}
                  />
                  <div
                    style={{ width: `${hardPct}%` }}
                    className="h-full bg-emerald-300 dark:bg-emerald-200"
                    title={`${coding.hard} Hard (${hardPct}%)`}
                  />
                  <div
                    style={{ width: `${easyPct}%` }}
                    className="h-full bg-border"
                    title={`${coding.easy} Easy (${easyPct}%)`}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Medium ({mediumPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 dark:bg-emerald-200" />
                    Hard ({hardPct}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    Easy ({easyPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet verified profile link */}
          <div className="mt-6 border-t border-border/50 pt-3">
            <a
              href={coding.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-xs text-foreground-muted transition-colors hover:text-accent"
            >
              <span>Verified across LeetCode & Codolio</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
