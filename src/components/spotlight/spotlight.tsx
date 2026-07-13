"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { searchItems, type SpotlightItem } from "@/lib/spotlight";

const GROUP_ORDER: SpotlightItem["group"][] = [
  "Sections",
  "Projects",
  "Writing",
  "Actions",
];

export function Spotlight({ items }: { items: SpotlightItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setMounted(true), []);

  // Flat, ordered result list (grouped for display, flat for keyboard nav).
  const results = useMemo(() => searchItems(query, items), [query, items]);

  const grouped = useMemo(() => {
    const map = new Map<SpotlightItem["group"], SpotlightItem[]>();
    for (const item of results) {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      group: g,
      items: map.get(g)!,
    }));
  }, [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const go = useCallback(
    (item: SpotlightItem) => {
      close();
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else if (item.href.startsWith("#")) {
        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", item.href);
      } else {
        router.push(item.href);
      }
    },
    [close, router]
  );

  // Global ⌘K / Ctrl+K to toggle; "/" to open when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (
        e.key === "/" &&
        !open &&
        !/^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input + lock scroll when open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep active index in range as results change.
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item);
    }
  };

  // Scroll the active option into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!mounted) return null;

  return (
    <>
      {/* Trigger — quiet, in nav */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search (Command K)"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-2.5 text-small text-foreground-subtle transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Search className="h-4 w-4" aria-hidden />
        <kbd className="hidden font-mono text-[0.7rem] sm:inline">⌘K</kbd>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[15vh]">
              <div
                className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                onClick={close}
                aria-hidden
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Search"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onKeyDown={onListKeyDown}
                className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
              >
                {/* Search input */}
                <div className="flex items-center gap-3 border-b border-border px-4">
                  <Search className="h-5 w-5 shrink-0 text-foreground-subtle" aria-hidden />
                  <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="spotlight-list"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      results[activeIndex] ? `spotlight-opt-${activeIndex}` : undefined
                    }
                    placeholder="Search sections, projects, writing…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 w-full bg-transparent text-body text-foreground placeholder:text-foreground-subtle focus:outline-none"
                  />
                </div>

                {/* Results */}
                <ul
                  ref={listRef}
                  id="spotlight-list"
                  role="listbox"
                  aria-label="Search results"
                  className="max-h-[50vh] overflow-y-auto p-2"
                >
                  {results.length === 0 ? (
                    <li className="px-3 py-8 text-center text-small text-foreground-muted">
                      No results for “{query}”
                    </li>
                  ) : (
                    grouped.map(({ group, items: groupItems }) => (
                      <li key={group}>
                        <p className="px-3 pb-1 pt-3 text-[0.7rem] font-medium uppercase tracking-widest text-foreground-subtle">
                          {group}
                        </p>
                        <ul>
                          {groupItems.map((item) => {
                            const flatIndex = results.indexOf(item);
                            const isActive = flatIndex === activeIndex;
                            return (
                              <li key={item.id} role="presentation">
                                <button
                                  type="button"
                                  id={`spotlight-opt-${flatIndex}`}
                                  data-index={flatIndex}
                                  role="option"
                                  aria-selected={isActive}
                                  onClick={() => go(item)}
                                  onMouseMove={() => setActiveIndex(flatIndex)}
                                  className={`flex min-h-11 w-full touch-manipulation items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-body transition-colors ${
                                    isActive
                                      ? "bg-accent-subtle text-accent"
                                      : "text-foreground-muted"
                                  }`}
                                >
                                  <span className="truncate">{item.label}</span>
                                  {isActive ? (
                                    <CornerDownLeft className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                                  ) : null}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ))
                  )}
                </ul>

                {/* Footer hint */}
                <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[0.7rem] text-foreground-subtle">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" aria-hidden />
                    <ArrowDown className="h-3 w-3" aria-hidden />
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" aria-hidden />
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono">esc</kbd>
                    close
                  </span>
                </div>
              </motion.div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
