"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GemStone } from "@/components/icons/Gem";
import { useToast } from "@/components/ui/use-toast";

const words = [
  "dia",
  "berenang",
  "sampai",
  "berolahraga",
  "dan",
  "Saya",
  "itu",
  "berjalan",
  "jumpa",
];

const correctAnswer = ["Saya", "berjalan", "dan", "dia", "berenang"];

export default function TranslateLesson() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(words);
  const router = useRouter();
  const { toast } = useToast();

  const handleWordClick = (word) => {
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (index) => {
    const word = selectedWords[index];
    setAvailableWords([...availableWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleCheckAnswer = () => {
    if (selectedWords.length === 0) return;
    
    const isAnswerCorrect = JSON.stringify(selectedWords) === JSON.stringify(correctAnswer);
    
    if (isAnswerCorrect) {
      toast({
        title: "Correct! 🎉",
        description: "Great job! Your translation is correct.",
        variant: "success",
      });
      
      setTimeout(() => {
        router.push("/lesson/mcq");
      }, 1500);
    } else {
      toast({
        title: "Wrong!",
        description: "Correct answer: Saya berjalan dan dia berenang.",
        variant: "error",
      });
      
      // Reset after toast disappears
      setTimeout(() => {
        setSelectedWords([]);
        setAvailableWords(words);
      }, 3000);
    }
  };

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
              <div className="h-full bg-accent w-1/5" />
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
                Translate this sentence
              </h2>
              <div className="flex items-center gap-4 bg-card p-6 rounded-2xl border border-border">
                <button className="flex-shrink-0 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:opacity-90">
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xl font-semibold text-foreground">
                  I walk and she swims.
                </p>
              </div>
            </div>

            {/* Selected Words Area */}
            <div className="min-h-[80px] bg-card rounded-2xl border-2 border-border p-4">
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => handleRemoveWord(index)}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90"
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
                  className="px-6 py-3 bg-card border-2 border-border rounded-xl font-semibold text-foreground hover:border-accent transition-colors"
                >
                  {word}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="border-t border-border bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Button
            onClick={handleCheckAnswer}
            disabled={selectedWords.length === 0}
            className="w-full md:w-auto md:min-w-[200px] md:ml-auto md:flex h-14 bg-accent hover:opacity-90 text-accent-foreground font-bold text-lg rounded-xl disabled:opacity-50"
          >
            Check Answers
          </Button>
        </div>
      </div>
    </div>
  );
}