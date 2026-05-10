import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import MissionSection from "./MissionSection";
import {
  claimUserDailyQuest,
  fetchGamificationDailyQuest,
  fetchUserDailyQuest,
} from "@/services/api";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import {
  DAILY_QUEST_PARAM_BASED_CHALLENGES,
  resolveDailyQuestClaimParam,
} from "@/lib/gamification";

const toTitleCase = (key = "") =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

const defaultLabels = [
  "Complete daily challenge",
  "Practice streak target",
  "Score goal challenge",
  "Bonus challenge",
];

const questAliases = {
  lessonWithNoMistake: ["lessonWithNoMistake", "noMistakes"],
  scoreHighPoints: ["scoreHighPoints", "highScore", "scoreEightyPlus"],
  shareTheApp: ["shareTheApp", "shareApp"],
  spendDatesForLives: ["spendDatesForLives", "spendDates"],
};

const resolveQuestAliases = (questId = "") => {
  if (!questId) return [];
  const explicit = questAliases[questId] || [];
  const fromGroup = Object.values(questAliases).find((aliases) =>
    aliases.includes(questId),
  );
  return Array.from(new Set([questId, ...explicit, ...(fromGroup || [])]));
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

const questSections = [
  {
    type: "daily",
    title: "Daily Quests",
    icon: "📅",
    description: "Reset every day",
  },
];

export default function DailyMissions() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dailyMissions, setDailyMissions] = useState([]);
  const [claimingMissionKey, setClaimingMissionKey] = useState("");

  const loadDailyQuests = useCallback(async () => {
    if (status === "loading") return;

    if (!isSessionValid(session)) {
      setIsLoading(false);
      setLoadError("Please login to view quests.");
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      setIsLoading(false);
      setLoadError("No authentication token available.");
      return;
    }

    try {
      setIsLoading(true);
      setLoadError("");

      const [globalResult, userQuestResult] = await Promise.all([
        fetchGamificationDailyQuest(token),
        fetchUserDailyQuest(token),
      ]);

      if (!globalResult.success) {
        throw new Error(globalResult.error || "Failed to load daily quests.");
      }

      if (!userQuestResult.success) {
        throw new Error(
          userQuestResult.error || "Failed to load current daily quest status.",
        );
      }

      const globalQuests = Array.isArray(globalResult.dailyQuest)
        ? globalResult.dailyQuest
        : [];
      const challengeStatuses = Array.isArray(
        userQuestResult.dailyQuest?.challengeStatuses,
      )
        ? userQuestResult.dailyQuest.challengeStatuses
        : [];

      const normalized = globalQuests.map((quest, index) => {
        const questKey = quest.key || `daily-${index + 1}`;
        const statusEntry = getMatchingChallengeStatus(
          questKey,
          challengeStatuses,
        );
        const current = Number(statusEntry?.details?.current) || 0;
        const target =
          Number(statusEntry?.details?.required) || Number(quest.required) || 0;
        const statusValue = statusEntry?.status || "pending";
        const isActive = Boolean(statusEntry);
        const claimQuestParam = resolveDailyQuestClaimParam(
          statusEntry?.challengeId || questKey,
        );
        const shouldUseQuestParam =
          DAILY_QUEST_PARAM_BASED_CHALLENGES.includes(claimQuestParam);

        return {
          key: questKey,
          label: quest.name
            ? quest.name
            : quest.key
              ? toTitleCase(quest.key)
              : defaultLabels[index] || `Mission ${index + 1}`,
          current,
          target,
          reward:
            Number(statusEntry?.details?.reward) || Number(quest.reward) || 0,
          status: statusValue,
          iconUrl: quest.icon?.url || quest.icon || "",
          type: "daily",
          active: isActive,
          claimable: isActive && statusValue === "completed",
          claimQuestParam,
          shouldUseQuestParam,
        };
      });

      setDailyMissions(normalized);
    } catch (error) {
      setLoadError(error?.message || "Unable to load daily quests.");
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    loadDailyQuests();
  }, [loadDailyQuests]);

  const handleClaimMission = async (mission) => {
    if (!mission?.claimable || claimingMissionKey) return;
    if (!isSessionValid(session)) {
      setLoadError("Please login to claim daily quests.");
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      setLoadError("No authentication token available.");
      return;
    }

    try {
      setClaimingMissionKey(mission.key || "");
      const questParam = mission.shouldUseQuestParam
        ? resolveDailyQuestClaimParam(mission.claimQuestParam)
        : undefined;
      const claimResult = await claimUserDailyQuest(token, questParam);

      if (!claimResult.success) {
        throw new Error(claimResult.error || "Failed to claim daily quest.");
      }

      await loadDailyQuests();
    } catch (error) {
      setLoadError(error?.message || "Unable to claim daily quest.");
    } finally {
      setClaimingMissionKey("");
    }
  };

  const sections = useMemo(() => {
    return questSections.map((section) => ({
      ...section,
      missions: dailyMissions.filter((m) => m.type === section.type),
    }));
  }, [dailyMissions]);

  const activeSections = sections.filter((s) => s.missions.length > 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
        Loading daily quests...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-destructive">
        {loadError}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {!activeSections.length && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
          No daily quests configured yet.
        </div>
      )}
      {activeSections.map((section) => (
        <MissionSection
          key={section.type}
          section={section}
          onClaimMission={handleClaimMission}
          claimingMissionKey={claimingMissionKey}
        />
      ))}
    </div>
  );
}
