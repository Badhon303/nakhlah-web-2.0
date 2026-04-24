import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import MissionSection from "./MissionSection";
import {
  fetchGamificationDailyQuest,
  fetchUserDailyQuest,
} from "@/services/api";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";

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

  useEffect(() => {
    const loadDailyQuests = async () => {
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

        const [globalResult, currentResult] = await Promise.all([
          fetchGamificationDailyQuest(token),
          fetchUserDailyQuest(token),
        ]);

        if (!globalResult.success) {
          throw new Error(globalResult.error || "Failed to load daily quests.");
        }

        if (!currentResult.success) {
          throw new Error(
            currentResult.error ||
              "Failed to load current daily quest progress.",
          );
        }

        const globalQuests = Array.isArray(globalResult.dailyQuest)
          ? globalResult.dailyQuest
          : [];
        const rawStatuses = currentResult.dailyQuest?.challengeStatuses;
        const statusByKey = new Map();
        const fallbackStatuses = Array.isArray(rawStatuses) ? rawStatuses : [];

        if (Array.isArray(rawStatuses)) {
          rawStatuses.forEach((status, index) => {
            const key =
              status?.key ||
              status?.challengeKey ||
              status?.questKey ||
              globalQuests[index]?.key ||
              `daily-${index + 1}`;
            statusByKey.set(key, status || {});
          });
        } else if (rawStatuses && typeof rawStatuses === "object") {
          Object.entries(rawStatuses).forEach(([key, status]) => {
            statusByKey.set(key, status || {});
          });
        }

        const normalized = globalQuests.map((quest, index) => {
          const questKey = quest.key || `daily-${index + 1}`;
          const status =
            statusByKey.get(questKey) || fallbackStatuses[index] || {};
          const details = status?.details || {};

          return {
            key: questKey,
            label: quest.name
              ? quest.name
              : quest.key
                ? toTitleCase(quest.key)
                : defaultLabels[index] || `Mission ${index + 1}`,
            current: Number(details.current) || 0,
            target: Number(details.required) || Number(quest.required) || 0,
            reward: Number(details.reward) || Number(quest.reward) || 0,
            status: status?.status || "pending",
            iconUrl: quest.icon?.url || quest.icon || "",
            type: "daily",
          };
        });

        setDailyMissions(normalized);
      } catch (error) {
        setLoadError(error?.message || "Unable to load daily quests.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyQuests();
  }, [session, status]);

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
