import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { CompletionScreen } from "./screens/CompletionScreen";
import { RecipesScreen } from "./screens/RecipesScreen";
import { NowTrainingBar } from "./components/NowTrainingBar";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { WORKOUTS, WORKOUT_ORDER, type WorkoutId } from "./data/workouts";
import { useWorkoutState } from "./state/useWorkoutState";
import { useWakeLock } from "./state/useWakeLock";

type Screen =
  | { kind: "home" }
  | { kind: "detail"; id: WorkoutId }
  | { kind: "complete"; id: WorkoutId; sets: number; elapsedMs: number }
  | { kind: "recipes" };

const readScreenFromHash = (): Screen => {
  const h = location.hash.replace(/^#/, "");
  if (h === "recipes") return { kind: "recipes" };
  if (h && h in WORKOUTS) return { kind: "detail", id: h as WorkoutId };
  return { kind: "home" };
};

export function App() {
  const { getState, toggleSet, resetWorkout, progress, lastDay, lastId } =
    useWorkoutState();
  const [screen, setScreen] = useState<Screen>(() => readScreenFromHash());
  const [settingsOpen, setSettingsOpen] = useState(false);

  const sessionStartRef = useRef<number>(Date.now());

  useWakeLock(screen.kind === "detail");

  // Theme the root CSS var from the active workout accent
  useEffect(() => {
    const accent =
      screen.kind === "detail" || screen.kind === "complete"
        ? WORKOUTS[screen.id].accent
        : "#10b981";
    document.documentElement.style.setProperty("--accent", accent);
  }, [screen]);

  // Hash sync
  useEffect(() => {
    const handler = () => setScreen(readScreenFromHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const openWorkout = useCallback((id: WorkoutId, freshSession = true) => {
    if (freshSession) sessionStartRef.current = Date.now();
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

  const handleSwipeNavigate = useCallback(
    (direction: 1 | -1) => {
      if (screen.kind !== "detail") return;
      const idx = WORKOUT_ORDER.indexOf(screen.id);
      const nextIdx = (idx + direction + WORKOUT_ORDER.length) % WORKOUT_ORDER.length;
      const nextId = WORKOUT_ORDER[nextIdx]!;
      // Don't reset session timer when swiping — keep the elapsed clock running
      openWorkout(nextId, false);
    },
    [screen, openWorkout]
  );

  // Find an in-progress workout (started today but not finished). Used for mini-bar.
  const inProgress = useMemo(() => {
    for (const id of WORKOUT_ORDER) {
      const p = progress(id);
      if (p.done > 0 && p.done < p.total) return { id, ...p };
    }
    return null;
  }, [progress]);

  return (
    <>
      <div className="ambient-glow" />
      <div className="grain" aria-hidden />

      <AnimatePresence mode="wait">
        {screen.kind === "home" && (
          <HomeScreen
            key="home"
            onOpen={(id) => openWorkout(id)}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenRecipes={() => {
              location.hash = "recipes";
              setScreen({ kind: "recipes" });
            }}
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
            onSwipeNavigate={handleSwipeNavigate}
            sessionStart={sessionStartRef.current}
          />
        )}
        {screen.kind === "recipes" && (
          <RecipesScreen key="recipes" onBack={goHome} />
        )}
      </AnimatePresence>

      {/* Now-training bar — only on home, only if a workout is mid-flight */}
      <AnimatePresence>
        {screen.kind === "home" && inProgress && (
          <NowTrainingBar
            key="now-bar"
            workout={WORKOUTS[inProgress.id]}
            done={inProgress.done}
            total={inProgress.total}
            onResume={() => openWorkout(inProgress.id, false)}
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

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
