"use client";

import { BookOpen } from "@/components/icons/BookOpen";
import { Lock } from "@/components/icons/Lock";
import { Trophy } from "@/components/icons/Trophy";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchTaskLessons } from "@/services/api";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";

const sortByOrder = (items, key) =>
  [...(items || [])].sort((a, b) => (a?.[key] || 0) - (b?.[key] || 0));

export function LessonSelectionPopup({
  taskId,
  isCompleted,
  isCurrent,
  isLocked,
  onClose,
  open,
}) {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!open || !taskId) return;

    const loadLessons = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        if (status === "loading") return;
        if (status === "unauthenticated" || !isSessionValid(session)) {
          throw new Error("Please login to view lessons.");
        }

        const token = getSessionToken(session);

        const result = await fetchTaskLessons(taskId, token);
        if (!result.success) {
          throw new Error(result.error || "Failed to load lessons");
        }

        const docs = Array.isArray(result.data?.docs) ? result.data.docs : [];
        const sortedLessons = sortByOrder(docs, "lessonOrder");
        const lastActiveIndex = sortedLessons
          .map((lesson) => Boolean(lesson?.inProgressOrCompleted))
          .lastIndexOf(true);

        const normalized = sortedLessons.map((lesson, index) => {
          const hasProgress = lastActiveIndex >= 0;
          const isCurrentLesson = hasProgress && index === lastActiveIndex;
          const isCompletedLesson = hasProgress && index < lastActiveIndex;
          const isLockedLesson =
            !lesson?.inProgressOrCompleted && !isCurrentLesson && !isCompletedLesson;

          return {
            id: lesson.id,
            title: lesson.title,
            isExam: Boolean(lesson.isExam),
            isCompleted: isCompletedLesson,
            isCurrent: isCurrentLesson,
            isLocked: isLockedLesson,
          };
        });

        setLessons(normalized);
      } catch (error) {
        setLoadError(error?.message || "Unable to load lessons");
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [open, session, status, taskId]);

  const footerText = isLocked
    ? "Complete previous lessons to unlock"
    : isCompleted
      ? "All lessons are available to practice"
      : isCurrent
        ? "Complete lessons to unlock more content"
        : "Complete previous nodes to unlock";

  const handleLessonClick = (lesson) => {
    if (lesson.isLocked) return;

    // Store the selected lesson info in sessionStorage
    sessionStorage.setItem("selectedLessonId", lesson.id);
    sessionStorage.setItem("selectedNodeId", taskId);

    router.push("/lesson");
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
            {isLocked
              ? "Lesson is locked"
              : isCompleted
                ? "All lessons unlocked"
                : isCurrent
                  ? "Start learning"
                  : "Complete previous lessons first"}
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="p-8">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center">
              Loading lessons...
            </p>
          ) : loadError ? (
            <p className="text-sm text-muted-foreground text-center">
              {loadError}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {lessons.map((lesson, index) => {
                const lessonIcon = lesson.isExam ? (
                  <Trophy size="lg" />
                ) : (
                  <BookOpen size="lg" />
                );

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
                        <Lock size="md" />
                      </div>
                    )}

                    {/* Book/Exam Icon */}
                    <div
                      className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${
                        lesson.isLocked
                          ? "bg-muted text-muted-foreground"
                          : lesson.isCompleted
                            ? "bg-accent text-accent-foreground"
                            : "text-accent"
                      }
                    `}
                    >
                      {lessonIcon}
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
          )}

          {/* Info Text */}
          {footerText ? (
            <p className="text-xs text-muted-foreground text-center mt-6">
              {footerText}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
