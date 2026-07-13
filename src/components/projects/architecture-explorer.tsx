"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  DoorOpen,
  ShieldCheck,
  Activity,
  Box,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { ArchitectureNode } from "@/data/projects";

const ICONS: Record<ArchitectureNode["icon"], LucideIcon> = {
  door: DoorOpen,
  shield: ShieldCheck,
  activity: Activity,
  box: Box,
  server: Server,
};

/**
 * Interactive architecture diagram (§4a) — the page's signature feature.
 * Renders the project's stages as node cards (icon + name + role) joined by
 * flow connectors, using the WAI-ARIA tablist pattern: each card is a tab, the
 * decision panel is its tabpanel. Click or keyboard (arrows / Home / End)
 * selects a stage; the panel shows the why / tradeoff / rejected behind it.
 * Calm by design: emerald marks the active card, connectors fill up to it,
 * content crossfades. Reduced-motion → static.
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

      {/* Node rail — cards joined by flow connectors. Horizontal on desktop,
          vertical (with a left spine) on mobile. */}
      <div
        role="tablist"
        aria-label="Architecture stages"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0"
      >
        {nodes.map((node, i) => {
          const isActive = i === activeIndex;
          const Icon = ICONS[node.icon];
          const connectorLit = i < activeIndex;
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
                className={`group flex w-full min-h-11 flex-1 touch-manipulation flex-col gap-1 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-0 ${
                  isActive
                    ? "-translate-y-0.5 border-accent bg-accent-subtle shadow-sm shadow-accent/10"
                    : "border-border hover:-translate-y-0.5 hover:border-accent/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-accent-strong" : "text-foreground-subtle"}`}
                    aria-hidden
                  />
                  <span
                    className={`font-mono text-small font-medium ${isActive ? "text-accent-strong" : "text-foreground"}`}
                  >
                    {node.label}
                  </span>
                </span>
                <span className="truncate text-[0.7rem] text-foreground-subtle">
                  {node.role}
                </span>
              </button>

              {/* Flow connector — fills emerald up to the active node */}
              {i < nodes.length - 1 ? (
                <ArrowRight
                  className={`mx-1 hidden h-4 w-4 shrink-0 self-center transition-colors sm:block ${
                    connectorLit ? "text-accent" : "text-border"
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
            <h4 className="font-mono text-body-lg font-semibold text-accent-strong">
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
