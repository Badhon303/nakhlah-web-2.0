"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mascot } from "@/components/nakhlah/Mascot";
import { XPDisplay } from "@/components/nakhlah/XPDisplay";
import { LessonCard } from "@/components/nakhlah/LessonCard";
import { motion } from "framer-motion";
import { BookOpen, Target, Zap, Award, ArrowRight, Globe } from "lucide-react";
import PathwayCarousel from "@/components/pathway/PathwayCarousel";
import { toast } from "sonner";

const todayLessons = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Learn essential Arabic greetings and introductions",
    progress: 100,
    isCompleted: true,
    xpReward: 15,
  },
  {
    id: 2,
    title: "Numbers 1-10",
    description: "Master counting from one to ten in Arabic",
    progress: 60,
    xpReward: 20,
  },
  {
    id: 3,
    title: "Common Phrases",
    description: "Everyday expressions for daily conversations",
    progress: 0,
    xpReward: 25,
  },
  {
    id: 4,
    title: "Family Members",
    description: "Learn vocabulary for family relationships",
    progress: 0,
    isLocked: true,
    xpReward: 20,
  },
];

const chapters = [
  {
    id: 1,
    label: "Getting Started",
    locked: false,
    section: {
      title: "Lesson 27",
      subtitle: "Describing abstract objects",
      color: "green",
    },
  },
  { id: 2, label: "Basic Concepts", locked: false },
  { id: 3, label: "Core Skills", locked: false },
  { id: 4, label: "Practice Round", locked: false },
  { id: 5, label: "Review Session", locked: false },
  {
    id: 6,
    label: "Advanced Topics",
    locked: false,
    section: {
      title: "Lesson 26",
      subtitle: "Forming an infinite path",
      color: "purple",
    },
  },
  { id: 7, label: "Deep Dive", locked: false },
  { id: 8, label: "Expert Level", locked: true },
  { id: 9, label: "Master Class", locked: true },
  {
    id: 10,
    label: "Final Challenge",
    locked: true,
    section: {
      title: "Lesson 25",
      subtitle: "The ultimate quest",
      color: "orange",
    },
  },
  { id: 11, label: "Bonus Round", locked: true },
  { id: 12, label: "Victory Lap", locked: true },
];

const stats = [
  {
    label: "Lessons Completed",
    value: "24",
    icon: BookOpen,
    color: "text-palm",
  },
  { label: "Words Learned", value: "156", icon: Globe, color: "text-accent" },
  {
    label: "Current Streak",
    value: "7 days",
    icon: Zap,
    color: "text-orange-500",
  },
  { label: "Achievements", value: "12", icon: Award, color: "text-primary" },
];

export default function HomeContent() {
  const currentChapter = 5;

  const handleSelectChapter = (chapter) => {
    toast.success(`Starting: ${chapter.label}`, {
      description: `Chapter ${chapter.id} selected`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-sand-light/50 to-transparent dark:from-accent/5" />
        <div className="container relative px-4 py-8 md:py-12 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent"
                >
                  Welcome back, Learner! 👋
                </motion.span>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Continue Your
                  <span className="block text-gradient-accent">
                    Arabic Journey
                  </span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                  You&apos;re making great progress! Keep your streak alive and
                  unlock new lessons today.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  Continue Learning
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Practice Mode
                </Button>
              </div>

              {/* XP Progress */}
              <Card variant="elevated" className="max-w-sm">
                <CardContent className="p-4">
                  <XPDisplay current={340} nextLevel={500} level={5} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <Mascot
                mood="happy"
                size="xxxl"
                message="Let's learn some Arabic today! 🌴"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card variant="interactive" className="text-center">
                <CardContent className="p-4 md:p-6">
                  <stat.icon className={`mx-auto h-8 w-8 ${stat.color}`} />
                  <p className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Progress */}
      <section className="container px-4 py-8 mx-auto">
        <PathwayCarousel
          chapters={chapters}
          current={currentChapter}
          onSelect={handleSelectChapter}
        />
      </section>

      {/* Today's Lessons */}
      <section className="container px-4 py-8 mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Today&apos;s Lessons
          </h2>
          <Button variant="ghost" className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todayLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                progress={lesson.progress}
                isCompleted={lesson.isCompleted}
                isLocked={lesson.isLocked}
                xpReward={lesson.xpReward}
                icon={<BookOpen className="h-6 w-6" />}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container px-4 py-8 mx-auto">
        <div className="grid gap-4 md:grid-cols-3">
          <Card variant="accent" className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Quick Practice</h3>
                <p className="text-sm text-muted-foreground">
                  5-minute exercises to reinforce learning
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Start now →
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="outlined" className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-palm text-secondary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Vocabulary Review</h3>
                <p className="text-sm text-muted-foreground">
                  Review words you&apos;ve learned this week
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Review now →
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="outlined" className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Complete today&apos;s challenge for bonus XP
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Take challenge →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
