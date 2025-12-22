"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/nakhlah/SearchInput";
import { FilterChips } from "@/components/nakhlah/FilterChips";
import { LessonCard } from "@/components/nakhlah/LessonCard";
import { LanguageSelector } from "@/components/nakhlah/LanguageSelector";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageCircle,
  Headphones,
  PenTool,
  Gamepad2,
} from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  {
    id: "vocabulary",
    label: "Vocabulary",
    icon: <BookOpen className="h-4 w-4" />,
  },
  { id: "grammar", label: "Grammar", icon: <PenTool className="h-4 w-4" /> },
  {
    id: "listening",
    label: "Listening",
    icon: <Headphones className="h-4 w-4" />,
  },
  {
    id: "speaking",
    label: "Speaking",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  { id: "games", label: "Games", icon: <Gamepad2 className="h-4 w-4" /> },
];

const lessons = [
  {
    id: 1,
    title: "Alphabet Basics",
    description: "Learn the Arabic alphabet and pronunciation",
    category: "vocabulary",
    progress: 100,
    isCompleted: true,
    xpReward: 20,
  },
  {
    id: 2,
    title: "Common Greetings",
    description: "Essential greetings for everyday conversations",
    category: "speaking",
    progress: 75,
    xpReward: 15,
  },
  {
    id: 3,
    title: "Numbers & Counting",
    description: "Count from 1 to 100 in Arabic",
    category: "vocabulary",
    progress: 50,
    xpReward: 25,
  },
  {
    id: 4,
    title: "Basic Sentence Structure",
    description: "Learn how to form simple sentences",
    category: "grammar",
    progress: 20,
    xpReward: 30,
  },
  {
    id: 5,
    title: "Listening Comprehension",
    description: "Practice understanding spoken Arabic",
    category: "listening",
    progress: 0,
    xpReward: 25,
  },
  {
    id: 6,
    title: "Word Match Game",
    description: "Fun matching game to reinforce vocabulary",
    category: "games",
    progress: 0,
    xpReward: 15,
  },
  {
    id: 7,
    title: "Colors & Shapes",
    description: "Learn vocabulary for colors and shapes",
    category: "vocabulary",
    progress: 0,
    isLocked: true,
    xpReward: 20,
  },
  {
    id: 8,
    title: "Verb Conjugation",
    description: "Master present tense verb forms",
    category: "grammar",
    progress: 0,
    isLocked: true,
    xpReward: 35,
  },
];

export default function Learn() {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [selectedLanguage, setSelectedLanguage] = useState("arabic");

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(search.toLowerCase()) ||
      lesson.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      selectedFilters.includes("all") ||
      selectedFilters.includes(lesson.category);
    return matchesSearch && matchesFilter;
  });

  const getIcon = (category) => {
    switch (category) {
      case "vocabulary":
        return <BookOpen className="h-6 w-6" />;
      case "grammar":
        return <PenTool className="h-6 w-6" />;
      case "listening":
        return <Headphones className="h-6 w-6" />;
      case "speaking":
        return <MessageCircle className="h-6 w-6" />;
      case "games":
        return <Gamepad2 className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Learn Arabic
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose a lesson to continue your learning journey
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-center justify-center">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search lessons..."
              className="md:col-span-2 lg:col-span-1"
            />
            <LanguageSelector
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              label="Learning"
            />
          </div>

          <FilterChips
            options={categories}
            selected={selectedFilters}
            onChange={(filters) => {
              if (filters.includes("all") && !selectedFilters.includes("all")) {
                setSelectedFilters(["all"]);
              } else if (filters.length === 0) {
                setSelectedFilters(["all"]);
              } else {
                setSelectedFilters(filters.filter((f) => f !== "all"));
              }
            }}
          />
        </div>

        {/* Progress Overview */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-palm">2</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">4</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-muted-foreground">2</p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <LessonCard
                title={lesson.title}
                description={lesson.description}
                progress={lesson.progress}
                isCompleted={lesson.isCompleted}
                isLocked={lesson.isLocked}
                xpReward={lesson.xpReward}
                icon={getIcon(lesson.category)}
              />
            </motion.div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No lessons found matching your criteria
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setSelectedFilters(["all"]);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
