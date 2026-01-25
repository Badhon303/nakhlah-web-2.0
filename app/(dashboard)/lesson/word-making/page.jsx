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

const letters = ["م", "ر", "ح", "ب", "ا", "ل", "ك", "ت", "س"];

const correctAnswer = ["م", "ر", "ح", "ب", "ا"];

export default function WordMakingLesson() {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState(letters);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [result, setResult] = useState(null);

  const router = useRouter();
  const { toast } = useToast();

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
    router.push("/lesson/mcq");
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
              <div className="h-full bg-accent w-2/6" />
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
                Make this word in Arabic
              </h2>
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  Hello (مرحبا)
                </p>
              </div>

              {/* Image for context */}
              <div className="mt-4 flex justify-center">
                <img
                  src="/my_name.webp"
                  alt="Arabic word illustration"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>

            {/* Selected Letters Area */}
            <div className="min-h-[100px] bg-card rounded-2xl border-2 border-border p-4">
              <div className="flex flex-wrap gap-2 justify-center items-center min-h-[68px]">
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
                  <p className="text-muted-foreground text-sm">
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

            {/* Hint */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                💡 Arrange the letters to form the word &quot;مرحبا&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={result}
        correctAnswer="مرحبا"
        onCheck={handleCheckAnswer}
        onContinue={onNext}
        onSkip={onNext}
        disabled={selectedLetters.length === 0}
      />
    </div>
  );
}
