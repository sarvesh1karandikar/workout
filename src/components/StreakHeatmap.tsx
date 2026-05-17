import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useHistory } from "../state/useHistory";

const LEVEL_COLORS = [
  "#141414",
  "#0d3d2e",
  "#0f6d4f",
  "#10b981",
  "#34d399",
];

export function StreakHeatmap() {
  const { streak, heatmap } = useHistory();
  const [tooltip, setTooltip] = useState<{ date: string; sets: number } | null>(null);

  if (heatmap.length === 0) return null;

  const cols: typeof heatmap[number][][] = [];
  for (let c = 0; c < 12; c++) {
    cols.push(heatmap.slice(c * 7, c * 7 + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 mb-4 px-1"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted font-bold">
          Activity · 12 weeks
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]">🔥</span>
            <span className="text-[12px] font-bold tabular-nums text-[color:var(--accent)]">
              {streak}
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-muted font-semibold">
              day{streak !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mb-2 text-[11px] font-semibold tabular-nums"
          >
            <span className="text-white">{tooltip.date}</span>
            <span className="text-muted ml-2">
              {tooltip.sets > 0 ? `${tooltip.sets} sets completed` : "Rest day"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-[3px] justify-between">
        {cols.map((week, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() =>
                  setTooltip(
                    tooltip?.date === day.date ? null : { date: day.date, sets: day.sets }
                  )
                }
                className="w-[11px] h-[11px] rounded-[3px] transition-transform active:scale-125"
                style={{
                  background: LEVEL_COLORS[day.level],
                  border: day.level === 0 ? "1px solid #1c1c1c" : "none",
                  boxShadow: day.level >= 3 ? `0 0 4px ${LEVEL_COLORS[day.level]}` : "none",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2.5 justify-end">
        <span className="text-[9px] text-muted font-semibold">Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <span
            key={i}
            className="w-[9px] h-[9px] rounded-[2px]"
            style={{
              background: c,
              border: i === 0 ? "1px solid #1c1c1c" : "none",
            }}
          />
        ))}
        <span className="text-[9px] text-muted font-semibold">More</span>
      </div>
    </motion.div>
  );
}
