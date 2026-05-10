"use client";

import { CheckCircle2 } from "lucide-react";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import {
  fetchGamificationDailyQuest,
  fetchUserDailyQuest,
} from "@/services/api";
import { buildApiUrl } from "@/lib/api-config";

const toTitleCase = (key = "") =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

const toMediaUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return buildApiUrl(url);
};

const questAliases = {
  lessonWithNoMistake: ["lessonWithNoMistake", "noMistakes"],
  scoreHighPoints: ["scoreHighPoints", "highScore", "scoreEightyPlus"],
  shareTheApp: ["shareTheApp", "shareApp"],
  spendDatesForLives: ["spendDatesForLives", "spendDates"],
  completeLessonsToday: ["completeLessonsToday", "completeLessons"],
  earnInjazToday: ["earnInjazToday", "earnInjaz"],
};

const resolveQuestAliases = (questId = "") => {
  if (!questId) return [];
  const explicit = questAliases[questId] || [];
  const fromGroup = Object.values(questAliases).find((aliases) =>
    aliases.includes(questId),
  );
  return Array.from(new Set([questId, ...explicit, ...(fromGroup || [])]));
};

const getMatchingQuestConfig = (challengeId, globalQuests) => {
  const aliases = resolveQuestAliases(challengeId);
  return globalQuests.find((quest) => {
    const questKey = quest?.key || "";
    if (!questKey) return false;
    if (questKey === challengeId) return true;
    return aliases.includes(questKey);
  });
};

const getMatchingChallengeStatus = (questKey, challengeStatuses) => {
  const aliases = resolveQuestAliases(questKey);
  return challengeStatuses.find((item) => {
    const challengeId = item?.challengeId || "";
    if (!challengeId) return false;
    if (challengeId === questKey) return true;
    return aliases.includes(challengeId);
  });
};

export function DailyQuests() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [completedQuests, setCompletedQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDailyQuests = useCallback(async () => {
    if (status === "loading") return;

    if (!isSessionValid(session)) {
      setIsLoading(false);
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [globalResult, userQuestResult] = await Promise.all([
        fetchGamificationDailyQuest(token),
        fetchUserDailyQuest(token),
      ]);

      if (!globalResult.success || !userQuestResult.success) {
        setCompletedQuests([]);
        return;
      }

      const globalQuests = Array.isArray(globalResult.dailyQuest)
        ? globalResult.dailyQuest
        : [];
      const challengeStatuses = Array.isArray(
        userQuestResult.dailyQuest?.challengeStatuses,
      )
        ? userQuestResult.dailyQuest.challengeStatuses
        : [];

      const quests = challengeStatuses.map((statusEntry) => {
        const questKey = statusEntry?.challengeId || "";
        const questConfig = getMatchingQuestConfig(questKey, globalQuests);
        const statusValue = (statusEntry?.status || "pending").toLowerCase();

        return {
          key: questKey,
          label: questConfig?.name
            ? questConfig.name
            : questKey
              ? toTitleCase(questKey)
              : `Quest`,
          iconUrl: toMediaUrl(
            questConfig?.icon?.url || questConfig?.icon || "",
          ),
          current: Number(statusEntry?.details?.current) || 0,
          target: Number(statusEntry?.details?.required) || 0,
          reward: Number(statusEntry?.details?.reward) || 0,
          status: statusValue,
        };
      });

      setCompletedQuests(quests);
    } catch (error) {
      console.error("Error loading daily quests:", error);
      setCompletedQuests([]);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    loadDailyQuests();
  }, [loadDailyQuests]);

  const menuOptions = [
    {
      label: "View Challenges",
      onClick: () => router.push("/challenge?tab=target"),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Daily Quests</h2>
            <p className="text-xs text-muted-foreground">
              Complete tasks to earn rewards
            </p>
          </div>
          <CardMenuOptions options={menuOptions} />
        </div>
        <div className="text-xs text-muted-foreground">Loading quests...</div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Daily Quests</h2>
          <p className="text-xs text-muted-foreground">
            Complete tasks to earn rewards
          </p>
        </div>
        <CardMenuOptions options={menuOptions} />
      </div>
      <ul className="space-y-2">
        {completedQuests.length === 0 ? (
          <li className="text-xs text-muted-foreground">
            No completed quests yet
          </li>
        ) : (
          completedQuests.map((quest, index) => (
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={quest.key}
              className="flex items-center justify-between bg-muted/20 rounded-md p-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  {quest.iconUrl && (
                    <img
                      src={quest.iconUrl}
                      alt={quest.label}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                </div>
                <span>{quest.label}</span>
              </div>
              <CheckCircle2 className="text-accent" />
            </motion.li>
          ))
        )}
      </ul>
    </div>
  );
}
