"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import EditProfilePage from "./components/EditProfile";
import FollowersPage from "./components/Followers";
import FollowingPage from "./components/Following";
import AllAchievementsPage from "./components/AllAchievements";
import ShareProfileDrawer from "./components/ShareProfileDrawer";

export default function ProfileAndSettings() {
  const [activeView, setActiveView] = useState("profile");
  const [showShareDrawer, setShowShareDrawer] = useState(false);

  const handleNavigate = (view) => {
    if (view === "share-profile") {
      setShowShareDrawer(true);
    } else {
      setActiveView(view);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "profile":
        return <ProfilePage onNavigate={handleNavigate} />;
      case "settings":
        return <SettingsPage onBack={() => setActiveView("profile")} />;
      case "edit-profile":
        return <EditProfilePage onBack={() => setActiveView("profile")} />;
      case "followers":
        return <FollowersPage onBack={() => setActiveView("profile")} />;
      case "following":
        return <FollowingPage onBack={() => setActiveView("profile")} />;
      case "all-achievements":
        return <AllAchievementsPage onBack={() => setActiveView("profile")} />;
      default:
        return <ProfilePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeView}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="container px-4 py-8 mx-auto"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      <ShareProfileDrawer 
        open={showShareDrawer} 
        onClose={() => setShowShareDrawer(false)} 
      />
    </div>
  );
}