/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Award,
  Calendar,
  Flame,
} from "lucide-react";

const weeklyData = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 85 },
  { day: "Wed", xp: 200 },
  { day: "Thu", xp: 150 },
  { day: "Fri", xp: 90 },
  { day: "Sat", xp: 180 },
  { day: "Sun", xp: 75 },
];

const achievements = [
  {
    name: "First Lesson",
    description: "Complete your first lesson",
    earned: true,
    icon: BookOpen,
  },
  {
    name: "Week Warrior",
    description: "7-day streak",
    earned: true,
    icon: Flame,
  },
  {
    name: "Vocabulary Master",
    description: "Learn 100 words",
    earned: true,
    icon: Award,
  },
  {
    name: "Grammar Guru",
    description: "Complete all grammar lessons",
    earned: false,
    icon: Target,
  },
];

// Generate deterministic activity data (same on server and client)
const activityData = Array.from({ length: 28 }).map((_, i) => {
  // Use a deterministic pattern instead of Math.random()
  const pattern = (i * 7 + (i % 5)) % 10;
  return pattern / 10;
});

export default function Stats() {
  const maxXp = Math.max(...weeklyData.map((d) => d.xp));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Your Statistics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your learning progress and achievements
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total XP",
              value: "2,340",
              icon: TrendingUp,
              color: "text-accent",
            },
            {
              label: "Current Streak",
              value: "7 days",
              icon: Flame,
              color: "text-orange-500",
            },
            {
              label: "Time Learned",
              value: "24h 35m",
              icon: Clock,
              color: "text-palm",
            },
            {
              label: "Lessons Done",
              value: "24",
              icon: BookOpen,
              color: "text-primary",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card variant="elevated">
                <CardContent className="flex items-center gap-4 p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Weekly XP Chart */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Weekly XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.xp / maxXp) * 100}%` }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    className="w-full rounded-t-lg bg-gradient-accent transition-all hover:opacity-80"
                    style={{
                      height: `${(day.xp / maxXp) * 100}%`,
                      minHeight: "20px",
                      background: "var(--gradient-accent)",
                    }}
                  />
                  <span className="mt-2 text-xs font-medium text-muted-foreground">
                    {day.day}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {day.xp}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Heatmap */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Activity Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mounted && (
              <div className="grid grid-cols-7 gap-2">
                {activityData.map((intensity, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.02 * i }}
                    className={`aspect-square rounded-md ${
                      intensity > 0.7
                        ? "bg-accent"
                        : intensity > 0.4
                          ? "bg-accent/60"
                          : intensity > 0.2
                            ? "bg-accent/30"
                            : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-sm bg-muted" />
                <div className="h-3 w-3 rounded-sm bg-accent/30" />
                <div className="h-3 w-3 rounded-sm bg-accent/60" />
                <div className="h-3 w-3 rounded-sm bg-accent" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 ${
                    achievement.earned
                      ? "border-palm bg-palm/10"
                      : "border-muted bg-muted/50 opacity-60"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      achievement.earned
                        ? "bg-palm text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
