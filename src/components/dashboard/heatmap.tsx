import type { ContributionData } from "@/lib/data/github";

// Emerald intensity ramp, level 0-4. Level 0 is an empty cell.
const LEVEL_CLASS = [
  "bg-border/60",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

export function Heatmap({
  data,
  updatedAt = "3h ago",
}: {
  data: ContributionData;
  updatedAt?: string;
  activeDays?: number;
  longestStreak?: number;
}) {
  // Derive all three quantities strictly from the single calendar array
  const days = data.weeks.flat();
  const activeDays = days.filter((d) => d.count > 0).length;

  let longestStreak = 0;
  let curr = 0;
  for (const d of days) {
    if (d.count > 0) {
      curr++;
      if (curr > longestStreak) longestStreak = curr;
    } else {
      curr = 0;
    }
  }
  return (
    <div>
      {/* Header: Total contributions · updated relative time */}
      <div className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-body-lg font-semibold tracking-tight text-foreground">
            {data.total.toLocaleString()} contributions
          </h3>
          <span className="text-small text-foreground-muted">
            · updated {updatedAt}
          </span>
        </div>
        <span className="font-mono text-xs text-foreground-subtle hidden sm:inline">
          Past 52 weeks
        </span>
      </div>

      {/* Horizontally scrollable 52-week calendar */}
      <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
        <div
          className="flex gap-1"
          role="img"
          aria-label={`${data.total} GitHub contributions in the past year`}
        >
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  className={`h-2.5 w-2.5 rounded-[2px] transition-transform hover:scale-125 ${LEVEL_CLASS[day.level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer: active days · longest streak (left) | Less -> More ramp (right) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
        <div className="font-mono text-small text-foreground-muted">
          <span className="font-semibold text-foreground">{activeDays}</span> active days{" "}
          <span className="text-foreground-subtle">·</span> longest streak{" "}
          <span className="font-semibold text-foreground">{longestStreak}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
          <span>Less</span>
          {LEVEL_CLASS.map((cls, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
