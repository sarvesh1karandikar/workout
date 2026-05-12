import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
  index: number;
  done: boolean;
  onToggle: () => void;
};

/**
 * Set circle with a liquid sweep-fill when marked done.
 * The "liquid" is a div with translateY(-100%) that animates up into frame.
 */
export function SetCircle({ index, done, onToggle }: Props) {
  const [burst, setBurst] = useState(0);

  const handleClick = () => {
    onToggle();
    if (navigator.vibrate) navigator.vibrate(8);
    setBurst((b) => b + 1);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={`Set ${index + 1}`}
      className={
        "relative grid place-items-center w-12 h-12 rounded-[14px] border-[1.5px] " +
        "font-bold text-[15px] overflow-hidden cursor-pointer select-none " +
        (done
          ? "border-[color:var(--accent)] text-[#04201a] shadow-[0_0_16px_-2px_color-mix(in_oklab,var(--accent)_55%,transparent)]"
          : "border-border-hi bg-bg-raised text-muted")
      }
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {/* Liquid fill layer */}
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-[color:var(--accent)] rounded-[inherit]"
        initial={false}
        animate={{ y: done ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      />
      {/* Expanding burst on tap */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={burst}
            aria-hidden
            className="absolute inset-0 rounded-[inherit] bg-[color:var(--accent)]"
            initial={{ opacity: 0.5, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            onAnimationComplete={() => setBurst(0)}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{index + 1}</span>
    </motion.button>
  );
}
