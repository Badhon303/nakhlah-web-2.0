/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, X, Turtle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { useToast } from "@/components/ui/use-toast";
import { ArabicTooltip } from "@/components/nakhlah/ArabicTooltip";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";
import { useAudio } from "@/hooks/use-audio";

const words = [
  "وَ",
  "عَلَيْكُمُ",
  "ٱلسَّلَامُ",
  "اِسْمِي",
  "حَالُكَ",
  "مُحَمَّد",
];

const correctAnswer = ["وَ", "عَلَيْكُمُ", "ٱلسَّلَامُ"];

const AUDIO_CONFIG = {
  audio: "/mp3/assalamu_alaykum_f39425b3f2.mp3",
  ttsText: "السَّلامُ عَلَيْكُمْ",
  lang: "ar-SA",
};

const ARABIC_PARTS = [
  { text: "السَّلامُ", pronunciation: "Assalamu" },
  { text: " ", pronunciation: "" },
  { text: "عَلَيْكُمْ", pronunciation: "Alaikum" },
];

export default function SentenceMakingLesson() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(words);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [result, setResult] = useState(null);

  const router = useRouter();
  const { toast } = useToast();
  const { play } = useAudio();

  // Global lesson progress (Sentence-Making = 5/6)
  const LESSON_TYPES = [
    "mcq",
    "true-false",
    "fill-in-the-blanks",
    "word-making",
    "sentence-making",
    "pair-match",
  ];
  const currentLessonType = "sentence-making";
  const currentLessonIndex = LESSON_TYPES.indexOf(currentLessonType);
  const totalLessons = LESSON_TYPES.length;
  const progressPercentage = ((currentLessonIndex + 1) / totalLessons) * 100;

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
    router.push("/lesson/pair-match");
  };

  const handlePlayAudio = () => {
    play({
      url: AUDIO_CONFIG.audio,
      text: AUDIO_CONFIG.ttsText,
      lang: AUDIO_CONFIG.lang,
      rate: 1.0,
    });
  };

  const handlePlayAudioSlow = () => {
    play({
      url: AUDIO_CONFIG.audio,
      text: AUDIO_CONFIG.ttsText,
      lang: AUDIO_CONFIG.lang,
      rate: 0.6,
    });
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
                Make the response to this greeting
              </h2>
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border">
                <button
                  onClick={handlePlayAudio}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <button
                  onClick={handlePlayAudioSlow}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground hover:opacity-90"
                  aria-label="Play slow audio"
                >
                  <Turtle className="w-6 h-6" />
                </button>
                <div className="text-xl font-semibold text-foreground">
                  {ARABIC_PARTS.map((part, idx) => (
                    <span key={idx}>
                      {part.pronunciation ? (
                        <ArabicTooltip
                          text={part.text}
                          pronunciation={part.pronunciation}
                        />
                      ) : (
                        part.text
                      )}
                    </span>
                  ))}
                </div>
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
            <div
              className="min-h-[80px] bg-card rounded-2xl border-2 border-border p-4"
              dir="rtl"
            >
              <div className="flex flex-wrap gap-2 justify-start">
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
