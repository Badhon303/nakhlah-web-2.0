"use client";

import { Lock } from "lucide-react";
import { Medal } from "@/components/icons/Medal";
import { buildApiUrl } from "@/lib/api-config";
import { cn } from "@/lib/utils";

const getIconUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return buildApiUrl(url);
};

export default function BadgeCard({ badge, currentInjaz = 0 }) {
  const iconUrl = getIconUrl(badge.icon?.url || badge.icon);
  const injazTarget = Number(badge.injazTarget) || 0;
  const isEarned = Boolean(badge.earned);
  const remaining = Math.max(0, injazTarget - currentInjaz);
  const progress =
    injazTarget > 0 ? Math.min(100, (currentInjaz / injazTarget) * 100) : 0;

  return (
    <div className="flex items-center gap-4 border-b border-border/60 p-4 last:border-b-0">
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full",
          isEarned
            ? "bg-gradient-to-br from-primary to-accent shadow-md"
            : "bg-muted grayscale",
        )}
      >
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Medal
            size="md"
            className={isEarned ? "text-white" : "text-muted-foreground"}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-bold",
            isEarned ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {badge.title}
        </p>

        {isEarned ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Unlocked
            <span aria-hidden="true"> · </span>
            {injazTarget.toLocaleString()} Injaz
          </p>
        ) : (
          <div className="mt-1.5 space-y-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-muted-foreground/50 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {remaining.toLocaleString()} Injaz to go
              <span aria-hidden="true"> · </span>
              {injazTarget.toLocaleString()} needed
            </p>
          </div>
        )}
      </div>

      {isEarned ? null : (
        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </div>
  );
}
