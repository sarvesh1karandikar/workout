import { useCallback, useSyncExternalStore } from "react";

/**
 * Per-exercise user overrides for weight, reps, and sets.
 * Keyed by exercise name (durable across reorderings of workouts.ts).
 * Values are strings to support "10 each leg", "30 sec", etc.
 */
export type ExerciseOverride = {
  weight?: string; // e.g. "35" — user enters just the number, unit from settings
  reps?: string; // override default reps
  sets?: number; // override default sets
};

const STORAGE_KEY = "workout:overrides";

let listeners: (() => void)[] = [];
const subscribe = (cb: () => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
const emit = () => listeners.forEach((l) => l());

type OverrideMap = Record<string, ExerciseOverride>;

const read = (): OverrideMap => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as OverrideMap;
  } catch {
    return {};
  }
};

const write = (map: OverrideMap) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  emit();
};

export function useExerciseOverrides() {
  const overrides = useSyncExternalStore(subscribe, read, () => ({}) as OverrideMap);

  const getOverride = useCallback(
    (exerciseName: string): ExerciseOverride => overrides[exerciseName] ?? {},
    [overrides]
  );

  const setOverride = useCallback(
    (exerciseName: string, patch: Partial<ExerciseOverride>) => {
      const map = read();
      const existing = map[exerciseName] ?? {};
      const next = { ...existing, ...patch };
      // Remove empty/undefined keys
      for (const k of Object.keys(next) as (keyof ExerciseOverride)[]) {
        if (next[k] === undefined || next[k] === "" || next[k] === null) {
          delete next[k];
        }
      }
      if (Object.keys(next).length === 0) {
        delete map[exerciseName];
      } else {
        map[exerciseName] = next;
      }
      write(map);
    },
    []
  );

  return { overrides, getOverride, setOverride };
}
