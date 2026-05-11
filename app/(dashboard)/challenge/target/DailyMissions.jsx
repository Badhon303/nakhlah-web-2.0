import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import MissionSection from "./MissionSection";
import {
  fetchGamificationDailyQuest,
  fetchUserDailyQuest,
} from "@/services/api";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import {
  getDailyQuestUserKey,
  getCachedDailyQuestBundle,
  onDailyQuestStatusChanged,
  setCachedDailyQuestBundle,
} from "@/lib/dailyQuestCache";

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

  const loadDailyQuests = useCallback(
    async (forceRefresh = false) => {
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

      const userKey = getDailyQuestUserKey(session);

      const mapDailyMissions = (globalQuests = [], challengeStatuses = []) => {
        const normalized = globalQuests.map((quest, index) => {
          const questKey = quest.key || `daily-${index + 1}`;
          const statusEntry = getMatchingChallengeStatus(
            questKey,
            challengeStatuses,
          );
          const questConfig =
            getMatchingQuestConfig(questKey, globalQuests) || quest;
          const statusValue = (statusEntry?.status || "pending").toLowerCase();
          const current = Number(statusEntry?.details?.current) || 0;
          const target =
            Number(statusEntry?.details?.required) ||
            Number(questConfig?.required) ||
            0;

          return {
            key: questKey,
            label: questConfig?.name
              ? questConfig.name
              : questKey
                ? toTitleCase(questKey)
                : defaultLabels[index] || `Mission ${index + 1}`,
            current,
            target,
            reward:
              Number(statusEntry?.details?.reward) ||
              Number(questConfig?.reward) ||
              0,
            status: statusValue,
            iconUrl: questConfig?.icon?.url || questConfig?.icon || "",
            type: "daily",
            active: Boolean(statusEntry),
          };
        });

        normalized.sort((a, b) => {
          const aActive = a.active ? 1 : 0;
          const bActive = b.active ? 1 : 0;
          return bActive - aActive;
        });

        return normalized;
      };

      if (!forceRefresh) {
        const cachedBundle = getCachedDailyQuestBundle(userKey);
        if (cachedBundle) {
          setDailyMissions(
            mapDailyMissions(
              Array.isArray(cachedBundle?.globalQuests)
                ? cachedBundle.globalQuests
                : [],
              Array.isArray(cachedBundle?.challengeStatuses)
                ? cachedBundle.challengeStatuses
                : [],
            ),
          );
          setIsLoading(false);
          return;
        }
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
            userQuestResult.error ||
              "Failed to load current daily quest status.",
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

        const normalized = mapDailyMissions(globalQuests, challengeStatuses);

        setDailyMissions(normalized);
        setCachedDailyQuestBundle(userKey, { globalQuests, challengeStatuses });
      } catch (error) {
        setLoadError(error?.message || "Unable to load daily quests.");
      } finally {
        setIsLoading(false);
      }
    },
    [session, status],
  );

  useEffect(() => {
    loadDailyQuests();
  }, [loadDailyQuests]);

  useEffect(() => {
    return onDailyQuestStatusChanged((event) => {
      const changedUserKey = event?.detail?.userKey;
      const currentUserKey = getDailyQuestUserKey(session);

      if (changedUserKey && changedUserKey !== currentUserKey) return;
      loadDailyQuests(true);
    });
  }, [loadDailyQuests, session]);

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
        <MissionSection key={section.type} section={section} />
      ))}
    </div>
  );
}
