"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { PalmIcon } from "@/components/icons/PublicAssetIcons";
import { usePalmRefillCountdown } from "@/hooks/usePalmRefillCountdown";

/**
 * Shared "refill Palm Trees" presentation used both as a full-screen
 * blocking overlay (mid-lesson, `PalmTreesDepletedOverlay`) and as an
 * inline card (profile page, `RefillLivesCard`) so the experience looks
 * and feels the same everywhere.
 */
export default function PalmRefillPanel({
  title = "Out of Palm Trees!",
  description = "You've used up all your Palm Trees, so you can't answer more questions right now.",
  palmTreesCount = 0,
  maxPalmTrees = 5,
  mascotSize = "xxxl",
  showMascot = true,
  onRefill,
  isRefilling = false,
  onGoPro,
  onExit,
  exitLabel = "Exit Lesson",
  palmUpdatedAt = null,
  dateStock = 0,
}) {
  const { isFull: palmIsFull, formatted: palmRefillCountdown } =
    usePalmRefillCountdown(palmUpdatedAt, palmTreesCount, maxPalmTrees);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto text-center"
    >
      {showMascot ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex justify-center"
        >
          <FreshDateMascot mood="sad" size={mascotSize} />
        </motion.div>
      ) : null}

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-extrabold text-foreground mb-2"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-muted-foreground mb-5"
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-1.5 mb-6"
      >
        {Array.from({ length: maxPalmTrees }).map((_, index) => (
          <PalmIcon
            key={index}
            size="md"
            className={index < palmTreesCount ? "opacity-100" : "opacity-25"}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <Button
          onClick={onRefill}
          disabled={isRefilling || palmTreesCount >= maxPalmTrees}
          className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
        >
          {isRefilling ? "Refilling..." : "Refill Palm Trees"}
        </Button>
        <Button
          onClick={onGoPro}
          disabled={isRefilling}
          variant="outline"
          className="w-full h-12 font-bold text-lg rounded-xl border-2"
        >
          Go Pro — Unlimited Palms
        </Button>

        <p className="text-xs text-muted-foreground pt-1">
          {!palmIsFull && palmRefillCountdown
            ? `Next free Palm Tree in ${palmRefillCountdown}`
            : "Palm Trees also refill for free over time — check back later."}
        </p>
        <p className="text-xs text-muted-foreground">
          You have {dateStock} date{dateStock === 1 ? "" : "s"} available to
          refill instantly.
        </p>

        {onExit ? (
          <button
            onClick={onExit}
            disabled={isRefilling}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 pt-1"
          >
            {exitLabel}
          </button>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
