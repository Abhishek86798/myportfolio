"use client";

import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { useAudienceMode } from "@/components/audience-mode/context";

const FALLBACK_METRICS: Record<string, { value: string; label: string }[]> = {
  HiGigAi: [
    { value: "$0/mo", label: "recurring infra" },
    { value: "5", label: "branch subdomains" },
    { value: "25+", label: "Sanity schemas" },
  ],
  "Trionix Technologies": [
    { value: "500+", label: "users served" },
    { value: "6", label: "backend modules" },
    { value: "50%", label: "fewer DB round-trips" },
  ],
};

export function Experience({ data = [] }: { data?: any[] }) {
  const { mode } = useAudienceMode();
  const isEngineer = mode === "engineer";

  // Map Sanity schema fields to component expectations
  const normalizedData = data.map((job: any) => {
    const org = job.company || job.org || "Unknown";
    return {
      ...job,
      org,
      period: job.duration || job.period,
      stack: job.tags || job.stack || [],
      highlights:
        job.highlights ||
        (job.description
          ? job.description.map((b: any) => b.children?.[0]?.text).filter(Boolean)
          : []),
      orgUrl: job.orgUrl || (org === "HiGigAi" ? "https://www.tridentpublicschool.com/" : "https://trionixtechnologies.in/"),
      location: job.location || "Remote",
      metrics: (job.metrics && job.metrics.length > 0) ? job.metrics : (FALLBACK_METRICS[org] || []),
      engineerHighlights: job.engineerHighlights || [],
    };
  });

  // Reverse-chronological order: newest (order 1 / HiGigAi) first
  const sortedData = [...normalizedData].sort((a: any, b: any) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    return 0;
  });

  return (
    <Section id="experience" variant="base">
      <SectionHeading id="experience" eyebrow="Where I've worked">Experience</SectionHeading>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {sortedData.map((job: any, i: number) => {
          const isLatest = i === 0;
          const metrics = job.metrics || [];

          return (
            <Reveal key={job._id || `${job.org}-${job.period}-${i}`} delay={i * 0.05}>
              <article
                className={`relative overflow-hidden rounded-2xl transition-all ${
                  isLatest
                    ? "border border-border/90 bg-[#17181c] dark:bg-[#17181c] p-6 sm:p-8 shadow-2xl shadow-black/30 ring-1 ring-white/[0.06] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/50 before:to-transparent hover:border-accent/40"
                    : "border border-border/40 bg-surface/30 dark:bg-surface/30 p-6 sm:p-8 hover:bg-surface/50 hover:border-border/60"
                }`}
              >
                {/* Eyebrow: Differentiate role hierarchy */}
                <div className="mb-2.5 flex items-center justify-between">
                  {isLatest ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      Most Recent
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-foreground-subtle">
                      Previous Role
                    </span>
                  )}
                  <span className="font-mono text-xs text-foreground-subtle">
                    {job.location ? `${job.location} · ` : ""}{job.period}
                  </span>
                </div>

                {/* Left-Aligned Header: No Letter Avatar */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                    {job.role}{" "}
                    {job.orgUrl ? (
                      <a
                        href={job.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>@ {job.org}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-accent">@ {job.org}</span>
                    )}
                  </h3>
                </div>

                {/* Three Large Figures on a Hairline Row - strictly left-aligned */}
                {metrics.length > 0 ? (
                  <div className="mt-5 grid grid-cols-3 divide-x divide-border/60 border-y border-border/60 py-3.5">
                    {metrics.slice(0, 3).map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-col px-4 first:pl-0 last:pr-0 text-left"
                      >
                        <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-foreground tracking-tight">
                          {m.value}
                        </span>
                        <span className="text-xs text-foreground-subtle truncate mt-0.5 font-medium">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Bullet Points with Substantive Accomplishments */}
                <ul className="mt-5 flex flex-col gap-2.5">
                  {job.highlights.map((point: string, idx: number) => (
                    <li
                      key={`${idx}-${point.substring(0, 10)}`}
                      className="flex gap-3 text-body text-foreground-muted leading-relaxed"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Engineer mode deeper implementation notes (§4b) */}
                {isEngineer && job.engineerHighlights && job.engineerHighlights.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                    {job.engineerHighlights.map((point: string) => (
                      <li key={point} className="text-small text-foreground-muted">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Tech Stack Tags */}
                {job.stack && job.stack.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.stack.map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border/80 bg-background px-3 py-1 font-mono text-xs text-foreground-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
