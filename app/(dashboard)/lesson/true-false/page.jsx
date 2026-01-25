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

// Dummy data
const DUMMY_STATEMENT = "كلمة 'شكراً' تعني 'Thank you' بالإنجليزية";
const DUMMY_CORRECT_ANSWER = true;

export default function TrueFalseLesson() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleOptionClick = (option) => {
    if (result !== null) return; // Prevent changes after answer submitted
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setResult(selectedOption === DUMMY_CORRECT_ANSWER);
  };

  const onNext = () => {
    // Last lesson in sequence - go to completed
    sessionStorage.removeItem("currentLessonIndex");
    sessionStorage.removeItem("selectedLessonId");
    sessionStorage.removeItem("selectedNodeId");
    router.push("/lesson/completed");
  };

  return (
    <div className="min-h-[calc(100vh_-_64px)] lg:min-h-screen bg-background flex flex-col">
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
              <div className="h-full bg-accent w-6/6" />
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
            className="space-y-8"
          >
            {/* Question */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center sm:text-start">
                True or False?
              </h2>

              {/* Audio Statement */}
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border mb-6">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  Listen to the statement
                </p>
              </div>

              {/* Statement */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <h3 className="text-2xl font-bold text-foreground text-center">
                  {DUMMY_STATEMENT}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {/* True Option */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => handleOptionClick(true)}
                  disabled={result !== null}
                  className={`p-6 rounded-2xl border-2 text-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedOption === true
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-card text-foreground hover:border-accent"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                        selectedOption === true
                          ? "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      ✓
                    </div>
                    <span className="text-xl">True</span>
                  </div>
                </motion.button>

                {/* False Option */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => handleOptionClick(false)}
                  disabled={result !== null}
                  className={`p-6 rounded-2xl border-2 text-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedOption === false
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-card text-foreground hover:border-accent"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                        selectedOption === false
                          ? "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      ✗
                    </div>
                    <span className="text-xl">False</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <LessonResultHandler
        isCorrect={result}
        correctAnswer={DUMMY_CORRECT_ANSWER ? "True" : "False"}
        onCheck={handleCheckAnswer}
        onContinue={onNext}
        onSkip={onNext}
        disabled={selectedOption === null}
      />
    </div>
  );
}
