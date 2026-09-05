import { Medal } from "@/components/icons/Medal";
import AchievementTick from "@/components/icons/AchievementTick";
import { motion } from "framer-motion";
import { ChevronLeft, Lock } from "lucide-react";
import { useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!API_URL) return url;
  return `${API_URL}${url}`;
};

export default function AllAchievementsPage({
  onBack,
  achievements = [],
  isLoading = false,
}) {
  const groupedAchievements = useMemo(() => {
    const groups = achievements.reduce((acc, item) => {
      const level = Number(item?.levelOrder) || 0;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(item);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([level, items]) => ({
        level: Number(level),
        items: [...items].sort(
          (a, b) => (a.unitOrder || 0) - (b.unitOrder || 0),
        ),
      }))
      .sort((a, b) => a.level - b.level);
  }, [achievements]);

  const unlockedCount = achievements.filter((item) => item.achieved).length;
  const inProgressCount = Math.max(achievements.length - unlockedCount, 0);

  return (
    <div className="container px-4 mx-auto max-w-4xl py-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-accent/20 lg:bg-card lg:shadow-sm"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-border px-5 py-6 text-foreground sm:px-7">
          <div className="absolute -right-14 -top-20 h-44 w-44 rounded-full border-[28px] border-white/10" />
          <div className="relative flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted/50 dark:hover:bg-muted/20"
              aria-label="Back to profile"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold text-foreground">
                All achievements
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {unlockedCount} unlocked · {inProgressCount} in progress
              </p>
            </div>
            <Medal size="lg" className="hidden shrink-0 text-accent sm:block" />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`achievement-skeleton-${index}`}
                  className="h-24 animate-pulse rounded-2xl border border-border bg-muted/50"
                />
              ))}
            </div>
          ) : !groupedAchievements.length ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No achievements available yet.
            </div>
          ) : (
            <div className="space-y-7">
              {groupedAchievements.map((group) => (
                <section key={`level-${group.level}`}>
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <h2 className="text-base font-extrabold text-foreground">
                      Level {group.level || "-"}
                    </h2>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {group.items.filter((item) => item.achieved).length}/
                      {group.items.length} unlocked
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-none border-x-0 border-y divide-y divide-border lg:rounded-2xl lg:border">
                    {group.items.map((achievement, index) => {
                      const isUnlocked = Boolean(achievement.achieved);
                      return (
                        <motion.article
                          key={
                            achievement.id ||
                            `${achievement.achievementTitle}-${index}`
                          }
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * index, duration: 0.25 }}
                          className="group relative flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/20 sm:p-5"
                        >
                          {isUnlocked ? (
                            <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
                          ) : null}
                          <div
                            className={`shrink-0 transition-transform group-hover:scale-105 ${!isUnlocked ? "opacity-60 grayscale" : ""}`}
                          >
                            {achievement.unitIcon ? (
                              <img
                                src={getMediaUrl(
                                  achievement.unitIcon?.url ||
                                    achievement.unitIcon,
                                )}
                                alt={achievement.title || "Unit icon"}
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                            ) : (
                              <Medal size="lg" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-extrabold text-foreground">
                                {achievement.achievementTitle || "Achievement"}
                              </h3>
                              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                Unit {achievement.unitOrder || "-"}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {achievement.title || "Untitled Unit"}
                            </p>
                            {achievement.unitDescription ? (
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                {achievement.unitDescription}
                              </p>
                            ) : null}
                          </div>

                          {isUnlocked ? (
                            <AchievementTick />
                          ) : (
                            <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                          )}
                        </motion.article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
