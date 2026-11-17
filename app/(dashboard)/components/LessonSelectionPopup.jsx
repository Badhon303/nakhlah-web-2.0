"use client";

import { Lock } from "@/components/icons/Lock";
import { TreasureChest } from "@/components/icons/TreasureChest";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  fetchTaskLessons,
  claimGiftBoxTask,
  fetchJourneyStructure,
  makeLearnerProgress,
} from "@/services/api";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { hasOpenedGiftBox } from "@/lib/gamification";
import {
  finishJourneyLandOnNewGift,
  rememberJourneyScroll,
} from "@/lib/journeyScroll";
import { useDailyQuestStore } from "@/stores/useDailyQuestStore";
import { useLessonStore } from "@/stores/useLessonStore";
import { useJourneyStore } from "@/stores/useJourneyStore";
import { useProfileStore } from "@/stores/useProfileStore";

const JOURNEY_REFRESH_FLAG_KEY = "nakhlah:journey-needs-refresh";

const sortByOrder = (items, key) =>
  [...(items || [])].sort((a, b) => (a?.[key] || 0) - (b?.[key] || 0));

const getProgressLessonId = (docs) => {
  const sortedLessons = sortByOrder(docs, "lessonOrder");
  const activeLesson =
    sortedLessons.find((lesson) => lesson?.status !== "locked") ||
    sortedLessons[0];

  return activeLesson?.id || "";
};

const getOrderedJourneyTasks = (journeyData) => {
  const levels = sortByOrder(journeyData?.levels, "levelOrder");

  return levels.flatMap((level) => {
    const units = sortByOrder(level?.units, "unitOrder");

    return units.flatMap((unit) => sortByOrder(unit?.tasks, "taskOrder"));
  });
};

export function LessonSelectionPopup({
  taskId,
  isCompleted,
  isCurrent,
  isLocked,
  isTaskGiftBox,
  isGiftOpened = false,
  onClose,
  open,
}) {
  const router = useRouter();
  const setSelectedLesson = useLessonStore((state) => state.setSelectedLesson);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const profileData = useProfileStore((state) => state.profile);
  const giftOpenedOnOpen = Boolean(
    isTaskGiftBox &&
      (isGiftOpened || hasOpenedGiftBox(profileData, taskId)),
  );
  const openedOnMountRef = useRef(giftOpenedOnOpen);
  const [isGiftAlreadyOpened, setIsGiftAlreadyOpened] =
    useState(giftOpenedOnOpen);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(giftOpenedOnOpen);
  const [giftRewards, setGiftRewards] = useState(null);
  const giftClaimStartedRef = useRef(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!open || !taskId) return;

    if (isTaskGiftBox) {
      if (openedOnMountRef.current) {
        setIsLoading(false);
        setLoadError("");
        setIsGiftAlreadyOpened(true);
        setHasClaimed(true);
        setGiftRewards(null);
      }
      return;
    }

    const loadLessons = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        setIsGiftAlreadyOpened(false);
        setHasClaimed(false);
        setGiftRewards(null);
        giftClaimStartedRef.current = false;

        if (status === "loading") return;
        if (status === "unauthenticated" || !isSessionValid(session)) {
          throw new Error("Please login to view lessons.");
        }

        const token = getSessionToken(session);
        const result = await fetchTaskLessons(taskId, token);
        if (!result.success) {
          throw new Error(result.error || "Failed to load lessons");
        }

        const docs = Array.isArray(result.data?.docs) ? result.data.docs : [];
        const sortedLessons = sortByOrder(docs, "lessonOrder");

        const normalized = sortedLessons.map((lesson) => {
          const status = lesson?.status;

          return {
            id: lesson.id,
            title: lesson.title,
            status,
            isExam: Boolean(lesson.isExam),
            isGiftBox: Boolean(isTaskGiftBox),
            isCompleted: status === "completed",
            isCurrent: status === "inProgress",
            isLocked: status === "locked",
          };
        });

        setLessons(normalized);
      } catch (error) {
        setLoadError(error?.message || "Unable to load lessons");
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [open, session, status, taskId, isTaskGiftBox]);

  // ... keeping the rest the same up to the return
  const footerText = isLocked
    ? "Complete previous tasks to unlock"
    : isCompleted
      ? "All content is available to practice"
      : isCurrent
        ? "Select an available block to begin"
        : "Complete previous tasks to unlock";

  const handleLessonClick = async (lesson) => {
    if (lesson.isLocked) return;

    sessionStorage.setItem("selectedLessonId", lesson.id);
    sessionStorage.setItem("selectedNodeId", taskId);
    sessionStorage.setItem(
      "selectedLessonIsExam",
      lesson.isExam ? "true" : "false",
    );
    sessionStorage.setItem("selectedLessonStatus", lesson.status || "");

    setSelectedLesson({
      lessonId: lesson.id,
      nodeId: taskId,
      status: lesson.status || "",
      isExam: Boolean(lesson.isExam),
    });

    router.push(`/lesson/${encodeURIComponent(lesson.id)}`);
    onClose();
  };

  const handleClaimGift = async () => {
    if (
      isClaiming ||
      hasClaimed ||
      isLocked ||
      isGiftAlreadyOpened ||
      isLoading
    ) {
      return;
    }

    giftClaimStartedRef.current = true;
    setIsClaiming(true);
    setHasClaimed(true);
    setLoadError("");

    try {
      const token = getSessionToken(session);
      const result = await claimGiftBoxTask(taskId, token);

      if (!result.success) {
        throw new Error(result.error);
      }

      const rewardPayload = result.data || {};
      setGiftRewards({
        datesReceived:
          Number(rewardPayload?.datesReceived) ||
          Number(rewardPayload?.dateReceived) ||
          0,
        injazReceived:
          Number(rewardPayload?.injazReceived) ||
          Number(rewardPayload?.InjazReceived) ||
          0,
        badgesAdded: Array.isArray(rewardPayload?.badges?.added)
          ? rewardPayload.badges.added
          : [],
      });

      const lessonsResult = await fetchTaskLessons(taskId, token);
      const activeGiftLessonId = lessonsResult.success
        ? getProgressLessonId(lessonsResult.data?.docs)
        : "";

      if (activeGiftLessonId) {
        const progressResult = await makeLearnerProgress(
          activeGiftLessonId,
          token,
        );
        if (progressResult?.success) {
          useDailyQuestStore.getState().invalidate();
        }
      }

      if (typeof window !== "undefined") {
        useJourneyStore.getState().invalidate();
        useProfileStore.getState().invalidate();
        sessionStorage.setItem(JOURNEY_REFRESH_FLAG_KEY, "true");
        rememberJourneyScroll(window.scrollY || 0);
        finishJourneyLandOnNewGift();
        window.dispatchEvent(new Event("nakhlah:journey-updated"));
      }

      // Auto close after showing animation for a bit
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "";
      if (errorMessage.toLowerCase().includes("gift box already opened")) {
        setIsGiftAlreadyOpened(true);
        setHasClaimed(true);
        setLoadError("");
      } else {
        setLoadError("Failed to claim gift. Please try again.");
        setHasClaimed(false);
        giftClaimStartedRef.current = false;
      }
    } finally {
      setIsClaiming(false);
    }
  };

  // Render Gift Box specific layout
  if (isTaskGiftBox) {
    const showRewardArea =
      !isLocked && !isGiftAlreadyOpened && (isClaiming || hasClaimed);
    const canClaim =
      !isLocked && !hasClaimed && !isGiftAlreadyOpened && !isLoading;
    const giftTitle = isLocked
      ? "Locked gift"
      : isGiftAlreadyOpened
        ? "Already opened"
        : isClaiming
          ? "Opening gift"
          : hasClaimed
            ? "Gift opened"
            : "Mystery gift";
    const giftCopy = isLocked
      ? "Finish the tasks before this one to open it."
      : isGiftAlreadyOpened
        ? "You already collected this gift."
        : isClaiming
          ? "Collecting your reward."
          : hasClaimed
            ? "Your rewards are now in your account."
            : "This gift is ready. Open it to collect your reward.";

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-3xl border-2 border-primary/70 bg-gradient-to-b from-amber-50 via-card to-card p-0 shadow-2xl sm:max-w-md [&>button]:hidden dark:from-amber-950/40 dark:via-card">
          <div className="relative overflow-hidden bg-gradient-to-r from-accent via-violet-500 to-amber-400 px-6 py-5 text-center">
            <div className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/20" />
            <div className="pointer-events-none absolute -bottom-8 right-6 h-20 w-20 rounded-full bg-amber-200/30" />
            <Sparkles className="pointer-events-none absolute left-5 top-3 h-4 w-4 text-amber-200" />
            <Sparkles className="pointer-events-none absolute right-14 top-6 h-3.5 w-3.5 text-white/80" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
              Journey gift
            </p>
            <DialogTitle className="mt-1 text-2xl font-black tracking-tight text-white">
              {giftTitle}
            </DialogTitle>
          </div>

          <div className="relative px-6 pb-6 pt-2">
            <Sparkles className="pointer-events-none absolute left-8 top-6 h-5 w-5 text-amber-400" />
            <Sparkles className="pointer-events-none absolute right-10 top-10 h-4 w-4 text-accent" />
            <Sparkles className="pointer-events-none absolute bottom-24 left-6 h-4 w-4 text-rose-400" />
            <Sparkles className="pointer-events-none absolute bottom-28 right-7 h-6 w-6 text-amber-300" />
            <span className="pointer-events-none absolute left-14 top-16 h-2 w-2 rounded-full bg-amber-400" />
            <span className="pointer-events-none absolute right-16 top-4 h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="pointer-events-none absolute right-12 top-20 h-2.5 w-2.5 rounded-full bg-rose-400" />

            {!isGiftAlreadyOpened ? (
              <div
                role={canClaim ? "button" : undefined}
                tabIndex={canClaim ? 0 : undefined}
                onClick={canClaim ? handleClaimGift : undefined}
                onKeyDown={
                  canClaim
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleClaimGift();
                        }
                      }
                    : undefined
                }
                className={`relative z-10 mx-auto flex h-36 items-center justify-center ${
                  canClaim
                    ? "cursor-pointer transition-transform hover:scale-105"
                    : ""
                }`}
              >
                <TreasureChest
                  className={`h-32 w-32 ${
                    isLocked ? "opacity-50 grayscale" : ""
                  }`}
                />
              </div>
            ) : null}

            <p className="relative z-10 mx-auto mt-1 max-w-xs text-center text-sm font-semibold leading-relaxed text-muted-foreground">
              {giftCopy}
            </p>

            {loadError && (
              <p className="relative z-10 mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-center text-sm font-semibold text-red-600">
                {loadError}
              </p>
            )}

            {showRewardArea ? (
              <div className="relative z-10 mt-6 min-h-[7.5rem] space-y-2">
                {giftRewards ? (
                  <>
                    {giftRewards.injazReceived > 0 && (
                      <div className="flex h-14 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-500/10 px-4">
                        <p className="text-base font-semibold text-amber-700">
                          You received{" "}
                          <span className="font-black">
                            {giftRewards.injazReceived.toLocaleString()} Injaz
                          </span>
                        </p>
                      </div>
                    )}
                    {giftRewards.datesReceived > 0 && (
                      <div className="flex h-14 items-center justify-center rounded-2xl border border-sky-200/80 bg-sky-500/10 px-4">
                        <p className="text-base font-semibold text-sky-700">
                          You found{" "}
                          <span className="font-black">
                            {giftRewards.datesReceived.toLocaleString()} Dates
                          </span>
                        </p>
                      </div>
                    )}
                    {giftRewards.badgesAdded.length > 0 && (
                      <div className="flex h-14 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-500/10 px-4">
                        <p className="text-base font-semibold text-emerald-700">
                          {giftRewards.badgesAdded.length > 1
                            ? `You unlocked ${giftRewards.badgesAdded.length} badges`
                            : "You unlocked a new badge"}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex h-14 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-500/10 px-4">
                      <span className="h-3 w-2/3 animate-pulse rounded-full bg-amber-300/80" />
                    </div>
                    <div className="flex h-14 items-center justify-center rounded-2xl border border-sky-200/80 bg-sky-500/10 px-4">
                      <span className="h-3 w-2/3 animate-pulse rounded-full bg-sky-300/80" />
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {canClaim ? (
              <Button
                type="button"
                className="relative z-10 mt-6 w-full"
                onClick={handleClaimGift}
              >
                Open gift
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Regular Lesson Selection layout
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-lg p-0 gap-0 border-border [&>button]:hidden rounded-2xl overflow-hidden shadow-lg border-2">
        {/* Simple Header */}
        <div className="bg-accent p-3 sm:p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
          <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-wide">
            Choose a Lesson
          </DialogTitle>
          <p className="text-white/90 font-medium text-sm mt-1">
            {isLocked
              ? "Lesson is locked"
              : isCompleted
                ? "All lessons unlocked"
                : isCurrent
                  ? "Start learning"
                  : "Complete previous lessons first"}
          </p>
        </div>

        {/* Lessons Grid (Tighter Spacing) */}
        <div className="p-4 sm:p-6 bg-card">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`lesson-skeleton-${index}`}
                  className="relative p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-border/60 bg-background/70"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-muted animate-pulse" />
                  <div className="mt-3 sm:mt-4 h-3 sm:h-4 w-3/4 mx-auto rounded bg-muted animate-pulse" />
                  <div className="mt-1 sm:mt-2 h-2.5 sm:h-3 w-1/2 mx-auto rounded bg-muted/80 animate-pulse" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <p className="text-sm font-semibold text-destructive text-center py-4">
              {loadError}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {lessons.map((lesson) => {
                const lessonIcon = lesson.isExam ? (
                  <img
                    src="/icons/Quiz1.svg"
                    alt="Quiz"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <img
                    src="/icons/Lesson.svg"
                    alt="Lesson"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                );

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    disabled={lesson.isLocked}
                    className={`
                      relative p-3 sm:p-5 rounded-2xl border-4 transition-all
                      flex flex-col items-center justify-center gap-2 sm:gap-3 group
                      ${
                        lesson.isLocked
                          ? "bg-muted border-muted-foreground/20 cursor-not-allowed opacity-75"
                          : lesson.isCompleted
                            ? "bg-card border-accent/20 hover:border-accent hover:bg-accent/5 cursor-pointer"
                            : "bg-card border-border hover:border-accent hover:bg-accent/5 cursor-pointer shadow-sm hover:shadow-md"
                      }
                      ${!lesson.isLocked && "active:scale-95"}
                    `}
                  >
                    {/* Small Status Overlays */}
                    {lesson.isLocked && (
                      <div className="absolute top-2 right-2">
                        <Lock size="sm" variant="silver" />
                      </div>
                    )}
                    {lesson.isCompleted && !lesson.isLocked && (
                      <div className="absolute top-2 right-2 text-emerald-500">
                        <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
                      </div>
                    )}

                    {/* Extra Large Icon */}
                    <div
                      className={`
                        w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
                        ${lesson.isLocked ? "grayscale opacity-50" : ""}
                        transition-transform group-hover:scale-105 duration-200
                      `}
                    >
                      {lessonIcon}
                    </div>

                    {/* Lesson Title */}
                    <p
                      className={`
                        text-sm sm:text-md font-bold text-center tracking-tight leading-tight px-1
                        ${lesson.isLocked ? "text-muted-foreground" : "text-foreground"}
                      `}
                    >
                      {lesson.title}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Info Text */}
          {footerText ? (
            <p className="text-xs font-semibold text-muted-foreground/80 text-center mt-5 uppercase tracking-wider">
              {footerText}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
