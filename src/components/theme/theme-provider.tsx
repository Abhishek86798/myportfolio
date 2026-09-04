"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

type Theme = "dark";

const ThemeContext = createContext<{
  theme: Theme;
}>({ theme: "dark" });

export const themeInitScript = `
(function() {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.classList.add('dark');
})();
`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
