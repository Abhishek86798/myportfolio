import { MapPin, Code2, ShieldCheck, Rocket, type LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/data/site.config";

const ICONS: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  code: Code2,
  shield: ShieldCheck,
  rocket: Rocket,
};

export function About() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="Who I am">About</SectionHeading>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {siteConfig.about.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <Reveal
              key={item.label}
              delay={i * 0.05}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface px-6 py-5 text-body text-foreground transition-colors hover:border-accent/50"
            >
              {Icon ? (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent transition-colors">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
              ) : null}
              <span className="font-medium">{item.label}</span>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
