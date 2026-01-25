"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mascot } from "@/components/nakhlah/Mascot";
import { useRouter } from "next/navigation";

// Define the lesson sequence - all lessons will go through these types
const lessonSequence = [
  "/lesson/sentence-making",
  "/lesson/word-making",
  "/lesson/mcq",
  "/lesson/pair-match",
  "/lesson/fill-in-the-blanks",
  "/lesson/true-false",
];

export default function LessonLoading() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to first lesson in the sequence
          setTimeout(() => {
            // Get current lesson index, default to 0 (first lesson)
            const currentIndex = parseInt(
              sessionStorage.getItem("currentLessonIndex") || "0",
            );

            // Navigate to the lesson at current index
            const route = lessonSequence[currentIndex] || lessonSequence[0];
            router.push(route);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Mascot mood="proud" size="xxxl" />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-accent mb-8"
        >
          Loading...
        </motion.h2>

        {/* Progress Bar */}
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

        {/* Tip Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground max-w-xs mx-auto"
        >
          Complete the course faster to get more XP and Diamonds.
        </motion.p>
      </div>
    </div>
  );
}
