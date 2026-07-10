"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Both icons render identically on server & client; the init script sets
          data-theme before paint, so CSS picks the right one — no hydration branch. */}
      <Sun className="hidden h-4 w-4 [:root[data-theme=dark]_&]:block" aria-hidden />
      <Moon className="hidden h-4 w-4 [:root[data-theme=light]_&]:block" aria-hidden />
    </button>
  );
}
