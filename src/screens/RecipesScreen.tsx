import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { RECIPES, CATEGORY_ORDER, CATEGORY_LABELS, type Recipe, type RecipeCategory } from "../data/recipes";

type Props = {
  onBack: () => void;
};

export function RecipesScreen({ onBack }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<RecipeCategory | "all">("all");

  const grouped = useMemo(() => {
    const map = new Map<RecipeCategory, Recipe[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const r of RECIPES) {
      map.get(r.category)?.push(r);
    }
    return map;
  }, []);

  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return CATEGORY_ORDER;
    return CATEGORY_ORDER.filter((c) => c === activeFilter);
  }, [activeFilter]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 max-w-[640px] mx-auto px-4 pt-3 pb-32"
    >
      <header className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          aria-label="Back"
          className="grid place-items-center w-11 h-11 rounded-xl border border-border bg-panel text-white text-2xl active:bg-panel-hi transition-colors"
        >
          ‹
        </button>
        <div className="font-display text-2xl tracking-wider uppercase leading-none">
          Recipes
        </div>
        <span className="text-[10px] tabular-nums text-muted font-semibold ml-auto">
          {RECIPES.length} total
        </span>
      </header>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 no-scrollbar">
        <FilterPill
          label="All"
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        />
        {CATEGORY_ORDER.map((cat) => (
          <FilterPill
            key={cat}
            label={`${catEmoji(cat)} ${CATEGORY_LABELS[cat]}`}
            active={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
          />
        ))}
      </div>

      <motion.div
        className="flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
      >
        {filteredCategories.map((cat) => {
          const recipes = grouped.get(cat);
          if (!recipes || recipes.length === 0) return null;
          return (
            <motion.div
              key={cat}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-lg">{catEmoji(cat)}</span>
                <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-muted">
                  {CATEGORY_LABELS[cat]}
                </div>
                <span className="text-[10px] tabular-nums text-muted/50 font-semibold">
                  {recipes.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    expanded={expanded === recipe.id}
                    onToggle={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={
        "flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors whitespace-nowrap " +
        (active
          ? "bg-[color:var(--accent)] border-[color:var(--accent)] text-[#04201a]"
          : "bg-panel border-border text-muted active:border-border-hi")
      }
      animate={{ scale: active ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {label}
    </motion.button>
  );
}

function RecipeCard({
  recipe,
  expanded,
  onToggle,
}: {
  recipe: Recipe;
  expanded: boolean;
  onToggle: () => void;
}) {
  const accent = "#f59e0b";
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = useCallback((idx: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  // Persist checked state per recipe in a ref (resets when collapsed)
  const wasExpanded = useRef(false);
  if (!expanded && wasExpanded.current) {
    wasExpanded.current = false;
  }
  if (expanded && !wasExpanded.current) {
    wasExpanded.current = true;
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-colors"
      style={{
        borderColor: expanded
          ? `color-mix(in oklab, ${accent} 40%, #222)`
          : "#222",
        background: expanded
          ? `linear-gradient(135deg, color-mix(in oklab, ${accent} 12%, #141414) 0%, #141414 70%)`
          : "#141414",
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center gap-4 active:opacity-80 transition-opacity"
      >
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl uppercase tracking-wider leading-tight">
            {recipe.title}
          </div>
          <div className="mt-1 text-[11px] text-muted uppercase tracking-[0.14em] font-semibold">
            {recipe.prepTime} prep · {recipe.cookTime} cook · {recipe.servings} servings
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {recipe.protein && (
            <span className="text-[11px] font-bold tabular-nums" style={{ color: accent }}>
              {recipe.protein}g protein
            </span>
          )}
          {recipe.calories && (
            <span className="text-[10px] tabular-nums text-muted">
              {recipe.calories} cal
            </span>
          )}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg mt-0.5"
            style={{ color: accent }}
          >
            ⌄
          </motion.span>
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border">
              {/* Macros bar */}
              <div className="flex gap-4 mt-3 mb-4 px-3 py-2.5 rounded-xl bg-panel border border-border">
                {recipe.calories && <MacroStat label="Cal" value={String(recipe.calories)} accent={accent} />}
                {recipe.protein && <MacroStat label="Protein" value={`${recipe.protein}g`} accent={accent} />}
                <MacroStat label="Servings" value={String(recipe.servings)} accent={accent} />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: `color-mix(in oklab, ${accent} 16%, transparent)`,
                      color: `color-mix(in oklab, ${accent} 80%, white)`,
                      border: `1px solid color-mix(in oklab, ${accent} 28%, transparent)`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Ingredients with checklist */}
              <SectionHeader accent={accent}>
                Ingredients
                {checkedIngredients.size > 0 && (
                  <span className="ml-2 text-muted text-[9px] normal-case tracking-normal">
                    {checkedIngredients.size}/{recipe.ingredients.length} checked
                  </span>
                )}
              </SectionHeader>
              <ul className="mt-2 mb-5 space-y-1">
                {recipe.ingredients.map((ing, i) => {
                  const checked = checkedIngredients.has(i);
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => toggleIngredient(i)}
                        className={
                          "w-full flex items-baseline gap-2.5 text-[14px] text-left py-0.5 transition-opacity " +
                          (checked ? "opacity-40" : "")
                        }
                      >
                        <span
                          className={
                            "flex-shrink-0 w-4 h-4 rounded border grid place-items-center text-[10px] transition-colors " +
                            (checked
                              ? "bg-[color:var(--accent)] border-[color:var(--accent)] text-[#04201a]"
                              : "border-border-hi bg-bg-raised")
                          }
                          style={{ marginTop: 2 }}
                        >
                          {checked && "✓"}
                        </span>
                        <span className={
                          "text-muted tabular-nums text-[12px] min-w-[55px] text-right font-semibold " +
                          (checked ? "line-through" : "")
                        }>
                          {ing.amount}
                        </span>
                        <span className={checked ? "line-through" : ""}>{ing.item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Steps */}
              <SectionHeader accent={accent}>Steps</SectionHeader>
              <ol className="mt-2 mb-4 space-y-3">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed">
                    <span
                      className="font-display text-lg tabular-nums leading-none mt-0.5 flex-shrink-0 w-7"
                      style={{ color: `color-mix(in oklab, ${accent} 60%, #999)` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span>{step.text}</span>
                      {step.time && (
                        <span
                          className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md"
                          style={{
                            color: accent,
                            background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                          }}
                        >
                          ⏱ {step.time}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Notes */}
              {recipe.notes && recipe.notes.length > 0 && (
                <>
                  <SectionHeader accent={accent}>Notes</SectionHeader>
                  <ul className="mt-2 space-y-1.5">
                    {recipe.notes.map((note, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-muted leading-relaxed pl-3 border-l-2"
                        style={{ borderColor: `color-mix(in oklab, ${accent} 30%, #222)` }}
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <div className="text-[14px] font-bold tabular-nums" style={{ color: accent }}>{value}</div>
      <div className="text-[8px] uppercase tracking-[0.18em] text-muted font-bold mt-0.5">{label}</div>
    </div>
  );
}

function SectionHeader({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div
      className="text-[10px] uppercase tracking-[0.22em] font-bold flex items-center"
      style={{ color: accent }}
    >
      {children}
    </div>
  );
}

function catEmoji(cat: string): string {
  switch (cat) {
    case "breakfast": return "🍳";
    case "mains": return "🍛";
    case "soups": return "🍲";
    case "sides": return "🥗";
    default: return "🍽️";
  }
}
