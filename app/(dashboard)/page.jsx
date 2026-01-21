import { ZigzagPath } from "./components/ZigzagPath";
import { UserStats } from "./components/UserStats";
import { DailyQuests } from "./components/DailyQuests";
import { ProfileSection } from "./components/ProfileSection";
import { Star } from "@/components/icons/Star";
import { Medal } from "@/components/icons/Medal";
import { Trophy } from "@/components/icons/Trophy";
import { Crown } from "@/components/icons/Crown";

const levels = [
  {
    id: 1,
    name: "The Basics",
    description: "Start your journey with fundamental concepts.",
  },
  {
    id: 2,
    name: "Building Blocks",
    description: "Expand your vocabulary and grammar.",
  },
  {
    id: 3,
    name: "First Conversations",
    description: "Learn to form simple sentences and questions.",
  },
];

const lessons = [
  // Level 1
  {
    id: 1,
    type: "lesson",
    title: "Lesson 1",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 2,
    type: "lesson",
    title: "Lesson 2",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 3,
    type: "lesson",
    title: "Lesson 3",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 4,
    type: "checkpoint",
    title: "Checkpoint",
    isCompleted: true,
    isCurrent: false,
    icon: <Medal size="xl" />,
    level: 1,
  },
  {
    id: 5,
    type: "lesson",
    title: "Lesson 4",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 6,
    type: "lesson",
    title: "Lesson 5",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 7,
    type: "lesson",
    title: "Lesson 6",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 8,
    type: "lesson",
    title: "Lesson 7",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 9,
    type: "trophy",
    title: "Level 1 Complete",
    isCompleted: false,
    isCurrent: true,
    icon: <Trophy />,
    level: 1,
  },

  // Level 2
  {
    id: 10,
    type: "lesson",
    title: "Lesson 8",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 11,
    type: "lesson",
    title: "Lesson 9",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 12,
    type: "lesson",
    title: "Lesson 10",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 13,
    type: "checkpoint",
    title: "Checkpoint",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 14,
    type: "lesson",
    title: "Lesson 11",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 15,
    type: "lesson",
    title: "Lesson 12",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 16,
    type: "lesson",
    title: "Lesson 13",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 17,
    type: "lesson",
    title: "Lesson 14",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 18,
    type: "trophy",
    title: "Level 2 Complete",
    isCompleted: false,
    isCurrent: false,
    icon: <Trophy />,
    level: 2,
  },

  // Level 3
  {
    id: 19,
    type: "lesson",
    title: "Lesson 15",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 20,
    type: "lesson",
    title: "Lesson 16",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 21,
    type: "lesson",
    title: "Lesson 17",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 22,
    type: "lesson",
    title: "Lesson 18",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 23,
    type: "crown",
    title: "Crown Challenge",
    isCompleted: false,
    isCurrent: false,
    icon: <Crown />,
    level: 3,
  },
];

const mascots = [
  { mood: "happy", size: "xxl", position: 3, message: "You're doing great!" },
  {
    mood: "proud",
    size: "xxl",
    position: 7,
    message: "Keep up the good work!",
  },
  { mood: "excited", size: "xxl", position: 12, message: "Amazing progress!" },
  { mood: "surprised", size: "xxl", position: 16, message: "You're on fire!" },
  {
    mood: "encouraging",
    size: "xxl",
    position: 21,
    message: "Almost at the finish line!",
  },
];

export default function LearnPage() {
  const stickyTopOffset = "top-6";

  return (
    <div className="bg-background text-foreground">
      {/* Mobile sticky header */}
      <div
        className="lg:hidden sticky z-20 bg-primary shadow-md"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <UserStats />
      </div>

      <main className="container mx-auto lg:px-4 lg:py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side: Scrollable pathway */}
          <div className="lg:w-2/3 lg:h-[calc(100vh_-_64px)] lg:overflow-y-auto no-scrollbar">
            <ZigzagPath lessons={lessons} levels={levels} mascots={mascots} />
          </div>

          {/* Right side: Sticky Sidebar */}
          <div
            className={`hidden lg:block lg:w-1/3 space-y-8 lg:sticky ${stickyTopOffset} h-fit max-w-sm ml-auto`}
          >
            <UserStats />
            <DailyQuests />
            <ProfileSection />
          </div>
        </div>
      </main>
    </div>
  );
}
