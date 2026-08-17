import BadgeCard from "./BadgeCard";

export default function BadgeSection({
  title,
  description,
  badges = [],
  currentInjaz = 0,
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {badges.length} {badges.length === 1 ? "badge" : "badges"}
        </span>
      </div>

      {description ? (
        <p className="px-1 text-xs text-muted-foreground">{description}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.key || badge.title}
            badge={badge}
            currentInjaz={currentInjaz}
          />
        ))}
      </div>
    </section>
  );
}
