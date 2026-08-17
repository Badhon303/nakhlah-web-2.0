"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";
import { useSession } from "@/lib/auth-client";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDailyQuestStore } from "@/stores/useDailyQuestStore";
import { useBadgesStore } from "@/stores/useBadgesStore";
import { useProfileStore } from "@/stores/useProfileStore";
import DailyMissions from "./target/DailyMissions";
import BadgesList from "./badges/BadgesList";

const tabs = [
  { id: "target", label: "Target" },
  { id: "badges", label: "Badges" },
];

export default function ChallengesHome() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    requestedTab === "badges" ? "badges" : "target",
  );

  const invalidateQuests = useDailyQuestStore((store) => store.invalidate);
  const fetchDailyQuests = useDailyQuestStore(
    (store) => store.fetchDailyQuests,
  );
  const invalidateBadges = useBadgesStore((store) => store.invalidate);
  const fetchBadges = useBadgesStore((store) => store.fetchBadges);
  const invalidateProfile = useProfileStore((store) => store.invalidate);
  const fetchProfile = useProfileStore((store) => store.fetchMyProfile);

  const handleRefresh = useCallback(() => {
    if (!isSessionValid(session)) return;

    const token = getSessionToken(session);
    if (!token) return;

    const userKey = getUserKey(session);
    invalidateQuests();
    invalidateBadges();
    invalidateProfile();

    void fetchDailyQuests({ token, userKey, forceRefresh: true });
    void fetchBadges({ token, userKey, forceRefresh: true });
    void fetchProfile(token, true, userKey);
  }, [
    fetchBadges,
    fetchDailyQuests,
    fetchProfile,
    invalidateBadges,
    invalidateProfile,
    invalidateQuests,
    session,
  ]);

  return (
    <div className="container mx-auto max-w-3xl px-4 pb-8 pt-4 lg:max-w-7xl lg:py-6">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-3 lg:max-w-sm"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full border-2 px-6 py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
                isActive
                  ? "border-accent bg-accent text-accent-foreground shadow-accent"
                  : "border-accent/40 bg-transparent text-accent hover:border-accent",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {activeTab === "target" ? <DailyMissions /> : <BadgesList />}
      </motion.div>
    </div>
  );
}
