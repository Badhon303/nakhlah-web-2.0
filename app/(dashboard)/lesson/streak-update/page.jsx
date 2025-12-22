"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Flame } from "@/components/icons/Flame";

export default function StreakUpdate() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/lesson/five-days-straight");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent lg:bg-card rounded-none lg:rounded-3xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-8"
        >
          {/* Flame Animation */}
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
            <div className="relative inline-block">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 blur-3xl rounded-full"
              />
              <Flame size="xxxl" className="relative mx-auto text-orange-500" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold text-foreground mb-3"
          >
            5 day streak!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted-foreground mb-8"
          >
            Keep up the amazing work! You&apos;re on fire! 🔥
          </motion.p>

          {/* Desktop Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="hidden sm:block"
          >
            <Button
              onClick={handleContinue}
              className="w-full h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
            >
              CONTINUE
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile bottom action */}
      <div className="w-full max-w-lg mx-auto sm:hidden bg-background border-t border-border p-4">
        <Button
          onClick={handleContinue}
          className="w-full h-12 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl"
        >
          CONTINUE
        </Button>
      </div>
    </div>
  );
}
