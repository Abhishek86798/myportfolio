"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { useAudienceMode } from "@/components/audience-mode/context";
import { journey } from "@/data/journey";

// Spine geometry — single source of truth. The spine is the vertical center of
// the left gutter; dots self-center on it via -translate-x-1/2, so no per-dot
// size math is needed and any dot-size change stays perfectly aligned.
const SPINE_LEFT = "left-[7px] md:left-[9px]"; // spine x (mobile / desktop)
const DOT_LEFT = "left-[7px] md:left-[9px]"; // dot center x — same as spine

export function Journey() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { mode } = useAudienceMode();
  const isEngineer = mode === "engineer";
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  // Track scroll through the list; the emerald spine "draws" from top as it passes.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.4"],
  });
  const drawScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="journey">
      <SectionHeading eyebrow="How I got here">Journey</SectionHeading>

      <ol ref={listRef} className="relative flex flex-col">
        {/* Base spine (faint) — sits at the gutter center */}
        <div
          className={`absolute bottom-3 top-3 w-px -translate-x-1/2 bg-border ${SPINE_LEFT}`}
          aria-hidden
        />
        {/* Emerald spine that draws on scroll (or static when reduced-motion) */}
        <motion.div
          className={`absolute bottom-3 top-3 w-px origin-top -translate-x-1/2 bg-accent ${SPINE_LEFT}`}
          style={{ scaleY: reduceMotion ? 1 : drawScaleY }}
          aria-hidden
        />

        {journey.map((m, i) => {
          // Engineer mode auto-expands every node's technical detail (§4b),
          // unless the visitor has explicitly collapsed this one.
          const isOpen =
            openId === m.id || (isEngineer && openId !== `closed-${m.id}`);
          const panelId = `journey-panel-${m.id}`;
          return (
            <motion.li
              key={m.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
              className="relative py-3 pl-8 md:pl-10"
            >
              {/* Node dot — self-centers on the spine via -translate-x-1/2, and
                  on the year row's optical center via top-[1.65rem] (py-3 12px +
                  half the 28.8px body-lg line box) + -translate-y-1/2. */}
              <span
                className={`absolute top-[1.65rem] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${DOT_LEFT} ${
                  m.current
                    ? "h-3.5 w-3.5 bg-accent"
                    : "h-3 w-3 border-2 border-border bg-background"
                }`}
                aria-hidden
              >
                {m.current ? (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                ) : null}
              </span>

              <button
                type="button"
                onClick={() =>
                  setOpenId(
                    isOpen
                      ? isEngineer
                        ? `closed-${m.id}` // sentinel: explicitly collapsed in engineer mode
                        : null
                      : m.id
                  )
                }
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="block w-full touch-manipulation rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className={`font-mono text-body-lg font-medium tabular-nums ${
                      m.current ? "text-accent" : "text-foreground-subtle"
                    }`}
                  >
                    {m.year}
                  </span>
                  <span className="text-body-lg font-semibold text-foreground">
                    {m.title}
                  </span>
                  {m.current ? (
                    <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-small font-medium text-accent">
                      Now
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 max-w-2xl text-body text-foreground-muted">
                  {m.summary}
                </p>
              </button>

              {/* Expandable detail — grid-rows collapse (transform-safe) */}
              <div
                id={panelId}
                className={`grid transition-[grid-template-rows] ease-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
                style={{ transitionDuration: reduceMotion ? "0ms" : "250ms" }}
                aria-hidden={!isOpen}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pt-3 text-body text-foreground-muted">
                    {m.detail}
                  </p>
                  {m.tags && m.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-surface px-3 py-1 text-small text-foreground-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {m.link ? (
                    <a
                      href={m.link.href}
                      className="mt-4 inline-flex touch-manipulation items-center gap-1.5 rounded-md text-small font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {m.link.label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
