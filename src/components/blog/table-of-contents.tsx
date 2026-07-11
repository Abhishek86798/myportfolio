"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * Sticky TOC (desktop only) with active-section highlight via IntersectionObserver.
 * Quiet by design — plain indented text, emerald tick on the active item only.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-small">
      <p className="mb-4 font-medium uppercase tracking-widest text-foreground-subtle">
        On this page
      </p>
      <ul className="flex flex-col gap-2 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-0.5 transition-colors",
                item.level === 3 ? "pl-6" : "pl-4",
                activeId === item.id
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
