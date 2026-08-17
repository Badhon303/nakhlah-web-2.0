"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDailyQuestStore } from "@/stores/useDailyQuestStore";
import { Button } from "@/components/ui/button";
import MissionSection from "./MissionSection";
import { MissionListSkeleton } from "../components/ChallengeSkeletons";
import { ChallengeEmptyState } from "../components/ChallengeEmptyState";

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

  const reload = () => {
    const token = getSessionToken(session);
    if (!token) return;
    void fetchDailyQuests({
      token,
      userKey: getUserKey(session),
      forceRefresh: true,
    });
  };

  // The backend shuffles a few quests into today's rotation; those come back
  // with a status entry (active), the rest are shown as a greyed-out preview.
  const { todaysMissions, otherMissions } = useMemo(
    () => ({
      todaysMissions: missions.filter((mission) => mission.active !== false),
      otherMissions: missions.filter((mission) => mission.active === false),
    }),
    [missions],
  );

  if (isLoading && !missions.length) {
    return (
      <div className="space-y-8">
        <MissionListSkeleton rows={3} />
        <MissionListSkeleton rows={2} />
      </div>
    );
  }

  if (loadError && !missions.length) {
    return (
      <ChallengeEmptyState
        title="We couldn't load your challenges"
        description={loadError}
        action={
          <Button size="sm" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!missions.length) {
    return (
      <ChallengeEmptyState
        title="No challenges yet!"
        description="Daily challenges appear here once they are set up. Check back soon."
      />
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
      ) : (
        <ChallengeEmptyState
          title="Today's missions aren't ready"
          description="Your daily missions are still being picked. Pull up the menu to refresh."
        />
      )}

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
