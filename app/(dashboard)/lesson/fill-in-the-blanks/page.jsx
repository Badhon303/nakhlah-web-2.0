"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { useToast } from "@/components/ui/use-toast";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";

// Dummy data
const DUMMY_SENTENCE = "أنا ___ إلى المدرسة كل يوم";
const DUMMY_CORRECT_ANSWER = "أذهب";

export default function FillInBlankLesson() {
  const [answer, setAnswer] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleCheckAnswer = () => {
    if (!answer.trim() || isCorrect !== null) return; // Prevent re-submission
    const correct =
      answer.trim().toLowerCase() === DUMMY_CORRECT_ANSWER.toLowerCase();
    setIsCorrect(correct);
  };

  const handleNext = () => {
    // Move to next lesson in sequence
    const currentIndex = parseInt(
      sessionStorage.getItem("currentLessonIndex") || "0",
    );
    sessionStorage.setItem("currentLessonIndex", (currentIndex + 1).toString());
    router.push("/lesson/true-false");
  };

  const parts = DUMMY_SENTENCE.split("___");

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
              <div className="h-full bg-accent w-5/6" />
            </div>

            <div className="flex items-center gap-2">
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
            className="space-y-8"
          >
            {/* Question */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center sm:text-start">
                Fill in the blank
              </h2>

              {/* Audio Sentence */}
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border mb-6">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  Complete the sentence below
                </p>
              </div>

              {/* Sentence with Input */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex flex-wrap items-center justify-center gap-3 text-2xl font-medium">
                  {parts[0]}
                  <div className="relative">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      disabled={isCorrect !== null}
                      className="w-48 h-14 text-center text-xl font-bold border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Type here"
                    />
                  </div>
                  {parts[1]}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={isCorrect}
        correctAnswer={DUMMY_CORRECT_ANSWER}
        onCheck={handleCheckAnswer}
        onContinue={handleNext}
        onSkip={handleNext}
        disabled={!answer.trim()}
      />
    </div>
  );
}
