import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site.config";

const EXPLORING = ["AI Security", "Agent Systems", "Distributed Systems"];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-20 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <p className="flex items-center gap-2 text-small font-medium uppercase tracking-widest text-foreground-muted">
          <span className="h-px w-6 bg-accent" aria-hidden />
          Currently exploring
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {EXPLORING.map((item) => (
            <span key={item} className="text-body-lg text-foreground">
              <span className="text-accent">✓</span> {item}
            </span>
          ))}
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

        <p className="mt-12 text-small text-foreground-subtle">
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
