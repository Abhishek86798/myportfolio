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
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Track scroll position to transition header from transparent to backdrop-blurred with hairline border.
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 88; // 64px header + 24px clearance
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
    <header
      className={cn(
        "sticky top-0 z-50 border-t-0 transition-all duration-200",
        isScrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md shadow-xs"
          : "border-b border-transparent bg-background/40 backdrop-blur-xs"
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-12">
        {/* Left: Brand Identity + Live Status Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.pushState(null, "", "/");
            }}
            className="group flex items-center gap-1.5 rounded-lg text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="font-mono text-sm tracking-tight text-foreground group-hover:text-accent transition-colors">
              {siteConfig.name.split(" ")[0]}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[11px] font-mono text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span>available</span>
          </div>
        </div>

        {/* Center: Sleek floating segmented pill navigation on desktop */}
        <div className="hidden md:flex items-center">
          <ul className="flex items-center gap-0.5 rounded-full border border-border/80 bg-surface/80 p-1 backdrop-blur-md shadow-xs">
            {DESKTOP_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-1 text-xs font-mono transition-all duration-150",
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
        <div className="flex items-center gap-2">
          <Spotlight items={spotlightIndex} />

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub profile"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Get in touch"
            className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-xs font-mono text-foreground-muted transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>contact</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
          </a>

          {/* Mobile menu trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden />
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
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
                        {siteConfig.name.split(" ")[0]}
                        <span className="text-accent">.</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        <span>available</span>
                      </span>
                    </div>
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
