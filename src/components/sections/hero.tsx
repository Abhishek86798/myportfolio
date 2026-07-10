import { ArrowDown, ArrowUpRight, FileText, Mail } from "lucide-react";
import { siteConfig } from "@/data/site.config";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center px-6 py-24 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Live status badge (§4f) */}
        <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background-subtle px-3 py-1.5 text-small text-foreground-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {siteConfig.status.label} — {siteConfig.status.project}
        </div>

        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Hi, I&apos;m {siteConfig.name.split(" ")[0]}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 text-title font-medium text-foreground-muted">
          {siteConfig.role}
        </p>
        <p className="mt-4 max-w-2xl text-body-lg text-foreground-muted">
          {siteConfig.tagline}
        </p>

        {/* CTAs — anchor the whitespace with intentional actions */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex touch-manipulation items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-small font-medium text-accent-foreground transition-all hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Projects
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={siteConfig.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex touch-manipulation items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-small font-medium text-foreground transition-all hover:border-accent hover:text-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Resume
          </a>
          <a
            href={siteConfig.links.email}
            className="inline-flex touch-manipulation items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-small font-medium text-foreground transition-all hover:border-accent hover:text-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </a>
        </div>

        {/* 3D accent hook — stubbed for Phase 3 (§4h) */}
      </div>

      {/* Scroll affordance */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 flex h-11 w-11 -translate-x-1/2 touch-manipulation items-center justify-center rounded-full text-foreground-subtle transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" aria-hidden />
      </a>
    </section>
  );
}
