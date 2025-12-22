import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle, Lock, Award } from "lucide-react";

export default function AllAchievementsPage({ onBack }) {
  const achievements = [
    {
      title: "Great King",
      description: "Get 5000 XP in the month to get this badge",
      progress: 3.7,
      total: 5,
      color: "bg-violet",
      icon: "👑",
      unlocked: true
    },
    {
      title: "Einstein's Brain",
      description: "Completed 80% in solo lesson to earn this",
      progress: 12,
      total: 20,
      color: "bg-palm-green",
      icon: "🧠",
      unlocked: true
    },
    {
      title: "Tough Knight",
      description: "Solve 3000 mix words to pass this quest",
      progress: 1.8,
      total: 25,
      color: "bg-primary",
      icon: "⚔️",
      unlocked: true
    },
    {
      title: "Time Killer",
      description: "Complete 100 lessons in order 2 days",
      progress: 73,
      total: 100,
      color: "bg-amber-500",
      icon: "⏰",
      unlocked: false
    },
    {
      title: "Great Sage",
      description: "Finish 100 chapter in 30 days",
      progress: 84,
      total: 120,
      color: "bg-secondary",
      icon: "📚",
      unlocked: false
    },
    {
      title: "Bookworm",
      description: "Read 500 pages without breaks",
      progress: 0,
      total: 500,
      color: "bg-palm-green",
      icon: "🐛",
      unlocked: false
    },
    {
      title: "Night Owl",
      description: "Study for 5 consecutive nights",
      progress: 0,
      total: 5,
      color: "bg-violet",
      icon: "🦉",
      unlocked: false
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              All Achievements
              <Award className="w-6 h-6 text-accent" />
            </h1>
            <p className="text-sm text-muted-foreground">
              3 unlocked • {achievements.length - 3} in progress
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              className={`relative p-5 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? "bg-muted/30 border-accent shadow-lg shadow-accent/20"
                  : "bg-muted/10 border-border/50"
              }`}
            >
              {!achievement.unlocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-3">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-xl ${achievement.color} flex items-center justify-center text-3xl ${
                      !achievement.unlocked && "opacity-50 grayscale"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  {achievement.unlocked && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-palm-green border-2 border-card flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">
                    {achievement.progress}K / {achievement.total}K
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${achievement.color}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(achievement.progress / achievement.total) * 100}%`,
                    }}
                    transition={{
                      delay: 0.1 * index + 0.3,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}