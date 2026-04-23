"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HighVoltage } from "@/components/icons/High-Voltage";
import { GemStone } from "@/components/icons/Gem";
import { Bullseye } from "@/components/icons/BullsEye";
import { Flame } from "@/components/icons/Flame";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  fetchGamificationDailyQuest,
  fetchUserDailyQuest,
} from "@/services/api";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";

const defaultMissionLabels = [
  "Complete daily challenge",
  "Practice streak target",
  "Score goal challenge",
  "Bonus challenge",
];
const missionIcons = [HighVoltage, GemStone, Bullseye, Flame];

const toTitleCase = (value = "") =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

export default function DailyMissionUpdate() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dailyQuestState, setDailyQuestState] = useState([]);
  const [injazReward, setInjazReward] = useState(0);
  const [rewardBadges, setRewardBadges] = useState([]);

  useEffect(() => {
    const loadDailyMission = async () => {
      if (status === "loading") return;

      if (!isSessionValid(session)) {
        setLoadError("Please login to view daily missions.");
        setIsLoading(false);
        return;
      }

      const token = getSessionToken(session);
      if (!token) {
        setLoadError("No authentication token available.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");

        const [currentResult, globalResult] = await Promise.all([
          fetchUserDailyQuest(token),
          fetchGamificationDailyQuest(token),
        ]);

        if (!currentResult.success) {
          throw new Error(
            currentResult.error || "Failed to load daily mission progress.",
          );
        }

        const currentStatuses = Array.isArray(
          currentResult.dailyQuest?.challengeStatuses,
        )
          ? currentResult.dailyQuest.challengeStatuses
          : [];

        const globalDailyQuest = Array.isArray(globalResult?.dailyQuest)
          ? globalResult.dailyQuest
          : [];

        const merged = currentStatuses.map((item, index) => {
          const details = item?.details || {};
          const globalQuest = globalDailyQuest[index] || {};
          const IconComponent = missionIcons[index % missionIcons.length];

          return {
            key: globalQuest?.key || `daily-${index + 1}`,
            label:
              (globalQuest?.key && toTitleCase(globalQuest.key)) ||
              defaultMissionLabels[index] ||
              `Mission ${index + 1}`,
            current: Number(details.current) || 0,
            target:
              Number(details.required) || Number(globalQuest?.required) || 0,
            reward: Number(details.reward) || Number(globalQuest?.reward) || 0,
            status: item?.status || "pending",
            IconComponent,
          };
        });

        setDailyQuestState(merged);
        setInjazReward(Number(currentResult.dailyQuest?.injazReward) || 0);
        setRewardBadges(
          Array.isArray(currentResult.dailyQuest?.badges)
            ? currentResult.dailyQuest.badges
            : [],
        );
      } catch (error) {
        setLoadError(
          error?.message || "Unable to load daily mission progress.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyMission();
  }, [session, status]);

  const missions = useMemo(() => dailyQuestState, [dailyQuestState]);

  const handleContinue = () => {
    router.push("/lesson/streak-update");
  };

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent lg:bg-card rounded-none lg:rounded-3xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-accent mb-2">
              Daily mission updated!
            </h1>
            {(injazReward > 0 || rewardBadges.length > 0) && (
              <p className="text-sm text-muted-foreground">
                {injazReward > 0 &&
                  `Injaz reward: ${injazReward.toLocaleString()}`}
                {injazReward > 0 && rewardBadges.length > 0 && " • "}
                {rewardBadges.length > 0 && `Badges: ${rewardBadges.length}`}
              </p>
            )}
          </motion.div>

          {/* Mission Cards */}
          <div className="space-y-4 mb-8">
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`mission-skeleton-${i}`}
                    className="border border-accent/20 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-muted animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                        <div className="w-full h-2 bg-muted animate-pulse rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            {!isLoading && loadError ? (
              <div className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive">
                {loadError}
              </div>
            ) : null}

            {!isLoading && !loadError && !missions.length ? (
              <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                No daily mission available for now.
              </div>
            ) : null}

            {missions.map((mission, index) => {
              const safeTarget = mission.target > 0 ? mission.target : 1;
              const progress = (mission.current / safeTarget) * 100;
              const IconComponent = mission.IconComponent;

              return (
                <motion.div
                  key={mission.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-transparent border border-accent/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <IconComponent size="md" className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-foreground">
                          {mission.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mission.current} / {mission.target}
                        </p>
                      </div>
                      <p className="text-xs text-left text-muted-foreground mb-2">
                        Status: {mission.status} • Reward:{" "}
                        {mission.reward.toLocaleString()} Injaz
                      </p>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            duration: 0.8,
                          }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden sm:block"
          >
            <Button
              onClick={handleContinue}
              className="w-full h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
            >
              CONTINUE
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile bottom action */}
      <div className="w-full max-w-lg mx-auto sm:hidden bg-background border-t border-border p-4">
        <Button
          onClick={handleContinue}
          className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
}
