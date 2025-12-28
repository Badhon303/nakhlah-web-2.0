import { Calendar } from "lucide-react";
import BadgeCard from "./BadgeCard";

export default function BadgeSection({ section }) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">
            {section.year}
          </h3>
        </div>

        <span className="text-sm text-muted-foreground">
          {section.badges.length} earned
        </span>
      </div>

      {/* Grid on desktop, list on mobile */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.badges.map((badge) => (
          <BadgeCard key={badge.title} badge={badge} />
        ))}
      </div>
    </div>
  );
}
