import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useSettings, type WeightUnit } from "../state/useSettings";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TIMER_OPTIONS = [0, 30, 45, 60, 90, 120];
const UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: "lb", label: "lb" },
  { value: "kg", label: "kg" },
];

export function SettingsDrawer({ open, onClose }: Props) {
  const { settings, update } = useSettings();
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
          />
          <motion.div
            key="settings-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
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
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-bg-raised overflow-hidden"
            style={{ maxHeight: "80vh" }}
          >
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
                maxHeight: "calc(80vh - 32px)",
                paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
              }}
            >
              <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-muted mb-5">
                Settings
              </div>

              {/* Rest timer */}
              <Section label="Rest timer (seconds)">
                <div className="flex flex-wrap gap-2">
                  {TIMER_OPTIONS.map((sec) => (
                    <Chip
                      key={sec}
                      label={sec === 0 ? "Off" : `${sec}s`}
                      active={settings.restTimerSec === sec}
                      onClick={() => update({ restTimerSec: sec })}
                    />
                  ))}
                </div>
              </Section>

              {/* Weight unit */}
              <Section label="Weight unit">
                <div className="flex gap-2">
                  {UNIT_OPTIONS.map((opt) => (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      active={settings.weightUnit === opt.value}
                      onClick={() => update({ weightUnit: opt.value })}
                    />
                  ))}
                </div>
              </Section>

              {/* Sound */}
              <Section label="Timer sound">
                <div className="flex gap-2">
                  <Chip
                    label="On"
                    active={settings.soundEnabled}
                    onClick={() => update({ soundEnabled: true })}
                  />
                  <Chip
                    label="Off"
                    active={!settings.soundEnabled}
                    onClick={() => update({ soundEnabled: false })}
                  />
                </div>
              </Section>

              <button
                type="button"
                onClick={onClose}
                className="mt-8 w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-[0.18em] bg-panel border border-border text-white active:bg-panel-hi transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-semibold mb-2.5">
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors " +
        (active
          ? "bg-[color:var(--accent)] border-[color:var(--accent)] text-[#04201a]"
          : "bg-panel border-border text-muted active:border-border-hi")
      }
    >
      {label}
    </button>
  );
}
