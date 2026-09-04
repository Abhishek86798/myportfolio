"use client";

import { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import type { ContributionData, ContributionDay } from "@/lib/data/github";

// Emerald intensity ramp, level 0-4. Level 0 is an empty cell.
const LEVEL_CLASS = [
  "bg-border/60",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

type MonthGroup = {
  key: string;
  label: string;
  year: number;
  weeks: ContributionDay[][];
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function groupWeeksByMonth(weeks: ContributionDay[][]): MonthGroup[] {
  const groups: MonthGroup[] = [];

  for (const week of weeks) {
    if (week.length === 0) continue;
    // Use the middle day (Wednesday, index 3 or closest) to represent the week's month
    const refDay = week[Math.min(3, week.length - 1)];
    const parts = refDay.date.split("-");
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const label = MONTH_NAMES[monthIndex];

    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.key !== key) {
      groups.push({
        key,
        label,
        year,
        weeks: [week],
      });
    } else {
      lastGroup.weeks.push(week);
    }
  }

  return groups;
}

export function Heatmap({
  data,
  updatedAt = "3h ago",
}: {
  data: ContributionData;
  updatedAt?: string;
  activeDays?: number;
  longestStreak?: number;
}) {
  const [calendar, setCalendar] = useState<ContributionData>(data);
  const [timeLabel, setTimeLabel] = useState<string>(updatedAt);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "live">("idle");

  const syncLive = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.contributions) {
          setCalendar(json.contributions);
          setTimeLabel(json.updatedAt || "just now");
          setSyncStatus("live");
        }
      }
    } catch {
      // keep current data on failure
    } finally {
      setIsSyncing(false);
    }
  };

  // Derive metrics strictly from the active calendar array
  const { activeDays, longestStreak, total } = useMemo(() => {
    const days = calendar.weeks.flat();
    const active = days.filter((d) => d.count > 0).length;
    let longest = 0;
    let curr = 0;
    for (const d of days) {
      if (d.count > 0) {
        curr++;
        if (curr > longest) longest = curr;
      } else {
        curr = 0;
      }
    }
    const tot = days.reduce((sum, d) => sum + (d.count || 0), 0);
    return { activeDays: active, longestStreak: longest, total: tot };
  }, [calendar]);

  // Group the weekly columns by month to cleanly separate dots month-by-month
  const monthGroups = useMemo(() => {
    return groupWeeksByMonth(calendar.weeks);
  }, [calendar.weeks]);

  return (
    <div>
      {/* Header: Total contributions · updated relative time + Sync button */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border/50 pb-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-body-lg font-semibold tracking-tight text-foreground">
            {total.toLocaleString()} contributions
          </h3>
          <span className="text-small text-foreground-muted">
            · updated {timeLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-foreground-subtle hidden sm:inline">
            Past 52 weeks
          </span>
          <button
            type="button"
            onClick={syncLive}
            disabled={isSyncing}
            title="Sync live activity from GitHub"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background-subtle/80 px-2.5 py-1 font-mono text-[11px] text-foreground-muted transition-all hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`h-3 w-3 ${
                isSyncing ? "animate-spin text-accent" : "transition-transform group-hover:rotate-180"
              }`}
            />
            <span>{isSyncing ? "Syncing..." : syncStatus === "live" ? "Live" : "Sync"}</span>
          </button>
        </div>
      </div>

      {/* Horizontally scrollable calendar with Month-Separated dots */}
      <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
        <div className="min-w-max flex items-start">
          {/* Day of week labels on left (Mon, Wed, Fri) aligned with 7 dot rows */}
          <div className="w-7 sm:w-8 shrink-0 flex flex-col font-mono text-[10px] text-foreground-subtle select-none">
            {/* Header spacer to match month labels row height */}
            <div className="h-4 mb-1.5" />
            <div className="flex flex-col gap-1 sm:gap-1.5">
              {DAY_LABELS.map((dayLabel, idx) => (
                <span
                  key={idx}
                  className="h-2.5 sm:h-3 flex items-center leading-none text-right justify-end pr-1.5"
                >
                  {dayLabel}
                </span>
              ))}
            </div>
          </div>

          {/* Month Groups with visual separation between months */}
          <div
            className="flex items-start gap-2.5 sm:gap-3.5"
            role="img"
            aria-label={`${total} contributions on GitHub`}
          >
            {monthGroups.map((group) => (
              <div key={group.key} className="flex flex-col shrink-0">
                {/* Month Name Header */}
                <div className="h-4 mb-1.5 flex items-center">
                  <span className="font-mono text-[10px] font-medium text-foreground-subtle select-none">
                    {group.label}
                  </span>
                </div>

                {/* Week Columns of Dots for this Month */}
                <div className="flex gap-1 sm:gap-1.5">
                  {group.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1 sm:gap-1.5">
                      {week.map((day) => {
                        const tooltip =
                          day.count > 0
                            ? `${day.count} contribution${
                                day.count === 1 ? "" : "s"
                              } on ${day.date}`
                            : `No contributions on ${day.date}`;

                        return (
                          <span
                            key={day.date}
                            title={tooltip}
                            className={`h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-[2px] transition-transform hover:scale-125 ${
                              LEVEL_CLASS[day.level]
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
