import { useCallback, useMemo, useSyncExternalStore } from "react";

export type WeightUnit = "lb" | "kg";

export type Settings = {
  restTimerSec: number;
  weightUnit: WeightUnit;
  soundEnabled: boolean;
};

const STORAGE_KEY = "workout:settings";

const DEFAULTS: Settings = {
  restTimerSec: 60,
  weightUnit: "lb",
  soundEnabled: false,
};

let listeners: (() => void)[] = [];
const subscribe = (cb: () => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
const emit = () => listeners.forEach((l) => l());

// Cached snapshot — only recomputed on emit()
let cachedSettings: Settings = readFromStorage();

function readFromStorage(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function getSnapshot(): Settings {
  return cachedSettings;
}

const write = (next: Settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cachedSettings = next;
  emit();
};

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULTS);

  const update = useCallback((partial: Partial<Settings>) => {
    write({ ...cachedSettings, ...partial });
  }, []);

  return useMemo(() => ({ settings, update }), [settings, update]);
}
