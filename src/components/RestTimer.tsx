import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Duration in seconds. 0 = disabled (won't render). */
  durationSec: number;
  /** Whether the timer is currently active */
  active: boolean;
  /** Called when timer finishes or is dismissed */
  onDone: () => void;
  accent: string;
  soundEnabled: boolean;
};

const RING_R = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

export function RestTimer({
  durationSec,
  active,
  onDone,
  accent,
  soundEnabled,
}: Props) {
  const [remaining, setRemaining] = useState(durationSec);
  const intervalRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  // Reset when activating
  useEffect(() => {
    if (active) {
      setRemaining(durationSec);
      startedRef.current = true;
    }
  }, [active, durationSec]);

  // Countdown
  useEffect(() => {
    if (!active || durationSec <= 0) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [active, durationSec]);

  // When countdown hits 0, fire done + play sound
  useEffect(() => {
    if (active && remaining === 0 && startedRef.current) {
      if (soundEnabled) playBeep();
      if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
      // Small delay so the ring fills visually before dismissing
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [remaining, active, soundEnabled, onDone]);

  if (durationSec <= 0) return null;

  const pct = durationSec > 0 ? remaining / durationSec : 0;
  const offset = RING_CIRCUMFERENCE * pct;
  const urgent = remaining <= 10 && remaining > 0;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="rest-timer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onDone}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md"
          style={{ cursor: "pointer" }}
        >
          <div className="flex flex-col items-center">
            {/* Ring */}
            <div className="relative w-[160px] h-[160px]">
              <svg viewBox="0 0 160 160" className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="80"
                  cy="80"
                  r={RING_R}
                  fill="none"
                  stroke="#222"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={RING_R}
                  fill="none"
                  stroke={urgent ? "#ef4444" : accent}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.9, ease: "linear" }}
                  style={{
                    filter: urgent
                      ? "drop-shadow(0 0 8px #ef4444)"
                      : `drop-shadow(0 0 6px color-mix(in oklab, ${accent} 60%, transparent))`,
                  }}
                />
              </svg>
              {/* Time display */}
              <div className="absolute inset-0 grid place-items-center">
                <div
                  className={
                    "font-display tabular-nums leading-none text-5xl " +
                    (urgent ? "text-red-400" : "text-white")
                  }
                  style={{
                    animation: urgent ? "urgentPulse 0.8s ease-in-out infinite" : undefined,
                  }}
                >
                  {remaining}
                </div>
              </div>
            </div>

            <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted font-bold">
              Rest
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted/60 font-semibold">
              Tap anywhere to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Simple beep using Web Audio API */
function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available
  }
}
