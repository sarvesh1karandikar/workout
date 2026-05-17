import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { RECIPES, CATEGORY_ORDER, CATEGORY_LABELS, type Recipe, type RecipeCategory } from "../data/recipes";

type Props = {
  onBack: () => void;
};

export function RecipesScreen({ onBack }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<RecipeCategory, Recipe[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const r of RECIPES) {
      map.get(r.category)?.push(r);
    }
    return map;
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 max-w-[640px] mx-auto px-4 pt-3 pb-32"
    >
      <header className="flex items-center gap-3 mb-6">
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
      </header>

      <motion.div
        className="flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
      >
        {CATEGORY_ORDER.map((cat) => {
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

function RecipeCard({
  recipe,
  expanded,
  onToggle,
}: {
  recipe: Recipe;
  expanded: boolean;
  onToggle: () => void;
}) {
  const accent = "#f59e0b"; // amber for food

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: expanded
          ? `color-mix(in oklab, ${accent} 40%, #222)`
          : "#222",
        background: expanded
          ? `linear-gradient(135deg, color-mix(in oklab, ${accent} 12%, #141414) 0%, #141414 70%)`
          : "#141414",
      }}
    >
      {/* Header — always visible */}
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
          <span className="text-lg" style={{ color: accent }}>
            {expanded ? "−" : "+"}
          </span>
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
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
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

              {/* Ingredients */}
              <SectionHeader accent={accent}>Ingredients</SectionHeader>
              <ul className="mt-2 mb-5 space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-baseline gap-2 text-[14px]">
                    <span className="text-muted tabular-nums text-[12px] min-w-[60px] text-right font-semibold">
                      {ing.amount}
                    </span>
                    <span>{ing.item}</span>
                  </li>
                ))}
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
                        <span className="ml-2 text-[10px] uppercase tracking-wider font-bold" style={{ color: accent }}>
                          {step.time}
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
                      <li key={i} className="text-[13px] text-muted leading-relaxed pl-3 border-l-2" style={{ borderColor: `color-mix(in oklab, ${accent} 30%, #222)` }}>
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

function SectionHeader({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div
      className="text-[10px] uppercase tracking-[0.22em] font-bold"
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
