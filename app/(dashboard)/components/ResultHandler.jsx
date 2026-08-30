"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isCorrect === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing on reset is intentional
      setMessage("");
      return;
    }
    const phrases = isCorrect ? CORRECT_PHRASES : WRONG_PHRASES;
    setMessage(phrases[Math.floor(Math.random() * phrases.length)]);
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
    <div className="border-t-2 border-border bg-background shrink-0 pb-[var(--sab)]">
      <AnimatePresence mode="wait" initial={false}>
        {isCorrect === null ? (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full px-4 py-4 sm:py-5"
          >
            <div className="container max-w-4xl mx-auto flex flex-row items-center gap-4">
              <button
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground font-bold text-base sm:text-lg underline underline-offset-4 shrink-0"
              >
                Skip
              </button>
              <Button
                onClick={onCheck}
                disabled={disabled}
                className="w-auto min-w-[120px] sm:min-w-[200px] h-12 sm:h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-base sm:text-lg rounded-xl ml-auto"
              >
                Check Answer
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={isCorrect ? "correct" : "wrong"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`w-full px-4 overflow-hidden ${
              isCorrect
                ? "py-4 sm:py-5 bg-emerald-500"
                : "py-6 sm:py-8 bg-red-500"
            }`}
          >
            <div
              className={`container max-w-4xl mx-auto flex flex-row justify-between gap-3 ${
                isCorrect ? "items-center" : "items-start"
              }`}
            >
              {/* Icon + text — always left, single row */}
              <div
                className={`flex gap-2 sm:gap-4 min-w-0 flex-1 ${
                  isCorrect ? "items-center" : "items-start"
                }`}
              >
                <Image
                  src={isCorrect ? ICONS.correct : ICONS.wrong}
                  alt={isCorrect ? "Correct" : "Wrong"}
                  className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-sm"
                  width={56}
                  height={56}
                />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-black leading-tight text-white">
                    {message}
                  </h3>
                  {!isCorrect && correctAnswer && (
                    <div className="mt-1">
                      <p className="text-white/80 font-bold text-sm sm:text-base leading-snug">
                        Correct:
                      </p>
                      <p
                        dir="auto"
                        className="text-white font-bold text-md sm:text-lg leading-snug break-words"
                      >
                        {correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Continue button — always right */}
              <Button
                onClick={handleContinue}
                className={`h-11 sm:h-14 px-4 sm:min-w-[200px] font-bold text-sm sm:text-lg rounded-xl shadow-lg transform active:scale-95 transition-transform shrink-0 ${
                  isCorrect
                    ? "bg-white hover:bg-white/90 text-emerald-600"
                    : "bg-white hover:bg-white/90 text-red-600"
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
