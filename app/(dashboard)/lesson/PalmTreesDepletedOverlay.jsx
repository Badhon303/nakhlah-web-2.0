"use client";

import PalmRefillPanel from "@/components/nakhlah/PalmRefillPanel";

/**
 * Full-screen blocking screen shown the instant a learner's Palm Trees hit
 * zero mid-lesson (Duolingo "out of hearts" pattern). Unlike a dismissible
 * modal, this has no backdrop-close/escape affordance — the learner must
 * either refill, go Pro, or exit the lesson.
 */
export default function PalmTreesDepletedOverlay({
  onRefill,
  isRefilling,
  onGoPro,
  onExit,
  palmUpdatedAt = null,
  dateStock = 0,
}) {
  return (
    <div className="fixed inset-0 z-[70] bg-background flex items-center justify-center p-4">
      <PalmRefillPanel
        title="Out of Palm Trees!"
        description="You've used up all your Palm Trees, so you can't answer more questions right now."
        palmTreesCount={0}
        maxPalmTrees={5}
        onRefill={onRefill}
        isRefilling={isRefilling}
        onGoPro={onGoPro}
        onExit={onExit}
        exitLabel="Exit Lesson"
        palmUpdatedAt={palmUpdatedAt}
        dateStock={dateStock}
      />
    </div>
  );
}
