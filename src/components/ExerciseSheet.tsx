import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise, MuscleId } from "../data/workouts";
import { MUSCLE_LABELS } from "../data/workouts";

type Props = {
  open: boolean;
  exerciseIdx: number | null;
  exercise: Exercise | null;
  accent: string;
  onClose: () => void;
};

const NOTES_KEY = "workout:notes";

const loadNotes = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
};

const saveNotes = (notes: Record<string, string>) => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

/**
 * Bottom sheet showing exercise details. Drag-to-dismiss, tap-backdrop-to-dismiss.
 * Notes are keyed by exercise NAME (durable across reorderings of `workouts.ts`).
 */
export function ExerciseSheet({ open, exercise, accent, onClose }: Props) {
  const dragControls = useDragControls();
  const [notes, setNotes] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Load this exercise's note on open
  useEffect(() => {
    if (!exercise) return;
    const all = loadNotes();
    setNotes(all[exercise.name] ?? "");
  }, [exercise]);

  // Debounced save on edit
  const updateNote = useCallback(
    (next: string) => {
      setNotes(next);
      if (!exercise) return;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        const all = loadNotes();
        if (next.trim()) all[exercise.name] = next;
        else delete all[exercise.name];
        saveNotes(all);
      }, 250);
    },
    [exercise]
  );

  // Flush pending save when sheet closes
  useEffect(() => {
    if (!open && debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && exercise && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t bg-bg-raised overflow-hidden"
            style={{
              borderColor: `color-mix(in oklab, ${accent} 30%, #222)`,
              maxHeight: "85vh",
              boxShadow: `0 -20px 60px -10px color-mix(in oklab, ${accent} 25%, transparent)`,
            }}
          >
            {/* Drag handle bar — only this triggers drag */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="pt-3 pb-1 grid place-items-center cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <span className="block w-10 h-1.5 rounded-full bg-border-hi" />
            </div>

            <div
              className="px-6 pb-8 pt-2 overflow-y-auto"
              style={{
                maxHeight: "calc(85vh - 32px)",
                paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
              }}
            >
              {/* Header */}
              <div className="mt-2">
                <div
                  className="text-[10px] uppercase tracking-[0.24em] font-bold"
                  style={{ color: accent }}
                >
                  Exercise
                </div>
                <div className="mt-1 font-display text-3xl uppercase tracking-wider leading-none">
                  {exercise.name}
                </div>
                <div className="mt-3 text-[13px] uppercase tracking-[0.18em] text-muted font-semibold tabular-nums">
                  {exercise.sets} × {exercise.reps}
                </div>
              </div>

              {/* Target muscles */}
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted font-bold mb-2">
                  Primary muscles
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.primary.map((m: MuscleId) => (
                    <span
                      key={m}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                      style={{
                        background: `color-mix(in oklab, ${accent} 18%, transparent)`,
                        color: `color-mix(in oklab, ${accent} 75%, white)`,
                        border: `1px solid color-mix(in oklab, ${accent} 32%, transparent)`,
                      }}
                    >
                      {MUSCLE_LABELS[m]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-7">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted font-bold">
                    Cues / notes
                  </div>
                  {notes.trim() && (
                    <button
                      type="button"
                      onClick={() => updateNote("")}
                      className="text-[10px] uppercase tracking-[0.18em] text-muted font-semibold active:text-white transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  ref={textareaRef}
                  value={notes}
                  onChange={(e) => updateNote(e.target.value)}
                  placeholder="e.g. keep elbows tucked, 45° bench, slow eccentric…"
                  rows={4}
                  className="w-full resize-none rounded-xl bg-panel border border-border px-4 py-3 text-[15px] leading-relaxed placeholder:text-muted outline-none focus:border-[color:var(--accent)] transition-colors"
                  style={{ caretColor: accent }}
                />
                <div className="mt-1.5 text-[10px] text-muted uppercase tracking-[0.18em] font-semibold">
                  {notes.trim() ? "Saved automatically" : "Persists per exercise"}
                </div>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-[0.18em] active:scale-[0.99] transition-transform"
                style={{
                  background: accent,
                  color: "#04201a",
                  boxShadow: `0 0 24px -6px color-mix(in oklab, ${accent} 60%, transparent)`,
                }}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
