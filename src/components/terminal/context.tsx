"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shared open/close state for Terminal Mode so the footer glyph, the keyboard
 * trigger, and the overlay itself all talk to one source of truth.
 */
const TerminalContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
} | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <TerminalContext.Provider value={{ open, setOpen }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within TerminalProvider");
  return ctx;
}
