import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MUSCLE_LABELS, type Workout, type WorkoutId } from "../data/workouts";
import { ProgressRing } from "../components/ProgressRing";
import { SetCircle } from "../components/SetCircle";
import { ExerciseSheet } from "../components/ExerciseSheet";

type Props = {
  workout: Workout;
  state: boolean[][];
  onBack: () => void;
  onToggleSet: (workoutId: WorkoutId, exerciseIdx: number, setIdx: number) => void;
  onReset: () => void;
  onComplete: () => void;
  onSwipeNavigate: (direction: 1 | -1) => void;
  sessionStart: number;
};

const SWIPE_COMMIT_DX = 80; // px the user has to drag horizontally
const SWIPE_COMMIT_VX = 500; // px/s velocity threshold

export function DetailScreen({
  workout,
  state,
  onBack,
  onToggleSet,
  onReset,
  onComplete,
  onSwipeNavigate,
  sessionStart,
}: Props) {
  const accent = workout.accent;
  const total = state.reduce((a, b) => a + b.length, 0);
  const done = state.reduce((a, b) => a + b.filter(Boolean).length, 0);
  const complete = total > 0 && done === total;

  const [elapsed, setElapsed] = useState(Date.now() - sessionStart);
  useEffect(() => {
    const t = setInterval(() => setElapsed(Date.now() - sessionStart), 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const [wasComplete, setWasComplete] = useState(complete);
  useEffect(() => {
    if (complete && !wasComplete) onComplete();
    setWasComplete(complete);
  }, [complete, wasComplete, onComplete]);

  // Sheet state — kept here so the workout context flows naturally
  const [sheetIdx, setSheetIdx] = useState<number | null>(null);
  const sheetExercise =
    sheetIdx !== null ? workout.exercises[sheetIdx] ?? null : null;

  // Pointer-down origin to ignore taps masquerading as drags
  const dragStartedRef = useRef(false);

  const fmtElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    dragStartedRef.current = false;
    const { offset, velocity } = info;
    // Ignore mostly-vertical gestures so list scrolling stays unaffected
    if (Math.abs(offset.x) < Math.abs(offset.y) * 1.2) return;
    if (offset.x < -SWIPE_COMMIT_DX || velocity.x < -SWIPE_COMMIT_VX) {
      onSwipeNavigate(1);
    } else if (offset.x > SWIPE_COMMIT_DX || velocity.x > SWIPE_COMMIT_VX) {
      onSwipeNavigate(-1);
    }
  };

  return (
    <>
      <motion.section
        key={workout.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        drag="x"
        dragDirectionLock
        dragSnapToOrigin
        dragElastic={0.18}
        onDragStart={() => {
          dragStartedRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        className="relative z-10 max-w-[640px] mx-auto px-4 pt-3 pb-32"
        style={{ touchAction: "pan-y" }}
      >
        <header className="sticky top-0 z-20 -mx-4 px-4 py-2 bg-frost flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Back"
            className="grid place-items-center w-11 h-11 rounded-xl border border-border bg-panel text-white text-2xl active:bg-panel-hi transition-colors"
          >
            ‹
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-display text-2xl tracking-wider uppercase leading-none">
              {workout.title}
            </div>
            <div className="mt-1 text-[10px] tabular-nums uppercase tracking-[0.18em] text-muted font-semibold">
              {fmtElapsed(elapsed)} · {done} / {total} sets
            </div>
          </div>
          <ProgressRing done={done} total={total} />
        </header>

        {/* Hero */}
        <motion.div
          layoutId={`tile-${workout.id}`}
          className="relative mt-5 rounded-2xl overflow-hidden border"
          style={{
            borderColor: `color-mix(in oklab, ${accent} 30%, #222)`,
            background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 20%, #141414) 0%, #141414 70%)`,
          }}
          animate={
            complete
              ? {
                  boxShadow: [
                    "0 0 0 0 transparent",
                    `0 0 42px 8px color-mix(in oklab, ${accent} 50%, transparent)`,
                    "0 0 0 0 transparent",
                  ],
                }
              : { boxShadow: "0 0 0 0 transparent" }
          }
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <span
            aria-hidden
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full animate-slow-float pointer-events-none"
            style={{
              background: `radial-gradient(circle, color-mix(in oklab, ${accent} 50%, transparent) 0%, transparent 70%)`,
            }}
          />
          <span
            aria-hidden
            className="absolute right-4 bottom-[-2rem] font-display leading-none pointer-events-none select-none tabular-nums"
            style={{
              fontSize: "12rem",
              color: `color-mix(in oklab, ${accent} 14%, transparent)`,
            }}
          >
            {workout.exercises.length}
          </span>
          <div className="relative px-6 py-7">
            <div
              className="text-[10px] uppercase tracking-[0.28em] font-bold"
              style={{ color: accent }}
            >
              Today's focus
            </div>
            <div className="mt-2 font-display text-[2.8rem] tracking-wider uppercase leading-[0.9]">
              {workout.title}
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {workout.muscles.map((m) => (
                <span
                  key={m}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                  style={{
                    background: `color-mix(in oklab, ${accent} 15%, transparent)`,
                    color: `color-mix(in oklab, ${accent} 75%, white)`,
                    border: `1px solid color-mix(in oklab, ${accent} 30%, transparent)`,
                  }}
                >
                  {MUSCLE_LABELS[m]}
                </span>
              ))}
            </div>
            <div
              className="mt-5 text-[10px] uppercase tracking-[0.22em] text-muted font-semibold flex items-center gap-2"
              aria-hidden
            >
              <SwipeHint accent={accent} />
              Swipe for next workout
            </div>
          </div>
        </motion.div>

        {/* Exercise list */}
        <motion.div
          className="mt-7"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
          }}
        >
          {workout.exercises.map((ex, exIdx) => {
            const exState = state[exIdx] ?? [];
            const exDone = exState.filter(Boolean).length === ex.sets;
            return (
              <motion.div
                key={exIdx}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className={
                  "grid grid-cols-[56px_1fr] items-start gap-x-4 gap-y-3 py-4 " +
                  (exIdx === 0 ? "" : "border-t border-border")
                }
              >
                <div
                  className="font-display tabular-nums leading-none select-none"
                  style={{
                    fontSize: "3.2rem",
                    color: exDone
                      ? accent
                      : `color-mix(in oklab, ${accent} 32%, transparent)`,
                    transition: "color 300ms ease",
                    textShadow: exDone
                      ? `0 0 16px color-mix(in oklab, ${accent} 50%, transparent)`
                      : "none",
                  }}
                >
                  {String(exIdx + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (dragStartedRef.current) return; // skip if a drag committed
                      setSheetIdx(exIdx);
                    }}
                    className="text-base font-bold mb-0.5 flex items-center gap-2 active:opacity-70 transition-opacity"
                  >
                    <span>{ex.name}</span>
                    <span
                      aria-hidden
                      className="text-muted text-xs leading-none translate-y-px"
                      style={{ opacity: 0.6 }}
                    >
                      ›
                    </span>
                    <AnimatePresence>
                      {exDone && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                          style={{
                            background: `color-mix(in oklab, ${accent} 22%, transparent)`,
                            color: accent,
                          }}
                        >
                          Done
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-muted font-semibold tabular-nums mb-3">
                    {ex.sets} × {ex.reps}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {Array.from({ length: ex.sets }).map((_, s) => (
                      <SetCircle
                        key={s}
                        index={s}
                        done={exState[s] ?? false}
                        onToggle={() => onToggleSet(workout.id, exIdx, s)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div
          className="fixed left-0 right-0 bottom-0 px-4 pt-4 flex justify-center pointer-events-none z-20"
          style={{
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            background: "linear-gradient(to top, rgba(5,5,5,0.97) 65%, rgba(5,5,5,0))",
          }}
        >
          <button
            onClick={() => {
              if (confirm(`Reset all checked sets for ${workout.title}?`)) onReset();
            }}
            className="pointer-events-auto bg-panel text-muted border border-border rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider active:bg-panel-hi active:text-white transition-colors"
          >
            Reset today
          </button>
        </div>
      </motion.section>

      <ExerciseSheet
        open={sheetIdx !== null}
        exerciseIdx={sheetIdx}
        exercise={sheetExercise}
        accent={accent}
        onClose={() => setSheetIdx(null)}
      />
    </>
  );
}

/** Tiny double-chevron hint */
function SwipeHint({ accent }: { accent: string }) {
  return (
    <motion.span
      aria-hidden
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center"
      style={{ color: accent }}
    >
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
        <path d="M2 1l4 4-4 4M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}
