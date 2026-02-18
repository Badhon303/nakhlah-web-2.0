import { ZigzagPath } from "./components/ZigzagPath";
import { UserStats } from "./components/UserStats";
import { DailyQuests } from "./components/DailyQuests";
import { ProfileSection } from "./components/ProfileSection";
import { LeaderboardCard } from "./components/LeaderboardCard";
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
    apiId: "691d5c822e12eb13348de931",
    type: "lesson",
    title: "Lesson 1",
    isCompleted: true,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 2,
    apiId: "691d5c822e12eb13348de931",
    type: "lesson",
    title: "Lesson 2",
    isCompleted: false,
    isCurrent: true,
    icon: <Star />,
    level: 1,
  },
  {
    id: 3,
    apiId: "691d5c822e12eb13348de931",
    type: "lesson",
    title: "Lesson 3",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 4,
    apiId: "691d5c822e12eb13348de931",
    type: "checkpoint",
    title: "Checkpoint",
    isCompleted: false,
    isCurrent: false,
    icon: <Medal size="xl" />,
    level: 1,
  },
  {
    id: 5,
    apiId: "691d5c822e12eb13348de931",
    type: "lesson",
    title: "Lesson 4",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 6,
    apiId: "691d5c822e12eb13348de936",
    type: "lesson",
    title: "Lesson 5",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 7,
    apiId: "691d5c822e12eb13348de937",
    type: "lesson",
    title: "Lesson 6",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 8,
    apiId: "691d5c822e12eb13348de938",
    type: "lesson",
    title: "Lesson 7",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 1,
  },
  {
    id: 9,
    apiId: "691d5c822e12eb13348de939",
    type: "trophy",
    title: "Level 1 Complete",
    isCompleted: false,
    isCurrent: false,
    icon: <Trophy />,
    level: 1,
  },

  // Level 2
  {
    id: 10,
    apiId: "691d5c822e12eb13348de940",
    type: "lesson",
    title: "Lesson 8",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 11,
    apiId: "691d5c822e12eb13348de941",
    type: "lesson",
    title: "Lesson 9",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 12,
    apiId: "691d5c822e12eb13348de942",
    type: "lesson",
    title: "Lesson 10",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 13,
    apiId: "691d5c822e12eb13348de943",
    type: "checkpoint",
    title: "Checkpoint",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 14,
    apiId: "691d5c822e12eb13348de944",
    type: "lesson",
    title: "Lesson 11",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 15,
    apiId: "691d5c822e12eb13348de945",
    type: "lesson",
    title: "Lesson 12",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 16,
    apiId: "691d5c822e12eb13348de946",
    type: "lesson",
    title: "Lesson 13",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 17,
    apiId: "691d5c822e12eb13348de947",
    type: "lesson",
    title: "Lesson 14",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 2,
  },
  {
    id: 18,
    apiId: "691d5c822e12eb13348de948",
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
    apiId: "691d5c822e12eb13348de949",
    type: "lesson",
    title: "Lesson 15",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 20,
    apiId: "691d5c822e12eb13348de950",
    type: "lesson",
    title: "Lesson 16",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 21,
    apiId: "691d5c822e12eb13348de951",
    type: "lesson",
    title: "Lesson 17",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 22,
    apiId: "691d5c822e12eb13348de952",
    type: "lesson",
    title: "Lesson 18",
    isCompleted: false,
    isCurrent: false,
    icon: <Star />,
    level: 3,
  },
  {
    id: 23,
    apiId: "691d5c822e12eb13348de953",
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
        className="lg:hidden fixed w-full z-[110] bg-primary shadow-md"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <UserStats />
      </div>

      <main
        className="container mx-auto lg:px-4 lg:py-6 max-w-7xl"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side: Scrollable pathway */}
          <div
            className="lg:w-2/3 lg:h-[calc(100vh_-_64px)] lg:overflow-y-auto no-scrollbar"
            style={{ top: "env(safe-area-inset-top, 0px)" }}
          >
            <ZigzagPath lessons={lessons} levels={levels} mascots={mascots} />
          </div>

          {/* Right side: Sticky Sidebar */}
          <div
            className={`hidden lg:block lg:w-1/3 space-y-6 lg:h-[calc(100vh_-_64px)] lg:overflow-y-auto no-scrollbar lg:sticky ${stickyTopOffset} h-fit max-w-sm ml-auto`}
          >
            <UserStats />
            <DailyQuests />
            <LeaderboardCard />
            <ProfileSection />
          </div>
        </div>
      </main>
    </div>
  );
}
