import { motion } from "framer-motion";
import type { Workout } from "../data/workouts";
import { ProgressRing } from "./ProgressRing";

type Props = {
  workout: Workout;
  done: number;
  total: number;
  onResume: () => void;
};

/**
 * Sticky bottom bar shown on the home screen when there's an in-progress
 * (started-but-not-finished) workout from today. Tap to jump back in.
 */
export function NowTrainingBar({ workout, done, total, onResume }: Props) {
  const accent = workout.accent;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="fixed left-0 right-0 bottom-0 z-30 flex justify-center px-3 pointer-events-none"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={onResume}
        className="pointer-events-auto w-full max-w-[600px] flex items-center gap-3 px-4 py-2.5 rounded-2xl border bg-frost active:scale-[0.99] transition-transform"
        style={{
          borderColor: `color-mix(in oklab, ${accent} 30%, #222)`,
          boxShadow: `0 12px 36px -8px color-mix(in oklab, ${accent} 38%, transparent), 0 0 0 1px rgba(255,255,255,0.04) inset`,
        }}
      >
        <ProgressRing done={done} total={total} size={42} />
        <div className="flex-1 min-w-0 text-left">
          <div
            className="text-[9px] uppercase tracking-[0.22em] font-bold"
            style={{ color: accent }}
          >
            Now training
          </div>
          <div className="font-display text-lg uppercase tracking-wider leading-none mt-0.5">
            {workout.title}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="tabular-nums font-bold text-sm">
            {done}/{total}
          </div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-muted font-semibold mt-0.5">
            Resume ›
          </div>
        </div>
      </button>
    </motion.div>
  );
}
