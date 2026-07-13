"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Briefcase, TerminalSquare } from "lucide-react";
import { useAudienceMode } from "./context";

/**
 * Audience Mode switch (§4b) — quiet infrastructure.
 *
 * Default (desktop): an icon-only square button matching the theme toggle, so
 * search / mode / theme read as one utility cluster. The icon flips
 * (briefcase ↔ terminal) on click. Engineer (the non-default, "deeper" state)
 * gets an accent tint + a small dot so the current mode is visible at a glance
 * without a text label; Recruiter stays plain.
 *
 * `full` (mobile menu): a labeled, full-width variant where there's room and
 * the icon-only cue would be less obvious.
 */
export function AudienceModeToggle({
  className,
  full = false,
}: {
  className?: string;
  full?: boolean;
}) {
  const { mode, toggle } = useAudienceMode();
  const reduceMotion = useReducedMotion();
  const isEngineer = mode === "engineer";
  const Icon = isEngineer ? TerminalSquare : Briefcase;
  const nextLabel = isEngineer ? "Recruiter" : "Engineer";

  const icon = (
    <span className="relative flex h-4 w-4 items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
          className="absolute"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </motion.span>
      </AnimatePresence>
    </span>
  );

  const ariaLabel = `Viewing as ${isEngineer ? "Engineer" : "Recruiter"}. Switch to ${nextLabel} view.`;

  if (full) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isEngineer}
        aria-label={ariaLabel}
        className={`inline-flex min-h-11 w-full touch-manipulation items-center justify-between rounded-lg border px-3 text-small font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isEngineer
            ? "border-accent/50 bg-accent-subtle text-accent"
            : "border-border bg-background-subtle text-foreground-muted"
        } ${className ?? ""}`}
      >
        <span className="inline-flex items-center gap-2">
          {icon}
          {isEngineer ? "Engineer" : "Recruiter"}
        </span>
        <span className="text-foreground-subtle">tap to switch</span>
      </button>
    );
  }

  // Icon-only, matches the theme toggle. Accent tint + dot marks Engineer.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isEngineer}
      aria-label={ariaLabel}
      title={`Switch to ${nextLabel} view`}
      className={`relative inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isEngineer
          ? "border-accent/50 bg-accent-subtle text-accent"
          : "border-border text-foreground-muted hover:border-accent hover:text-accent"
      } ${className ?? ""}`}
    >
      {icon}
      {isEngineer ? (
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-background bg-accent"
          aria-hidden
        />
      ) : null}
    </button>
  );
}
