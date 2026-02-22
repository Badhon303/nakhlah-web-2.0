/* eslint-disable react-hooks/set-state-in-effect */
import { Circle } from "./Circle";
import { Mascot } from "@/components/nakhlah/Mascot";
import { useEffect, useState } from "react";
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
      threshold: 0.5,
    });

    levelElements.forEach((el) => {
      observer.observe(el);
      observers.push(observer);
    });

    // initial level name
    if (levels && levels.length > 0) {
      setCurrentLevelId(levels[0].id);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [levels, isLoading]);

  return (
    <div className="relative lg:max-w-lg mx-auto">
      {/* Sticky level header */}
      <div className="sticky top-[calc(env(safe-area-inset-top)+72px)] lg:top-0 z-50 bg-background/80 backdrop-blur-sm py-2 lg:py-0">
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg transition-all duration-500 ease-in-out bg-gradient-to-r ${getLevelColor(
            currentLevel?.colorIndex || 1,
          )} text-white`}
        >
          <div>
            <div className="text-2xl font-bold">
              {currentLevel ? `Unit ${currentLevel.unitOrder || ""}` : ""}
            </div>
            {/* <div>{currentLevel ? currentLevel.name : ""}</div> */}
            {currentLevel?.subtitle ? (
              <div className="text-xs text-white/90">{currentLevel.subtitle}</div>
            ) : null}
          </div>
          <button className="text-white hover:bg-white/20 p-2 rounded-full">
            <FileText className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lessons grouped by level */}
      <div className="relative mt-6">
        {levels.map((level, levelIndex) => (
          <div
            key={level.id}
            data-level-id={level.id}
            className="mb-12 relative"
          >
            {/* Level barrier */}
            <div className="relative h-1 flex items-center justify-center mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-border"></div>
              </div>
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
              {(groupedLessons[level.id] || []).map((lesson, index) => {
                const position = getPosition(index);
                const mascotPosition = getMascotPosition(index);

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
                          className="relative mx-auto bg-white text-sm font-semibold px-3 py-2 rounded-md shadow-md border-accent w-[110px]"
                          style={{
                            borderWidth: 4,
                          }}
                        >
                          {/* The bubble text */}
                          <div className="text-center font-semibold text-accent">
                            START!
                          </div>

                          {/* Arrow pointing down */}
                          <div
                            className="absolute left-1/2 bg-white border-accent"
                            style={{
                              width: 16,
                              height: 16,
                              bottom: -11,
                              transform: "translateX(-50%) rotate(45deg)",
                              borderRightWidth: 4,
                              borderBottomWidth: 4,
                            }}
                          />

                          {/* Mask to hide the top part of the arrow */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 bg-white"
                            style={{
                              width: 20,
                              height: 8,
                              bottom: -2,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Mascot */}
                    {mascots.map(
                      (mascot) =>
                        mascot.position === lesson.id && (
                          <div
                            key={mascot.mood}
                            className="absolute"
                            style={{
                              left: mascotPosition.left,
                              top:
                                mascotPosition.left === "85%" ? "90%" : "70%",
                              transform: `${mascotPosition.transform} translateY(-50%)`,
                            }}
                          >
                            <Mascot
                              mood={mascot.mood}
                              size={mascot.size}
                              message={mascot.message}
                              className=""
                            />
                          </div>
                        ),
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

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
