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

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

type CalendarMonth = {
  key: string;
  label: string;
  year: number;
  columns: (ContributionDay | null)[][];
};

function buildCalendarMonths(weeks: ContributionDay[][]): CalendarMonth[] {
  const allDays = weeks.flat();
  if (allDays.length === 0) return [];

  // Group strictly by calendar month (YYYY-MM)
  const monthKeys: string[] = [];
  for (const d of allDays) {
    const m = d.date.slice(0, 7);
    if (!monthKeys.includes(m)) monthKeys.push(m);
  }

  // If the leading month has <= 2 days (e.g. trailing Aug 31 from previous year),
  // omit it so the calendar starts clean on the 1st of the full month
  const validMonthKeys = monthKeys.filter((mKey, idx) => {
    const count = allDays.filter((d) => d.date.startsWith(mKey)).length;
    if (idx === 0 && count <= 2) return false;
    return true;
  });

  return validMonthKeys.map((mKey) => {
    const [yearStr, monthStr] = mKey.split("-");
    const year = parseInt(yearStr, 10);
    const monthIdx = parseInt(monthStr, 10) - 1;

    const monthDays = allDays.filter((d) => d.date.startsWith(mKey));

    const columns: (ContributionDay | null)[][] = [];
    let currentCol: (ContributionDay | null)[] = new Array(7).fill(null);

    for (const day of monthDays) {
      const parts = day.date.split("-");
      const dateObj = new Date(
        Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      );
      const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

      currentCol[dayOfWeek] = day;

      if (dayOfWeek === 6) {
        columns.push(currentCol);
        currentCol = new Array(7).fill(null);
      }
    }

    if (currentCol.some((d) => d !== null)) {
      columns.push(currentCol);
    }

    return {
      key: mKey,
      label: MONTH_NAMES[monthIdx],
      year,
      columns,
    };
  });
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

  // Build true calendar months with exact day counts and centered headers
  const calendarMonths = useMemo(() => {
    return buildCalendarMonths(calendar.weeks);
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

      {/* Horizontally scrollable calendar with true calendar months */}
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

          {/* Month Groups with exact calendar days and centered month headers */}
          <div
            className="flex items-start gap-2 sm:gap-3"
            role="img"
            aria-label={`${total} contributions on GitHub`}
          >
            {calendarMonths.map((month) => (
              <div key={month.key} className="flex flex-col shrink-0">
                {/* Month Name Header - PROPERLY CENTERED */}
                <div className="h-4 mb-1.5 flex items-center justify-center text-center">
                  <span className="font-mono text-[10px] font-medium text-foreground-subtle select-none">
                    {month.label}
                  </span>
                </div>

                {/* Week Columns of Dots for this Month */}
                <div className="flex gap-1 sm:gap-1.5">
                  {month.columns.map((col, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-1 sm:gap-1.5">
                      {col.map((day, rowIdx) => {
                        if (!day) {
                          return (
                            <span
                              key={`empty-${rowIdx}`}
                              className="h-2.5 sm:h-3 w-2.5 sm:w-3 invisible pointer-events-none"
                              aria-hidden="true"
                            />
                          );
                        }

                        const breakdownParts: string[] = [];
                        if (day.githubCount) {
                          breakdownParts.push(
                            `${day.githubCount} commit${day.githubCount > 1 ? "s" : ""}`
                          );
                        }
                        if (day.codolioCount) {
                          breakdownParts.push(
                            `${day.codolioCount} DSA solve${day.codolioCount > 1 ? "s" : ""}`
                          );
                        }
                        const detail =
                          breakdownParts.length > 0
                            ? ` (${breakdownParts.join(" · ")})`
                            : "";
                        const tooltip =
                          day.count > 0
                            ? `${day.count} activit${
                                day.count === 1 ? "y" : "ies"
                              } on ${day.date}${detail}`
                            : `No activity on ${day.date}`;

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
