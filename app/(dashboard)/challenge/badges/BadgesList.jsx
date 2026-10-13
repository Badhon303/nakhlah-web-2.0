"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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

const sortBadges = (badges, sort) =>
  [...badges].sort((a, b) => {
    if (sort === "injaz-desc") return b.injazTarget - a.injazTarget;
    if (sort === "az") return a.title.localeCompare(b.title);
    return a.injazTarget - b.injazTarget;
  });

export default function BadgesList() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("injaz-asc");

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
  const normalizedBadges = useMemo(
    () =>
      (badgeDictionary || []).map((badge) => {
        const injazTarget = Number(badge.target) || 0;
        return {
          key: badge.key,
          title: badge.name || toTitleCase(badge.key || "Badge"),
          icon: badge.icon,
          injazTarget,
          earned: currentInjaz >= injazTarget,
        };
      }),
    [badgeDictionary, currentInjaz],
  );

  const { earnedBadges, lockedBadges } = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = sortBadges(
      query
        ? normalizedBadges.filter((badge) =>
            badge.title.toLowerCase().includes(query),
          )
        : normalizedBadges,
      sort,
    );

    return {
      earnedBadges: filtered.filter((badge) => badge.earned),
      lockedBadges: filtered.filter((badge) => !badge.earned),
    };
  }, [normalizedBadges, search, sort]);

  const isSearching = search.trim().length > 0;
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
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Your current Activity Injaz
          </span>
          <span className="text-base font-bold text-accent">
            {currentInjaz.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <label className="relative min-w-0 flex-1 sm:max-w-xs">
            <span className="sr-only">Search badges</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search badges"
              className="h-11 w-full rounded-full border border-border bg-card pl-9 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none sm:h-10 sm:text-sm"
            />
          </label>

          <label className="sm:w-auto">
            <span className="sr-only">Sort badges</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 w-full rounded-full border border-border bg-card px-4 text-base text-muted-foreground focus:border-accent focus:outline-none sm:h-10 sm:w-auto sm:text-sm"
            >
              <option value="injaz-asc">Injaz (Low → High)</option>
              <option value="injaz-desc">Injaz (High → Low)</option>
              <option value="az">Title (A → Z)</option>
            </select>
          </label>
        </div>
      </div>

      {isSearching && !earnedBadges.length && !lockedBadges.length ? (
        <ChallengeEmptyState
          title="No badges found"
          description="Try a different search term."
        />
      ) : (
        <div className="space-y-10">
          {earnedBadges.length ? (
            <BadgeSection
              title="Earned"
              description="Badges you have already unlocked."
              badges={earnedBadges}
              currentInjaz={currentInjaz}
              variant="earned"
            />
          ) : isSearching ? null : (
            <ChallengeEmptyState
              title="No earned badges yet!"
              description="Complete lessons and daily challenges to earn Injaz and unlock your first badge."
            />
          )}

          {lockedBadges.length ? (
            <BadgeSection
              title="Locked"
              description="Reach the Injaz target to unlock these."
              badges={lockedBadges}
              currentInjaz={currentInjaz}
              variant="locked"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
