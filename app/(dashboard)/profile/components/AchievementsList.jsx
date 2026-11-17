"use client";
import { Medal } from "@/components/icons/Medal";
import AchievementTick from "@/components/icons/AchievementTick";
import { motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!API_URL) return url;
  return `${API_URL}${url}`;
};

const AchievementIcon = ({ achievement }) =>
  achievement.unitIcon ? (
    <img
      src={getMediaUrl(achievement.unitIcon?.url || achievement.unitIcon)}
      alt={achievement.title || "Unit icon"}
      className="h-14 w-14 rounded-xl object-cover"
    />
  ) : (
    <Medal size="lg" />
  );

export default function AchievementsList({
  onViewAll,
  achievements = [],
  isLoading = false,
}) {
  const compactAchievements = achievements.slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-accent/20 lg:bg-card lg:shadow-sm"
    >
      <div className="flex items-center justify-between gap-5 border-b border-border px-5 py-5 text-foreground sm:px-7">
        <div>
          <h3 className="text-xl font-extrabold text-foreground">
            Achievements
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The moments that mark your learning progress.
          </p>
        </div>
        {/* <Medal size="lg" className="shrink-0 text-white" /> */}
      </div>

      <div className="sm:p-6">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={`achievement-skeleton-${index}`}
                className="flex h-24 items-center gap-4 rounded-2xl border border-border p-4"
              >
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !compactAchievements.length && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <Medal size="xl" className="mx-auto opacity-60" />
            <p className="mt-3 font-extrabold text-foreground">
              Your first achievement is waiting
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete lessons to begin building your collection.
            </p>
          </div>
        )}

        {!isLoading && compactAchievements.length > 0 && (
          <div className="space-y-3">
            {compactAchievements.map((achievement, index) => (
              <motion.article
                key={
                  achievement.id || `${achievement.achievementTitle}-${index}`
                }
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.07 * index, duration: 0.35 }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-none border-x-0 border-t-0 border-b border-border p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/20 lg:rounded-2xl lg:border"
              >
                {achievement.achieved ? (
                  <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
                ) : null}
                <span className="shrink-0 transition-transform group-hover:scale-105">
                  <AchievementIcon achievement={achievement} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-foreground">
                      {achievement.achievementTitle || "Achievement"}
                    </h4>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Level {achievement.levelOrder || "-"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Unit {achievement.unitOrder || "-"}:{" "}
                    {achievement.title || "Untitled Unit"}
                  </p>
                </div>
                {achievement.achieved ? (
                  <AchievementTick />
                ) : (
                  <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
              </motion.article>
            ))}

            <button
              onClick={onViewAll}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted/50 dark:hover:bg-muted/20"
            >
              View all achievements
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
