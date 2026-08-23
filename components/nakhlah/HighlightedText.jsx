export default function HighlightedText({ text, query }) {
  if (!text || !query.trim()) return text || "";

  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = String(text).split(new RegExp(`(${escapedQuery})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-accent/25 px-0.5 text-foreground ring-1 ring-accent/30 dark:bg-accent/45 dark:ring-accent/50"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
