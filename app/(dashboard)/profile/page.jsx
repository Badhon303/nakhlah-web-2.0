"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationSettingsPage from "./components/NotificationSettings";
import AccessibilitySettingsPage from "./components/AccessibilitySettings";
import SecuritySettingsPage from "./components/SecuritySettings";
import FindFriendsPage from "./components/FindFriends";
import HelpCenterPage from "./components/HelpCenter";
import ContactUsPage from "./components/ContactUs";
import AllAchievementsPage from "./components/AllAchievements";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import EditProfilePage from "./components/EditProfile";
import FollowersPage from "./components/Followers";
import FollowingPage from "./components/Following";
import ShareProfileDrawer from "./components/ShareProfileDrawer";
import GeneralSettingsPage from "./components/GeneralSettings";
import AboutNakhlahPage from "./components/AboutNakhlah";

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
        return (
          <SettingsPage
            onBack={() => setActiveView("profile")}
            onNavigate={handleNavigate}
          />
        );
      case "edit-profile":
        return <EditProfilePage onBack={() => setActiveView("profile")} />;
      case "followers":
        return <FollowersPage onBack={() => setActiveView("profile")} />;
      case "following":
        return <FollowingPage onBack={() => setActiveView("profile")} />;
      case "all-achievements":
        return <AllAchievementsPage onBack={() => setActiveView("profile")} />;
      case "notification":
        return (
          <NotificationSettingsPage onBack={() => setActiveView("settings")} />
        );
      case "accessibility":
        return (
          <AccessibilitySettingsPage onBack={() => setActiveView("settings")} />
        );
      case "security":
        return (
          <SecuritySettingsPage onBack={() => setActiveView("settings")} />
        );
      case "find-friends":
        return <FindFriendsPage onBack={() => setActiveView("settings")} />;
      case "help-center":
        return (
          <HelpCenterPage
            onBack={() => setActiveView("settings")}
            onNavigateContact={() => setActiveView("contact-us")}
          />
        );
      case "contact-us":
        return <ContactUsPage onBack={() => setActiveView("help-center")} />;
      case "general":
        return <GeneralSettingsPage onBack={() => setActiveView("settings")} />;
      case "about-nakhlah":
        return <AboutNakhlahPage onBack={() => setActiveView("settings")} />;
      default:
        return <ProfilePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
