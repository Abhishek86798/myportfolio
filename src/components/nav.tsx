"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site.config";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AudienceModeToggle } from "@/components/audience-mode/toggle";
import { Spotlight } from "@/components/spotlight/spotlight";
import type { SpotlightItem } from "@/lib/spotlight";
import { cn } from "@/lib/utils";

// `desktop: false` keeps a section out of the (space-constrained) desktop bar
// while still showing it in the roomier mobile menu. Scroll-spy observes all.
const NAV_LINKS = [
  { href: "#about", id: "about", label: "About" },
  { href: "#journey", id: "journey", label: "Journey" },
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#projects", id: "projects", label: "Projects" },
  { href: "#dashboard", id: "dashboard", label: "Dashboard", desktop: false },
  { href: "#blog", id: "blog", label: "Blog" },
];

const DESKTOP_LINKS = NAV_LINKS.filter((l) => l.desktop !== false);

/** Scroll-spy: highlights the nav link for the section currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Nav({ spotlightIndex }: { spotlightIndex: SpotlightItem[] }) {
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Portal target — the header's backdrop-blur creates a containing block for
  // `position: fixed` descendants, which traps the overlay inside its own
  // (content-sized) box instead of the viewport. Render outside it instead.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape to close + focus trap within the panel while open.
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Move focus into the panel on open; restore to the trigger on close.
  // Skip the initial render so we don't grab focus on page load.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (menuOpen) {
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    } else if (wasOpen.current) {
      triggerRef.current?.focus();
    }
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="touch-manipulation rounded-lg text-body font-semibold tracking-tight text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {siteConfig.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop links (space-constrained subset) */}
          <ul className="mr-2 hidden items-center gap-1 md:flex">
            {DESKTOP_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "touch-manipulation rounded-lg px-3 py-2 text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active === link.id
                      ? "text-accent"
                      : "text-foreground-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Audience Mode — desktop only; mobile lives in the menu panel.
              Wrapper controls visibility so it wins over the button's own
              display utility. */}
          <span className="mr-1 hidden sm:inline-flex">
            <AudienceModeToggle />
          </span>
          <Spotlight items={spotlightIndex} />
          <ThemeToggle />

          {/* Mobile menu trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — portaled to document.body, see `mounted` note above */}
      {menuOpen && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[60] md:hidden">
              <div
                className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col border-l border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-body font-semibold text-foreground">Menu</span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>

                {/* Audience Mode — lives in the menu on mobile (§4b) */}
                <div className="mt-6">
                  <p className="mb-2 text-small font-medium uppercase tracking-widest text-foreground-subtle">
                    Viewing as
                  </p>
                  <AudienceModeToggle full />
                </div>

                <ul className="mt-6 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active === link.id ? "true" : undefined}
                        className={cn(
                          "flex touch-manipulation items-center rounded-lg px-4 py-3 text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          active === link.id
                            ? "bg-accent-subtle text-accent-strong-strong"
                            : "text-foreground-muted hover:bg-background-subtle hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
