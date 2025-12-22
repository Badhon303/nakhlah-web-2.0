"use client";
import { motion } from "framer-motion";
import { Flame, Target, Zap, BookOpen, Award } from "lucide-react";

export default function QuickStats() {
  const quickStats = [
    { label: "Current Streak", value: "7 days", icon: Flame, color: "text-primary" },
    { label: "Longest Streak", value: "21 days", icon: Target, color: "text-palm-green" },
    { label: "Total XP", value: "15,274", icon: Zap, color: "text-amber-500" },
    { label: "Words Learned", value: "448", icon: BookOpen, color: "text-secondary" },
    { label: "Lessons Completed", value: "127", icon: Award, color: "text-accent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
    >
      <div className="mb-4 lg:mb-6">
        <h3 className="text-xl font-semibold">Quick Stats</h3>
      </div>
      
      <div className="space-y-3">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30 hover:bg-muted/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
                <span className="text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <span className="font-bold text-foreground">
                {stat.value}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}