"use client";

import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { MetricRow } from "@/components/ui/metric-row";
import { useAudienceMode } from "@/components/audience-mode/context";
import { experience } from "@/data/experience";

export function Experience() {
  const { mode } = useAudienceMode();
  const isEngineer = mode === "engineer";
  return (
    <Section id="experience" className="bg-background-subtle">
      <SectionHeading eyebrow="Where I've worked">Experience</SectionHeading>

      <div className="flex flex-col gap-6">
        {experience.map((job, i) => (
          <Reveal key={`${job.org}-${job.period}`} delay={i * 0.05}>
          <div className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 active:translate-y-0 md:p-8">
            <div className="flex items-start gap-4">
              {/* Company monogram — visual anchor per card */}
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-body-lg font-semibold text-accent-strong"
                aria-hidden
              >
                {job.org.charAt(0)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline">
                  <h3 className="text-body-lg font-semibold text-foreground">
                    {job.role}{" "}
                    {job.orgUrl ? (
                      <a
                        href={job.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex touch-manipulation items-center gap-0.5 rounded text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        @ {job.org}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-accent">@ {job.org}</span>
                    )}
                  </h3>
                  <span className="shrink-0 text-small text-foreground-subtle">
                    {job.location} · {job.period}
                  </span>
                </div>
              </div>
            </div>

            {job.metrics && job.metrics.length > 0 ? (
              <div className="mt-5">
                <MetricRow metrics={job.metrics} />
              </div>
            ) : null}

            <ul className="mt-5 flex flex-col gap-2">
              {job.highlights.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-body text-foreground-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Engineer mode adds deeper implementation notes (§4b) */}
            {isEngineer && job.engineerHighlights && job.engineerHighlights.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                {job.engineerHighlights.map((point) => (
                  <li key={point} className="text-small text-foreground-muted">
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {job.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-background-subtle px-3 py-1 text-small text-foreground-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
