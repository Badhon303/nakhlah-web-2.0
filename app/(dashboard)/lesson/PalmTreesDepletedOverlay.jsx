"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { PalmIcon } from "@/components/icons/PublicAssetIcons";

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
}) {
  return (
    <div className="fixed inset-0 z-[70] bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-4"
        >
          <FreshDateMascot mood="sad" size="xxxl" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-extrabold text-foreground mb-2"
        >
          Out of Palm Trees!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-muted-foreground mb-5"
        >
          You&apos;ve used up all your Palm Trees, so you can&apos;t answer
          more questions right now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-1.5 mb-6"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <PalmIcon key={index} size="md" className="opacity-25" />
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
            disabled={isRefilling}
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
            Palm Trees also refill for free over time — check back later.
          </p>

          <button
            onClick={onExit}
            disabled={isRefilling}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 pt-1"
          >
            Exit Lesson
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
