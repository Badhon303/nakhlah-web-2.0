"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { useToast } from "@/components/ui/use-toast";

// Dummy data
const DUMMY_SENTENCE = "The ___ is the largest planet in our solar system.";
const DUMMY_CORRECT_ANSWER = "Jupiter";

export default function FillInBlankLesson() {
  const [answer, setAnswer] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckAnswer = () => {
    if (answer.trim()) {
      const correct = answer.trim().toLowerCase() === DUMMY_CORRECT_ANSWER.toLowerCase();
      
      if (correct) {
        toast({
          title: "Correct! 🎉",
          description: "Great job! Your answer is correct.",
          variant: "success",
        });
        
        setTimeout(() => {
          router.push("/lesson/true-false");
        }, 1500);
      } else {
        toast({
          title: "Wrong answer",
          description: `The correct answer is "${DUMMY_CORRECT_ANSWER}"`,
          variant: "error",
        });
        setAnswer("");
      }
    }
  };

  const parts = DUMMY_SENTENCE.split("___");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent w-3/5" />
            </div>
            <div className="flex items-center gap-2">
              <GemStone size="sm" />
              <span className="text-accent font-bold">100</span>
            </div>
          </div>
        </div>
      </div>

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
                Fill in the blank
              </h2>
              
              {/* Audio Sentence */}
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border mb-6">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  Complete the sentence below
                </p>
              </div>

              {/* Sentence with Input */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex flex-wrap items-center justify-center gap-3 text-2xl font-medium">
                  {parts[0]}
                  <div className="relative">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-48 h-14 text-center text-xl font-bold border-accent"
                      placeholder="Type here"
                    />
                  </div>
                  {parts[1]}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="border-t border-border bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Button
            onClick={handleCheckAnswer}
            disabled={!answer.trim()}
            className="w-full md:w-auto md:min-w-[200px] md:ml-auto md:flex h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl disabled:opacity-50"
          >
            Check Answers
          </Button>
        </div>
      </div>
    </div>
  );
}