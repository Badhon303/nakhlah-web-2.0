"use client";
import { BarChart } from "@/components/icons/BarChart";
import { Bullseye } from "@/components/icons/BullsEye";
import { Calendar } from "@/components/icons/Calendar";
import {
  DatesIcon,
  InjazStarIcon,
  StreakIcon,
} from "@/components/icons/PublicAssetIcons";
import { Medal } from "@/components/icons/Medal";
import { motion } from "framer-motion";
import { getProfileBadgeCount } from "@/lib/gamification";

export default function StatisticsGrid({ profileData, achievementsData = [] }) {
  const totalDates = profileData?.gamificationStock?.dateStock ?? 0;
  const totalXp = profileData?.gamificationStock?.injazStock ?? 0;
  const tasksCompleted =
    profileData?.dailyChallengeActivity?.tasksCompleted ?? 0;
  const lessonsCompleted =
    profileData?.dailyChallengeActivity?.lessonsCompleted ?? 0;
  const achievementsUnlocked = Array.isArray(achievementsData)
    ? achievementsData.filter((achievement) => achievement?.achieved).length
    : 0;
  const badgesEarned = getProfileBadgeCount(profileData);

  const userStats = [
    {
      icon: StreakIcon,
      value: `${tasksCompleted}`,
      label: "Tasks Completed Today",
    },
    {
      icon: Calendar,
      value: `${lessonsCompleted}`,
      label: "Lessons Completed Today",
    },
    {
      icon: DatesIcon,
      value: totalDates.toLocaleString(),
      label: "Total Dates",
    },
    {
      icon: InjazStarIcon,
      value: totalXp.toLocaleString(),
      label: "Total Injaz Gained",
    },
    {
      icon: Bullseye,
      value: `${achievementsUnlocked}`,
      label: "Achievements Unlocked",
    },
    {
      icon: Medal,
      value: `${badgesEarned}`,
      label: "Badges Earned",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-accent/20 lg:bg-card lg:shadow-sm"
    >
      <div className="flex items-center justify-between gap-5 border-b border-border px-5 py-5 text-foreground sm:px-7">
        <div>
          <h3 className="text-xl font-extrabold text-foreground">
            Your statistics
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A clear view of what you have accomplished so far.
          </p>
        </div>
        {/* <BarChart size="lg" className="shrink-0 text-white" /> */}
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3">
        {userStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              className="group min-h-40 bg-transparent p-5 transition-colors hover:bg-muted/50 dark:hover:bg-muted/20 lg:bg-card sm:p-6"
            >
              <IconComponent
                size="lg"
                className="text-accent transition-transform group-hover:scale-105"
              />
              <p className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium leading-5 text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
