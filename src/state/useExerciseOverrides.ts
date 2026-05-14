import { useCallback, useSyncExternalStore } from "react";

export type ExerciseOverride = {
  weight?: string;
  reps?: string;
  sets?: number;
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

function readFromStorage(): OverrideMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as OverrideMap;
  } catch {
    return {};
  }
}

// Cached snapshot — only updated on write()
let cached: OverrideMap = readFromStorage();

function getSnapshot(): OverrideMap {
  return cached;
}

function writeToStorage(map: OverrideMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  cached = map;
  emit();
}

export function useExerciseOverrides() {
  const overrides = useSyncExternalStore(subscribe, getSnapshot, () => cached);

  const getOverride = useCallback(
    (exerciseName: string): ExerciseOverride => overrides[exerciseName] ?? {},
    [overrides]
  );

  const setOverride = useCallback(
    (exerciseName: string, patch: Partial<ExerciseOverride>) => {
      const map = { ...cached };
      const existing = map[exerciseName] ?? {};
      const next: ExerciseOverride = { ...existing, ...patch };
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
      writeToStorage(map);
    },
    []
  );

  return { overrides, getOverride, setOverride };
}
