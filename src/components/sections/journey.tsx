"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { useAudienceMode } from "@/components/audience-mode/context";
import { journey as fallbackJourney } from "@/data/journey";

export function Journey({ data = [] }: { data?: any[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { mode } = useAudienceMode();
  const isEngineer = mode === "engineer";

  const items = data && data.length > 0 ? data : fallbackJourney;

  // Group milestones chronologically by year (2023 -> 2026) to show acceleration
  const yearGroups = items.reduce((acc: Record<string, any[]>, item: any) => {
    const y = item.year || "2023";
    if (!acc[y]) acc[y] = [];
    acc[y].push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(yearGroups).sort((a, b) => Number(a) - Number(b));

  return (
    <Section id="journey" variant="raised">
      <SectionHeading id="journey" eyebrow="How I got here">Journey</SectionHeading>

      <div className="flex flex-col gap-10 sm:gap-14">
        {sortedYears.map((year, yearIdx) => {
          const milestones = yearGroups[year];
          const hasCurrent = milestones.some((m: any) => m.current);

          return (
            <Reveal key={year} delay={yearIdx * 0.05}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
                {/* Left Gutter: Year Numeral alone (strong anchor, unclipped) */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <span
                    className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight ${
                      hasCurrent ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {year}
                  </span>
                  {hasCurrent ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-semibold text-accent-strong">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      Now
                    </span>
                  ) : null}
                </div>

                {/* Right Column: Left-aligned single-column timeline with hairline spine */}
                <div className="md:col-span-9 relative pl-6 sm:pl-8 border-l border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-7">
                  {milestones.map((m: any, mIdx: number) => {
                    const itemId = m._id || m.id || `${year}-${mIdx}`;
                    const isOpen =
                      openId === itemId || (isEngineer && openId !== `closed-${itemId}`);
                    const isCurrent = m.current;

                    return (
                      <div key={itemId} className="relative group/item">
                        {/* Dot on Left Spine: only 'now' is filled, no hollow dots */}
                        {isCurrent ? (
                          <span
                            className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent ring-4 ring-accent/20"
                            aria-hidden
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                          </span>
                        ) : null}

                        {/* Whole Row Clickable */}
                        <button
                          type="button"
                          onClick={() =>
                            setOpenId(isOpen ? `closed-${itemId}` : itemId)
                          }
                          className="w-full text-left flex flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-lg"
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <div className="flex flex-wrap items-baseline gap-2">
                              {m.period ? (
                                <span className="font-mono text-xs font-medium text-accent">
                                  {m.period} ·
                                </span>
                              ) : null}
                              <h3 className="text-body font-semibold tracking-tight text-foreground transition-colors group-hover/item:text-accent">
                                {m.title}
                              </h3>
                            </div>

                            {/* Single quiet + / − toggle affordance at the right edge */}
                            {m.detail ? (
                              <span
                                className="font-mono text-sm font-semibold text-foreground-subtle transition-colors group-hover/item:text-accent shrink-0 select-none"
                                aria-hidden
                              >
                                {isOpen ? "−" : "+"}
                              </span>
                            ) : null}
                          </div>

                          <p className="text-small text-foreground-muted leading-relaxed pr-6">
                            {m.summary}
                          </p>
                        </button>

                        {/* Expandable Technical Depth */}
                        {m.detail && isOpen ? (
                          <div className="mt-2.5 rounded-xl border border-border/70 bg-surface/60 p-4 text-small text-foreground-muted leading-relaxed">
                            <p>{m.detail}</p>
                            {m.tags && m.tags.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {m.tags.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-border/80 bg-background px-2.5 py-0.5 font-mono text-xs text-foreground-subtle"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            {m.link ? (
                              <a
                                href={m.link.href}
                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover"
                              >
                                {m.link.label}
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                              </a>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
