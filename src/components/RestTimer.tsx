import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  durationSec: number;
  active: boolean;
  onDone: () => void;
  accent: string;
  soundEnabled: boolean;
};

const RING_R = 62;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const TICK_COUNT = 60;

export function RestTimer({ durationSec, active, onDone, accent, soundEnabled }: Props) {
  const [remaining, setRemaining] = useState(durationSec);
  const intervalRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (active) {
      setRemaining(durationSec);
      startedRef.current = true;
    }
  }, [active, durationSec]);

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

  useEffect(() => {
    if (active && remaining === 0 && startedRef.current) {
      if (soundEnabled) playBeep();
      if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [remaining, active, soundEnabled, onDone]);

  // Haptic tick at 3, 2, 1
  useEffect(() => {
    if (active && remaining <= 3 && remaining > 0 && startedRef.current) {
      if (navigator.vibrate) navigator.vibrate(15);
    }
  }, [remaining, active]);

  if (durationSec <= 0) return null;

  const pct = durationSec > 0 ? remaining / durationSec : 0;
  const offset = RING_CIRCUMFERENCE * (1 - pct);
  const urgent = remaining <= 10 && remaining > 0;
  const strokeColor = urgent ? "#ef4444" : accent;

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
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 backdrop-blur-lg cursor-pointer"
        >
          <div className="flex flex-col items-center">
            {/* Timer ring with tick marks */}
            <div className="relative w-[180px] h-[180px]">
              <svg viewBox="0 0 180 180" className="w-full h-full">
                {/* Tick marks around the edge */}
                {Array.from({ length: TICK_COUNT }).map((_, i) => {
                  const angle = (i / TICK_COUNT) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const isMajor = i % 5 === 0;
                  const inner = isMajor ? 76 : 78;
                  const outer = 82;
                  const x1 = 90 + Math.cos(rad) * inner;
                  const y1 = 90 + Math.sin(rad) * inner;
                  const x2 = 90 + Math.cos(rad) * outer;
                  const y2 = 90 + Math.sin(rad) * outer;
                  const tickPct = i / TICK_COUNT;
                  const isActive = tickPct <= pct;
                  return (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isActive ? strokeColor : "#2a2a2a"}
                      strokeWidth={isMajor ? 2 : 1}
                      opacity={isActive ? 1 : 0.4}
                    />
                  );
                })}

                {/* Background track */}
                <circle
                  cx="90" cy="90" r={RING_R}
                  fill="none" stroke="#1a1a1a" strokeWidth="5"
                />

                {/* Depleting arc */}
                <circle
                  cx="90" cy="90" r={RING_R}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  transform="rotate(-90 90 90)"
                  style={{
                    transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                    filter: `drop-shadow(0 0 ${urgent ? 10 : 6}px ${strokeColor})`,
                  }}
                />

                {/* Glowing leading dot */}
                {pct > 0 && (
                  <circle
                    cx={90 + RING_R * Math.cos(((1 - pct) * 360 - 90) * Math.PI / 180)}
                    cy={90 + RING_R * Math.sin(((1 - pct) * 360 - 90) * Math.PI / 180)}
                    r="4"
                    fill={strokeColor}
                    style={{
                      filter: `drop-shadow(0 0 6px ${strokeColor})`,
                      transition: "cx 1s linear, cy 1s linear",
                    }}
                  />
                )}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <motion.div
                    key={remaining}
                    initial={{ scale: 1.1, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={
                      "font-display tabular-nums leading-none " +
                      (urgent ? "text-red-400 text-6xl" : "text-white text-5xl")
                    }
                    style={{
                      animation: urgent ? "urgentPulse 0.8s ease-in-out infinite" : undefined,
                    }}
                  >
                    {remaining}
                  </motion.div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.3em] text-muted font-bold">
                    {remaining === 0 ? "Go!" : "sec"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-muted font-bold">
              Rest
            </div>
            <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-muted/50 font-semibold">
              Tap anywhere to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
  } catch {}
}
