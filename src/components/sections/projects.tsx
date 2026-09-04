"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity-image";

export function Projects({ data = [] }: { data?: any[] }) {
  return (
    <Section id="projects" variant="raised">
      <SectionHeading id="projects" eyebrow="What I've built">Projects</SectionHeading>

      <div className="relative mt-8 sm:mt-10 flex flex-col gap-10 sm:gap-12 pb-4 sm:pb-6 max-w-4xl mx-auto">
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

  // Scale down from 1 to 0.97 as the next card covers it
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  // Drop brightness to 70% as the next card covers it (depth without blur/glow)
  const filter = useTransform(scrollYProgress, [0, 1], ["brightness(1)", "brightness(0.7)"]);

  // Resolve screenshot: Sanity image asset OR local asset for AyuSynapse if Sanity asset not uploaded yet
  const imageUrl = project.image
    ? urlForImage(project.image)?.url()
    : project.slug === "ayusynapse"
    ? "/projects/ayusynapse.jpg"
    : null;

  const navigateToCaseStudy = () => {
    router.push(`/projects/${project.slug}`);
  };

  const repoPath = project.githubUrl
    ? project.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")
    : `Abhishek86798/${project.slug}`;

  return (
    <div
      ref={containerRef}
      className="sticky top-24 sm:top-28 w-full"
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
        className="group/card relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-[#0d0f12] p-6 sm:p-8 shadow-2xl transition-all duration-200 hover:border-[#2E323A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent"
      >
        {/* Slot 1: Visual preview (collapses completely when no image) */}
        {imageUrl ? (
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden rounded-xl border border-border/50 bg-background-subtle">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover object-top"
            />
          </div>
        ) : null}

        {/* Slot 2: Title + Repo path + Top-Right Action Pair (GitHub mark and ↗ arrow) */}
        <div className={`${imageUrl ? "mt-5" : "mt-0"} flex flex-col gap-1.5`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover/card:text-foreground">
                {project.title}
              </h3>
              <p className="font-mono text-xs text-foreground-subtle mt-0.5">
                {repoPath}
              </p>
            </div>

            {/* Top-Right Action Pair */}
            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} on GitHub`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-subtle transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              ) : null}

              {/* Case Study Arrow Affordance - goes emerald on card hover */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-subtle transition-colors duration-200 group-hover/card:border-accent group-hover/card:text-accent"
                aria-hidden
              >
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          <p className="text-body text-foreground-muted leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Slot 3: 3 metrics on a hairline row - left aligned */}
        {project.metrics && project.metrics.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 divide-x divide-border/60 border-y border-border/60 py-3.5">
            {project.metrics.slice(0, 3).map((m: any, idx: number) => (
              <div
                key={idx}
                className="flex flex-col px-4 first:pl-0 last:pr-0 text-left"
              >
                <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-foreground tracking-tight">
                  {m.value}
                </span>
                <span className="text-xs text-foreground-subtle truncate mt-0.5 font-medium">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {/* Slot 4: 4–6 stack tags */}
        {project.tags && project.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 6).map((tech: string) => (
              <span
                key={tech}
                className="rounded-full border border-border/80 bg-background-subtle/80 px-3 py-1 font-mono text-xs text-foreground-muted"
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
