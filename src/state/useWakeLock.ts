import { useEffect } from "react";

/** Keeps the screen awake while `active` is true. Silently no-ops if unsupported. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    // WakeLock is not in the lib.dom types on older TS; treat as any.
    const navAny = navigator as unknown as {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
    };
    if (!navAny.wakeLock) return;

    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const s = await navAny.wakeLock!.request("screen");
        if (cancelled) {
          s.release?.();
          return;
        }
        sentinel = s;
        s.addEventListener?.("release", () => {
          sentinel = null;
        });
      } catch {
        // permissions denied, backgrounded, etc. — swallow.
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !sentinel) acquire();
    };

    acquire();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      sentinel?.release?.();
    };
  }, [active]);
}

type WakeLockSentinelLike = {
  release?: () => Promise<void> | void;
  addEventListener?: (type: "release", cb: () => void) => void;
};
