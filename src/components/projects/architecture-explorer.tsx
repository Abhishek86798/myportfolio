"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ArchitectureNode } from "@/data/projects";

/**
 * Interactive architecture pipeline (§4a). Renders the project's stages as a
 * WAI-ARIA tablist — each node is a tab, the decision panel is its tabpanel.
 * Click or keyboard (arrows / Home / End) selects a stage; the panel shows the
 * why / tradeoff / rejected behind it. Calm by design: emerald marks the active
 * node, a connector fills up to it, content crossfades. Reduced-motion → static.
 */
export function ArchitectureExplorer({ nodes }: { nodes: ArchitectureNode[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (nodes.length === 0) return null;
  const active = nodes[activeIndex];

  const focusTab = (i: number) => {
    setActiveIndex(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = nodes.length - 1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusTab(activeIndex === last ? 0 : activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusTab(activeIndex === 0 ? last : activeIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(last);
        break;
    }
  };

  return (
    <div>
      <p className="sr-only">
        Architecture pipeline, {nodes.length} stages, {nodes[0].label} to{" "}
        {nodes[nodes.length - 1].label}. Select a stage to read its design
        decision.
      </p>

      {/* Node rail — horizontal on desktop, vertical on mobile */}
      <div
        role="tablist"
        aria-label="Architecture stages"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0"
      >
        {nodes.map((node, i) => {
          const isActive = i === activeIndex;
          const isPast = i <= activeIndex;
          return (
            <div key={node.id} className="flex items-center sm:contents">
              <button
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${node.id}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIndex(i)}
                className={`inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-lg border px-4 py-2 font-mono text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "border-accent bg-accent-subtle text-accent-strong"
                    : "border-border text-foreground-muted hover:border-accent/50 hover:text-foreground"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isActive ? "bg-accent" : "bg-border"
                  }`}
                  aria-hidden
                />
                {node.label}
              </button>

              {/* Connector — fills emerald up to the active node */}
              {i < nodes.length - 1 ? (
                <ChevronRight
                  className={`mx-1 hidden h-4 w-4 shrink-0 transition-colors sm:block ${
                    isPast && i < activeIndex ? "text-accent" : "text-border"
                  }`}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Decision panel */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        tabIndex={0}
        className="mt-6 rounded-xl border border-border bg-background-subtle p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <motion.div
          key={active.id}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="font-mono text-body-lg font-semibold text-accent">
              {active.label}
            </h4>
            <span className="shrink-0 font-mono text-small tabular-nums text-foreground-subtle">
              {activeIndex + 1} / {nodes.length}
            </span>
          </div>

          <dl className="mt-5 flex flex-col gap-5">
            <DecisionRow label="Why" value={active.why} />
            <DecisionRow label="Tradeoff" value={active.tradeoff} />
            <DecisionRow label="Rejected" value={active.rejected} rejected />
          </dl>
        </motion.div>
      </div>
    </div>
  );
}

function DecisionRow({
  label,
  value,
  rejected = false,
}: {
  label: string;
  value: string;
  rejected?: boolean;
}) {
  return (
    <div className={rejected ? "border-l-2 border-border pl-4" : undefined}>
      <dt className="text-small font-medium uppercase tracking-widest text-foreground-subtle">
        {label}
      </dt>
      <dd className="mt-1.5 max-w-2xl text-body leading-[1.7] text-foreground-muted">
        {value}
      </dd>
    </div>
  );
}
