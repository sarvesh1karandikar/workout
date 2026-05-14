import { motion } from "framer-motion";
import { WORKOUT_ORDER, WORKOUTS, type WorkoutId } from "../data/workouts";
import { HomeTile } from "./HomeTile";
import { Wordmark } from "../components/Wordmark";
import { StreakHeatmap } from "../components/StreakHeatmap";
import { humanAgo } from "../state/useWorkoutState";

type Props = {
  onOpen: (id: WorkoutId) => void;
  onOpenSettings: () => void;
  lastDay: string | null;
  lastId: WorkoutId | null;
};

export function HomeScreen({ onOpen, onOpenSettings, lastDay, lastId }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative z-10 max-w-[640px] mx-auto px-4 pt-6 pb-32"
    >
      <header className="flex items-end justify-between mb-7 px-1">
        <Wordmark className="text-white text-[1.1rem]" />
        <div className="flex items-center gap-3">
          {lastDay && lastId && (
            <div className="text-[11px] text-muted uppercase tracking-[0.14em] font-semibold">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: WORKOUTS[lastId].accent }}
              />
              {humanAgo(lastDay)}
            </div>
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="grid place-items-center w-8 h-8 rounded-lg border border-border bg-panel text-muted active:bg-panel-hi active:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </header>

      <StreakHeatmap />

      <motion.div
        className="flex flex-col gap-3.5"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
      >
        {WORKOUT_ORDER.map((id) => (
          <motion.div
            key={id}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <HomeTile
              workout={WORKOUTS[id]}
              isLastTrained={id === lastId}
              onOpen={() => onOpen(id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <footer className="mt-10 text-center text-[10px] text-muted uppercase tracking-[0.2em]">
        Tap a workout to begin
      </footer>
    </motion.section>
  );
}
