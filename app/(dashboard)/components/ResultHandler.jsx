"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const ICONS = {
  correct: "/icons/Correct_answer.svg",
  wrong: "/icons/Wrong_answer.svg",
};

const CORRECT_PHRASES = [
  "Great job!",
  "Well done!",
  "Excellent!",
  "You're on fire!",
  "Keep it up!",
  "Awesome!",
  "Spot on!",
  "Brilliant!",
  "Perfect!",
  "You nailed it!",
  "Fantastic!",
  "Superb!",
];

const WRONG_PHRASES = [
  "Don't give up!",
  "You can do this!",
  "Keep trying!",
  "Almost there!",
  "Learning takes time!",
  "Stay positive!",
  "Next one will be better!",
  "Believe in yourself!",
  "Mistakes help us grow!",
  "You've got this!",
  "Keep going!",
  "Try again!",
];

const SOUNDS = {
  correct: "/mp3/correct.mp3",
  wrong: "/mp3/wrong.mp3",
  click: "/mp3/click.mp3",
};

function useSoundEffect(src) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio(src);
    audioRef.current.preload = "auto";
  }, [src]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  return play;
}

export function LessonResultHandler({
  isCorrect,
  correctAnswer,
  onCheck,
  onContinue,
  onSkip,
  disabled,
}) {
  const playCorrect = useSoundEffect(SOUNDS.correct);
  const playWrong = useSoundEffect(SOUNDS.wrong);
  const playClick = useSoundEffect(SOUNDS.click);

  const message = useMemo(() => {
    if (isCorrect === null) return "";
    const phrases = isCorrect ? CORRECT_PHRASES : WRONG_PHRASES;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [isCorrect]);

  const previousResult = useRef(null);

  useEffect(() => {
    if (isCorrect === true && previousResult.current !== true) {
      playCorrect();
    } else if (isCorrect === false && previousResult.current !== false) {
      playWrong();
    }
    previousResult.current = isCorrect;
  }, [isCorrect, playCorrect, playWrong]);

  const handleContinue = useCallback(() => {
    playClick();
    onContinue?.();
  }, [playClick, onContinue]);

  return (
    <div className="border-t-2 border-border bg-background h-[120px] flex flex-col overflow-hidden shrink-0">
      <AnimatePresence mode="wait" initial={false}>
        {isCorrect === null ? (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-[120px] w-full flex flex-col sm:flex-row items-center justify-between px-4 gap-4 container max-w-4xl mx-auto"
          >
            <button
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground font-bold text-lg underline underline-offset-4 order-2 sm:order-1"
            >
              Skip
            </button>
            <Button
              onClick={onCheck}
              disabled={disabled}
              className="w-full sm:w-auto sm:min-w-[200px] h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl order-1 sm:order-2"
            >
              Check Answer
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={isCorrect ? "correct" : "wrong"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`w-full h-[120px] flex items-center px-4 ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/40"
                : "bg-red-100 dark:bg-red-900/40"
            }`}
          >
            <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={isCorrect ? ICONS.correct : ICONS.wrong}
                  alt={isCorrect ? "Correct" : "Wrong"}
                  className="w-16 h-16 shrink-0 object-contain drop-shadow-sm"
                />
                <div className="min-w-0">
                  <h3
                    className={`text-xl font-black ${isCorrect ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400"}`}
                  >
                    {message}
                  </h3>
                  {!isCorrect && correctAnswer && (
                    <p className="text-red-700 dark:text-red-300 font-bold text-base truncate">
                      Correct answer: {correctAnswer}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleContinue}
                className={`w-full sm:w-auto sm:min-w-[200px] h-14 font-bold text-lg rounded-xl shadow-lg transform active:scale-95 transition-transform shrink-0 ${
                  isCorrect
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
