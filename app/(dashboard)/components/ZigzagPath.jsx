/* eslint-disable react-hooks/set-state-in-effect */
import { Circle } from "./Circle";
import { Mascot } from "@/components/nakhlah/Mascot";
import { useEffect, useMemo, useState } from "react";
import { Lock, FileText } from "lucide-react";

export function ZigzagPath({ lessons, levels, mascots, isLoading = false }) {
  const [currentLevelId, setCurrentLevelId] = useState("");

  const currentLevel = levels.find((l) => l.id === currentLevelId);

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const key = lesson.sectionId || lesson.level;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lesson);
    return acc;
  }, {});

  const currentSectionLessons = currentLevel
    ? groupedLessons[currentLevel.id] || []
    : [];
  const currentTask =
    currentSectionLessons.find((lesson) => lesson.isCurrent) ||
    currentSectionLessons.find((lesson) => !lesson.isLocked) ||
    currentSectionLessons[0];

  const getPosition = (index) => {
    const amplitude = 25;
    const center = 50;
    const frequency = 0.8;
    const x = center + Math.sin(index * frequency) * amplitude;
    return { left: `${x}%`, transform: "translateX(-50%)" };
  };

  const getMascotPosition = (index) => {
    const lessonPos = getPosition(index);
    const leftPercent = parseInt(lessonPos.left);
    return leftPercent > 50
      ? { left: "20%", transform: "translateX(-50%)" }
      : { left: "80%", transform: "translateX(-50%) translateY(-20%)" };
  };

  const autoMascotPlacements = useMemo(() => {
    if (!Array.isArray(lessons) || lessons.length === 0) return [];

    const moods = ["proud", "encouraging", "happy", "cool"];
    const sizes = ["xxl", "xxl", "xxl", "xxl"];
    const desiredCount = Math.min(
      4,
      Math.max(2, Math.floor(lessons.length / 3)),
    );
    const step = Math.max(1, Math.floor(lessons.length / (desiredCount + 1)));

    const selectedIndices = new Set();
    for (let i = 1; i <= desiredCount; i += 1) {
      const idx = Math.min(lessons.length - 1, i * step);
      selectedIndices.add(idx);
    }

    if (selectedIndices.size === 0 && lessons[0]) {
      selectedIndices.add(0);
    }

    return Array.from(selectedIndices)
      .sort((a, b) => a - b)
      .map((index, idx) => ({
        position: lessons[index]?.id,
        mood: moods[idx % moods.length],
        size: sizes[idx % sizes.length],
        placementIndex: idx,
      }))
      .filter((item) => Boolean(item.position));
  }, [lessons]);

  const activeMascots =
    Array.isArray(mascots) && mascots.length > 0
      ? mascots
      : autoMascotPlacements;

  const mascotByLessonId = useMemo(() => {
    const placementMap = new Map();
    activeMascots.forEach((mascot) => {
      if (mascot?.position) {
        placementMap.set(mascot.position, mascot);
      }
    });
    return placementMap;
  }, [activeMascots]);

  const getLevelColor = (level) => {
    const colors = [
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-orange-400 to-orange-600",
      "from-blue-400 to-blue-600",
      "from-red-400 to-red-600",
    ];
    return colors[(level - 1) % colors.length];
  };

  useEffect(() => {
    if (isLoading || !levels.length) return undefined;

    const observers = [];
    const levelElements = document.querySelectorAll("[data-level-id]");

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const levelId = entry.target.getAttribute("data-level-id");
          const level = levels.find((l) => l.id.toString() === levelId);
          if (level) {
            setCurrentLevelId(level.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-15% 0px -80% 0px",
      threshold: 0,
    });

    levelElements.forEach((el) => {
      observer.observe(el);
      observers.push(observer);
    });

    if (levels && levels.length > 0 && !currentLevelId) {
      setCurrentLevelId(levels[0].id);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [levels, isLoading, currentLevelId]);

  return (
    <div className="relative lg:max-w-lg mx-auto">
      {/* Sticky unit header */}
      <div className="sticky top-[calc(env(safe-area-inset-top)+72px)] lg:top-0 z-50 bg-background/80 backdrop-blur-sm py-2 lg:py-0">
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg transition-all duration-500 ease-in-out bg-gradient-to-r ${getLevelColor(
            currentLevel?.colorIndex || 1,
          )} text-white`}
        >
          <div>
            <div className="text-sm text-white/90 mb-1 font-semibold uppercase tracking-wider">
              {currentLevel?.levelName ? `${currentLevel.levelName}, ` : ""}
              {currentLevel?.name || ""}
            </div>
            {currentTask?.title ? (
              <div className="text-2xl font-bold leading-tight">
                {currentTask.title}
              </div>
            ) : null}
          </div>
          <button className="text-white hover:bg-white/20 p-2 rounded-full">
            <FileText className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lessons grouped by level */}
      <div className="relative mt-6">
        {levels.map((level, levelIndex) => {
          const levelLessons = groupedLessons[level.id] || [];
          const isFirstLessonCurrent = levelLessons[0]?.isCurrent;

          return (
            <div
              key={level.id}
              data-level-id={level.id}
              className="mb-12 relative"
            >
              {/* Level barrier */}
              <div
                className={`relative h-1 flex items-center justify-center ${
                  isFirstLessonCurrent ? "mb-16 mt-6" : "mb-6"
                }`}
              >
                {/* <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-border"></div>
                </div> */}
                <div className="relative bg-background px-4">
                  <span
                    className={`text-lg font-bold bg-gradient-to-r ${getLevelColor(
                      level.colorIndex || levelIndex + 1,
                    )} bg-clip-text text-transparent`}
                  >
                    {level.name}
                  </span>
                </div>
              </div>

              {/* Zigzag path for this level */}
              <div className="relative">
                {levelLessons.map((lesson, index) => {
                  const globalIndex = lessons.findIndex(
                    (l) => l.id === lesson.id,
                  );
                  const position = getPosition(
                    globalIndex >= 0 ? globalIndex : index,
                  );
                  const mascotPosition = getMascotPosition(
                    globalIndex >= 0 ? globalIndex : index,
                  );
                  const mascot = mascotByLessonId.get(lesson.id);
                  const baseTop = mascotPosition.left === "20%" ? 72 : 200;
                  const topOffset = mascot?.placementIndex === 1 ? 8 : 0;

                  return (
                    <div key={lesson.id} className="relative h-28 w-full">
                      {/* Lesson circle */}
                      <div
                        className="absolute"
                        style={{
                          left: position.left,
                          top: "50%",
                          transform: `${position.transform} translateY(-50%)`,
                        }}
                      >
                        <Circle
                          isCompleted={lesson.isCompleted}
                          isCurrent={lesson.isCurrent}
                          isLocked={lesson.isLocked}
                          icon={lesson.icon}
                          type={lesson.type}
                          size="lg"
                          nodeId={lesson.apiId}
                        />
                      </div>

                      {/* "Speech / quotation" bubble - positioned directly above the node */}
                      {lesson.isCurrent && (
                        <div
                          aria-hidden
                          className="absolute z-10"
                          style={{
                            left: position.left,
                            top: "-40%",
                            transform: "translateX(-50%)",
                          }}
                        >
                          <div
                            className="relative mx-auto bg-white text-sm font-semibold px-4 py-2 rounded-2xl shadow-md border-accent w-max min-w-[100px]"
                            style={{
                              borderWidth: 4,
                            }}
                          >
                            {/* The bubble text */}
                            <div className="text-center font-bold text-accent tracking-wide uppercase">
                              START!
                            </div>

                            {/* Beautiful curved SVG tail */}
                            <svg
                              className="absolute left-1/2 -translate-x-1/2 text-accent"
                              style={{
                                bottom: -14,
                              }}
                              width="24"
                              height="14"
                              viewBox="0 0 24 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="-1"
                                y="-1"
                                width="26"
                                height="5"
                                fill="white"
                              />
                              <path
                                d="M-1 2 C 8 2, 8 12, 12 12 C 16 12, 16 2, 25 2"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinejoin="round"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Mascot */}
                      {mascot && (
                        <div
                          key={`${lesson.id}-${mascot.mood || "helper"}`}
                          className="absolute"
                          style={{
                            left: mascotPosition.left,
                            top: `${baseTop + topOffset}%`,
                            transform: `${mascotPosition.transform} translateY(-50%)`,
                          }}
                        >
                          <Mascot
                            mood={mascot.mood || "happy"}
                            size={mascot.size || "md"}
                            message={mascot.message}
                            className=""
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Section unlocker placeholder */}
        <div className="mt-8 flex justify-center">
          <div className="bg-card border-2 border-dashed border-border rounded-xl p-6 w-full max-w-md text-center">
            <div className="flex justify-center mb-3">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Next Section Locked
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete the current section to unlock the next one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
