"use client";

import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { useAudienceMode } from "@/components/audience-mode/context";
import { skillGroups } from "@/data/skills";

export function Skills() {
  const { mode } = useAudienceMode();
  const isEngineer = mode === "engineer";
  return (
    <Section id="skills">
      <SectionHeading eyebrow="What I work with">Skills</SectionHeading>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.05}>
            <h3 className="text-small font-medium uppercase tracking-widest text-foreground-subtle">
              {group.category}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="cursor-default rounded-full border border-border bg-surface px-3.5 py-1.5 text-small text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
            {/* Engineer mode adds how/where each group is used (§4b) */}
            {isEngineer && group.usage ? (
              <p className="mt-3 text-small leading-relaxed text-foreground-muted">
                {group.usage}
              </p>
            ) : null}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
