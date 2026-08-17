"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Medal } from "@/components/icons/Medal";
import { buildApiUrl } from "@/lib/api-config";
import { cn } from "@/lib/utils";

const getIconUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return buildApiUrl(url);
};

export default function MissionCard({ mission, index = 0 }) {
  const iconUrl = getIconUrl(mission.iconUrl || mission.icon?.url || "");
  const current = Number(mission.current) || 0;
  const target = Number(mission.target) || 0;
  const reward = Number(mission.reward) || 0;

  const completedByStatus =
    (mission.status || "").toLowerCase() === "completed";
  const completedByProgress = target > 0 && current >= target;
  const isCompleted = completedByStatus || completedByProgress;

  // Quests outside today's rotation are rendered black-and-white as a preview.
  const isActive = mission.active !== false;
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all",
        isActive
          ? "border-border hover:shadow-md"
          : "border-border/60 opacity-60 grayscale",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconUrl}
            alt=""
            className="h-11 w-11 rounded-xl object-contain"
          />
        ) : (
          <Medal size="md" className="text-accent" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-bold leading-snug",
              isCompleted
                ? "text-muted-foreground line-through"
                : "text-foreground",
            )}
          >
            {mission.label}
          </p>
          {isActive && isCompleted ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          ) : null}
        </div>

        {isActive ? (
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-sm font-bold text-accent">
              {current} / {target}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Not in today&apos;s rotation
            {reward > 0 ? ` · ${reward.toLocaleString()} Injaz reward` : ""}
          </p>
        )}
      </div>
    </motion.div>
  );
}
