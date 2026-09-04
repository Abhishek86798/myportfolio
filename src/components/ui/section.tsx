import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Systemized section rhythm — every major section uses the same vertical
 * spacing and max-width container so the page reads as deliberate, not improvised.
 * (PLAN.md §1: generous, consistent spacing.)
 */
export function Section({
  id,
  variant = "base",
  hasBorder = true,
  className,
  children,
}: {
  id?: string;
  variant?: "base" | "raised";
  hasBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 md:scroll-mt-28 px-6 py-16 md:px-12 md:py-[88px]",
        variant === "raised" ? "bg-background-subtle" : "bg-background",
        hasBorder && "border-t border-black/[0.06] dark:border-white/[0.06]",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Oversized, type-led section heading with unified `//` syntax and anchor-on-hover link.
 */
export function SectionHeading({
  id,
  eyebrow,
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={cn("mb-8 sm:mb-10", className)}>
      {eyebrow ? (
        <p className="mb-2 font-mono text-xs text-foreground-subtle">
          {eyebrow.replace(/^\/\/\s*/, "")}
        </p>
      ) : null}
      <h2 className="group/heading relative text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl flex items-baseline gap-3">
        {id ? (
          <a
            href={`#${id}`}
            aria-label={`Link to ${id}`}
            className="font-mono text-xs sm:text-sm font-normal text-foreground-subtle opacity-0 transition-opacity hover:text-accent group-hover/heading:opacity-100 select-none"
          >
            #{id}
          </a>
        ) : null}
        <span>{children}</span>
      </h2>
    </Reveal>
  );
}
