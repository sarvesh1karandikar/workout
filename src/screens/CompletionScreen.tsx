import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import type { Workout } from "../data/workouts";

type Props = {
  workout: Workout;
  totalSets: number;
  elapsedMs: number;
  onDone: () => void;
};

export function CompletionScreen({ workout, totalSets, elapsedMs, onDone }: Props) {
  const fired = useRef(false);
  const accent = workout.accent;

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const colors = [accent, "#ffffff", lighten(accent, 30)];
    const shoot = (origin: { x: number; y: number }) =>
      confetti({
        particleCount: 80,
        spread: 90,
        startVelocity: 55,
        origin,
        colors,
        scalar: 1.1,
        ticks: 220,
      });
    shoot({ x: 0.15, y: 0.5 });
    setTimeout(() => shoot({ x: 0.85, y: 0.5 }), 150);
    setTimeout(() => shoot({ x: 0.5, y: 0.35 }), 320);
    if (navigator.vibrate) navigator.vibrate([20, 40, 20, 40, 80]);
  }, [accent]);

  const fmtElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 grid place-items-center px-6"
      style={{
        background: `radial-gradient(ellipse 120% 80% at 50% 40%, color-mix(in oklab, ${accent} 26%, #050505) 0%, #050505 70%)`,
      }}
    >
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 160, damping: 16 }}
          className="font-display tabular-nums leading-none"
          style={{
            fontSize: "11rem",
            color: accent,
            textShadow: `0 0 40px color-mix(in oklab, ${accent} 50%, transparent)`,
          }}
        >
          ✓
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div
            className="text-[11px] uppercase tracking-[0.3em] font-bold"
            style={{ color: accent }}
          >
            Workout Complete
          </div>
          <div className="mt-3 font-display text-5xl tracking-wider uppercase leading-none">
            {workout.title}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-7"
        >
          <Stat label="Sets" value={String(totalSets)} accent={accent} />
          <Stat label="Time" value={fmtElapsed(elapsedMs)} accent={accent} />
          <Stat label="Groups" value={String(workout.muscles.length)} accent={accent} />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onDone}
          className="mt-10 px-12 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] active:scale-95 transition-transform"
          style={{
            background: accent,
            color: "#04201a",
            boxShadow: `0 0 32px -2px color-mix(in oklab, ${accent} 60%, transparent)`,
          }}
        >
          Done
        </motion.button>
      </div>
    </motion.section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-display text-3xl tabular-nums leading-none" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-muted font-bold">
        {label}
      </div>
    </div>
  );
}

function lighten(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1]!, 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
