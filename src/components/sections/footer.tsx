import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site.config";
import { EmailAction } from "@/components/ui/email-action";

const EXPLORING = ["AI Security", "Agent Systems", "Distributed Systems"];

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-black/[0.06] dark:border-white/[0.06] bg-background px-6 py-16 md:px-12 md:py-[88px]"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          // CURRENTLY EXPLORING
        </p>
        <div className="mt-4 flex flex-col gap-2 font-mono text-small">
          <div className="flex items-center gap-2.5 text-foreground">
            <span className="text-accent font-bold">[x]</span>
            <span>AI Security</span>
          </div>
          <div className="flex items-center gap-2.5 text-foreground">
            <span className="text-accent font-bold">[x]</span>
            <span>Agent Systems</span>
          </div>
          <div className="flex items-center gap-2.5 text-foreground-muted">
            <span className="text-foreground-subtle font-bold">[ ]</span>
            <span>Distributed Systems</span>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-title font-semibold tracking-tight text-foreground">
          Open to internships. Let&apos;s build something awesome.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.links.email}
            aria-label="Email"
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mail className="h-5 w-5" aria-hidden />
          </a>
        </div>

        {/* Visible address — always readable/selectable, even with no mail client */}
        <p className="mt-4 text-small text-foreground-muted">
          Or reach me at{" "}
          <EmailAction className="font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline">
            {siteConfig.email}
          </EmailAction>
        </p>

        <div className="mt-12 flex items-center justify-between gap-4 font-mono text-xs text-foreground-subtle border-t border-border/40 pt-6">
          <p className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {siteConfig.name}.</span>
            <span>·</span>
            <span className="text-foreground-muted">exit 0</span>
          </p>
          <a
            href="#main"
            className="text-foreground-subtle transition-colors hover:text-accent"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
