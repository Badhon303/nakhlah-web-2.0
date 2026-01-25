"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { useToast } from "@/components/ui/use-toast";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";

const leftWords = [
  { id: 1, text: "مرحبا", matched: false },
  { id: 2, text: "كتاب", matched: false },
  { id: 3, text: "شكرا", matched: false },
  { id: 4, text: "ماء", matched: false },
  { id: 5, text: "بيت", matched: false },
];

const rightWords = [
  { id: 6, text: "Hello", matched: false },
  { id: 7, text: "Book", matched: false },
  { id: 8, text: "Thank you", matched: false },
  { id: 9, text: "Water", matched: false },
  { id: 10, text: "House", matched: false },
];

const correctPairs = {
  مرحبا: "Hello",
  كتاب: "Book",
  شكرا: "Thank you",
  ماء: "Water",
  بيت: "House",
};

export default function PairMatchLesson() {
  const [leftState, setLeftState] = useState(leftWords);
  const [rightState, setRightState] = useState(rightWords);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const router = useRouter();

  const handleLeftClick = (item) => {
    if (item.matched || isCorrect !== null) return; // Prevent changes after answer submitted
    setSelectedLeft(item);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item) => {
    if (item.matched || isCorrect !== null) return; // Prevent changes after answer submitted
    setSelectedRight(item);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left, right) => {
    if (correctPairs[left.text] === right.text) {
      // Correct match - mark as matched
      setLeftState(
        leftState.map((p) => (p.id === left.id ? { ...p, matched: true } : p)),
      );
      setRightState(
        rightState.map((p) =>
          p.id === right.id ? { ...p, matched: true } : p,
        ),
      );
      // Add to matched pairs for visual connection
      setMatchedPairs([...matchedPairs, { left: left.id, right: right.id }]);
    }
    // Clear selection after a brief moment
    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 300);
  };

  const handleCheckAnswer = () => {
    const allMatched = leftState.every((p) => p.matched);
    setIsCorrect(allMatched);
  };

  const handleNext = () => {
    // Move to next lesson in sequence
    const currentIndex = parseInt(
      sessionStorage.getItem("currentLessonIndex") || "0",
    );
    sessionStorage.setItem("currentLessonIndex", (currentIndex + 1).toString());
    router.push("/lesson/fill-in-the-blanks");
  };

  return (
    <div className="min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowExitDialog(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent w-4/6" />
            </div>
            <div className="flex items-center gap-2">
              <GemStone size="sm" />
              <span className="text-accent font-bold">100</span>
            </div>
          </div>
        </div>
      </div>

      {/*  Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50">
          <LeavingDialog onCancel={() => setShowExitDialog(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              Match the words
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Tap the Arabic word, then tap its English translation
            </p>

            {/* Matching Grid with visual connection indicators */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Arabic */}
              <div className="space-y-4">
                <div className="text-center font-bold text-lg text-accent mb-3">
                  Arabic
                </div>
                {leftState.map((item, index) => {
                  const matchNumber =
                    leftState.filter((p, i) => i < index && p.matched).length +
                    1;
                  const isSelected = selectedLeft?.id === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleLeftClick(item)}
                      disabled={item.matched}
                      className={`w-full p-5 rounded-2xl border-3 font-bold text-xl transition-all relative ${
                        item.matched
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : isSelected
                            ? "border-accent bg-accent/20 text-foreground shadow-2xl scale-105 ring-4 ring-accent/50"
                            : "border-border bg-card text-foreground hover:border-accent hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      {/* Match indicator badge */}
                      {item.matched && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                          {matchNumber}
                        </div>
                      )}

                      {/* Selection pulse indicator */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-accent"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <span className="text-2xl relative z-10">
                        {item.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Right Column - English */}
              <div className="space-y-4">
                <div className="text-center font-bold text-lg text-accent mb-3">
                  English
                </div>
                {rightState.map((item, index) => {
                  const matchNumber =
                    rightState.filter((p, i) => i < index && p.matched).length +
                    1;
                  const isSelected = selectedRight?.id === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRightClick(item)}
                      disabled={item.matched}
                      className={`w-full p-5 rounded-2xl border-3 font-semibold text-lg transition-all relative ${
                        item.matched
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : isSelected
                            ? "border-accent bg-accent/20 text-foreground shadow-2xl scale-105 ring-4 ring-accent/50"
                            : "border-border bg-card text-foreground hover:border-accent hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      {/* Match indicator badge */}
                      {item.matched && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                          {matchNumber}
                        </div>
                      )}

                      {/* Selection pulse indicator */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-accent"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <span className="relative z-10">{item.text}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Center connection indicator when both items are selected */}
              {selectedLeft && selectedRight && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center z-20 shadow-xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-3xl"
                  >
                    ⟷
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {leftState.filter((p) => p.matched).length} / {leftState.length}{" "}
                matches
              </p>
              {selectedLeft && !selectedRight && (
                <p className="text-xs text-accent mt-2 animate-pulse">
                  Now select the matching English word →
                </p>
              )}
              {selectedRight && !selectedLeft && (
                <p className="text-xs text-accent mt-2 animate-pulse">
                  ← Now select the matching Arabic word
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={isCorrect}
        onCheck={handleCheckAnswer}
        onContinue={handleNext}
        onSkip={handleNext}
        disabled={!leftState.every((p) => p.matched)}
      />
    </div>
  );
}
