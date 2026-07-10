"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AudienceMode = "recruiter" | "engineer";

const STORAGE_KEY = "audience-mode";

const AudienceModeContext = createContext<{
  mode: AudienceMode;
  setMode: (mode: AudienceMode) => void;
  toggle: () => void;
} | null>(null);

function readStoredMode(): AudienceMode {
  if (typeof window === "undefined") return "recruiter";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "engineer" ? "engineer" : "recruiter";
}

export function AudienceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AudienceMode>(readStoredMode);

  const updateMode = (next: AudienceMode) => {
    setMode(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <AudienceModeContext.Provider
      value={{
        mode,
        setMode: updateMode,
        toggle: () => updateMode(mode === "recruiter" ? "engineer" : "recruiter"),
      }}
    >
      {children}
    </AudienceModeContext.Provider>
  );
}

export function useAudienceMode() {
  const ctx = useContext(AudienceModeContext);
  if (!ctx) {
    throw new Error("useAudienceMode must be used within AudienceModeProvider");
  }
  return ctx;
}
