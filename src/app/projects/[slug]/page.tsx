import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { sanityFetch } from "@/sanity/client";
import { projectBySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/lib/sanity-image";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { getAllPosts } from "@/lib/blog";
import { buildSpotlightIndex } from "@/lib/spotlight-index";
import { PortableText } from "@portabletext/react";

export const revalidate = 3600;

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, posts] = await Promise.all([
    sanityFetch<any>({
      query: projectBySlugQuery,
      params: { slug },
      tags: ["project"],
    }),
    getAllPosts(),
  ]);

  if (!project) {
    notFound();
  }

  const spotlightIndex = buildSpotlightIndex(posts);

  return (
    <>
      <Nav spotlightIndex={spotlightIndex} />
      <main className="min-h-screen pt-24 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-2 text-small font-mono text-foreground-muted hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / projects</span>
        </Link>

        {/* 2-Column Sticky Case Study Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (Sticky Overview & Specs) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>SPEC // {project.slug}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>

            <p className="text-body-lg text-foreground-muted leading-relaxed">
              {project.description}
            </p>

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 ? (
              <div className="grid grid-cols-3 divide-x divide-border/60 border-y border-border/60 py-4 my-2">
                {project.metrics.map((m: any, idx: number) => (
                  <div key={idx} className={`flex flex-col ${idx === 0 ? "pr-3" : idx === 1 ? "px-3 text-center" : "pl-3 text-right"}`}>
                    <span className="font-mono text-lg font-bold text-foreground tabular-nums">
                      {m.value}
                    </span>
                    <span className="text-xs text-foreground-subtle truncate mt-1">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* External Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/40">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-small font-medium text-foreground hover:text-accent transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  Source Code
                </a>
              ) : null}

              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-small font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  Live Deployment
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Right Column (Scrolling Evidence & Writeup) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Gallery Images */}
            {(() => {
              const fallbackImages: Record<string, string[]> = {
                ayusynapse: ["/projects/ayusynapse.jpg"],
                "mcp-zero-trust-security-gateway": ["/projects/mcp-zero-trust.jpg"],
                "mcp-zero-trust-gateway": ["/projects/mcp-zero-trust.jpg"],
                cidra: ["/projects/cidra.jpg"],
              };
              const galleryImages: string[] =
                project.images && project.images.length > 0
                  ? project.images.map((img: any) => urlForImage(img)?.url()).filter(Boolean)
                  : fallbackImages[project.slug] || [];

              return galleryImages.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {galleryImages.map((src: string, i: number) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-xl"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-background-subtle">
                        <Image
                          src={src}
                          alt={`${project.title} screenshot ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface p-8 text-center font-mono text-small text-foreground-muted">
                  [ Architectural telemetry & diagrams active in local builds ]
                </div>
              );
            })()}

            {/* Detailed Content / Writeup */}
            {project.content ? (
              <div className="rounded-2xl border border-border bg-surface p-8 prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-foreground mb-4 font-mono">
                  // Architectural Decisions & Implementation
                </h3>
                <div className="text-body text-foreground-muted leading-relaxed space-y-4">
                  <PortableText value={project.content} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
