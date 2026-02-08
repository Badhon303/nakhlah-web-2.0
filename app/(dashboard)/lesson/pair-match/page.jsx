"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";

const QUESTIONS = [
  {
    id: 1,
    audio: "/mp3/kaifa_haluka_df7cdf2652.mp3",
    title: "Match Arabic with English",
    leftWords: [
      { id: 1, text: "ٱلسَّلَامُ عَلَيْكُمْ", matched: false },
      { id: 2, text: "وَعَلَيْكُمُ ٱلسَّلَامُ", matched: false },
      { id: 3, text: "كَيْفَ حَالُكَ؟", matched: false },
      { id: 4, text: "كَيْفَ حَالُكِ؟", matched: false },
    ],
    rightWords: [
      { id: 5, text: "How are you? (female)", matched: false },
      { id: 6, text: "Peace be upon you", matched: false },
      { id: 7, text: "And upon you be peace", matched: false },
      { id: 8, text: "How are you? (male)", matched: false },
    ],
    correctPairs: {
      "ٱلسَّلَامُ عَلَيْكُمْ": "Peace be upon you",
      "وَعَلَيْكُمُ ٱلسَّلَامُ": "And upon you be peace",
      "كَيْفَ حَالُكَ؟": "How are you? (male)",
      "كَيْفَ حَالُكِ؟": "How are you? (female)",
    },
  },
];

export default function PairMatchLesson() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [leftState, setLeftState] = useState(QUESTIONS[0].leftWords);
  const [rightState, setRightState] = useState(QUESTIONS[0].rightWords);
  const [incorrectPairs, setIncorrectPairs] = useState([]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;

  // Global lesson progress (Pair-Match = 6/6)
  const LESSON_TYPES = [
    "mcq",
    "true-false",
    "fill-in-the-blanks",
    "word-making",
    "sentence-making",
    "pair-match",
  ];
  const currentLessonType = "pair-match";
  const currentLessonIndex = LESSON_TYPES.indexOf(currentLessonType);
  const totalLessons = LESSON_TYPES.length;
  const progressPercentage = ((currentLessonIndex + 1) / totalLessons) * 100;
  const router = useRouter();

  const handleLeftClick = (item) => {
    if (item.matched || isCorrect !== null) return;
    setSelectedLeft(item);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item) => {
    if (item.matched || isCorrect !== null) return;
    setSelectedRight(item);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left, right) => {
    if (currentQuestion.correctPairs[left.text] === right.text) {
      setLeftState(
        leftState.map((p) => (p.id === left.id ? { ...p, matched: true } : p)),
      );
      setRightState(
        rightState.map((p) =>
          p.id === right.id ? { ...p, matched: true } : p,
        ),
      );
    } else {
      // Mark as incorrect pair
      setIncorrectPairs([
        ...incorrectPairs,
        { leftId: left.id, rightId: right.id },
      ]);
    }
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
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLeftState(QUESTIONS[currentQuestionIndex + 1].leftWords);
      setRightState(QUESTIONS[currentQuestionIndex + 1].rightWords);
      setSelectedLeft(null);
      setSelectedRight(null);
      setIsCorrect(null);
      setIncorrectPairs([]);
    } else {
      sessionStorage.removeItem("currentLessonIndex");
      sessionStorage.removeItem("selectedLessonId");
      sessionStorage.removeItem("selectedNodeId");
      router.push("/lesson/completed");
    }
  };

  const matchedCount = leftState.filter((p) => p.matched).length;

  return (
    <div className="min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col">
      {/* Header - EXACTLY like MCQ */}
      <div className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShowExitDialog(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex-1 h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <GemStone size="sm" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-accent font-bold text-sm sm:text-base">
                100
              </span>
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

      {/* Main Content - EXACTLY like MCQ spacing */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Title - Same positioning as MCQ audio button & title */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center sm:text-start">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Matching Grid - Equal width columns for pair matching */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Arabic */}
              <div className="w-full">
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 text-center">
                    Arabic
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {leftState.map((item, index) => {
                      const isSelected = selectedLeft?.id === item.id;
                      const isMatched = item.matched;
                      const isIncorrect = incorrectPairs.some(
                        (p) => p.leftId === item.id,
                      );

                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleLeftClick(item)}
                          disabled={isMatched}
                          className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[60px] sm:min-h-[70px] ${
                            isMatched
                              ? "border-green-500 bg-green-500/10 text-green-600"
                              : isIncorrect
                                ? "border-red-500 bg-red-500/10 text-red-600"
                                : isSelected
                                  ? "border-accent bg-accent/10 text-foreground shadow-md sm:shadow-lg"
                                  : "border-border bg-card text-foreground hover:border-accent hover:shadow-sm sm:hover:shadow-md"
                          }`}
                        >
                          <span className="text-base sm:text-lg md:text-xl font-bold text-center leading-tight">
                            {item.text}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column - English */}
              <div className="w-full">
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 text-center">
                    English
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {rightState.map((item, index) => {
                      const isSelected = selectedRight?.id === item.id;
                      const isMatched = item.matched;
                      const isIncorrect = incorrectPairs.some(
                        (p) => p.rightId === item.id,
                      );

                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleRightClick(item)}
                          disabled={isMatched}
                          className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[60px] sm:min-h-[70px] ${
                            isMatched
                              ? "border-green-500 bg-green-500/10 text-green-600"
                              : isIncorrect
                                ? "border-red-500 bg-red-500/10 text-red-600"
                                : isSelected
                                  ? "border-accent bg-accent/10 text-foreground shadow-md sm:shadow-lg"
                                  : "border-border bg-card text-foreground hover:border-accent hover:shadow-sm sm:hover:shadow-md"
                          }`}
                        >
                          <span className="text-sm sm:text-base md:text-lg font-bold text-center leading-tight line-clamp-2">
                            {item.text}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Text - Similar to MCQ */}
            <div className="text-center text-sm sm:text-base text-muted-foreground">
              {matchedCount} of {leftState.length} pairs correctly matched
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action - EXACTLY like MCQ */}
      <div className="">
        <LessonResultHandler
          isCorrect={isCorrect}
          correctAnswer={
            !isCorrect && isCorrect !== null
              ? "All pairs need to be correctly matched"
              : undefined
          }
          onCheck={handleCheckAnswer}
          onContinue={handleNext}
          onSkip={handleNext}
          disabled={false}
        />
      </div>
    </div>
  );
}
