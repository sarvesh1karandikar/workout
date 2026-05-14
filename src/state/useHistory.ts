import { useMemo, useSyncExternalStore } from "react";

const PREFIX = "workout:";
const SETTINGS_KEY = "workout:settings";
const NOTES_KEY = "workout:notes";
const OVERRIDES_KEY = "workout:overrides";
const SKIP_KEYS = new Set([SETTINGS_KEY, NOTES_KEY, OVERRIDES_KEY]);

type DaySummary = {
  date: string; // YYYY-MM-DD
  setsCompleted: number;
};

let listeners: (() => void)[] = [];
const subscribe = (cb: () => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
export const emitHistoryChange = () => listeners.forEach((l) => l());

const readHistory = (): DaySummary[] => {
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
      // ignore corrupt entries
    }
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
};

export function useHistory() {
  const history = useSyncExternalStore(subscribe, readHistory, () => []);

  const { streak, heatmap } = useMemo(() => {
    // Build a set of dates that had at least one set
    const activeDates = new Set(history.map((d) => d.date));

    // Current streak: count consecutive days ending today (or yesterday)
    let streak = 0;
    const now = new Date();
    const check = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Check today first — if active, include it
    const todayStr = fmtDate(check);
    if (!activeDates.has(todayStr)) {
      // Maybe yesterday was last day
      check.setDate(check.getDate() - 1);
      if (!activeDates.has(fmtDate(check))) {
        // No streak
        return { streak: 0, heatmap: buildHeatmap(history) };
      }
    }
    // Count backwards
    while (activeDates.has(fmtDate(check))) {
      streak++;
      check.setDate(check.getDate() - 1);
    }

    return { streak, heatmap: buildHeatmap(history) };
  }, [history]);

  return { history, streak, heatmap };
}

type HeatmapDay = {
  date: string;
  sets: number; // 0 = no data
  level: 0 | 1 | 2 | 3 | 4;
};

function buildHeatmap(history: DaySummary[]): HeatmapDay[] {
  const map = new Map(history.map((d) => [d.date, d.setsCompleted]));
  const days: HeatmapDay[] = [];
  const now = new Date();
  // Go back 12 weeks (84 days)
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = fmtDate(d);
    const sets = map.get(date) ?? 0;
    days.push({ date, sets, level: intensityLevel(sets) });
  }
  return days;
}

function intensityLevel(sets: number): 0 | 1 | 2 | 3 | 4 {
  if (sets === 0) return 0;
  if (sets <= 6) return 1;
  if (sets <= 12) return 2;
  if (sets <= 18) return 3;
  return 4;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
