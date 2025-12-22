import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Flame, Target, Trophy } from "lucide-react";
import { Mascot } from "../Mascot";

const dailyGoals = [
  {
    value: "5",
    label: "Casual",
    description: "5 min / day",
    icon: Zap,
    detail: "Perfect for busy schedules",
  },
  {
    value: "10",
    label: "Regular",
    description: "10 min / day",
    icon: Flame,
    detail: "Build a consistent habit",
  },
  {
    value: "15",
    label: "Serious",
    description: "15 min / day",
    icon: Target,
    detail: "Make steady progress",
  },
  {
    value: "20",
    label: "Intense",
    description: "20 min / day",
    icon: Trophy,
    detail: "Learn fast and deep",
  },
];

export function GoalStep({ selectedGoal, onSelect }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-8 justify-center"
      >
        <Mascot mood="sleeping" size="md" className="" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Set your daily goal
          </h1>
          <p className="text-muted-foreground text-lg">
            How much time can you dedicate each day?
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {dailyGoals.map((goal, index) => {
          const Icon = goal.icon;
          return (
            <motion.button
              key={goal.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(goal.value)}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                selectedGoal === goal.value
                  ? "border-accent bg-accent/10 shadow-accent-glow"
                  : "border-border bg-card hover:border-primary"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                  selectedGoal === goal.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-gradient-accent text-accent-foreground"
                )}
              >
                <Icon className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-lg">
                  {goal.label}
                </p>
                <p className="text-accent font-semibold text-sm">
                  {goal.description}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {goal.detail}
                </p>
              </div>
              {selectedGoal === goal.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                >
                  <svg
                    className="w-3 h-3 text-accent-foreground"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-secondary/10 border border-secondary/20"
      >
        <p className="text-center text-sm text-muted-foreground">
          💡 <span className="text-foreground font-medium">Tip:</span> You can
          always change your daily goal later in settings
        </p>
      </motion.div>
    </div>
  );
}
