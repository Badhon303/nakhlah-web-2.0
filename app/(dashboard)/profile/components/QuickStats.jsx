"use client";
import { motion } from "framer-motion";
import { Calendar } from "@/components/icons/Calendar";
import { Bullseye } from "@/components/icons/BullsEye";
import { StreakIcon } from "@/components/icons/PublicAssetIcons";
import { getLongestStreak } from "@/lib/gamification";
import { getCurrentStreakCount, getMissedDaysCount } from "@/lib/streakUtils";

export default function QuickStats({ profileData }) {
  const currentStreak = getCurrentStreakCount(profileData?.learnerStreak);
  const longestStreak = getLongestStreak(profileData);
  const missedDays = getMissedDaysCount(profileData?.learnerStreak);
  const badgesUnlocked = Array.isArray(profileData?.gamificationStock?.badges)
    ? profileData.gamificationStock.badges.length
    : 0;

  const quickStats = [
    {
      label: "Current Streak",
      value: `${currentStreak} day${currentStreak === 1 ? "" : "s"}`,
      icon: StreakIcon,
    },
    {
      label: "Longest Streak",
      value: `${longestStreak} day${longestStreak === 1 ? "" : "s"}`,
      icon: Bullseye,
    },
    {
      label: "Missed Days",
      value: `${missedDays}`,
      icon: Calendar,
    },
    // {
    //   label: "Badges Unlocked",
    //   value: `${badgesUnlocked}`,
    //   icon: Award,
    //   color: "text-accent",
    // },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-2xl lg:border lg:border-accent/20 lg:bg-card lg:shadow-sm"
    >
      <div className="border-b border-border px-5 py-4 text-foreground">
        <h3 className="text-xl font-extrabold text-foreground">
          Streak overview
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your consistency across recent learning days.
        </p>
      </div>

      <div className="space-y-2">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-transparent p-3.5 transition-colors hover:bg-muted/50 dark:hover:bg-muted/20"
            >
              <div className="flex min-w-0 items-center gap-3">
                <IconComponent size="md" className="shrink-0 text-accent" />
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <span className="shrink-0 text-sm font-extrabold text-foreground">
                {stat.value}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
