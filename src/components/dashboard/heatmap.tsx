"use client";

import { useState, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import type { ContributionData } from "@/lib/data/github";

// Emerald intensity ramp, level 0-4. Level 0 is an empty cell.
const LEVEL_CLASS = [
  "bg-border/60",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

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
      // keep fallback
    } finally {
      setIsSyncing(false);
    }
  };

  // Derive all metrics strictly from the active calendar array
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

  // Compute month positions along the 52-week horizontal columns
  const monthMap = useMemo(() => {
    const map = new Map<number, string>();
    let lastMonth = -1;
    calendar.weeks.forEach((week, wi) => {
      const firstDay = week[0];
      if (firstDay && firstDay.date) {
        try {
          const parts = firstDay.date.split("-");
          const m = parseInt(parts[1], 10) - 1;
          if (m !== lastMonth) {
            // Pick short month name: Jan, Feb, Mar...
            const d = new Date(Date.UTC(parseInt(parts[0], 10), m, parseInt(parts[2], 10)));
            const label = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
            map.set(wi, label);
            lastMonth = m;
          }
        } catch {
          // ignore date parse issues
        }
      }
    });
    return map;
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
          <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium text-accent border border-accent/20">
            GitHub ∪ Codolio
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
            title="Sync live activity from GitHub & Codolio"
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

      {/* Horizontally scrollable 52-week calendar with Month & Day axes */}
      <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
        <div className="min-w-[720px] w-full flex flex-col">
          {/* Month Axis Header Row */}
          <div className="flex items-center mb-1.5 pl-7 sm:pl-8">
            <div className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-1.5 w-full font-mono text-[10px] text-foreground-subtle select-none">
              {calendar.weeks.map((_, wi) => {
                const month = monthMap.get(wi);
                return (
                  <div key={wi} className="relative h-3.5">
                    {month ? (
                      <span className="absolute left-0 top-0 whitespace-nowrap">
                        {month}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid Area: Day Axis (Left) + 52 Week Columns (Right) */}
          <div className="flex items-center">
            {/* Day of week labels on left (Mon, Wed, Fri) */}
            <div className="w-7 sm:w-8 shrink-0 flex flex-col gap-1 sm:gap-1.5 pr-1.5 font-mono text-[10px] text-foreground-subtle select-none">
              {DAY_LABELS.map((dayLabel, idx) => (
                <span
                  key={idx}
                  className="h-2.5 sm:h-3 flex items-center leading-none text-right justify-end"
                >
                  {dayLabel}
                </span>
              ))}
            </div>

            {/* 52 Week Columns stretching full width */}
            <div
              className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-1.5 w-full"
              role="img"
              aria-label={`${total} contributions across GitHub and Codolio`}
            >
              {calendar.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1 sm:gap-1.5">
                  {week.map((day) => {
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
                        className={`h-2.5 sm:h-3 w-full rounded-[2px] transition-transform hover:scale-125 ${
                          LEVEL_CLASS[day.level]
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
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
