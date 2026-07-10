import { cn } from "@/lib/utils";

/**
 * Systemized section rhythm — every major section uses the same vertical
 * spacing and max-width container so the page reads as deliberate, not improvised.
 * (PLAN.md §1: generous, consistent spacing.)
 */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 px-6 py-24 md:px-12 md:py-32", className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Oversized, type-led section heading (PLAN.md §1: "Every section opens with
 * an oversized heading"). Optional eyebrow label above it, emerald.
 */
export function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12 md:mb-16">
      {eyebrow ? (
        <p className="mb-3 flex items-center gap-2 text-small font-medium uppercase tracking-widest text-foreground-muted">
          <span className="h-px w-6 bg-accent" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {children}
      </h2>
    </div>
  );
}
