/* eslint-disable react-hooks/set-state-in-effect */
import { Circle } from "./Circle";
import { GateBanner } from "@/components/nakhlah/GateBanner";
import { JourneyCompleteCelebration } from "./JourneyCompleteCelebration";
import {
  finishJourneyLandOnNewGift,
  readJourneyLandOnNewGift,
  takeRememberedJourneyScroll,
} from "@/lib/journeyScroll";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

let journeyScrollMountId = 0;

const PATH_CENTER = 50;
const PATH_AMPLITUDE = 25;
const PATH_FREQUENCY = 0.8;
// const LESSON_ROW_HEIGHT = 112;

function findNewlyUnlockedGift(lessons) {
  const currentIndex = lessons.findIndex((lesson) => lesson.isCurrent);
  if (currentIndex <= 0) return null;
  const previous = lessons[currentIndex - 1];
  if (
    previous?.type === "trophy" &&
    !previous.isLocked &&
    !previous.isGiftOpened
  ) {
    return previous;
  }
  return null;
}

export function ZigzagPath({ lessons, levels, isLoading = false }) {
  const [currentLevelId, setCurrentLevelId] = useState("");
  const hasScrolledRef = useRef(false);
  const prevLessonsRef = useRef(lessons);
  const hasMountedWithLessonsRef = useRef(false);
  const lessonsChangedRef = useRef(false);
  const stickRef = useRef(false);
  const landOnGiftRef = useRef(false);
  const landFlagReadRef = useRef(false);
  const heldScrollRef = useRef(null);

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

  // Whether every lesson across the whole journey has been completed, i.e.
  // there's genuinely nothing left to unlock right now.
  const isJourneyComplete =
    !isLoading && lessons.length > 0 && lessons.every((l) => l.isCompleted);

  const getPosition = (index) => {
    const x = PATH_CENTER + Math.sin(index * PATH_FREQUENCY) * PATH_AMPLITUDE;
    return { left: `${x}%`, transform: "translateX(-50%)" };
  };

  const lessonIndexById = useMemo(
    () => new Map(lessons.map((lesson, index) => [lesson.id, index])),
    [lessons],
  );

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

  useEffect(() => {
    const mountId = ++journeyScrollMountId;
    return () => {
      window.setTimeout(() => {
        if (journeyScrollMountId === mountId) {
          finishJourneyLandOnNewGift();
        }
      }, 0);
    };
  }, []);

  // A later journey refresh must not move the path after a gift landing or claim.
  useEffect(() => {
    if (lessons.length === 0) return;
    if (!hasMountedWithLessonsRef.current) {
      hasMountedWithLessonsRef.current = true;
      prevLessonsRef.current = lessons;
      return;
    }
    if (prevLessonsRef.current !== lessons) {
      if (!stickRef.current) {
        hasScrolledRef.current = false;
      }
      lessonsChangedRef.current = true;
      prevLessonsRef.current = lessons;
    }
  }, [lessons]);

  useEffect(() => {
    if (heldScrollRef.current == null) return undefined;
    const y = heldScrollRef.current;
    const restore = () => {
      window.scrollTo({ top: y, left: 0, behavior: "instant" });
    };
    restore();
    const raf = requestAnimationFrame(restore);
    const release = window.setTimeout(() => {
      heldScrollRef.current = null;
    }, 1500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(release);
    };
  }, [lessons]);

  // Fresh visits, including login, land on the current lesson.
  // The gift rules run only from a one-shot flag set by that action.
  useEffect(() => {
    if (isLoading || lessons.length === 0) return undefined;
    if (hasScrolledRef.current) return undefined;

    const isInPlaceRefresh = lessonsChangedRef.current;
    lessonsChangedRef.current = false;

    if (!landFlagReadRef.current && !isInPlaceRefresh) {
      landFlagReadRef.current = true;
      landOnGiftRef.current = readJourneyLandOnNewGift();
      // A saved claim position belongs to the refresh that followed that claim.
      // A fresh visit, including login, starts from the current lesson.
      takeRememberedJourneyScroll();
      sessionStorage.removeItem("nakhlah:journey-scroll-node");
    }

    if (isInPlaceRefresh) {
      const savedScroll = takeRememberedJourneyScroll();
      if (savedScroll != null) {
        heldScrollRef.current = savedScroll;
        window.scrollTo({ top: savedScroll, left: 0, behavior: "instant" });
        stickRef.current = true;
        hasScrolledRef.current = true;
        finishJourneyLandOnNewGift();
        return undefined;
      }
    }

    const getTargetEl = () => {
      if (landOnGiftRef.current) {
        const gift = findNewlyUnlockedGift(lessons);
        if (gift) {
          const giftEl = document.getElementById(`node-${gift.apiId}`);
          if (!giftEl) return null;
          return { el: giftEl, landedOnGift: true };
        }
      }

      const currentLesson = lessons.find((l) => l.isCurrent);
      let targetEl = currentLesson
        ? document.getElementById(`node-${currentLesson.apiId}`)
        : null;

      if (!targetEl) {
        const lastInteractedId = localStorage.getItem("lastInteractedNodeId");
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

      return targetEl ? { el: targetEl, landedOnGift: false } : null;
    };

    const doScroll = () => {
      const target = getTargetEl();
      if (!target) return false;
      target.el.scrollIntoView({ behavior: "instant", block: "center" });
      hasScrolledRef.current = true;
      if (target.landedOnGift) {
        stickRef.current = true;
        landOnGiftRef.current = false;
        finishJourneyLandOnNewGift();
      } else if (isInPlaceRefresh && landOnGiftRef.current) {
        landOnGiftRef.current = false;
        finishJourneyLandOnNewGift();
      }
      return true;
    };

    let t1;
    let t2;
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
    <div className="relative lg:max-w-3xl mx-auto pt-4">
      {/* Journey completion is the only status shown above the path. */}
      {isJourneyComplete ? <JourneyCompleteCelebration /> : null}

      {/* Lessons grouped by level - bottom-to-top: level 1 sits at the bottom */}
      <div className="relative flex flex-col-reverse">
        {levels.map((level, levelIndex) => {
          const levelLessons = groupedLessons[level.id] || [];
          const isFirstLessonCurrent = levelLessons[0]?.isCurrent;

          return (
            <div
              key={level.id}
              data-level-id={level.id}
              className="mb-12 relative flex flex-col-reverse"
            >
              {/* Level Gate Banner - sits below lessons (start of level) */}
              <div
                className={`${isFirstLessonCurrent ? "mt-12 mb-6" : "mt-8"}`}
              >
                <GateBanner title={level.name} />
              </div>

              {/* Zigzag path for this level - first lesson at bottom */}
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
                          isGiftOpened={lesson.isGiftOpened}
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
                            top: "-30%",
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
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
