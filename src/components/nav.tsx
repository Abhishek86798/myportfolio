"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site.config";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Spotlight } from "@/components/spotlight/spotlight";
import type { SpotlightItem } from "@/lib/spotlight";
import { cn } from "@/lib/utils";

// Desktop nav displays the primary 6 sections inside the centered floating pill.
// All 7 sections (including Dashboard) are available in the mobile drawer and Spotlight.
const NAV_LINKS = [
  { href: "#about", id: "about", label: "About" },
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#projects", id: "projects", label: "Projects" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#journey", id: "journey", label: "Journey" },
  { href: "#dashboard", id: "dashboard", label: "Dashboard", desktop: false },
  { href: "#blog", id: "blog", label: "Blog" },
];

const DESKTOP_LINKS = NAV_LINKS.filter((l) => l.desktop !== false);

/** Robust scroll-position based section tracker */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const updateActive = () => {
      if (typeof window === "undefined") return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // If at very bottom of document, activate the last section (#blog)
      if (scrollY + windowHeight >= documentHeight - 60) {
        setActive(ids[ids.length - 1]);
        return;
      }

      // If at very top (in hero section, before #about)
      const firstSection = document.getElementById(ids[0]);
      if (firstSection && scrollY < firstSection.offsetTop - 200) {
        setActive(null);
        return;
      }

      // Target scroll threshold line for sticky floating header
      const targetLine = scrollY + 160;
      let current: string | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          if (el.offsetTop <= targetLine) {
            current = id;
          }
        }
      }

      setActive(current);
    };

    // Check on mount (handles page load at #blog or hash URL)
    updateActive();

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    window.addEventListener("hashchange", updateActive, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", updateActive);
    };
  }, [ids]);

  return [active, setActive] as const;
}

export function Nav({ spotlightIndex }: { spotlightIndex: SpotlightItem[] }) {
  const [active, setActive] = useActiveSection(NAV_LINKS.map((l) => l.id));
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while mobile menu is open.
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

  // Move focus into the panel on open; restore to trigger on close.
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        setActive(targetId);
        const headerOffset = 90; // floating nav clearance
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        history.pushState(null, "", href);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-0 bg-transparent pointer-events-none py-3 md:py-4 transition-all duration-200">
      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 md:px-12">
        {/* Left: Brand Identity (Clean, no available badge) */}
        <div className="pointer-events-auto flex items-center">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.pushState(null, "", "/");
            }}
            className="group font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
          >
            {siteConfig.name.split(" ")[0]}
            <span className="text-accent">.</span>
          </Link>
        </div>

        {/* Center: Sleek floating segmented pill navigation on desktop — dead-centered via absolute positioning */}
        <div className="pointer-events-auto hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ul className="flex items-center gap-1 rounded-full border border-border/80 bg-surface/90 p-1 backdrop-blur-md shadow-xs">
            {DESKTOP_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "inline-flex items-center justify-center h-7 px-3 rounded-full text-xs font-mono leading-none transition-all duration-150",
                      isActive
                        ? "bg-accent/15 text-accent font-medium shadow-xs"
                        : "text-foreground-muted hover:text-foreground hover:bg-white/[0.04]"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Spotlight, GitHub Profile, Contact CTA & Mobile Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/80 bg-surface/90 p-1 backdrop-blur-md shadow-xs">
          <Spotlight
            items={spotlightIndex}
            triggerClassName="h-7 px-2.5 rounded-full border-0 bg-transparent text-xs text-foreground-muted hover:text-accent hover:bg-white/[0.04] focus-visible:ring-1"
          />

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub profile"
            className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-white/[0.04] hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <GithubIcon className="h-3.5 w-3.5" />
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Get in touch"
            className="hidden lg:inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-mono text-foreground-muted transition-colors hover:bg-white/[0.04] hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <span>contact</span>
            <ArrowUpRight className="h-3 w-3 text-accent" />
          </a>

          {/* Mobile menu trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="inline-flex h-7 w-7 touch-manipulation items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-white/[0.04] hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent md:hidden"
          >
            <Menu className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — portaled to document.body */}
      {menuOpen && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[60] md:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />

              {/* Slide-over Drawer */}
              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col justify-between border-l border-border bg-background p-6 shadow-2xl"
              >
                <div>
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
                      {siteConfig.name.split(" ")[0]}
                      <span className="text-accent">.</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      aria-label="Close menu"
                      className="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <ul className="mt-6 flex flex-col gap-1.5">
                    {NAV_LINKS.map((link, idx) => {
                      const isActive = active === link.id;
                      return (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={(e) => {
                              setMenuOpen(false);
                              handleNavClick(e, link.href);
                            }}
                            aria-current={isActive ? "true" : undefined}
                            className={cn(
                              "flex items-center justify-between touch-manipulation rounded-lg px-3.5 py-2.5 text-sm font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                              isActive
                                ? "bg-accent/15 text-accent font-medium border border-accent/20"
                                : "text-foreground-muted hover:bg-surface hover:text-foreground"
                            )}
                          >
                            <span>{link.label}</span>
                            <span className="text-xs text-foreground-subtle">
                              0{idx + 1}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Drawer Footer info & social links */}
                <div className="border-t border-border/60 pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground-subtle">Connect</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center justify-between rounded-lg border border-border/80 bg-surface/40 px-3 py-2 text-xs font-mono text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    <span className="truncate">{siteConfig.email}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-accent" />
                  </a>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
