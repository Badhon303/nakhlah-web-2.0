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

const words = ["أنا", "أمشي", "و", "هي", "تسبح", "يأكل", "نحن", "يقرأ", "هم"];

const correctAnswer = ["أنا", "أمشي", "و", "هي", "تسبح"];

export default function SentenceMakingLesson() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(words);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [result, setResult] = useState(null);

  const router = useRouter();
  const { toast } = useToast();

  const handleWordClick = (word) => {
    if (result !== null) return;
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (index) => {
    if (result !== null) return;
    const word = selectedWords[index];
    setAvailableWords([...availableWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = () => {
    if (selectedWords.length === 0) return;
    const isAnswerCorrect =
      JSON.stringify(selectedWords) === JSON.stringify(correctAnswer);
    setResult(isAnswerCorrect);
  };

  const onNext = () => {
    // Move to next lesson in sequence
    const currentIndex = parseInt(
      sessionStorage.getItem("currentLessonIndex") || "0",
    );
    sessionStorage.setItem("currentLessonIndex", (currentIndex + 1).toString());
    router.push("/lesson/word-making");
  };

  return (
    <div className="min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col relative">
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
              <div className="h-full bg-accent w-1/6" />
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
                Make this sentence in Arabic
              </h2>
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  I walk and she swims
                </p>
              </div>

              {/* Image for context */}
              <div className="mt-4 flex justify-center">
                <img
                  src="/assalamu_alaykum.webp"
                  alt="Arabic lesson illustration"
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>

            {/* Selected Words Area */}
            <div className="min-h-[80px] bg-card rounded-2xl border-2 border-border p-4">
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => handleRemoveWord(index)}
                    disabled={result !== null}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {word}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Available Words */}
            <div className="flex flex-wrap gap-3 justify-center">
              {availableWords.map((word, index) => (
                <motion.button
                  key={word + index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleWordClick(word)}
                  disabled={result !== null}
                  className="px-6 py-3 bg-card border-2 border-border rounded-xl font-semibold text-foreground hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {word}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={result}
        correctAnswer={correctAnswer.join(" ")}
        onCheck={handleCheckAnswer}
        onContinue={onNext}
        onSkip={onNext}
        disabled={selectedWords.length === 0}
      />
    </div>
  );
}
