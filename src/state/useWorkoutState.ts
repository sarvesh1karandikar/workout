import { useCallback, useEffect, useMemo, useState } from "react";
import { WORKOUTS, WORKOUT_ORDER, type WorkoutId } from "../data/workouts";

const PREFIX = "workout:";

type TodayState = Partial<Record<WorkoutId, boolean[][]>>;

const todayKey = () => {
  const d = new Date();
  return `${PREFIX}${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const emptyStateFor = (id: WorkoutId): boolean[][] =>
  WORKOUTS[id].exercises.map((ex) => Array(ex.sets).fill(false));

const pruneAndFindLast = (): { lastDay: string | null; lastId: WorkoutId | null } => {
  const today = todayKey();
  let lastDay: string | null = null;
  let lastId: WorkoutId | null = null;
  let lastTime = 0;

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(PREFIX) || k === today) continue;
    try {
      const v = JSON.parse(localStorage.getItem(k) ?? "{}") as TodayState;
      for (const id of WORKOUT_ORDER) {
        const rows = v[id];
        if (rows && rows.some((arr) => arr.some(Boolean))) {
          const t = new Date(k.slice(PREFIX.length) + "T00:00:00").getTime();
          if (t > lastTime) {
            lastTime = t;
            lastDay = k.slice(PREFIX.length);
            lastId = id;
          }
        }
      }
    } catch {
      // bad entry, skip it
    }
  }

  return { lastDay, lastId };
};

export function useWorkoutState() {
  const [today, setToday] = useState<TodayState>(() => {
    try {
      return JSON.parse(localStorage.getItem(todayKey()) ?? "{}") as TodayState;
    } catch {
      return {};
    }
  });

  const [{ lastDay, lastId }, setLast] = useState(() => pruneAndFindLast());

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(todayKey(), JSON.stringify(today));
  }, [today]);

  const getState = useCallback(
    (id: WorkoutId): boolean[][] => {
      const existing = today[id];
      const expected = WORKOUTS[id].exercises;
      const mismatched =
        !existing ||
        existing.length !== expected.length ||
        existing.some((arr, i) => arr.length !== expected[i].sets);
      if (mismatched) return emptyStateFor(id);
      return existing!;
    },
    [today]
  );

  const toggleSet = useCallback(
    (id: WorkoutId, exerciseIdx: number, setIdx: number) => {
      setToday((prev) => {
        const current = prev[id] ?? emptyStateFor(id);
        const next = current.map((row, i) =>
          i === exerciseIdx ? row.map((val, j) => (j === setIdx ? !val : val)) : row
        );
        return { ...prev, [id]: next };
      });
      // When user interacts today, yesterday's "last" indicator stays (today is "current")
      setLast((prev) => ({ ...prev }));
    },
    []
  );

  const resetWorkout = useCallback((id: WorkoutId) => {
    setToday((prev) => ({ ...prev, [id]: emptyStateFor(id) }));
  }, []);

  const progress = useCallback(
    (id: WorkoutId) => {
      const state = getState(id);
      const total = state.reduce((a, b) => a + b.length, 0);
      const done = state.reduce((a, b) => a + b.filter(Boolean).length, 0);
      return { total, done, pct: total === 0 ? 0 : done / total };
    },
    [getState]
  );

  const result = useMemo(
    () => ({ getState, toggleSet, resetWorkout, progress, lastDay, lastId }),
    [getState, toggleSet, resetWorkout, progress, lastDay, lastId]
  );

  return result;
}

export const humanAgo = (dayStr: string) => {
  const days = Math.floor(
    (Date.now() - new Date(dayStr + "T00:00:00").getTime()) / 86400000
  );
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1wk ago" : `${weeks}wk ago`;
};
