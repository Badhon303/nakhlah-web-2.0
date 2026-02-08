/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Volume2, X, Turtle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { ArabicTooltip } from "@/components/nakhlah/ArabicTooltip";
import LeavingDialog from "../leaving/page";
import { LessonResultHandler } from "../../components/ResultHandler";
import { useAudio } from "@/hooks/use-audio";

// Fill-in-the-Blank question for kaifa haluki
const QUESTIONS = [
  {
    id: 1,
    audio: "/mp3/kaifa_haluki_e27efb9dae.mp3",
    ttsText: "كَيْفَ حَالُكِ؟",
    gender: "female",
    englishSentence: "___ are you",
    arabicSentence: "___ حَالُكِ؟",
    arabicParts: [
      { text: "كَيْفَ", pronunciation: "Kaifa" },
      { text: " ", pronunciation: "" },
      { text: "حَالُكِ؟", pronunciation: "Haluki" },
    ],
    translation: "How are you? (female)",
    englishAnswer: "How",
    arabicAnswer: "كَيْفَ",
    image: "/assalamu_alaykum.webp",
  },
];

export default function FillInBlankLesson() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const router = useRouter();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const { play } = useAudio();

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;

  // Global lesson progress (Fill-in-the-Blanks = 3/6)
  const LESSON_TYPES = [
    "mcq",
    "true-false",
    "fill-in-the-blanks",
    "word-making",
    "sentence-making",
    "pair-match",
  ];
  const currentLessonType = "fill-in-the-blanks";
  const currentLessonIndex = LESSON_TYPES.indexOf(currentLessonType);
  const totalLessons = LESSON_TYPES.length;
  const progressPercentage = ((currentLessonIndex + 1) / totalLessons) * 100;

  const handleCheckAnswer = () => {
    if (!answer.trim() || isCorrect !== null) return;
    const correct =
      answer.trim().toLowerCase() ===
      currentQuestion.englishAnswer.toLowerCase();
    setIsCorrect(correct);
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

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setIsCorrect(null);
    } else {
      router.push("/lesson/word-making");
    }
  };

  const parts = currentQuestion.englishSentence.split("___");

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
                Fill in the blank
              </p>
            </div>

            {/* Image and Sentence Side by Side */}
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

              {/* Sentence Container */}
              <div className="lg:w-3/5 w-full">
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                  {/* Arabic Question with Tooltips */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-base sm:text-lg md:text-xl text-foreground">
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
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-lg sm:text-xl md:text-2xl font-semibold">
                    <span className="text-foreground">___ are you</span>
                  </div>

                  {/* Input Field */}
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <div className="relative">
                      <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={isCorrect !== null}
                        className={`
                          w-24 sm:w-32 md:w-40 lg:w-48 
                          h-12 sm:h-14 md:h-16 
                          text-center 
                          text-base sm:text-lg md:text-xl 
                          font-bold 
                          border-2
                          ${isCorrect === true ? "border-green-500" : isCorrect === false ? "border-red-500" : "border-accent"}
                          disabled:opacity-50 disabled:cursor-not-allowed
                          rounded-lg sm:rounded-xl
                        `}
                        placeholder="______"
                      />
                      {answer && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                          Type your answer
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hint */}
                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Listen to the audio and type the missing English word
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="">
        <LessonResultHandler
          isCorrect={isCorrect}
          correctAnswer={currentQuestion.englishAnswer}
          onCheck={handleCheckAnswer}
          onContinue={handleNext}
          onSkip={handleNext}
          disabled={!answer.trim()}
        />
      </div>
    </div>
  );
}
