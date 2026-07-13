"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AudienceMode = "recruiter" | "engineer";

const STORAGE_KEY = "audience-mode";

const AudienceModeContext = createContext<{
  mode: AudienceMode;
  setMode: (mode: AudienceMode) => void;
  toggle: () => void;
} | null>(null);

export function AudienceModeProvider({ children }: { children: ReactNode }) {
  // Always start "recruiter" so server and first client render match (no
  // hydration mismatch). Sync from localStorage after mount.
  const [mode, setMode] = useState<AudienceMode>("recruiter");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "engineer") setMode("engineer");
  }, []);

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
