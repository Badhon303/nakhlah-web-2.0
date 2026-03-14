"use client";

import { useEffect, useState } from "react";
import { ZigzagPath } from "./components/ZigzagPath";
import { UserStats } from "./components/UserStats";
import { DailyQuests } from "./components/DailyQuests";
import { ProfileSection } from "./components/ProfileSection";
import { LeaderboardCard } from "./components/LeaderboardCard";
import { CompleteProfilePrompt } from "./components/CompleteProfilePrompt";
import { Trophy } from "@/components/icons/Trophy";
import { fetchJourneyStructure } from "@/services/api";
import { updateMyProfile } from "@/services/api/auth";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { toast } from "@/components/nakhlah/Toast";

const mascots = [];

const sortByOrder = (items, key) =>
  [...(items || [])].sort((a, b) => (a?.[key] || 0) - (b?.[key] || 0));

const buildJourneyView = (journey) => {
  const sections = [];
  const nodes = [];
  const sortedLevels = sortByOrder(journey?.levels, "levelOrder");

  sortedLevels.forEach((level) => {
    const units = sortByOrder(level?.units, "unitOrder");

    units.forEach((unit) => {
    const sectionId = `${level.id}-${unit.id}`;
    const levelLocked = !level?.inProgressOrCompleted;
    const unitLocked = !unit?.inProgressOrCompleted;
    sections.push({
      id: sectionId,
      name: unit.title,
      subtitle: level.title,
      unitOrder: unit.unitOrder,
      levelOrder: level.levelOrder,
      colorIndex: level.levelOrder,
    });

    const tasks = sortByOrder(unit?.tasks, "taskOrder");
    const lastActiveIndex = tasks
      .map((task) => Boolean(task?.inProgressOrCompleted))
      .lastIndexOf(true);

    tasks.forEach((task, index) => {
      const hasProgress = lastActiveIndex >= 0;
      let isCurrent = hasProgress && index === lastActiveIndex;
      let isCompleted = hasProgress && index < lastActiveIndex;
      const isLocked =
        levelLocked ||
        unitLocked ||
        (!task?.inProgressOrCompleted && !isCurrent && !isCompleted);
      if (levelLocked || unitLocked) {
        isCurrent = false;
        isCompleted = false;
      }
      const isGiftBox = Boolean(task?.giftBox);
      const type = isGiftBox ? "trophy" : "lesson";

      nodes.push({
        id: `${sectionId}-${task.id}`,
        apiId: task.id,
        type,
        title: task.title,
        isCompleted,
        isCurrent,
        isLocked,
        icon: isGiftBox ? <Trophy size="xl" /> : null,
        level: unit.unitOrder,
        sectionId,
      });
    });
    });
  });

  return { sections, nodes };
};

export default function LearnPage() {
  const stickyTopOffset = "top-6";
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldPrompt = localStorage.getItem("nakhlah_profile_prompt_pending") === "true";
    setShowProfilePrompt(shouldPrompt);
  }, []);

  useEffect(() => {
    const loadJourney = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        if (status === "loading") return;
        if (status === "unauthenticated" || !isSessionValid(session)) {
          throw new Error("Please login to view your journey.");
        }

        const token = getSessionToken(session);

        const result = await fetchJourneyStructure(token);
        if (!result.success) {
          throw new Error(result.error || "Failed to load journey structure");
        }

        const { sections, nodes } = buildJourneyView(result.data || {});
        setLevels(sections);
        setLessons(nodes);
      } catch (error) {
        setLoadError(error?.message || "Unable to load journey structure");
      } finally {
        setIsLoading(false);
      }
    };

    loadJourney();
  }, [session, status]);

  const handleCompleteProfile = async ({ fullName, contactNumber, profilePicture }) => {
    if (!isSessionValid(session)) {
      toast.error("Session not found. Please login again.");
      return;
    }

    const token = getSessionToken(session);
    if (!token) {
      toast.error("Access token missing. Please login again.");
      return;
    }

    setIsUpdatingProfile(true);
    const result = await updateMyProfile({ fullName, contactNumber }, profilePicture, token);
    setIsUpdatingProfile(false);

    if (!result.success) {
      toast.error(result.error || "Failed to update profile");
      return;
    }

    localStorage.removeItem("nakhlah_profile_prompt_pending");
    setShowProfilePrompt(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="bg-background text-foreground">
      <CompleteProfilePrompt
        open={showProfilePrompt}
        isSubmitting={isUpdatingProfile}
        onSubmit={handleCompleteProfile}
        onClose={() => setShowProfilePrompt(false)}
      />

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
            {loadError ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {loadError}
              </div>
            ) : (
              <ZigzagPath
                lessons={lessons}
                levels={levels}
                mascots={mascots}
                isLoading={isLoading}
              />
            )}
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
