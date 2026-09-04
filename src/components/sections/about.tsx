import {
  MapPin,
  Code2,
  ShieldCheck,
  Rocket,
  GraduationCap,
  Trophy,
  Terminal,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/data/site.config";

const ICONS: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  code: Code2,
  shield: ShieldCheck,
  rocket: Rocket,
  graduation: GraduationCap,
  trophy: Trophy,
  terminal: Terminal,
  brain: Brain,
};

export function About({ data }: { data?: any }) {
  // Use Sanity items if available, otherwise fall back to siteConfig.about
  const items =
    data?.items && data.items.length > 0 ? data.items : siteConfig.about;

  return (
    <Section id="about" variant="raised">
      <SectionHeading id="about">
        About
      </SectionHeading>

      <div className="border-y border-black/[0.06] dark:border-white/[0.06] divide-y divide-black/[0.06] dark:divide-white/[0.06]">
        {items.map((item: any, i: number) => {
          const Icon = item.icon ? ICONS[item.icon] : null;
          return (
            <Reveal key={item.specLabel || i} delay={i * 0.05}>
              <div className="grid grid-cols-1 md:grid-cols-12 py-5 sm:py-6 gap-3 md:gap-8 items-baseline transition-colors hover:bg-surface/30 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-lg">
                {/* Left Column: Spec Label rail */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-foreground-subtle/60">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-xs font-medium text-foreground-muted tracking-wide">
                    {item.specLabel}
                  </span>
                </div>

                {/* Right Column: Spec content */}
                <div className="md:col-span-8 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2.5">
                      {Icon ? (
                        <Icon
                          className="h-[18px] w-[18px] text-accent shrink-0"
                          aria-hidden
                        />
                      ) : null}
                      <h3 className="text-body font-semibold tracking-tight text-foreground">
                        {item.label}
                      </h3>
                    </div>
                    {item.meta ? (
                      <span className="font-mono text-xs text-foreground-subtle">
                        {item.meta}
                      </span>
                    ) : null}
                  </div>

                  {item.description ? (
                    <p className="text-small text-foreground-muted leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
