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

const letters = ["ر", "م", "ب", "ا", "ي", "س"];

const correctAnswer = ["ا", "س", "م", "ي"]; // Fixed: Correct order for "اسمي"

export default function WordMakingLesson() {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState(letters);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [result, setResult] = useState(null);

  const router = useRouter();
  const { toast } = useToast();

  // Global lesson progress (Word-Making = 4/6)
  const LESSON_TYPES = [
    "mcq",
    "true-false",
    "fill-in-the-blanks",
    "word-making",
    "sentence-making",
    "pair-match",
  ];
  const currentLessonType = "word-making";
  const currentLessonIndex = LESSON_TYPES.indexOf(currentLessonType);
  const totalLessons = LESSON_TYPES.length;
  const progressPercentage = ((currentLessonIndex + 1) / totalLessons) * 100;

  const handleLetterClick = (letter) => {
    if (result !== null) return;
    setSelectedLetters([...selectedLetters, letter]);
    const index = availableLetters.indexOf(letter);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index) => {
    if (result !== null) return;
    const letter = selectedLetters[index];
    setAvailableLetters([...availableLetters, letter]);
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = () => {
    if (selectedLetters.length === 0) return;
    // NO REVERSE HERE - Compare as-is
    const isAnswerCorrect =
      JSON.stringify(selectedLetters) === JSON.stringify(correctAnswer);
    setResult(isAnswerCorrect);
  };

  const onNext = () => {
    // Move to next lesson in sequence
    const currentIndex = parseInt(
      sessionStorage.getItem("currentLessonIndex") || "0",
    );
    sessionStorage.setItem("currentLessonIndex", (currentIndex + 1).toString());
    router.push("/lesson/sentence-making");
  };

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col relative">
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
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <GemStone size="sm" />
              <span className="text-accent font-bold">100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Dialog */}
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
                Write &quot;My name&quot; in Arabic
              </h2>
            </div>

            {/* Selected Letters Area - Use RTL direction */}
            <div className="min-h-[100px] bg-card rounded-2xl border-2 border-border p-4">
              <div
                dir="rtl"
                className="flex flex-wrap gap-2 justify-center items-center min-h-[68px]"
              >
                {selectedLetters.map((letter, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => handleRemoveLetter(index)}
                    disabled={result !== null}
                    className="px-5 py-3 bg-accent text-accent-foreground rounded-xl font-bold text-2xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {letter}
                  </motion.button>
                ))}
                {selectedLetters.length === 0 && (
                  <p dir="ltr" className="text-muted-foreground text-sm">
                    Tap the letters to form the word
                  </p>
                )}
              </div>
            </div>

            {/* Available Letters */}
            <div className="flex flex-wrap gap-3 justify-center">
              {availableLetters.map((letter, index) => (
                <motion.button
                  key={letter + index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLetterClick(letter)}
                  disabled={result !== null}
                  className="w-16 h-16 bg-card border-2 border-border rounded-xl font-bold text-2xl text-foreground hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={result}
        correctAnswer="اسمي"
        onCheck={handleCheckAnswer}
        onContinue={onNext}
        onSkip={onNext}
        disabled={selectedLetters.length === 0}
      />
    </div>
  );
}
