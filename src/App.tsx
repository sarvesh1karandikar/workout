import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { CompletionScreen } from "./screens/CompletionScreen";
import { WORKOUTS, type WorkoutId } from "./data/workouts";
import { useWorkoutState } from "./state/useWorkoutState";
import { useWakeLock } from "./state/useWakeLock";

type Screen =
  | { kind: "home" }
  | { kind: "detail"; id: WorkoutId }
  | { kind: "complete"; id: WorkoutId; sets: number; elapsedMs: number };

const readScreenFromHash = (): Screen => {
  const h = location.hash.replace(/^#/, "") as WorkoutId | "";
  if (h && h in WORKOUTS) return { kind: "detail", id: h };
  return { kind: "home" };
};

export function App() {
  const { getState, toggleSet, resetWorkout, lastDay, lastId } = useWorkoutState();
  const [screen, setScreen] = useState<Screen>(() => readScreenFromHash());

  // Per-session start timestamp, resets when a detail screen is opened fresh
  const sessionStartRef = useRef<number>(Date.now());

  // Keep screen awake while on detail screen
  useWakeLock(screen.kind === "detail");

  // Theme the root CSS var from the active workout accent
  useEffect(() => {
    const accent =
      screen.kind === "detail" || screen.kind === "complete"
        ? WORKOUTS[screen.id].accent
        : "#10b981";
    document.documentElement.style.setProperty("--accent", accent);
  }, [screen]);

  // Hash sync: so mobile back gesture / browser back works
  useEffect(() => {
    const handler = () => {
      const next = readScreenFromHash();
      setScreen(next);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const openWorkout = useCallback((id: WorkoutId) => {
    sessionStartRef.current = Date.now();
    location.hash = id;
    setScreen({ kind: "detail", id });
  }, []);

  const goHome = useCallback(() => {
    location.hash = "";
    setScreen({ kind: "home" });
  }, []);

  const handleComplete = useCallback(() => {
    if (screen.kind !== "detail") return;
    const w = WORKOUTS[screen.id];
    const totalSets = w.exercises.reduce((a, e) => a + e.sets, 0);
    setScreen({
      kind: "complete",
      id: screen.id,
      sets: totalSets,
      elapsedMs: Date.now() - sessionStartRef.current,
    });
  }, [screen]);

  return (
    <>
      <div className="ambient-glow" />
      <div className="grain" aria-hidden />

      <AnimatePresence mode="wait">
        {screen.kind === "home" && (
          <HomeScreen
            key="home"
            onOpen={openWorkout}
            lastDay={lastDay}
            lastId={lastId}
          />
        )}
        {screen.kind === "detail" && (
          <DetailScreen
            key={`detail-${screen.id}`}
            workout={WORKOUTS[screen.id]}
            state={getState(screen.id)}
            onBack={goHome}
            onToggleSet={toggleSet}
            onReset={() => resetWorkout(screen.id)}
            onComplete={handleComplete}
            sessionStart={sessionStartRef.current}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {screen.kind === "complete" && (
          <CompletionScreen
            key="complete"
            workout={WORKOUTS[screen.id]}
            totalSets={screen.sets}
            elapsedMs={screen.elapsedMs}
            onDone={goHome}
          />
        )}
      </AnimatePresence>
    </>
  );
}
