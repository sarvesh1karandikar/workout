import { useCallback, useMemo, useSyncExternalStore } from "react";

export type WeightUnit = "lb" | "kg";

export type Settings = {
  restTimerSec: number; // seconds between sets (0 = disabled)
  weightUnit: WeightUnit;
  soundEnabled: boolean;
};

const STORAGE_KEY = "workout:settings";

const DEFAULTS: Settings = {
  restTimerSec: 60,
  weightUnit: "lb",
  soundEnabled: false,
};

// Simple pub/sub so all consumers re-render on change
let listeners: (() => void)[] = [];
const subscribe = (cb: () => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
const emit = () => listeners.forEach((l) => l());

const read = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
};

const write = (next: Settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
};

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, read, () => DEFAULTS);

  const update = useCallback((partial: Partial<Settings>) => {
    write({ ...read(), ...partial });
  }, []);

  return useMemo(() => ({ settings, update }), [settings, update]);
}
