import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

type Props = {
  index: number;
  done: boolean;
  onToggle: () => void;
};

export function SetCircle({ index, done, onToggle }: Props) {
  const [burst, setBurst] = useState(0);
  const [dots, setDots] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const dotId = useRef(0);

  const handleClick = () => {
    onToggle();
    if (navigator.vibrate) navigator.vibrate(8);
    setBurst((b) => b + 1);
    // Micro confetti: spawn 5 dots shooting outward
    if (!done) {
      const newDots = Array.from({ length: 5 }, (_, i) => ({
        id: dotId.current++,
        x: 0,
        y: 0,
        angle: (i * 72) + Math.random() * 30 - 15,
      }));
      setDots((prev) => [...prev, ...newDots]);
      setTimeout(() => setDots((prev) => prev.filter((d) => !newDots.includes(d))), 700);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={`Set ${index + 1}`}
      className={
        "relative grid place-items-center w-12 h-12 rounded-[14px] border-[1.5px] " +
        "font-bold text-[15px] overflow-visible cursor-pointer select-none " +
        (done
          ? "border-[color:var(--accent)] text-[#04201a] shadow-[0_0_16px_-2px_color-mix(in_oklab,var(--accent)_55%,transparent)]"
          : "border-border-hi bg-bg-raised text-muted")
      }
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {/* Clock-wipe radial fill using conic-gradient + clip */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: "var(--accent)",
          clipPath: done
            ? "circle(100% at 50% 50%)"
            : "circle(0% at 50% 50%)",
        }}
        initial={false}
        animate={{
          clipPath: done
            ? "circle(75% at 50% 50%)"
            : "circle(0% at 50% 50%)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Expanding burst ring */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={burst}
            aria-hidden
            className="absolute inset-0 rounded-[inherit] border-2 border-[color:var(--accent)]"
            initial={{ opacity: 0.7, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setBurst(0)}
          />
        )}
      </AnimatePresence>

      {/* Micro confetti dots */}
      {dots.map((dot) => {
        const rad = (dot.angle * Math.PI) / 180;
        const dist = 28 + Math.random() * 12;
        return (
          <motion.span
            key={dot.id}
            aria-hidden
            className="absolute w-[5px] h-[5px] rounded-full bg-[color:var(--accent)]"
            style={{ top: "50%", left: "50%", marginTop: -2.5, marginLeft: -2.5 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        );
      })}

      <span className="relative z-10">{index + 1}</span>
    </motion.button>
  );
}
