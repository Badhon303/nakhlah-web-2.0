import HeaderSection from "./components/HeaderSection";
import StatisticsGrid from "./components/StatisticsGrid";
import XPChart from "./components/XPChart";
import AchievementsList from "./components/AchievementsList";
import MotivationCard from "./components/MotivationCard";
import QuickStats from "./components/QuickStats";
import ShareProfile from "./components/ShareProfile";

export default function ProfilePage({ onNavigate }) {
  const stats = [
    { label: "Followers", value: "1,536", onClick: () => onNavigate("followers") },
    { label: "Following", value: "195", onClick: () => onNavigate("following") },
    { label: "Activity XP", value: "15,274" },
  ];

  return (
    <div className="max-w-7xl mx-auto min-h-[calc(100vh-64px)] overflow-hidden">
      <HeaderSection 
        stats={stats} 
        onNavigateSettings={() => onNavigate("settings")}
        onNavigateEdit={() => onNavigate("edit-profile")}
        onShare={() => onNavigate("share-profile")}
      />
      
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <StatisticsGrid />
          <XPChart />
          <AchievementsList onViewAll={() => onNavigate("all-achievements")} />
        </div>

        {/* Sidebar - Only on Desktop */}
        <div className="hidden lg:block space-y-8">
          <MotivationCard />
          <QuickStats />
          <ShareProfile onShare={() => onNavigate("share-profile")} />
        </div>
      </div>

      {/* Mobile Sidebar - appears below main content */}
      <div className="lg:hidden space-y-6 mt-4">
        <QuickStats />
      </div>
    </div>
  );
}
