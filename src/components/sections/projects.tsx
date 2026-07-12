import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { MetricRow } from "@/components/ui/metric-row";
import { projects, type Project } from "@/data/projects";

export function Projects() {
  return (
    <Section id="projects" className="bg-background-subtle">
      <SectionHeading eyebrow="What I've built">Projects</SectionHeading>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const featured = project.featured;
  return (
    <article
      className={`group relative rounded-2xl border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10 active:translate-y-0 ${
        featured
          ? "border-accent/40 p-8 md:p-10"
          : "border-border p-6 hover:border-accent/50 md:p-8"
      }`}
    >
      {featured ? (
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-small font-medium text-accent">
          <Star className="h-3.5 w-3.5" aria-hidden />
          Featured
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <h3
          className={`font-semibold tracking-tight text-foreground ${
            featured ? "text-title" : "text-body-lg"
          }`}
        >
          {project.title}
        </h3>
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="-m-2 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        ) : null}
      </div>

      <p className={`mt-3 max-w-2xl text-foreground-muted ${featured ? "text-body-lg" : "text-body"}`}>
        {project.recruiter.overview}
      </p>

      {project.metrics && project.metrics.length > 0 ? (
        <div className="mt-6 border-t border-border pt-6">
          <MetricRow metrics={project.metrics} />
        </div>
      ) : null}

      <p className="mt-6 max-w-2xl text-small text-foreground-muted">
        {project.recruiter.impact}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-background-subtle px-3 py-1 text-small text-foreground-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.github ? (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex touch-manipulation items-center gap-1.5 rounded-md text-small font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          View on GitHub
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      ) : null}
    </article>
  );
}
