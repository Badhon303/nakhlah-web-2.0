"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { X, Lock, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data structure - you can replace this with actual data
const getLessonsForNode = (nodeId, isCompleted, isCurrent, isLocked) => {
  // Example: each node has 3-4 lessons
  const lessonSets = {
    1: [
      { id: "1-1", title: "Lesson 1" },
      { id: "1-2", title: "Lesson 2" },
      { id: "1-3", title: "Lesson 3" },
    ],
    2: [
      { id: "2-1", title: "Lesson 1" },
      { id: "2-2", title: "Lesson 2" },
      { id: "2-3", title: "Lesson 3" },
      { id: "2-4", title: "Lesson 4" },
    ],
    3: [
      { id: "3-1", title: "Lesson 1" },
      { id: "3-2", title: "Lesson 2" },
      { id: "3-3", title: "Lesson 3" },
    ],
    4: [
      { id: "4-1", title: "Lesson 1" },
      { id: "4-2", title: "Lesson 2" },
      { id: "4-3", title: "Lesson 3" },
    ],
    5: [
      { id: "5-1", title: "Lesson 1" },
      { id: "5-2", title: "Lesson 2" },
      { id: "5-3", title: "Lesson 3" },
    ],
  };

  const baseLessons = lessonSets[nodeId] || [];

  // If completed node, all lessons are unlocked
  if (isCompleted) {
    return baseLessons.map((lesson) => ({
      ...lesson,
      isLocked: false,
      isCompleted: true,
    }));
  }

  // If current node, first lesson is unlocked, rest can vary
  if (isCurrent) {
    return baseLessons.map((lesson, index) => ({
      ...lesson,
      isLocked: index > 0, // First is unlocked, rest are locked (you can customize this)
      isCompleted: false,
    }));
  }

  // If locked node, all lessons are locked
  if (isLocked) {
    return baseLessons.map((lesson) => ({
      ...lesson,
      isLocked: true,
      isCompleted: false,
    }));
  }

  return [];
};

export function LessonSelectionPopup({
  nodeId,
  isCompleted,
  isCurrent,
  isLocked,
  onClose,
  open,
}) {
  const router = useRouter();
  const lessons = getLessonsForNode(nodeId, isCompleted, isCurrent, isLocked);

  const handleLessonClick = (lesson) => {
    if (lesson.isLocked) return;

    // Store the selected lesson info in sessionStorage
    sessionStorage.setItem("selectedLessonId", lesson.id);
    sessionStorage.setItem("selectedNodeId", nodeId);
    sessionStorage.setItem("currentLessonIndex", "0"); // Start from first lesson type

    // Navigate to loading page - will start the lesson sequence
    router.push("/lesson/loading");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 border-border [&>button]:hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent/80 p-6 text-center relative rounded-t-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-accent-foreground/80 hover:text-accent-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <DialogTitle className="text-2xl font-bold text-accent-foreground">
            Choose a Lesson
          </DialogTitle>
          <p className="text-accent-foreground/90 text-sm mt-1">
            {isCompleted
              ? "All lessons unlocked"
              : isCurrent
                ? "Start learning"
                : "Complete previous lessons first"}
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {lessons.map((lesson, index) => {
              return (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleLessonClick(lesson)}
                  disabled={lesson.isLocked}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all
                    flex flex-col items-center justify-center gap-3
                    ${
                      lesson.isLocked
                        ? "bg-muted border-muted-foreground/20 cursor-not-allowed"
                        : lesson.isCompleted
                          ? "bg-accent/10 border-accent hover:bg-accent/20 hover:scale-105 cursor-pointer"
                          : "bg-card border-border hover:border-accent hover:scale-105 cursor-pointer"
                    }
                  `}
                >
                  {/* Lock Icon Overlay */}
                  {lesson.isLocked && (
                    <div className="absolute top-2 right-2 z-10">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* Book Icon - Always visible */}
                  <div
                    className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${
                      lesson.isLocked
                        ? "bg-muted text-muted-foreground"
                        : lesson.isCompleted
                          ? "bg-accent text-accent-foreground"
                          : "bg-accent/20 text-accent"
                    }
                  `}
                  >
                    <BookOpen className="w-8 h-8" />
                  </div>

                  {/* Lesson Title */}
                  <p
                    className={`
                    text-sm font-bold text-center
                    ${lesson.isLocked ? "text-muted-foreground" : "text-foreground"}
                  `}
                  >
                    {lesson.title}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Info Text */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            {isCompleted
              ? "All lessons are available to practice"
              : isCurrent
                ? "Complete lessons to unlock more content"
                : "Complete previous nodes to unlock"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
