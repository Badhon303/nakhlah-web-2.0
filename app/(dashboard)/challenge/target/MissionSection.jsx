import MissionCard from "./MissionCard";

export default function MissionSection({
  title,
  emoji,
  description,
  missions = [],
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-lg font-bold text-foreground">
          {title} {emoji ? <span aria-hidden="true">{emoji}</span> : null}
        </h2>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {missions.length} {missions.length === 1 ? "challenge" : "challenges"}
        </span>
      </div>

      {description ? (
        <p className="px-1 text-xs text-muted-foreground">{description}</p>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        {missions.map((mission, index) => (
          <MissionCard
            key={mission.key || index}
            mission={mission}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
