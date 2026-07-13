"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useAudienceMode, type AudienceMode } from "./context";

const OPTIONS: { value: AudienceMode; label: string }[] = [
  { value: "recruiter", label: "Recruiter" },
  { value: "engineer", label: "Engineer" },
];

/**
 * Audience Mode switch (§4b) — quiet infrastructure, not spectacle. A compact
 * segmented control; the active pill slides between options (layoutId), reduced
 * -motion gated. Radiogroup semantics so it reads correctly to screen readers.
 */
export function AudienceModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useAudienceMode();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label="Content depth"
      className={`inline-flex items-center rounded-lg border border-border bg-background-subtle p-0.5 ${className ?? ""}`}
    >
      {OPTIONS.map((opt) => {
        const isActive = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setMode(opt.value)}
            className={`relative inline-flex min-h-9 touch-manipulation items-center rounded-md px-3 text-small font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
              isActive ? "text-accent" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {isActive ? (
              <motion.span
                layoutId="audience-pill"
                className="absolute inset-0 rounded-md bg-accent-subtle"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 32 }
                }
                aria-hidden
              />
            ) : null}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
