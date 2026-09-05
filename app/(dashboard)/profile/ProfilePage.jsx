import HeaderSection from "./components/HeaderSection";
import StatisticsGrid from "./components/StatisticsGrid";
import AchievementsList from "./components/AchievementsList";
import MotivationCard from "./components/MotivationCard";
import QuickStats from "./components/QuickStats";
// import ShareProfile from "./components/ShareProfile";
import SubscriptionCard from "./components/SubscriptionCard";
import RefillLivesCard from "./components/RefillLivesCard";
import { DailyQuests } from "../components/DailyQuests";

export default function ProfilePage({
  onNavigate,
  currentUser,
  profileData,
  achievementsData,
  isLoading,
}) {
  const dynamicStats = [
    {
      label: "Followers",
      value: "1,536",
      onClick: () => onNavigate("followers"),
    },
    {
      label: "Following",
      value: "195",
      onClick: () => onNavigate("following"),
    },
    {
      label: "Activity Injaz",
      value: `${profileData?.gamificationStock?.injazStock ?? 0}`,
    },
  ];

  const stats = [
    {
      label: "Followers",
      value: "1,536",
      onClick: () => onNavigate("followers"),
    },
    {
      label: "Following",
      value: "195",
      onClick: () => onNavigate("following"),
    },
    { label: "Activity Injaz", value: "15,274" },
  ];

  const resolvedStats = profileData ? dynamicStats : stats;

  return (
    <main className="container mx-auto max-w-3xl py-6 lg:max-w-7xl px-4 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="min-w-0 space-y-6 lg:space-y-8">
          <HeaderSection
            stats={resolvedStats}
            onNavigateSettings={() => onNavigate("settings")}
            onNavigateEdit={() => onNavigate("edit-profile")}
            onShare={() => onNavigate("share-profile")}
            currentUser={currentUser}
            profileData={profileData}
            isLoading={isLoading}
          />
          <StatisticsGrid
            profileData={profileData}
            achievementsData={achievementsData}
          />
          <AchievementsList
            onViewAll={() => onNavigate("all-achievements")}
            achievements={achievementsData}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar - Only on Desktop */}
        <aside className="hidden space-y-6 lg:block">
          <MotivationCard />
          <QuickStats profileData={profileData} />
          {/* <ShareProfile onShare={() => onNavigate("share-profile")} /> */}
          <SubscriptionCard />
          <RefillLivesCard />
        </aside>
      </div>

      {/* Mobile Sidebar - appears below main content */}
      <div className="mt-6 space-y-6 pb-6 lg:hidden">
        <DailyQuests variant="profile" />
        <QuickStats profileData={profileData} />
        {/* <ShareProfile onShare={() => onNavigate("share-profile")} /> */}
        <SubscriptionCard />
        <RefillLivesCard />
      </div>
    </main>
  );
}
