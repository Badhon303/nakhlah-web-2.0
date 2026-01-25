/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { useToast } from "@/components/ui/use-toast";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";

const options = [
  { id: 1, text: "أهلاً وسهلاً", correct: true },
  { id: 2, text: "مع السلامة", correct: false },
  { id: 3, text: "صباح الخير", correct: false },
  { id: 4, text: "مساء الخير", correct: false },
];

export default function MCQLesson() {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const { toast } = useToast();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleOptionClick = (option) => {
    if (isCorrect !== null) return; // Prevent changes after answer submitted
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsCorrect(selectedOption.correct);
  };

  const handleNext = () => {
    // Move to next lesson in sequence
    const currentIndex = parseInt(
      sessionStorage.getItem("currentLessonIndex") || "0",
    );
    sessionStorage.setItem("currentLessonIndex", (currentIndex + 1).toString());
    router.push("/lesson/pair-match");
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
              <div className="h-full bg-accent w-3/6" />
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
        <div className="w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center sm:text-start">
                What does this mean?
              </h2>
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  Welcome (in Arabic)
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <img
                  src="/assalamu_alaykum.webp"
                  alt="Arabic greeting"
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOptionClick(option)}
                  disabled={isCorrect !== null}
                  className={`p-4 rounded-xl border-2 text-left font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedOption?.id === option.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-card text-foreground hover:border-accent"
                  }`}
                >
                  {option.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={isCorrect}
        correctAnswer="أهلاً وسهلاً"
        onCheck={handleCheckAnswer}
        onContinue={handleNext}
        onSkip={handleNext}
        disabled={!selectedOption}
      />
    </div>
  );
}
