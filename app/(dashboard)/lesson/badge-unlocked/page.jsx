"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Medal } from "@/components/icons/Medal";
import Confetti from "@/components/nakhlah/Confetti";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { getMediaUrl } from "@/app/(dashboard)/lesson/utils/mediaUtils";
import { useBadgesStore } from "@/stores/useBadgesStore";
import {
  clearUnlockedBadgeKeys,
  readUnlockedBadgeKeys,
  toBadgeTitle,
} from "@/lib/lessonUnlockedBadges";

export default function BadgeUnlocked() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const badgeDictionary = useBadgesStore((state) => state.badges);
  const fetchBadges = useBadgesStore((state) => state.fetchBadges);
  const [unlockedKeys] = useState(() => readUnlockedBadgeKeys());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!unlockedKeys.length) {
      router.replace("/lesson/daily-mission");
    }
  }, [router, unlockedKeys.length]);

  useEffect(() => {
    const loadBadges = async () => {
      if (status === "loading") return;
      if (!isSessionValid(session)) return;

      const token = getSessionToken(session);
      if (!token) return;

      await fetchBadges({ token, userKey: getUserKey(session) });
    };

    loadBadges();
  }, [fetchBadges, session, status]);

  useEffect(() => {
    setShowConfetti(true);
    const timeoutId = window.setTimeout(() => setShowConfetti(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [currentIndex]);

  const unlockedBadges = useMemo(() => {
    const catalogByKey = new Map(
      (badgeDictionary || []).map((badge) => [String(badge.key || ""), badge]),
    );

    return unlockedKeys.map((key) => {
      const catalogBadge = catalogByKey.get(key);
      const target = Number(catalogBadge?.target) || 0;

      return {
        key,
        title: catalogBadge?.name || toBadgeTitle(key),
        iconUrl: getMediaUrl(catalogBadge?.icon?.url || catalogBadge?.icon),
        target,
        description: target
          ? `You reached ${target.toLocaleString()} Injaz and unlocked this badge.`
          : "A new badge has been added to your collection.",
      };
    });
  }, [badgeDictionary, unlockedKeys]);

  const currentBadge = unlockedBadges[currentIndex];
  const isLastBadge = currentIndex >= unlockedBadges.length - 1;

  const goToDailyMission = () => {
    clearUnlockedBadgeKeys();
    router.push("/lesson/daily-mission");
  };

  const handleContinue = () => {
    if (!isLastBadge) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    goToDailyMission();
  };

  if (!unlockedKeys.length || !currentBadge) {
    return (
      <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background" />
    );
  }

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Confetti key={currentBadge.key} active={showConfetti} />

      <div className="w-full max-w-lg mx-auto text-center flex-1 flex flex-col justify-center">
        <motion.div
          key={currentBadge.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent lg:bg-card rounded-none lg:rounded-3xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="mb-6"
          >
            <div className="relative inline-flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.25, 0.55, 0.25],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-full bg-accent/40 blur-3xl"
              />
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-accent/30 bg-white shadow-lg">
                {currentBadge.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentBadge.iconUrl}
                    alt={currentBadge.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Medal size="xxl" />
                )}
              </div>
            </div>
          </motion.div>

          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-accent"
          >
            {unlockedBadges.length > 1
              ? `Badge ${currentIndex + 1} of ${unlockedBadges.length}`
              : "New badge"}
          </motion.p> */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-3 text-3xl font-extrabold text-accent md:text-4xl"
          >
            Badge unlocked!
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-3 text-2xl font-extrabold text-foreground"
          >
            {currentBadge.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mx-auto mb-8 max-w-sm text-muted-foreground"
          >
            {currentBadge.description}
          </motion.p>

          {currentBadge.target > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-8 px-4 sm:px-0"
            >
              <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border-2 border-amber-400">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 py-3">
                  <p className="text-center text-lg font-bold text-white">
                    Total Injaz Earned
                  </p>
                </div>
                <div className="bg-white py-5">
                  <p className="text-3xl font-extrabold text-slate-800">
                    {currentBadge.target.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="hidden sm:block"
          >
            <Button
              onClick={handleContinue}
              className="h-14 w-full rounded-xl bg-accent text-lg font-bold text-accent-foreground hover:opacity-90"
            >
              CONTINUE
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-lg border-t border-border bg-background p-4 sm:hidden">
        <Button
          onClick={handleContinue}
          className="h-12 w-full rounded-xl bg-accent text-lg font-bold text-accent-foreground hover:opacity-90"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
}
