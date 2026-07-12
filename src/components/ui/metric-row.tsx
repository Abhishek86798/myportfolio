import type { Metric } from "@/data/projects";

/**
 * A compact row of quantified impact stats — the strongest recruiter signals
 * (users, scale, reduction) pulled out of prose into fast-scannable figures.
 * Shared by Projects and Experience so both read as one system.
 */
export function MetricRow({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col">
          <dt className="sr-only">{m.label}</dt>
          <dd className="text-body-lg font-semibold tabular-nums tracking-tight text-accent">
            {m.value}
          </dd>
          <span className="mt-0.5 text-small text-foreground-subtle">
            {m.label}
          </span>
        </div>
      ))}
    </dl>
  );
}
