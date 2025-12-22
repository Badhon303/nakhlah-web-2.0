import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/nakhlah/Mascot";
import { ArrowRight, Languages, Clock, Award } from "lucide-react";

const languageNames = {
  arabic: "Arabic",
  english: "English",
  french: "French",
  spanish: "Spanish",
  german: "German",
  urdu: "Urdu",
};

export function CompletionStep({ language, dailyGoal, quizScore, onComplete }) {
  return (
    <div className="w-full max-w-[520px] mx-auto text-center">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="bg-gradient-to-b from-white/60 to-white/40 dark:from-black/40 dark:to-black/30 p-6 rounded-3xl border border-border shadow-lg"
      >
        <Mascot mood="proud" size="xxl" className="mx-auto" />
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-foreground mb-1">
              You&apos;re all set!
            </h1>
            <p className="text-muted-foreground">
              Your personalized learning journey begins now.
            </p>
          </div>

          <div className="w-full mt-3 bg-card p-4 rounded-2xl border border-border">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Languages className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">
                    Learning {languageNames[language] || language}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your chosen language
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">
                    {dailyGoal} minutes daily
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your daily goal
                  </p>
                </div>
              </div>

              {quizScore > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {quizScore}/3 correct answers
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Assessment result
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Complete your first lesson today to start your streak! 🔥
          </p>
        </div>
      </motion.div>
    </div>
  );
}
