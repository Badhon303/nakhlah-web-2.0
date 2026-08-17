"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useBadgesStore } from "@/stores/useBadgesStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { Button } from "@/components/ui/button";
import BadgeSection from "./BadgeSection";
import { BadgeListSkeleton } from "../components/ChallengeSkeletons";
import { ChallengeEmptyState } from "../components/ChallengeEmptyState";

const toTitleCase = (key = "") =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

export default function BadgesList() {
  const { data: session, status } = useSession();

  const badgeDictionary = useBadgesStore((store) => store.badges);
  const isBadgesLoading = useBadgesStore((store) => store.isLoading);
  const badgesError = useBadgesStore((store) => store.error);
  const fetchBadges = useBadgesStore((store) => store.fetchBadges);
  const clearBadges = useBadgesStore((store) => store.clear);

  const profile = useProfileStore((store) => store.profile);
  const isProfileLoading = useProfileStore((store) => store.isLoading);
  const fetchProfile = useProfileStore((store) => store.fetchMyProfile);

  useEffect(() => {
    if (status === "loading") return;

    if (!isSessionValid(session)) {
      clearBadges();
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      clearBadges();
      return;
    }

    const userKey = getUserKey(session);
    void fetchBadges({ token, userKey });
    void fetchProfile(token, false, userKey);
  }, [clearBadges, fetchBadges, fetchProfile, session, status]);

  const reload = () => {
    const token = getSessionToken(session);
    if (!token) return;
    const userKey = getUserKey(session);
    void fetchBadges({ token, userKey, forceRefresh: true });
    void fetchProfile(token, true, userKey);
  };

  const currentInjaz = useMemo(() => {
    const resolved = Number(profile?.gamificationStock?.injazStock);
    return Number.isFinite(resolved) ? resolved : 0;
  }, [profile]);

  // The API only exposes an Injaz target per badge, so "earned" is derived from
  // the learner's current Injaz stock.
  const { earnedBadges, lockedBadges } = useMemo(() => {
    const normalized = (badgeDictionary || []).map((badge) => {
      const injazTarget = Number(badge.target) || 0;
      return {
        key: badge.key,
        title: badge.name || toTitleCase(badge.key || "Badge"),
        icon: badge.icon,
        injazTarget,
        earned: currentInjaz >= injazTarget,
      };
    });

    return {
      earnedBadges: normalized
        .filter((badge) => badge.earned)
        .sort((a, b) => b.injazTarget - a.injazTarget),
      lockedBadges: normalized
        .filter((badge) => !badge.earned)
        .sort((a, b) => a.injazTarget - b.injazTarget),
    };
  }, [badgeDictionary, currentInjaz]);

  const isLoading =
    (isBadgesLoading || isProfileLoading) && !badgeDictionary.length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <BadgeListSkeleton rows={3} />
        <BadgeListSkeleton rows={4} />
      </div>
    );
  }

  if (badgesError && !badgeDictionary.length) {
    return (
      <ChallengeEmptyState
        title="We couldn't load your badges"
        description={badgesError}
        action={
          <Button size="sm" onClick={reload}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!badgeDictionary.length) {
    return (
      <ChallengeEmptyState
        title="No badges yet!"
        description="Badges appear here once they are set up. Keep learning to earn Injaz."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <span className="text-sm text-muted-foreground">Your Injaz</span>
        <span className="text-base font-bold text-accent">
          {currentInjaz.toLocaleString()}
        </span>
      </div>

      {earnedBadges.length ? (
        <BadgeSection
          title="Earned"
          description="Badges you have already unlocked."
          badges={earnedBadges}
          currentInjaz={currentInjaz}
        />
      ) : (
        <ChallengeEmptyState
          title="No earned badges yet!"
          description="Complete lessons and daily challenges to earn Injaz and unlock your first badge."
        />
      )}

      {lockedBadges.length ? (
        <BadgeSection
          title="All Badges"
          description="Reach the Injaz target to unlock these."
          badges={lockedBadges}
          currentInjaz={currentInjaz}
        />
      ) : null}
    </div>
  );
}
