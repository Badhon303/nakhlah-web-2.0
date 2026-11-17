import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import MissionSection from "./MissionSection";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDailyQuestStore } from "@/stores/useDailyQuestStore";

export default function DailyMissions() {
  const { data: session, status } = useSession();
  const missions = useDailyQuestStore((store) => store.challengeDailyMissions);
  const isLoading = useDailyQuestStore((store) => store.isLoading);
  const loadError = useDailyQuestStore((store) => store.error);
  const fetchDailyQuests = useDailyQuestStore(
    (store) => store.fetchDailyQuests,
  );
  const clearDailyQuests = useDailyQuestStore((store) => store.clear);

  useEffect(() => {
    if (status === "loading") return;

    if (!isSessionValid(session)) {
      clearDailyQuests();
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      clearDailyQuests();
      return;
    }

    fetchDailyQuests({ token, userKey: getUserKey(session) });
  }, [clearDailyQuests, fetchDailyQuests, session, status]);

  const { todaysMissions, otherMissions } = useMemo(
    () => ({
      todaysMissions: missions.filter((mission) => mission.active !== false),
      otherMissions: missions.filter((mission) => mission.active === false),
    }),
    [missions],
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={`mission-skeleton-${index}`}
            className="h-20 rounded-2xl border border-border bg-card animate-pulse"
          />
        ))}
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

  if (!missions.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
        No daily quests configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {todaysMissions.length ? (
        <MissionSection
          title="Daily Missions"
          emoji="🎯"
          missions={todaysMissions}
        />
      ) : null}
      {otherMissions.length ? (
        <MissionSection
          title="Other Challenges"
          description="Not part of today's rotation — they may show up on another day."
          missions={otherMissions}
        />
      ) : null}
    </div>
  );
}
