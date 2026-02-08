/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, X, Turtle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { ArabicTooltip } from "@/components/nakhlah/ArabicTooltip";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";
import { useAudio } from "@/hooks/use-audio";

// Multiple questions with learning step
const QUESTIONS = [
  {
    id: 1,
    type: "learn",
    audio: "/mp3/assalamu_alaykum_f39425b3f2.mp3",
    ttsText: "السَّلامُ عَلَيْكُمْ",
    arabicParts: [
      { text: "السَّلامُ", pronunciation: "Assalamu" },
      { text: " ", pronunciation: "" },
      { text: "عَلَيْكُمْ", pronunciation: "Alaikum" },
    ],
    translation: "Peace be upon you",
    image: "/assalamu_alaykum.webp",
  },
  {
    id: 2,
    type: "question",
    audio: "/mp3/assalamu_alaykum_f39425b3f2.mp3",
    ttsText: "السَّلامُ عَلَيْكُمْ",
    question: "What is the meaning of",
    arabicParts: [
      { text: "السَّلامُ", pronunciation: "Assalamu" },
      { text: " ", pronunciation: "" },
      { text: "عَلَيْكُمْ", pronunciation: "Alaikum" },
    ],
    showArabicInQuestion: true,
    image: "/assalamu_alaykum.webp",
    options: [
      { id: 1, text: "Peace be upon you", correct: true },
      { id: 2, text: "How are you?", correct: false },
      { id: 3, text: "My name is", correct: false },
      { id: 4, text: "Good morning", correct: false },
    ],
  },
  {
    id: 3,
    type: "learn",
    audio: "/mp3/ismee_e33727b3bb.mp3",
    ttsText: "اِسْمِي",
    arabicParts: [{ text: "اِسْمِي", pronunciation: "Ismee" }],
    translation: "My name is...",
    image: "/assalamu_alaykum.webp",
  },
  {
    id: 4,
    type: "question",
    audio: "/mp3/Ismi_Muhammad_ac06c40781.mp3",
    ttsText: "اِسْمِي مُحَمَّد",
    gender: "male",
    question: "What does the speaker say?",
    image: "/assalamu_alaykum.webp",
    options: [
      { id: 1, text: "My name is Muhammad", correct: true },
      { id: 2, text: "My name is Fatima", correct: false },
      { id: 3, text: "How are you? (male)", correct: false },
      { id: 4, text: "Peace be upon you", correct: false },
    ],
  },
  {
    id: 5,
    type: "question",
    audio: "/mp3/ismee_fatima_5a1d266777.mp3",
    ttsText: "اِسْمِي فَاطِمَه",
    gender: "female",
    question: "What does the speaker say?",
    image: "/my_name.webp",
    options: [
      { id: 1, text: "My name is Muhammad", correct: false },
      { id: 2, text: "My name is Fatima", correct: true },
      { id: 3, text: "How are you? (female)", correct: false },
      { id: 4, text: "Peace be upon you", correct: false },
    ],
  },
];

export default function MCQLesson() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const { play } = useAudio();

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;

  // Global lesson progress (MCQ = 1/6)
  const LESSON_TYPES = [
    "mcq",
    "true-false",
    "fill-in-the-blanks",
    "word-making",
    "sentence-making",
    "pair-match",
  ];
  const currentLessonType = "mcq";
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
    if (!selectedOption) return;
    setIsCorrect(selectedOption.correct);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      router.push("/lesson/true-false");
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

      {/*  Dialog */}
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
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                    Question
                  </p>
                </div>

                {/* Question */}
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center sm:text-start">
                    {currentQuestion.question}
                    {currentQuestion.showArabicInQuestion && (
                      <>
                        {" "}
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
                        ?
                      </>
                    )}
                  </h2>
                </div>

                {/* Image and Options Side by Side */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
                  {/* Image Container - Different sizes for mobile vs desktop */}
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

                  {/* Options Container - Always 2 columns grid */}
                  <div className="lg:w-3/5 w-full">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleOptionClick(option)}
                          disabled={isCorrect !== null}
                          className={`p-3 sm:p-4 md:p-6 w-full min-h-[80px] sm:min-h-[100px] rounded-lg sm:rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                            selectedOption?.id === option.id
                              ? isCorrect === true
                                ? "border-green-500 bg-green-500/10 text-green-600"
                                : isCorrect === false
                                  ? "border-red-500 bg-red-500/10 text-red-600"
                                  : "border-accent bg-accent/10 text-foreground shadow-md sm:shadow-lg"
                              : "border-border bg-card text-foreground hover:border-accent hover:shadow-sm sm:hover:shadow-md"
                          }`}
                        >
                          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center leading-tight">
                            {option.text}
                          </span>
                        </motion.button>
                      ))}
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
            correctAnswer={currentQuestion.options.find((o) => o.correct)?.text}
            onCheck={handleCheckAnswer}
            onContinue={handleNext}
            onSkip={handleNext}
            disabled={!selectedOption}
          />
        )}
      </div>
    </div>
  );
}
