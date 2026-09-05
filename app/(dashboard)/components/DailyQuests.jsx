"use client";

import { CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDailyQuestStore } from "@/stores/useDailyQuestStore";

const isQuestCompleted = (quest) => {
  const completedByStatus = (quest?.status || "").toLowerCase() === "completed";
  const completedByProgress =
    Number(quest?.target) > 0 &&
    Number(quest?.current) >= Number(quest?.target);
  return completedByStatus || completedByProgress;
};

export function DailyQuests({ variant = "home" }) {
  const router = useRouter();
  const isProfileVariant = variant === "profile";
  const { data: session, status } = useSession();
  const dailyQuests = useDailyQuestStore((store) => store.homeDailyQuests);
  const isLoading = useDailyQuestStore((store) => store.isLoading);
  const fetchDailyQuests = useDailyQuestStore(
    (store) => store.fetchDailyQuests,
  );
  const claimQuestIfAvailable = useDailyQuestStore(
    (store) => store.claimQuestIfAvailable,
  );
  const clearDailyQuests = useDailyQuestStore((store) => store.clear);
  const [claimingQuestKey, setClaimingQuestKey] = useState(null);
  const lastUserKeyRef = useRef(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!isSessionValid(session)) {
      clearDailyQuests();
      lastUserKeyRef.current = null;
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      clearDailyQuests();
      return;
    }

    const userKey = getUserKey(session);
    if (lastUserKeyRef.current === userKey && dailyQuests.length > 0) return;
    lastUserKeyRef.current = userKey;

    fetchDailyQuests({ token, userKey });
  }, [clearDailyQuests, fetchDailyQuests, session, status]);

  const handleClaimQuest = async (quest) => {
    if (!quest) return;
    if (isQuestCompleted(quest)) return;

    const token = getSessionToken(session);
    if (!token) return;

    setClaimingQuestKey(quest.key);
    try {
      await claimQuestIfAvailable({
        token,
        userKey: getUserKey(session),
        questKey: quest.key,
      });
    } finally {
      await fetchDailyQuests({
        token,
        userKey: getUserKey(session),
        forceRefresh: true,
      });
      setClaimingQuestKey(null);
    }
  };

  const menuOptions = [
    {
      label: "View Challenges",
      onClick: () => router.push("/challenge?tab=target"),
    },
  ];

  if (isLoading) {
    return (
      <div
        className={
          isProfileVariant
            ? "overflow-hidden rounded-none border-0 bg-transparent shadow-none"
            : "p-4 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-sm"
        }
      >
        <div
          className={
            isProfileVariant
              ? "flex items-center justify-between border-b border-border px-5 py-4 text-foreground"
              : "flex items-center justify-between mb-4"
          }
        >
          <div>
            <h2
              className={`font-extrabold ${
                isProfileVariant
                  ? "text-xl text-foreground"
                  : "text-lg text-slate-900"
              }`}
            >
              Daily Quests
            </h2>
            <p
              className={`text-xs ${
                isProfileVariant ? "text-muted-foreground" : "text-slate-700"
              }`}
            >
              Complete tasks to earn rewards
            </p>
          </div>
          <CardMenuOptions
            options={menuOptions}
            className={
              isProfileVariant ? "text-foreground hover:bg-muted/50" : ""
            }
          />
        </div>
        <div
          className={`p-4 text-xs ${
            isProfileVariant ? "text-muted-foreground" : "text-slate-600"
          }`}
        >
          Loading quests...
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isProfileVariant
          ? "overflow-hidden rounded-none border-0 bg-transparent shadow-none"
          : "p-4 rounded-xl bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-sm"
      }
    >
      <div
        className={
          isProfileVariant
            ? "flex items-center justify-between border-b border-border px-5 py-4 text-foreground"
            : "flex items-center justify-between mb-4"
        }
      >
        <div>
          <h2
            className={`font-extrabold ${
              isProfileVariant
                ? "text-xl text-foreground"
                : "text-lg text-slate-900"
            }`}
          >
            Daily Quests
          </h2>
          <p
            className={`text-xs ${
              isProfileVariant ? "text-muted-foreground" : "text-slate-700"
            }`}
          >
            Complete tasks to earn rewards
          </p>
        </div>
        <CardMenuOptions
          options={menuOptions}
          className={
            isProfileVariant ? "text-foreground hover:bg-muted/50" : ""
          }
        />
      </div>
      <AnimatePresence initial={false}>
        <ul className={isProfileVariant ? "space-y-2" : "space-y-2"}>
          {dailyQuests.length === 0 ? (
            <li
              className={`p-4 text-xs ${
                isProfileVariant ? "text-muted-foreground" : "text-slate-700"
              }`}
            >
              No daily quests yet
            </li>
          ) : (
            dailyQuests.map((quest, index) => (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.05 }}
                key={quest.key}
                className={
                  isProfileVariant
                    ? "flex items-center justify-between gap-3 border-b border-border bg-transparent p-3.5"
                    : "flex items-center justify-between rounded-lg border border-white/30 bg-white/40 p-2"
                }
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {quest.iconUrl && (
                      <img
                        src={quest.iconUrl}
                        alt={quest.label}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                  </div>
                  <span
                    className={
                      isProfileVariant
                        ? "text-sm font-medium text-foreground"
                        : "text-slate-800"
                    }
                  >
                    {quest.label}
                  </span>
                </div>
                {isQuestCompleted(quest) ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaimQuest(quest);
                    }}
                    disabled={claimingQuestKey === quest.key}
                    className={`flex items-center justify-center disabled:opacity-50 ${
                      isProfileVariant
                        ? "text-muted-foreground hover:text-accent"
                        : "text-slate-500 hover:text-primary"
                    }`}
                    aria-label="Check progress"
                    title="Check progress"
                  >
                    {claimingQuestKey === quest.key ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                )}
              </motion.li>
            ))
          )}
        </ul>
      </AnimatePresence>
    </div>
  );
}
