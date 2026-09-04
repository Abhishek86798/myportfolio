import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Sparkles } from "lucide-react";

export function About({ data }: { data?: any }) {
  const headline =
    data?.headline ||
    "I build backend systems and security boundaries designed not to fail when the happy path breaks.";

  const narrative =
    data?.narrative && data.narrative.length > 0
      ? data.narrative
      : [
          "I'm a pre-final year Dual Degree student (B.Tech in IT + MBA) at IIITM Gwalior. While many engineers start from the UI down, I work from the systems layer up: deterministic authorization proxies, high-throughput microservices, and Linux execution sandboxes.",
          "Lately, my core focus is AI systems security. Connecting LLM agents directly to production databases and terminal tools without rigid boundaries is an operational accident waiting to happen. I build least-privilege execution environments using Linux seccomp filters, system call tracing, and Zero-Trust validation so agentic workflows can run in production without becoming security liabilities.",
          "Studying business strategy alongside computer systems changed how I evaluate architecture. I don't believe in engineering in an academic vacuum. Every architectural choice—whether it's picking DigiLocker over raw Aadhaar for DPDP compliance, or eliminating redundant database round-trips—is fundamentally an honest trade-off between user friction, operational latency, and business trust.",
        ];

  const principles =
    data?.principles && data.principles.length > 0
      ? data.principles
      : [
          {
            title: "Sandboxing & Zero-Trust",
            tag: "AI Security Tooling",
            description:
              "Treat all external inputs and LLM agent tool calls as inherently untrusted. Enforce least-privilege boundaries using Linux seccomp and deterministic authorization gateways.",
          },
          {
            title: "Pragmatic Architecture",
            tag: "Backend Infrastructure",
            description:
              "Choose battle-tested databases and boring tech before reaching for distributed complexity. Measure p99 latency, design clean indexes, and eliminate N+1 round-trips.",
          },
          {
            title: "Trade-off Honesty",
            tag: "Systems Philosophy",
            description:
              "Every engineering decision has a real cost. Whether it's data minimization in privacy compliance or caching consistency, articulate the trade-offs clearly rather than pretending both sides come out equally happy.",
          },
        ];

  const currentFocus =
    data?.currentFocus ||
    "Open for Software Engineering & Systems Internships (Summer & Fall 2025/2026). Actively contributing to CNCF/Meshery and building open security tooling.";

  return (
    <Section id="about" variant="raised">
      <SectionHeading id="about" eyebrow="Philosophy & Focus">
        About
      </SectionHeading>

      <div className="max-w-4xl mx-auto">
        {/* Bold Headline */}
        <Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-snug">
            {headline}
          </h2>
        </Reveal>

        {/* Two-Column Editorial Layout */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: First-Person Narrative Story */}
          <div className="lg:col-span-7 flex flex-col gap-5 text-body-lg text-foreground-muted leading-relaxed">
            {narrative.map((p: string, idx: number) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}

            {/* Current Focus Banner */}
            {currentFocus ? (
              <Reveal delay={0.2}>
                <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Current Focus & Availability</span>
                  </div>
                  <p className="mt-2 text-small text-foreground leading-relaxed">
                    {currentFocus}
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Right Column: 3 Architectural Pillars / Principles */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1">
              Pillars I Build By
            </span>

            {principles.map((pillar: any, idx: number) => (
              <Reveal key={pillar.title || idx} delay={0.1 + idx * 0.05}>
                <div className="rounded-xl border border-border/80 bg-surface/50 p-4 sm:p-5 transition-colors hover:border-accent/40">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-body font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                    {pillar.tag ? (
                      <span className="font-mono text-[10px] text-accent rounded bg-accent/10 px-2 py-0.5 border border-accent/20">
                        {pillar.tag}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-small text-foreground-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
