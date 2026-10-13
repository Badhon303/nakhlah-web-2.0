import { Award, Lock } from "lucide-react";
import BadgeCard from "./BadgeCard";

export default function BadgeSection({
  title,
  description,
  badges = [],
  currentInjaz = 0,
  variant = "earned",
}) {
  const SectionIcon = variant === "locked" ? Lock : Award;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <SectionIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="truncate text-lg font-bold text-foreground">
            {title}
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-muted/50 px-3 py-1 text-xs font-semibold text-accent sm:text-sm">
          {badges.length} total
        </span>
      </div>

      {description ? (
        <p className="px-1 text-sm text-muted-foreground">{description}</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
