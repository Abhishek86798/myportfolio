import type { ContributionData } from "@/lib/data/github";

// Emerald intensity ramp, level 0-4. Level 0 is an empty cell.
const LEVEL_CLASS = [
  "bg-border/60",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

export function Heatmap({ data }: { data: ContributionData }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-body-lg font-semibold text-foreground">
          {data.total.toLocaleString()} contributions
        </h3>
        <span className="text-small text-foreground-subtle">past year</span>
      </div>

      {/* Horizontally scrollable so the full year never breaks the layout on mobile */}
      <div className="mt-4 overflow-x-auto pb-2">
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
                  title={`${day.count} on ${day.date}`}
                  className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_CLASS[day.level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-small text-foreground-subtle">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
