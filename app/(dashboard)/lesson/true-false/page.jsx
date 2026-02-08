/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, X, Check, X as XIcon, Turtle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { ArabicTooltip } from "@/components/nakhlah/ArabicTooltip";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";
import { useAudio } from "@/hooks/use-audio";

// Learning sections and True/False question
const QUESTIONS = [
  {
    id: 1,
    type: "learn",
    audio: "/mp3/kaifa_haluka_df7cdf2652.mp3",
    ttsText: "كَيْفَ حَالُكَ؟",
    gender: "male",
    arabicParts: [
      { text: "كَيْفَ", pronunciation: "Kaifa" },
      { text: " ", pronunciation: "" },
      { text: "حَالُكَ؟", pronunciation: "Haluka" },
    ],
    translation: "How are you? (male)",
    image: "/assalamu_alaykum.webp",
  },
  {
    id: 2,
    type: "learn",
    audio: "/mp3/kaifa_haluki_e27efb9dae.mp3",
    ttsText: "كَيْفَ حَالُكِ؟",
    gender: "female",
    arabicParts: [
      { text: "كَيْفَ", pronunciation: "Kaifa" },
      { text: " ", pronunciation: "" },
      { text: "حَالُكِ؟", pronunciation: "Haluki" },
    ],
    translation: "How are you? (female)",
    image: "/assalamu_alaykum.webp",
  },
  {
    id: 3,
    type: "question",
    statement: "You use كَيْفَ حَالُكَ؟ to ask a woman how she is",
    explanation:
      "كَيْفَ حَالُكَ؟ (kaifa haluka) is used for males. For females, use كَيْفَ حَالُكِ؟ (kaifa haluki).",
    correct: false,
    image: "/assalamu_alaykum.webp",
  },
];

export default function TrueFalseLesson() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const router = useRouter();
  const { play } = useAudio();

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;

  // Global lesson progress (True/False = 2/6)
  const LESSON_TYPES = [
    "mcq",
    "true-false",
    "fill-in-the-blanks",
    "word-making",
    "sentence-making",
    "pair-match",
  ];
  const currentLessonType = "true-false";
  const currentLessonIndex = LESSON_TYPES.indexOf(currentLessonType);
  const totalLessons = LESSON_TYPES.length;
  const progressPercentage = ((currentLessonIndex + 1) / totalLessons) * 100;

  const handleOptionClick = (option) => {
    if (isCorrect !== null) return;
    setSelectedOption(option);
  };

  const handlePlayAudio = () => {
    play({
      url: currentQuestion.audio,
      text: currentQuestion.ttsText,
      lang: "ar-SA",
      gender: currentQuestion.gender,
      rate: 1.0,
    });
  };

  const handlePlayAudioSlow = () => {
    play({
      url: currentQuestion.audio,
      text: currentQuestion.ttsText,
      lang: "ar-SA",
      gender: currentQuestion.gender,
      rate: 0.6,
    });
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsCorrect(selectedOption === currentQuestion.correct);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      router.push("/lesson/fill-in-the-blanks");
    }
  };

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {currentQuestion.type === "learn" ? (
              <>
                {/* Learning Section */}
                {/* Audio Button and Title */}
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  <button
                    onClick={handlePlayAudio}
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90 self-start"
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={handlePlayAudioSlow}
                    className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center text-foreground hover:opacity-90 self-start"
                    aria-label="Play slow audio"
                  >
                    <Turtle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                    {currentQuestion.arabicParts.map((part, idx) => (
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
                    ({currentQuestion.translation})
                  </div>
                </div>

                {/* Image and Content Side by Side */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
                  {/* Image Container */}
                  <div className="lg:w-2/5 flex justify-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-sm">
                      <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl sm:rounded-2xl p-2">
                        <img
                          src={currentQuestion.image}
                          alt="Learning illustration"
                          className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Translation Display */}
                  <div className="lg:w-3/5 w-full space-y-4 sm:space-y-6">
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
                      <div className="text-center space-y-4">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                          {currentQuestion.arabicParts.map((part, idx) => (
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
                        </h3>
                        <div className="h-px bg-border my-4" />
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
                          {currentQuestion.translation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Question Section */}
                {/* Title */}
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                    True or False?
                  </p>
                </div>

                {/* Question Progress */}
                {/* <div className="text-center sm:text-start">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div> */}

                {/* Image and Content Side by Side */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
                  {/* Image Container */}
                  <div className="lg:w-2/5 flex justify-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-sm">
                      <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl sm:rounded-2xl p-2">
                        <img
                          src={currentQuestion.image}
                          alt="Question illustration"
                          className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statement and Options */}
                  <div className="lg:w-3/5 w-full space-y-4 sm:space-y-6">
                    {/* Statement Box */}
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">
                        {currentQuestion.statement}
                      </h3>

                      {/* Explanation (shown after answer) */}
                      {isCorrect !== null && (
                        <div
                          className={`mt-4 p-3 sm:p-4 rounded-lg ${isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}
                        >
                          <p className="text-sm sm:text-base text-foreground text-center">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* True/False Options */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {/* True Option */}
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => handleOptionClick(true)}
                        disabled={isCorrect !== null}
                        className={`
                      p-4 sm:p-6 md:p-8 
                      w-full 
                      min-h-[100px] sm:min-h-[120px]
                      rounded-xl sm:rounded-2xl 
                      border-2 
                      transition-all 
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      flex flex-col items-center justify-center gap-2 sm:gap-3
                      ${
                        selectedOption === true
                          ? isCorrect === true
                            ? "border-green-500 bg-green-500/10 text-green-600"
                            : isCorrect === false
                              ? "border-red-500 bg-red-500/10 text-red-600"
                              : "border-accent bg-accent/10 text-foreground"
                          : "border-border bg-card text-foreground hover:border-accent"
                      }
                    `}
                      >
                        <div
                          className={`
                      w-10 h-10 sm:w-12 sm:h-12 
                      rounded-full 
                      flex items-center justify-center 
                      text-lg sm:text-2xl font-bold
                      ${
                        selectedOption === true
                          ? isCorrect === true
                            ? "bg-green-500 text-white"
                            : isCorrect === false
                              ? "bg-red-500 text-white"
                              : "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                        >
                          <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold">
                          True
                        </span>
                      </motion.button>

                      {/* False Option */}
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => handleOptionClick(false)}
                        disabled={isCorrect !== null}
                        className={`
                      p-4 sm:p-6 md:p-8 
                      w-full 
                      min-h-[100px] sm:min-h-[120px]
                      rounded-xl sm:rounded-2xl 
                      border-2 
                      transition-all 
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      flex flex-col items-center justify-center gap-2 sm:gap-3
                      ${
                        selectedOption === false
                          ? isCorrect === true
                            ? "border-green-500 bg-green-500/10 text-green-600"
                            : isCorrect === false
                              ? "border-red-500 bg-red-500/10 text-red-600"
                              : "border-accent bg-accent/10 text-foreground"
                          : "border-border bg-card text-foreground hover:border-accent"
                      }
                    `}
                      >
                        <div
                          className={`
                      w-10 h-10 sm:w-12 sm:h-12 
                      rounded-full 
                      flex items-center justify-center 
                      text-lg sm:text-2xl font-bold
                      ${
                        selectedOption === false
                          ? isCorrect === true
                            ? "bg-green-500 text-white"
                            : isCorrect === false
                              ? "bg-red-500 text-white"
                              : "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                        >
                          <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold">
                          False
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="">
        {currentQuestion.type === "learn" ? (
          <div className="border-t-2 border-border bg-background min-h-[120px] flex flex-col justify-center">
            <div className="container max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleNext}
                className="text-muted-foreground hover:text-foreground font-bold text-lg underline underline-offset-4 order-2 sm:order-1"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="w-full sm:w-auto sm:min-w-[200px] h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl order-1 sm:order-2"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <LessonResultHandler
            isCorrect={isCorrect}
            correctAnswer={
              currentQuestion.type === "question" && currentQuestion.correct
                ? "True"
                : "False"
            }
            onCheck={handleCheckAnswer}
            onContinue={handleNext}
            onSkip={handleNext}
            disabled={
              currentQuestion.type === "question" && selectedOption === null
            }
          />
        )}
      </div>
    </div>
  );
}
