import { useEffect, useMemo, useState } from "react";

const PREFIX = "workout:";
const SKIP_KEYS = new Set(["workout:settings", "workout:notes", "workout:overrides"]);

type DaySummary = {
  date: string;
  setsCompleted: number;
};

export type HeatmapDay = {
  date: string;
  sets: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function readHistory(): DaySummary[] {
  const result: DaySummary[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(PREFIX) || SKIP_KEYS.has(k)) continue;
    const date = k.slice(PREFIX.length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    try {
      const v = JSON.parse(localStorage.getItem(k) ?? "{}") as Record<string, boolean[][]>;
      let sets = 0;
      for (const rows of Object.values(v)) {
        for (const row of rows) {
          sets += row.filter(Boolean).length;
        }
      }
      if (sets > 0) result.push({ date, setsCompleted: sets });
    } catch {
      // ignore
    }
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function intensityLevel(sets: number): 0 | 1 | 2 | 3 | 4 {
  if (sets === 0) return 0;
  if (sets <= 6) return 1;
  if (sets <= 12) return 2;
  if (sets <= 18) return 3;
  return 4;
}

function buildHeatmap(history: DaySummary[]): HeatmapDay[] {
  const map = new Map(history.map((d) => [d.date, d.setsCompleted]));
  const days: HeatmapDay[] = [];
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = fmtDate(d);
    const sets = map.get(date) ?? 0;
    days.push({ date, sets, level: intensityLevel(sets) });
  }
  return days;
}

function computeStreak(activeDates: Set<string>): number {
  let streak = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);
  const todayStr = fmtDate(check);
  if (!activeDates.has(todayStr)) {
    check.setDate(check.getDate() - 1);
    if (!activeDates.has(fmtDate(check))) return 0;
  }
  while (activeDates.has(fmtDate(check))) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

/**
 * Reads workout history from localStorage once on mount.
 * Call `refresh()` after completing sets to update the heatmap.
 */
export function useHistory() {
  const [history, setHistory] = useState<DaySummary[]>(() => readHistory());

  // Refresh on window focus (covers coming back from detail -> home)
  useEffect(() => {
    const handler = () => setHistory(readHistory());
    window.addEventListener("focus", handler);
    // Also refresh on storage event (other tabs) and on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") handler();
    });
    return () => {
      window.removeEventListener("focus", handler);
    };
  }, []);

  const { streak, heatmap } = useMemo(() => {
    const activeDates = new Set(history.map((d) => d.date));
    return {
      streak: computeStreak(activeDates),
      heatmap: buildHeatmap(history),
    };
  }, [history]);

  const refresh = () => setHistory(readHistory());

  return { history, streak, heatmap, refresh };
}

// Keep the export for any consumers but make it a no-op now
export const emitHistoryChange = () => {};
