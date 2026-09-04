"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity-image";

const fallbackImages: Record<string, string> = {
  ayusynapse: "/projects/ayusynapse.jpg",
  "mcp-zero-trust-security-gateway": "/projects/mcp-zero-trust.jpg",
  "mcp-zero-trust-gateway": "/projects/mcp-zero-trust.jpg",
  cidra: "/projects/cidra.jpg",
};

const PROJECT_HIGHLIGHTS: Record<string, string> = {
  ayusynapse: "Sub-100ms WebRTC consultation & real-time EHR sync",
  "mcp-zero-trust-security-gateway": "mTLS reverse proxy with sub-millisecond policy engine",
  "mcp-zero-trust-gateway": "mTLS reverse proxy with sub-millisecond policy engine",
  cidra: "AST static differential parsing with risk score classification",
};

export function Projects({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <Section id="projects" variant="raised">
      <SectionHeading id="projects">Projects</SectionHeading>

      <div className="relative mt-8 sm:mt-10 flex flex-col gap-10 sm:gap-14 pb-8 sm:pb-12 max-w-4xl mx-auto">
        {data.map((project: any, i: number) => (
          <StackingProjectCard
            key={project.slug || project._id || i}
            project={project}
            index={i}
            total={data.length}
          />
        ))}
      </div>
    </Section>
  );
}

function StackingProjectCard({
  project,
  index,
  total,
}: {
  project: any;
  index: number;
  total: number;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scale down subtly from 1 to 0.97 as the next card covers it
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  // Subtle depth drop to 75% brightness as the next card stacks atop
  const filter = useTransform(scrollYProgress, [0, 1], ["brightness(1)", "brightness(0.75)"]);

  const imageUrl = project.image
    ? urlForImage(project.image)?.url()
    : fallbackImages[project.slug] || null;

  const navigateToCaseStudy = () => {
    router.push(`/projects/${project.slug}`);
  };

  const repoPath = project.githubUrl
    ? project.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")
    : `Abhishek86798/${project.slug}`;

  const architectureNote = PROJECT_HIGHLIGHTS[project.slug] || null;

  return (
    <div
      ref={containerRef}
      className="sticky top-28 sm:top-32 w-full"
      style={{
        zIndex: index + 10,
      }}
    >
      <motion.article
        onClick={navigateToCaseStudy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigateToCaseStudy();
          }
        }}
        tabIndex={0}
        role="link"
        aria-label={`Read case study for ${project.title}`}
        style={{
          scale: index === total - 1 ? 1 : scale,
          filter: index === total - 1 ? "none" : filter,
        }}
        className="group/card relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-[#0d0f12] p-6 sm:p-8 shadow-2xl transition-all duration-200 hover:border-border/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
      >
        {/* Visual Preview */}
        {imageUrl ? (
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden rounded-xl border border-border/50 bg-background-subtle mb-5">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover object-top transition-transform duration-300 group-hover/card:scale-[1.01]"
            />
          </div>
        ) : null}

        {/* Title, Repo Path & Actions */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] font-semibold text-accent uppercase tracking-wider">
                  0{index + 1} · System
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover/card:text-accent">
                {project.title}
              </h3>
              <p className="font-mono text-xs text-foreground-subtle mt-0.5">
                {repoPath}
              </p>
            </div>

            {/* Actions: External links & Case study pill */}
            <div className="flex items-center gap-2 shrink-0">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} Live Site`}
                  className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 font-mono text-xs text-foreground-subtle transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>Live</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}

              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} on GitHub`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground-subtle transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              ) : null}

              <div
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3.5 font-mono text-xs font-medium text-accent transition-colors group-hover/card:bg-accent/20"
                aria-hidden
              >
                <span>Case Study</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5" />
              </div>
            </div>
          </div>

          <p className="mt-2 text-body text-foreground-muted leading-relaxed line-clamp-3 max-w-3xl">
            {project.description}
          </p>

          {/* Architecture Capability Highlight (Substantive evidence, no 3-stat divider) */}
          {architectureNote ? (
            <div className="mt-3 flex items-center gap-2 font-mono text-xs text-foreground-subtle bg-surface/30 border border-border/40 rounded-lg px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-foreground-muted font-medium">Architecture:</span>
              <span className="truncate">{architectureNote}</span>
            </div>
          ) : null}
        </div>

        {/* Tech Stack Chips */}
        {project.tags && project.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-border/30">
            {project.tags.slice(0, 7).map((tech: string) => (
              <span
                key={tech}
                className="rounded-full border border-border/80 bg-background px-3 py-1 font-mono text-xs text-foreground-subtle"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </motion.article>
    </div>
  );
}
