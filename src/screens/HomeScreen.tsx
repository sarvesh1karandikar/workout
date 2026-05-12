import { motion } from "framer-motion";
import { WORKOUT_ORDER, WORKOUTS, type WorkoutId } from "../data/workouts";
import { HomeTile } from "./HomeTile";
import { Wordmark } from "../components/Wordmark";
import { humanAgo } from "../state/useWorkoutState";

type Props = {
  onOpen: (id: WorkoutId) => void;
  lastDay: string | null;
  lastId: WorkoutId | null;
};

export function HomeScreen({ onOpen, lastDay, lastId }: Props) {
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
        {lastDay && lastId && (
          <div className="text-[11px] text-muted uppercase tracking-[0.14em] font-semibold">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
              style={{ background: WORKOUTS[lastId].accent }}
            />
            {humanAgo(lastDay)}
          </div>
        )}
      </header>

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
