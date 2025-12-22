import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, BookOpen, GraduationCap, Brain } from "lucide-react";
import { Mascot } from "../Mascot";

const proficiencyLevels = [
  {
    value: "beginner",
    label: "I'm new to this",
    description: "Start from the very beginning",
    icon: Sparkles,
    color: "text-secondary",
  },
  {
    value: "elementary",
    label: "I know some basics",
    description: "Simple phrases and greetings",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    value: "intermediate",
    label: "I can have conversations",
    description: "Comfortable with common topics",
    icon: GraduationCap,
    color: "text-accent",
  },
  {
    value: "advanced",
    label: "I'm quite fluent",
    description: "Just need to polish my skills",
    icon: Brain,
    color: "text-violet-light",
  },
];

export function ProficiencyStep({ selectedLevel, onSelect }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-8 justify-center"
      >
        <Mascot mood="excited" size="md" className="w-20 h-20" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            How much do you know?
          </h1>
          <p className="text-muted-foreground text-lg">
            We&apos;ll personalize your learning path
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {proficiencyLevels.map((level, index) => {
          const Icon = level.icon;
          return (
            <motion.button
              key={level.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(level.value)}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300",
                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                selectedLevel === level.value
                  ? "border-accent bg-accent/10 shadow-accent-glow"
                  : "border-border bg-card hover:border-primary"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  selectedLevel === level.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    selectedLevel === level.value ? "" : level.color
                  )}
                />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-foreground text-lg">
                  {level.label}
                </p>
                <p className="text-muted-foreground text-sm">
                  {level.description}
                </p>
              </div>
              {selectedLevel === level.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-accent-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
