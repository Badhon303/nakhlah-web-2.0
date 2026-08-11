import { Circle } from "./Circle";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const PATH_CENTER = 50;
const PATH_AMPLITUDE = 25;
const PATH_FREQUENCY = 0.8;
const LESSON_ROW_HEIGHT = 112;
const MASCOT_VERTICAL_OFFSET = -180;
const MASCOT_SIDE_POSITIONS = {
  left: "80%",
  right: "20%",
};

function getResponsiveMascotSize(width) {
  if (width >= 768) return "xxxl";
  return "xxxl";
}

function getLevelRingColor(colorIndex) {
  const colors = ["#4ade80", "#c084fc", "#fb923c", "#60a5fa", "#f87171"];
  return colors[((colorIndex || 1) - 1) % colors.length] || colors[3];
}

function LevelProgressRing({ percentage, colorIndex, className = "" }) {
  const radius = 24;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = Math.max(
    0,
    Math.min(100, Math.round(percentage || 0)),
  );
  const offset = circumference - (safePercentage / 100) * circumference;
  const strokeColor = getLevelRingColor(colorIndex);

  return (
    <svg
      viewBox="0 0 56 56"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-auto aspect-square shrink-0 ${className}`}
    >
      <circle cx="28" cy="28" r="28" fill="#ffffff" />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 28 28)"
        style={{ transition: "stroke-dashoffset 600ms ease" }}
      />
      <text
        x="28"
        y="29"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1f2937"
        fontSize="12"
        fontWeight="700"
      >
        {safePercentage}%
      </text>
    </svg>
  );
}

function UnitBanner({
  gradientClass,
  title,
  subtitle,
  percentage,
  colorIndex,
  compact = false,
}) {
  return (
    <div
      className={`relative overflow-hidden flex items-center rounded-full shadow-lg transition-all duration-500 ease-in-out bg-gradient-to-r ${gradientClass} text-white ${
        compact ? "h-16 pl-3 pr-0" : "h-[72px] pl-4 pr-0"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 w-28 opacity-20 ${
          compact ? "right-16" : "right-[72px]"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div
        className={`relative min-w-0 ${
          compact ? "pr-16 pl-0" : "pr-[72px] pl-0"
        }`}
      >
        <div
          className={`font-extrabold leading-tight truncate ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          {title}
        </div>
        {/* {subtitle ? (
          <div className="text-xs sm:text-sm text-white/80 font-medium truncate">
            {subtitle}
          </div>
        ) : null} */}
      </div>

      <div
        className="absolute right-0 top-0 h-full aspect-square"
        aria-hidden="true"
      >
        <LevelProgressRing
          percentage={percentage}
          colorIndex={colorIndex}
          className="h-full w-auto"
        />
      </div>
    </div>
  );
}

function UnitDivider({ label, colorIndex }) {
  const color = getLevelRingColor(colorIndex);

  return (
    <div className="w-full flex items-center justify-center gap-3 my-6 px-6">
      <span className="h-px flex-1 bg-border" />
      <span
        className="text-sm md:text-base font-bold tracking-wide whitespace-nowrap"
        style={{ color }}
      >
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function ZigzagPath({ lessons, levels, mascots, isLoading = false }) {
  const [currentLevelId, setCurrentLevelId] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const hasScrolledRef = useRef(false);
  const prevLessonsRef = useRef(lessons);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentLevel = levels.find(
    (l) => l.id === (currentLevelId || levels[0]?.id),
  );

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const key = lesson.sectionId || lesson.level;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lesson);
    return acc;
  }, {});

  const currentSectionLessons = useMemo(
    () => (currentLevel ? groupedLessons[currentLevel.id] || [] : []),
    [currentLevel, groupedLessons],
  );
  const currentTask =
    currentSectionLessons.find((lesson) => lesson.isCurrent) ||
    currentSectionLessons.find((lesson) => !lesson.isLocked) ||
    currentSectionLessons[0];

  const levelProgress = useMemo(() => {
    if (!currentSectionLessons.length) return 0;
    const total = currentSectionLessons.length;
    const unlocked = currentSectionLessons.filter(
      (lesson) => !lesson.isLocked,
    ).length;
    return total > 0 ? Math.round((unlocked / total) * 100) : 0;
  }, [currentSectionLessons]);

  const hasCompletedJourney =
    !isLoading &&
    lessons.length > 0 &&
    lessons.every((lesson) => lesson.isCompleted);

  const getPosition = (index) => {
    const x = PATH_CENTER + Math.sin(index * PATH_FREQUENCY) * PATH_AMPLITUDE;
    return { left: `${x}%`, transform: "translateX(-50%)" };
  };

  const lessonIndexById = useMemo(
    () => new Map(lessons.map((lesson, index) => [lesson.id, index])),
    [lessons],
  );

  const mascotPlacementsByAnchorId = useMemo(() => {
    if (!Array.isArray(lessons) || lessons.length === 0) return new Map();

    const allMoods = [
      "proud",
      "encouraging",
      "happy",
      "cool",
      "excited",
      "confident",
      "thinking",
      "focused",
      "surprised",
      "default",
    ];
    const startOffset = (lessons?.length || 0) % allMoods.length;
    const step = 3; // coprime with allMoods.length to cycle without repeats
    const getMoodForIndex = (i) =>
      allMoods[(startOffset + i * step) % allMoods.length];

    const baseSize = getResponsiveMascotSize(windowWidth);
    const sizes = [baseSize, baseSize, baseSize, baseSize]; // identical, responsive mascot sizes
    const halfWave = Math.PI / PATH_FREQUENCY;
    const firstTurningPoint = Math.PI / (2 * PATH_FREQUENCY);
    const slotCandidates = [];

    for (
      let turningPoint = firstTurningPoint, slotIndex = 0;
      turningPoint + halfWave <= lessons.length;
      turningPoint += halfWave, slotIndex += 1
    ) {
      const midpoint = turningPoint + halfWave / 2;
      const anchorIndex = Math.min(
        lessons.length - 1,
        Math.max(0, Math.floor(midpoint)),
      );

      slotCandidates.push({
        anchorLessonId: lessons[anchorIndex]?.id,
        midpoint,
        side: slotIndex % 2 === 0 ? "left" : "right",
        slotIndex,
      });
    }

    if (slotCandidates.length === 0) return new Map();

    const requestedMascots =
      Array.isArray(mascots) && mascots.length > 0
        ? mascots
        : slotCandidates.map((_, index) => ({
            mood: getMoodForIndex(index),
            size: sizes[index % sizes.length],
          }));

    const availableSlots = [...slotCandidates];
    const placementsByAnchor = new Map();

    requestedMascots
      .slice(0, slotCandidates.length)
      .forEach((mascot, index) => {
        if (availableSlots.length === 0) return;

        const requestedIndex = mascot?.position
          ? lessonIndexById.get(mascot.position)
          : null;

        let slotChoiceIndex = Math.min(index, availableSlots.length - 1);

        if (Number.isInteger(requestedIndex)) {
          slotChoiceIndex = availableSlots.reduce(
            (bestIndex, slot, currentIndex) =>
              Math.abs(slot.midpoint - requestedIndex) <
              Math.abs(availableSlots[bestIndex].midpoint - requestedIndex)
                ? currentIndex
                : bestIndex,
            0,
          );
        }

        const [slot] = availableSlots.splice(slotChoiceIndex, 1);

        if (!slot?.anchorLessonId) return;

        const placement = {
          ...slot,
          mood: mascot?.mood || getMoodForIndex(slot.slotIndex),
          size: mascot?.size || sizes[slot.slotIndex % sizes.length],
          message: mascot?.message,
        };

        const anchoredPlacements =
          placementsByAnchor.get(slot.anchorLessonId) || [];
        anchoredPlacements.push(placement);
        placementsByAnchor.set(slot.anchorLessonId, anchoredPlacements);
      });

    const firstLessonId = lessons[0]?.id;
    if (firstLessonId) {
      const firstSlotMood = requestedMascots[0]?.mood || getMoodForIndex(0);
      const firstCurveMood =
        allMoods.find((m) => m !== firstSlotMood) || allMoods[0];
      const firstCurveMascot = {
        anchorLessonId: firstLessonId,
        midpoint: 0.75,
        side: "right",
        slotIndex: "first-curve",
        mood: firstCurveMood,
        size: baseSize,
      };
      const anchoredPlacements = placementsByAnchor.get(firstLessonId) || [];
      anchoredPlacements.push(firstCurveMascot);
      placementsByAnchor.set(firstLessonId, anchoredPlacements);
    }

    return placementsByAnchor;
  }, [lessonIndexById, lessons, mascots, windowWidth]);

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

    return () => observers.forEach((o) => o.disconnect());
  }, [levels, isLoading]);

  // Reset scroll guard whenever lessons data changes identity
  useEffect(() => {
    if (prevLessonsRef.current !== lessons) {
      hasScrolledRef.current = false;
      prevLessonsRef.current = lessons;
    }
  }, [lessons]);

  // Scroll to current lesson on load / after refresh
  useEffect(() => {
    if (isLoading || lessons.length === 0) return undefined;
    if (hasScrolledRef.current) return undefined;

    const getTargetEl = () => {
      const currentLesson = lessons.find((l) => l.isCurrent);
      let targetEl = currentLesson
        ? document.getElementById(`node-${currentLesson.apiId}`)
        : null;

      if (!targetEl) {
        const lastInteractedId = sessionStorage.getItem("lastInteractedNodeId");
        if (lastInteractedId) {
          targetEl = document.getElementById(`node-${lastInteractedId}`);
        }
      }

      if (!targetEl) {
        const firstUnlocked = lessons.find((l) => !l.isLocked);
        if (firstUnlocked) {
          targetEl = document.getElementById(`node-${firstUnlocked.apiId}`);
        }
      }

      return targetEl;
    };

    const doScroll = () => {
      const targetEl = getTargetEl();
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "instant", block: "center" });
        hasScrolledRef.current = true;
        return true;
      }
      return false;
    };

    let t1, t2;
    const raf = requestAnimationFrame(() => {
      if (!doScroll()) {
        t1 = setTimeout(() => {
          if (!doScroll()) {
            t2 = setTimeout(doScroll, 500);
          }
        }, 400);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [lessons, isLoading]);

  return (
    <div className="relative lg:max-w-lg mx-auto">
      {/* Mobile mask: hides scrolled content behind the fixed UserStats header and the sticky banner */}
      <div className="fixed top-[var(--sat)] left-0 right-0 h-[65px] z-[39] bg-background lg:hidden pointer-events-none" />

      {/* Mobile current-level banner at the top of the journey path */}
      <div className="lg:hidden sticky top-[calc(65px_+_var(--sat))] z-[43] bg-background mb-4">
        <UnitBanner
          compact
          gradientClass={getLevelColor(currentLevel?.colorIndex || 1)}
          title={currentLevel?.name || ""}
          subtitle={
            [currentLevel?.levelName, currentTask?.title]
              .filter(Boolean)
              .join(" Â· ") || ""
          }
          percentage={levelProgress}
          colorIndex={currentLevel?.colorIndex || 1}
        />
      </div>

      {/* Desktop mask to keep whitespace above sticky header clean */}
      <div className="hidden lg:block sticky top-0 z-[44] h-6 bg-background" />

      {/* Sticky unit header on desktop only */}
      <div className="hidden lg:block sticky top-6 z-[44] bg-background py-2 lg:py-0">
        <UnitBanner
          gradientClass={getLevelColor(currentLevel?.colorIndex || 1)}
          title={currentLevel?.name || ""}
          subtitle={
            [currentLevel?.levelName, currentTask?.title]
              .filter(Boolean)
              .join(" Â· ") || ""
          }
          percentage={levelProgress}
          colorIndex={currentLevel?.colorIndex || 1}
        />
      </div>

      {hasCompletedJourney ? (
        <div className="mb-8 mt-0 lg:mt-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-primary/20 to-accent/10 border-2 border-accent/30 rounded-3xl p-6 w-full max-w-md text-center shadow-lg"
          >
            <div className="flex justify-center mb-3">
              <FreshDateMascot mood="celebrating" size="xl" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">
              Congratulations!
            </h3>
            <p className="text-sm font-semibold text-muted-foreground mb-1">
              You have completed the journey.
            </p>
            <p className="text-sm text-muted-foreground">
              Keep practicing to maintain your streak and master every lesson.
            </p>
          </motion.div>
        </div>
      ) : null}

      {/* Lessons grouped by level - bottom-to-top: level 1 sits at the visual bottom */}
      <div className="relative flex flex-col-reverse">
        {levels.map((level) => {
          const levelLessons = groupedLessons[level.id] || [];
          const isFirstLessonCurrent = levelLessons[0]?.isCurrent;
          const levelStartIndex = lessonIndexById.get(levelLessons[0]?.id) ?? 0;
          const levelMascots = levelLessons.flatMap(
            (lesson) => mascotPlacementsByAnchorId.get(lesson.id) || [],
          );

          return (
            <div
              key={level.id}
              data-level-id={level.id}
              className="relative flex flex-col-reverse"
            >
              {/* Unit label - centered horizontally at the visual bottom of the level */}
              <div className={isFirstLessonCurrent ? "mt-10 mb-4" : "mt-6"}>
                <UnitDivider label={level.name} colorIndex={level.colorIndex} />
              </div>

              {/* Zigzag path for this level - first lesson at visual bottom */}
              <div className="relative flex flex-col-reverse">
                {levelLessons.map((lesson, index) => {
                  const globalIndex = lessonIndexById.get(lesson.id);
                  const position = getPosition(globalIndex ?? index);

                  return (
                    <div
                      key={lesson.id}
                      id={`node-${lesson.apiId}`}
                      className="relative h-28 w-full"
                    >
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
                            className="relative mx-auto bg-card text-sm font-semibold px-4 py-2 rounded-2xl shadow-md border-accent w-max min-w-[100px]"
                            style={{
                              borderWidth: 4,
                            }}
                          >
                            <div className="text-center font-bold text-accent tracking-wide uppercase">
                              START!
                            </div>

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
                                fill="hsl(var(--card))"
                              />
                              <path
                                d="M-1 2 C 8 2, 8 12, 12 12 C 16 12, 16 2, 25 2"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinejoin="round"
                                fill="hsl(var(--card))"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {levelMascots.map((mascot) => (
                  <div
                    key={`${level.id}-${mascot.slotIndex}-${
                      mascot.mood || "helper"
                    }`}
                    className="absolute z-10 pointer-events-none"
                    style={{
                      left: MASCOT_SIDE_POSITIONS[mascot.side],
                      top: `${
                        (levelLessons.length -
                          1 -
                          (mascot.midpoint - levelStartIndex)) *
                          LESSON_ROW_HEIGHT +
                        LESSON_ROW_HEIGHT / 2 +
                        MASCOT_VERTICAL_OFFSET
                      }px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <FreshDateMascot
                      mood={mascot.mood || "happy"}
                      size={mascot.size || "md"}
                      message={mascot.message}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
