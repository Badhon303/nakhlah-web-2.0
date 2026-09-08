"use client";

import { motion } from "framer-motion";
import { Trophy } from "@/components/icons/Trophy";
import { ConfettiRain } from "@/components/nakhlah/ResultVisuals";

/**
 * Celebratory panel shown in place of the "Next Section Locked" placeholder
 * once the learner has completed every lesson currently available in their
 * journey. The shared confetti rain renders at viewport level so the
 * decoration falls from the top of the screen without being clipped here.
 */
export function JourneyCompleteCelebration() {
  return (
    <>
      <ConfettiRain />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex justify-center"
      >
        <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/40 bg-white/30 p-6 text-center shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-white/10">
          <div className="relative flex justify-center mb-3">
            <Trophy size="xl" />
          </div>
          <h3 className="relative mb-2 text-lg font-bold text-slate-900 dark:text-white">
            You&apos;ve completed the journey!
          </h3>
          <p className="relative text-sm text-slate-700 dark:text-white/70">
            Amazing work finishing every lesson. New content is on its way —
            check back soon for more!
          </p>
        </div>
      </motion.div>
    </>
  );
}
