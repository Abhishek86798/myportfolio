import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <Section id="experience" className="bg-background-subtle">
      <SectionHeading eyebrow="Where I've worked">Experience</SectionHeading>

      <div className="flex flex-col gap-6">
        {experience.map((job, i) => (
          <Reveal
            key={`${job.org}-${job.period}`}
            delay={i * 0.05}
            className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50 md:p-8"
          >
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <h3 className="text-body-lg font-semibold text-foreground">
                {job.role}{" "}
                <span className="text-accent">@ {job.org}</span>
              </h3>
              <span className="shrink-0 text-small text-foreground-muted">
                {job.period}
              </span>
            </div>
            <p className="mt-1 text-small text-foreground-muted">{job.location}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {job.highlights.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-body text-foreground-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {job.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-background-subtle px-3 py-1 text-small text-foreground-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
