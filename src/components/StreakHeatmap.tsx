import { motion } from "framer-motion";
import { useHistory } from "../state/useHistory";

const LEVEL_COLORS = [
  "var(--hm-0, #141414)",
  "var(--hm-1, #0d3d2e)",
  "var(--hm-2, #0f6d4f)",
  "var(--hm-3, #10b981)",
  "var(--hm-4, #34d399)",
];

/**
 * 12-week calendar heatmap + streak counter. Sits on the home screen.
 * Grid is 7 rows (Mon–Sun) × 12 columns (weeks).
 */
export function StreakHeatmap() {
  const { streak, heatmap } = useHistory();

  if (heatmap.length === 0) return null;

  // Arrange into columns (weeks). heatmap is already 84 days oldest→newest.
  // We want 12 columns of 7 rows. The grid reads column by column.
  const cols: typeof heatmap[number][][] = [];
  for (let c = 0; c < 12; c++) {
    cols.push(heatmap.slice(c * 7, c * 7 + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-7 mb-2 px-1"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted font-bold">
          Activity · 12 weeks
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]">🔥</span>
            <span className="text-[11px] font-bold tabular-nums text-[color:var(--accent)]">
              {streak}
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-muted font-semibold">
              day{streak !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-[3px]">
        {cols.map((week, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                className="w-[10px] h-[10px] rounded-[2.5px]"
                style={{
                  background: LEVEL_COLORS[day.level],
                  border: day.level === 0 ? "1px solid #1c1c1c" : "none",
                }}
                title={`${day.date}: ${day.sets} sets`}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
