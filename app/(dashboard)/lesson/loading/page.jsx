"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mascot } from "@/components/nakhlah/Mascot";
import { useRouter } from "next/navigation";

const lessonSequence = ["/lesson"];

export default function LessonLoading() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [error] = useState(null);

  useEffect(() => {
    const lessonId = sessionStorage.getItem("selectedLessonId")?.trim();

    if (!lessonId) {
      console.error("No lesson ID found");
      router.push("/");
      return;
    }

    sessionStorage.setItem("currentLessonIndex", "0");
    sessionStorage.setItem("selectedLessonId", lessonId);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push(lessonSequence[0]);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Mascot mood={error ? "sad" : "proud"} size="xxxl" />
        </motion.div>

        {/* Loading Text or Error */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-2xl font-bold mb-8 ${
            error ? "text-destructive" : "text-accent"
          }`}
        >
          {error ? "Error Loading Lesson" : "Loading..."}
        </motion.h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-destructive mb-6"
          >
            {error}
          </motion.p>
        )}

        {/* Progress Bar */}
        {!error && (
          <div className="mb-6">
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Tip Text */}
        {!error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground max-w-xs mx-auto"
          >
            Complete the course faster to get more XP and Diamonds.
          </motion.p>
        )}
      </div>
    </div>
  );
}
