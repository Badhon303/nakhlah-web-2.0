/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, X, Turtle, Check, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import LeavingDialog from "./leaving/page";
import { LessonResultHandler } from "../components/ResultHandler";
import LessonHeader from "../components/LessonHeader";
import { useAudio } from "@/hooks/use-audio";
import { ArabicTooltip } from "@/components/nakhlah/ArabicTooltip";
import { getMediaUrl, shuffleArray, sortByOrder } from "./utils/mediaUtils";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { fetchLessonQuestions as fetchLessonAPI } from "@/services/api";
import LessonLoadingView from "./loading/LessonLoadingView";

function normalizeText(value) {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ");
}

function getQuestionMedia(question, mediaType) {
  const mediaList = Array.isArray(question?.questionMedia)
    ? question.questionMedia
    : [];
  const mediaItem = mediaList.find((item) => item?.mediaType === mediaType);
  const mediaUrl = mediaItem?.media?.url;

  return mediaUrl ? getMediaUrl(mediaUrl) : "";
}

function normalizeQuestionsPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.questions)) return payload.questions;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export default function LessonPage() {
  const router = useRouter();
  const { play } = useAudio();
  const { data: session, status } = useSession();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [lives] = useState(5);

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");

  const [selectedTokens, setSelectedTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState([]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [leftState, setLeftState] = useState([]);
  const [rightState, setRightState] = useState([]);
  const [incorrectPairs, setIncorrectPairs] = useState([]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progressPercentage =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const questionType = currentQuestion?.question_type;

  const imageUrl = getQuestionMedia(currentQuestion, "image");
  const audioUrl = getQuestionMedia(currentQuestion, "audio");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated" || !isSessionValid(session)) {
      router.push("/auth/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchLessonQuestions = async () => {
      // Wait for session to load
      if (status === "loading") return;
      
      // Check if session is valid
      if (!isSessionValid(session)) {
        setLoadError("Please login to access lessons.");
        setIsLoading(false);
        router.push("/auth/login");
        return;
      }

      const lessonId = sessionStorage.getItem("selectedLessonId")?.trim();
      if (!lessonId) {
        setLoadError("No lesson selected.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");

        const token = getSessionToken(session);
        if (!token) {
          throw new Error("No authentication token available");
        }

        // Use API service
        const result = await fetchLessonAPI(lessonId, token);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        console.log("Lesson API raw response:", result.data);

        const normalizedQuestions = normalizeQuestionsPayload(result.data);
        if (!normalizedQuestions.length) {
          throw new Error("No questions returned from API.");
        }

        setQuestions(normalizedQuestions);
        setCurrentIndex(0);
      } catch (error) {
        setLoadError(error?.message || "Unable to load lesson.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonQuestions();
  }, [status, session, router]);

  useEffect(() => {
    if (currentIndex >= totalQuestions && totalQuestions > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalQuestions]);

  const mcqOptions = useMemo(() => {
    if (questionType !== "mcq") return [];
    return (currentQuestion.answers || []).map((answer) => ({
      id: answer.id,
      text: answer.title,
      correct: Boolean(answer.is_correct),
    }));
  }, [currentQuestion, questionType]);

  const fillBlankCorrectAnswer = useMemo(() => {
    if (questionType !== "fill_blank") return "";
    return (
      (currentQuestion.answers || []).find((answer) => Boolean(answer.is_correct))
        ?.title || ""
    );
  }, [currentQuestion, questionType]);

  const fillBlankOptions = useMemo(() => {
    if (questionType !== "fill_blank") return [];
    return (currentQuestion.answers || []).map((answer) => ({
      id: answer.id,
      text: answer.title,
      correct: Boolean(answer.is_correct),
    }));
  }, [currentQuestion, questionType]);

  const fillBlankQuestionParts = useMemo(() => {
    if (questionType !== "fill_blank") {
      return { before: "", blank: "", after: "", hasBlank: false };
    }

    const title = (currentQuestion?.question_title || "").toString();
    const match = title.match(/_{2,}|-{3,}|\.{3,}/);

    if (!match || match.index === undefined) {
      return {
        before: title,
        blank: "____",
        after: "",
        hasBlank: false,
      };
    }

    const startIndex = match.index;
    const endIndex = startIndex + match[0].length;

    return {
      before: title.slice(0, startIndex),
      blank: match[0],
      after: title.slice(endIndex),
      hasBlank: true,
    };
  }, [currentQuestion, questionType]);

  const orderedTokens = useMemo(() => {
    if (questionType !== "word_making" && questionType !== "sentence_making") {
      return [];
    }
    return sortByOrder(currentQuestion.answers || []).map((answer) => answer.title);
  }, [currentQuestion, questionType]);

  useEffect(() => {
    setIsCorrect(null);
    setSelectedOptionId(null);
    setSelectedTrueFalse(null);
    setFillBlankAnswer("");
    setSelectedTokens([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIncorrectPairs([]);

    if (questionType === "word_making" || questionType === "sentence_making") {
      setAvailableTokens(shuffleArray(orderedTokens));
      return;
    }

    if (questionType === "pair_matching") {
      const pairs = currentQuestion.answers || [];
      const leftItems = pairs.map((pair, index) => ({
        id: `left-${index}-${pair.id}`,
        text: pair.left_title,
        matchKey: pair.id,
        matched: false,
      }));
      const rightItems = shuffleArray(
        pairs.map((pair, index) => ({
          id: `right-${index}-${pair.id}`,
          text: pair.right_title,
          matchKey: pair.id,
          matched: false,
        })),
      );
      setLeftState(leftItems);
      setRightState(rightItems);
      return;
    }

    setAvailableTokens([]);
    setLeftState([]);
    setRightState([]);
  }, [currentIndex, currentQuestion, orderedTokens, questionType]);

  const handlePlayAudio = () => {
    if (!audioUrl) return;
    play({ url: audioUrl, rate: 1.0 });
  };

  const handlePlayAudioSlow = () => {
    if (!audioUrl) return;
    play({ url: audioUrl, rate: 0.6 });
  };

  const goToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    sessionStorage.removeItem("currentLessonIndex");
    sessionStorage.removeItem("selectedLessonId");
    sessionStorage.removeItem("selectedNodeId");
    router.push("/lesson/completed");
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    if (questionType === "mcq") {
      const selected = mcqOptions.find((option) => option.id === selectedOptionId);
      if (!selected) return;
      setIsCorrect(selected.correct);
      return;
    }

    if (questionType === "true_false") {
      if (selectedTrueFalse === null) return;
      setIsCorrect(selectedTrueFalse === Boolean(currentQuestion.true_false_answer));
      return;
    }

    if (questionType === "fill_blank") {
      if (!fillBlankAnswer.trim()) return;
      setIsCorrect(
        normalizeText(fillBlankAnswer) === normalizeText(fillBlankCorrectAnswer),
      );
      return;
    }

    if (questionType === "word_making" || questionType === "sentence_making") {
      if (selectedTokens.length === 0) return;
      setIsCorrect(
        JSON.stringify(selectedTokens) === JSON.stringify(orderedTokens),
      );
      return;
    }

    if (questionType === "pair_matching") {
      setIsCorrect(leftState.length > 0 && leftState.every((item) => item.matched));
      return;
    }

    goToNext();
  };

  const handleTokenClick = (token, index) => {
    if (isCorrect !== null) return;
    setSelectedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveToken = (index) => {
    if (isCorrect !== null) return;
    const token = selectedTokens[index];
    setSelectedTokens((prev) => prev.filter((_, i) => i !== index));
    setAvailableTokens((prev) => [...prev, token]);
  };

  const checkMatch = (leftItem, rightItem) => {
    if (leftItem.matchKey === rightItem.matchKey) {
      setLeftState((prev) =>
        prev.map((item) =>
          item.id === leftItem.id ? { ...item, matched: true } : item,
        ),
      );
      setRightState((prev) =>
        prev.map((item) =>
          item.id === rightItem.id ? { ...item, matched: true } : item,
        ),
      );
    } else {
      setIncorrectPairs((prev) => [
        ...prev,
        { leftId: leftItem.id, rightId: rightItem.id },
      ]);
      setTimeout(() => setIncorrectPairs([]), 450);
    }
    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 200);
  };

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

  const learnAnswerEntry = useMemo(() => {
    if (questionType !== "learn") return ["", ""];
    return Object.entries(currentQuestion.learn_answer || {})[0] || ["", ""];
  }, [currentQuestion, questionType]);

  const matchedCount = leftState.filter((item) => item.matched).length;

  if (isLoading) {
    return <LessonLoadingView progress={65} />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-destructive">
            {loadError}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-xl bg-accent text-accent-foreground font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col">
      <LessonHeader
        progressPercentage={progressPercentage}
        onExit={() => setShowExitDialog(true)}
        initialElapsedSeconds={0}
        lives={lives}
        maxLives={5}
      />

      {showExitDialog && (
        <div className="fixed inset-0 z-50">
          <LeavingDialog onCancel={() => setShowExitDialog(false)} />
        </div>
      )}

      <div
        className={`flex-1 flex justify-center p-3 sm:p-4 ${
          questionType === "pair_matching"
            ? "items-start overflow-y-auto overflow-x-hidden"
            : "items-center"
        }`}
      >
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            key={currentQuestion?.id || currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {questionType === "learn" && (
              <>
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  {audioUrl ? (
                    <>
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
                    </>
                  ) : null}
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                    Learn
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
                  <div className="lg:w-2/5 flex justify-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-sm">
                      <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl sm:rounded-2xl p-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Learning illustration"
                            className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-3/5 w-full space-y-4 sm:space-y-6">
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
                      <div className="text-center space-y-4">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                          {learnAnswerEntry[1]
                            .split(/\s+/)
                            .filter(Boolean)
                            .map((word, index, words) => {
                              const pronunciation = learnAnswerEntry[0]
                                .split(/\s+/)
                                .filter(Boolean)[index];
                              const isLast = index === words.length - 1;
                              return (
                                <span key={`${word}-${index}`}>
                                  <ArabicTooltip
                                    text={word}
                                    pronunciation={pronunciation}
                                  />
                                  {isLast ? "" : " "}
                                </span>
                              );
                            })}
                        </h3>
                        <div className="h-px bg-border my-4" />
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
                          {currentQuestion.question_title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {questionType === "mcq" && (
              <>
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  {audioUrl ? (
                    <>
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
                    </>
                  ) : null}
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">Question</p>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center sm:text-start">
                  {currentQuestion.question_title}
                </h2>

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
                  <div className="lg:w-2/5 flex justify-center">
                    <div className="relative w-full max-w-[280px] sm:max-w-sm">
                      <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl sm:rounded-2xl p-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Question illustration"
                            className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-3/5 w-full">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {mcqOptions.map((option, index) => (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setSelectedOptionId(option.id)}
                          disabled={isCorrect !== null}
                          className={`p-3 sm:p-4 md:p-6 w-full min-h-[80px] sm:min-h-[100px] rounded-lg sm:rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                            selectedOptionId === option.id
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

            {questionType === "true_false" && (
              <>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                    True or False?
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">
                    {currentQuestion.question_title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setSelectedTrueFalse(true)}
                    disabled={isCorrect !== null}
                    className={`p-4 sm:p-6 md:p-8 w-full min-h-[100px] sm:min-h-[120px] rounded-xl sm:rounded-2xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 sm:gap-3 ${
                      selectedTrueFalse === true
                        ? isCorrect === true
                          ? "border-green-500 bg-green-500/10 text-green-600"
                          : isCorrect === false
                            ? "border-red-500 bg-red-500/10 text-red-600"
                            : "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-card text-foreground hover:border-accent"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold ${
                        selectedTrueFalse === true
                          ? isCorrect === true
                            ? "bg-green-500 text-white"
                            : isCorrect === false
                              ? "bg-red-500 text-white"
                              : "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold">True</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setSelectedTrueFalse(false)}
                    disabled={isCorrect !== null}
                    className={`p-4 sm:p-6 md:p-8 w-full min-h-[100px] sm:min-h-[120px] rounded-xl sm:rounded-2xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 sm:gap-3 ${
                      selectedTrueFalse === false
                        ? isCorrect === true
                          ? "border-green-500 bg-green-500/10 text-green-600"
                          : isCorrect === false
                            ? "border-red-500 bg-red-500/10 text-red-600"
                            : "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-card text-foreground hover:border-accent"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold ${
                        selectedTrueFalse === false
                          ? isCorrect === true
                            ? "bg-green-500 text-white"
                            : isCorrect === false
                              ? "bg-red-500 text-white"
                              : "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold">False</span>
                  </motion.button>
                </div>
              </>
            )}

            {questionType === "fill_blank" && (
              <>
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  {audioUrl ? (
                    <>
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
                    </>
                  ) : null}
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                    Fill in the blank
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center leading-relaxed">
                    {fillBlankQuestionParts.hasBlank ? (
                      <>
                        {fillBlankQuestionParts.before}
                        <span className="inline-flex min-w-[110px] sm:min-w-[140px] mx-1 align-middle justify-center border-b-2 border-foreground/40 overflow-hidden leading-none py-1">
                          <AnimatePresence mode="wait">
                            {fillBlankAnswer ? (
                              <motion.span
                                key={fillBlankAnswer}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                className="inline-block text-foreground"
                              >
                                {fillBlankAnswer}
                              </motion.span>
                            ) : (
                              <motion.span
                                key="blank"
                                initial={{ opacity: 0.6 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.6 }}
                                className="inline-block text-muted-foreground"
                              >
                                {fillBlankQuestionParts.blank}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        {fillBlankQuestionParts.after}
                      </>
                    ) : (
                      <>
                        {fillBlankQuestionParts.before}
                        <span className="inline-flex min-w-[110px] sm:min-w-[140px] mx-1 align-middle justify-center border-b-2 border-foreground/40 overflow-hidden leading-none py-1">
                          <AnimatePresence mode="wait">
                            {fillBlankAnswer ? (
                              <motion.span
                                key={fillBlankAnswer}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                className="inline-block text-foreground"
                              >
                                {fillBlankAnswer}
                              </motion.span>
                            ) : (
                              <motion.span
                                key="blank-fallback"
                                initial={{ opacity: 0.6 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.6 }}
                                className="inline-block text-muted-foreground"
                              >
                                ____
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </>
                    )}
                  </h2>
                  <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                    {fillBlankOptions.map((option, index) => {
                      const isSelected =
                        normalizeText(fillBlankAnswer) === normalizeText(option.text);

                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setFillBlankAnswer(option.text)}
                          disabled={isCorrect !== null}
                          className={`p-3 sm:p-4 md:p-6 w-full min-h-[80px] sm:min-h-[100px] rounded-lg sm:rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                            isSelected
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
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {(questionType === "word_making" || questionType === "sentence_making") && (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center sm:text-start">
                    {currentQuestion.question_title}
                  </h2>
                </div>

                <div className="min-h-[90px] bg-card rounded-2xl border-2 border-border p-4">
                  <div
                    dir="rtl"
                    className="flex flex-wrap gap-2 justify-center items-center min-h-[58px]"
                  >
                    {selectedTokens.map((token, index) => (
                      <motion.button
                        key={`${token}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => handleRemoveToken(index)}
                        disabled={isCorrect !== null}
                        className="px-5 py-3 bg-accent text-accent-foreground rounded-xl font-bold text-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {token}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {availableTokens.map((token, index) => (
                    <motion.button
                      key={`${token}-${index}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTokenClick(token, index)}
                      disabled={isCorrect !== null}
                      className="px-4 py-3 bg-card border-2 border-border rounded-xl font-bold text-xl text-foreground hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {token}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {questionType === "pair_matching" && (
              <>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center sm:text-start">
                    Match Arabic & English
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="w-full">
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col overflow-hidden">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3 text-center">
                        Arabic
                      </h3>
                      <div className="space-y-2.5 sm:space-y-4 pr-1">
                        {leftState.map((item, index) => {
                          const isSelected = selectedLeft?.id === item.id;
                          const isMatched = item.matched;
                          const isIncorrect = incorrectPairs.some(
                            (pair) => pair.leftId === item.id,
                          );

                          return (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleLeftClick(item)}
                              disabled={isMatched}
                              className={`w-full p-2 sm:p-2.5 rounded-lg sm:rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] sm:min-h-[50px] ${
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

                  <div className="w-full">
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col overflow-hidden">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3 text-center">
                        English
                      </h3>
                      <div className="space-y-2.5 sm:space-y-4 pr-1">
                        {rightState.map((item, index) => {
                          const isSelected = selectedRight?.id === item.id;
                          const isMatched = item.matched;
                          const isIncorrect = incorrectPairs.some(
                            (pair) => pair.rightId === item.id,
                          );

                          return (
                            <motion.button
                              key={item.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleRightClick(item)}
                              disabled={isMatched}
                              className={`w-full p-2 sm:p-2.5 rounded-lg sm:rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] sm:min-h-[50px] ${
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

                <div className="text-center text-sm sm:text-base text-muted-foreground mt-3 pb-1 sm:pb-2">
                  {matchedCount} of {leftState.length} pairs correctly matched
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <div className="shrink-0">
        {questionType === "learn" ? (
          <div className="border-t-2 border-border bg-background min-h-[120px] flex flex-col justify-center">
            <div className="container max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={goToNext}
                className="text-muted-foreground hover:text-foreground font-bold text-lg underline underline-offset-4 order-2 sm:order-1"
              >
                Skip
              </button>
              <button
                onClick={goToNext}
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
              questionType === "mcq"
                ? mcqOptions.find((option) => option.correct)?.text
                : questionType === "true_false"
                  ? Boolean(currentQuestion.true_false_answer)
                    ? "True"
                    : "False"
                  : questionType === "fill_blank"
                    ? fillBlankCorrectAnswer
                    : questionType === "word_making" || questionType === "sentence_making"
                      ? orderedTokens.join(" ")
                      : !isCorrect && isCorrect !== null
                        ? "All pairs need to be correctly matched"
                        : undefined
            }
            onCheck={handleCheckAnswer}
            onContinue={goToNext}
            onSkip={goToNext}
            disabled={
              questionType === "mcq"
                ? !selectedOptionId
                : questionType === "true_false"
                  ? selectedTrueFalse === null
                  : questionType === "fill_blank"
                    ? !fillBlankAnswer.trim()
                    : questionType === "word_making" || questionType === "sentence_making"
                      ? selectedTokens.length === 0
                      : false
            }
          />
        )}
      </div>
    </div>
  );
}