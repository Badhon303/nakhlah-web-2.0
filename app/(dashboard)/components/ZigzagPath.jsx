
import { Circle } from "./Circle";
import { Mascot } from "@/components/nakhlah/Mascot";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export function ZigzagPath({ lessons, levels, mascots }) {
  const [currentLevelName, setCurrentLevelName] = useState("");

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.level]) acc[lesson.level] = [];
    acc[lesson.level].push(lesson);
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
      ? { left: "15%", transform: "translateX(-50%)" }
      : { left: "85%", transform: "translateX(-50%)" };
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
    const observers = [];
    const levelElements = document.querySelectorAll("[data-level-id]");

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const levelId = entry.target.getAttribute("data-level-id");
          const level = levels.find(l => l.id.toString() === levelId);
          if (level) {
            setCurrentLevelName(level.name);
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
    
    // Set initial level name
    if (levels && levels.length > 0) {
        setCurrentLevelName(levels[0].name);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [levels]);

  return (
    <div className="relative max-w-md mx-auto">
      {/* Sticky level header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div
          className={`text-center bg-gradient-to-r ${getLevelColor(levels.find(l => l.name === currentLevelName)?.id || 1)} text-white py-3 rounded-lg shadow-lg transition-all duration-500 ease-in-out`}
        >
          <h2 className="text-2xl font-bold">{currentLevelName}</h2>
        </div>
      </div>

      {/* Lessons grouped by level */}
      <div className="relative mt-6">
        {levels.map((level, levelIndex) => (
          <div key={level.id} data-level-id={level.id} className="mb-12 relative">
            {/* Level barrier */}
            <div className="relative h-1 flex items-center justify-center mb-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-border"></div>
                </div>
                <div className="relative bg-background px-4">
                  <span className={`text-lg font-bold bg-gradient-to-r ${getLevelColor(level.id)} bg-clip-text text-transparent`}>
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
                  <div key={lesson.id} className="relative h-24 w-full">
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
                        isLocked={!lesson.isCompleted && !lesson.isCurrent}
                        icon={lesson.icon}
                        type={lesson.type}
                      />
                    </div>

                    {/* Mascot */}
                    {mascots.map(
                      (mascot) =>
                        mascot.position === lesson.id && (
                          <div
                            key={mascot.mood}
                            className="absolute"
                            style={{
                              left: mascotPosition.left,
                              top: "50%",
                              transform: `${mascotPosition.transform} translateY(-50%)`,
                            }}
                          >
                            <Mascot
                              mood={mascot.mood}
                              message={mascot.message}
                              className="max-w-[250px]"
                            />
                          </div>
                        )
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
