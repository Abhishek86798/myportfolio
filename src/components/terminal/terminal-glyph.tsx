"use client";

import { useTerminal } from "./context";

/**
 * The discoverable-not-advertised entry point (§4d): a faint `>_` with no label.
 * Only a hover tooltip hints at what it is. Never appears in nav or Spotlight.
 */
export function TerminalGlyph() {
  const { setOpen } = useTerminal();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      title="Terminal"
      aria-label="Open terminal"
      className="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-md font-mono text-small text-foreground-subtle/60 transition-colors hover:bg-background-subtle hover:text-accent focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {">_"}
    </button>
  );
}
