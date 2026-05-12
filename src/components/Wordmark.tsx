/** Pure-typographic wordmark. No SVG graphics. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <div
      className={
        "font-display uppercase leading-none select-none " + (className ?? "")
      }
      style={{ letterSpacing: "0.28em" }}
    >
      Work
      <span className="text-[color:var(--accent)]">·</span>
      out
    </div>
  );
}
