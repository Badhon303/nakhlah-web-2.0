"use client";

import { CheckCircle2, Lock } from "lucide-react";
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
    <div
      className={cn(
        "rounded-2xl border bg-card shadow-sm transition-shadow",
        isEarned ? "border-border" : "border-border/60",
      )}
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full",
            isEarned ? "bg-transparent" : "bg-muted grayscale",
          )}
        >
          {iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconUrl}
              alt={badge.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Medal
              size="md"
              className={isEarned ? "text-accent" : "text-muted-foreground"}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "mb-1 truncate font-bold",
              isEarned ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {badge.title}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 text-sm">
            <span className="font-semibold text-accent">
              {injazTarget.toLocaleString()} Injaz
            </span>
            <span aria-hidden="true" className="text-xs text-muted-foreground">
              •
            </span>
            <span className="text-muted-foreground">
              {isEarned ? "Unlocked" : "Target"}
            </span>
          </div>
        </div>

        {isEarned ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 fill-accent text-background" />
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>

      {isEarned ? null : (
        <div className="px-4 pb-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {remaining.toLocaleString()} Injaz to go
            <span aria-hidden="true"> · </span>
            {injazTarget.toLocaleString()} needed to unlock
          </p>
        </div>
      )}
    </div>
  );
}
