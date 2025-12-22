"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Flame } from "@/components/icons/Flame";
import { Check } from "lucide-react";

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const streakDays = [false, false, true, true, true, true, true];

export default function FiveDaysStraight() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/");
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
          {/* Flame Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
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
              <Flame 
                size="xxxl" 
                className="relative mx-auto text-orange-500" 
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold text-foreground mb-2"
          >
            5 days straight!
          </motion.h1>

          {/* Description */}
          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground mb-8"
          >
            Increase your practice every day and you stay on a day streak!
          </motion.p> */}

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8 border border-border p-3 rounded-3xl"
          >
            <div className="grid grid-cols-7 gap-3">
              {days.map((day, index) => (
                <motion.div
                  key={day}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      streakDays[index]
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {streakDays[index] && (
                      <Check strokeWidth={4} className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {day}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Streak Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8"
            >
              <div className="rounded-2xl p-4">
                <p className="text-base text-muted-foreground">
                  Increases if you practice everyday and will return to zero if you skip a day!
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-muted/50 rounded-2xl p-4 border border-border">
              <p className="text-3xl font-bold text-orange-500">5</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 border border-border">
              <p className="text-3xl font-bold text-accent">7</p>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
          </motion.div>

          {/* Desktop Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
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