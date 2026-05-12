import { motion } from "framer-motion";
import type { Workout } from "../data/workouts";

type Props = {
  workout: Workout;
  isLastTrained: boolean;
  onOpen: () => void;
};

export function HomeTile({ workout, isLastTrained, onOpen }: Props) {
  const accent = workout.accent;
  const exerciseCount = workout.exercises.length;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layoutId={`tile-${workout.id}`}
      className="relative w-full text-left overflow-hidden rounded-2xl border cursor-pointer min-h-[116px]"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 32%, #222)`,
        background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 18%, #141414) 0%, #141414 65%)`,
      }}
      whileTap={{ scale: 0.992 }}
    >
      {/* Left accent bar */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background: accent,
          boxShadow: `0 0 22px 2px color-mix(in oklab, ${accent} 60%, transparent)`,
        }}
      />

      {/* Giant ghost numeral on right */}
      <span
        aria-hidden
        className="absolute right-4 top-1/2 -translate-y-1/2 font-display leading-none pointer-events-none select-none tabular-nums"
        style={{
          fontSize: "8.5rem",
          color: `color-mix(in oklab, ${accent} 22%, transparent)`,
          textShadow: `0 0 20px color-mix(in oklab, ${accent} 30%, transparent)`,
        }}
      >
        {exerciseCount}
      </span>

      {/* Radial corner glow */}
      <span
        aria-hidden
        className={
          "absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none " +
          (isLastTrained ? "animate-pulse" : "")
        }
        style={{
          background: `radial-gradient(circle, color-mix(in oklab, ${accent} 40%, transparent) 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col justify-center h-full py-5 pl-6 pr-6">
        <div className="text-[10px] uppercase tracking-[0.24em] font-bold" style={{ color: accent }}>
          {isLastTrained ? "Last trained" : "Day"}
        </div>
        <div className="mt-1 font-display text-[2.6rem] tracking-wider uppercase leading-none">
          {workout.title}
        </div>
        <div className="mt-2.5 text-[11px] uppercase tracking-[0.18em] text-muted font-semibold tabular-nums">
          {exerciseCount} exercises · {workout.muscles.length} muscle groups
        </div>
      </div>
    </motion.button>
  );
}
