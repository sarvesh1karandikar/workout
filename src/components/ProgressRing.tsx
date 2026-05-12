import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type Props = { done: number; total: number; size?: number };

const RADIUS = 22;
const CIRC = 2 * Math.PI * RADIUS;

export function ProgressRing({ done, total, size = 52 }: Props) {
  const pct = total === 0 ? 0 : done / total;
  const complete = total > 0 && done === total;

  // Animate the dashoffset with a spring for a satisfying ease.
  const spring = useSpring(pct, { stiffness: 160, damping: 22, mass: 0.6 });
  const dashOffset = useTransform(spring, (v) => CIRC * (1 - v));

  useEffect(() => {
    spring.set(pct);
  }, [pct, spring]);

  return (
    <div
      className="relative flex-shrink-0 grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 52 52"
        style={{ width: size, height: size, transform: "rotate(-90deg)" }}
      >
        <circle cx="26" cy="26" r={RADIUS} fill="none" stroke="#222" strokeWidth="4" />
        <motion.circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          style={{
            strokeDashoffset: dashOffset,
            filter: "drop-shadow(0 0 5px color-mix(in oklab, var(--accent) 55%, transparent))",
          }}
        />
      </svg>
      <div
        className={
          "absolute inset-0 grid place-items-center text-[11px] font-bold tabular-nums " +
          (complete ? "text-[color:var(--accent)]" : "text-white")
        }
      >
        {done}/{total}
      </div>
    </div>
  );
}
