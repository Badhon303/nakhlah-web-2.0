"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationSettingsPage from "./components/NotificationSettings";
import HelpCenterPage from "./components/HelpCenter";
import ContactUsPage from "./components/ContactUs";
import AllAchievementsPage from "./components/AllAchievements";
import TermsAndConditionsPage from "./components/TermsAndConditions";
import PrivacyPolicyPage from "./components/PrivacyPolicy";
import LearningTipsGuidesPage from "./components/LearningTipsGuides";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import EditProfilePage from "./components/EditProfile";
import ShareProfileDrawer from "./components/ShareProfileDrawer";
import AboutNakhlahPage from "./components/AboutNakhlah";
import { useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDailyQuestStore } from "@/stores/useDailyQuestStore";
import { useAchievementsStore } from "@/stores/useAchievementsStore";
import { fetchCurrentUser, fetchMyProfile } from "@/services/api";

const VALID_VIEWS = new Set([
  "profile",
  "settings",
  "edit-profile",
  "all-achievements",
  "notification",
  "help-center",
  "contact-us",
  "about-nakhlah",
  "terms-and-conditions",
  "privacy-policy",
  "learning-tips",
  "payment",
]);

export default function ProfileAndSettingsContent({ basePath, defaultView }) {
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { data: session, status } = useSession();
  const achievementsData = useAchievementsStore((s) => s.achievements);
  const fetchAchievements = useAchievementsStore((s) => s.fetchAchievements);
  const clearAchievements = useAchievementsStore((s) => s.clear);
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimQuestIfAvailable = useDailyQuestStore(
    (store) => store.claimQuestIfAvailable,
  );

  // Derive the active view and editing state from the URL during render instead
  // of syncing via an effect, which would trigger cascading renders.
  const requestedView = searchParams.get("view");
  const activeView =
    requestedView && VALID_VIEWS.has(requestedView) ? requestedView : defaultView;
  const startEditingProfile =
    activeView === "edit-profile"
      ? searchParams.get("startEditing") === "true"
      : false;

  useEffect(() => {
    const loadProfile = async () => {
      if (status === "loading") return;
      if (status === "unauthenticated" || !isSessionValid(session)) {
        clearAchievements();
        setIsProfileLoading(false);
        return;
      }

      const token = getSessionToken(session);
      const userKey = getUserKey(session);
      setIsProfileLoading(true);

      const [meResult, profileResult] = await Promise.all([
        fetchCurrentUser(token),
        fetchMyProfile(token),
      ]);

      if (meResult.success) {
        setCurrentUser(meResult.user || null);
      }

      if (profileResult.success) {
        setProfileData(profileResult.profile || null);
      }

      void fetchAchievements({ token, userKey });

      setIsProfileLoading(false);
    };

    loadProfile();
  }, [session, status]);

  const handleProfileUpdated = (updatedProfile) => {
    if (updatedProfile) {
      setProfileData(updatedProfile);
    }
  };

  const handleNavigate = (view, options = {}) => {
    if (view === "share-profile") {
      setShowShareDrawer(true);
      const token = getSessionToken(session);
      if (token && isSessionValid(session)) {
        void claimQuestIfAvailable({
          token,
          userKey: getUserKey(session),
          questKey: "shareTheApp",
        });
      }
    } else if (view === "payment") {
      router.push("/store");
    } else if (view === "edit-profile") {
      const startEditing = options?.startEditing || false;
      if (startEditing) {
        router.push("/profile?view=edit-profile&startEditing=true");
      } else {
        router.push(`${basePath}?view=edit-profile`);
      }
    } else if (view === "all-achievements") {
      router.push("/profile?view=all-achievements");
    } else if (view === "settings") {
      router.push("/settings");
    } else if (VALID_VIEWS.has(view)) {
      router.push(`${basePath}?view=${view}`);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "profile":
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            currentUser={currentUser}
            profileData={profileData}
            achievementsData={achievementsData}
            isLoading={isProfileLoading}
          />
        );
      case "settings":
        return (
          <SettingsPage
            onBack={() => router.push("/profile")}
            onNavigate={handleNavigate}
          />
        );
      case "edit-profile":
        return (
          <EditProfilePage
            onBack={() =>
              router.push(startEditingProfile ? "/profile" : basePath)
            }
            currentUser={currentUser}
            profileData={profileData}
            onProfileUpdated={handleProfileUpdated}
            startEditing={startEditingProfile}
          />
        );

      case "all-achievements":
        return (
          <AllAchievementsPage
            onBack={() => router.push("/profile")}
            achievements={achievementsData}
            isLoading={isProfileLoading}
          />
        );
      case "notification":
        return (
          <NotificationSettingsPage
            onBack={() => router.push(`${basePath}?view=settings`)}
          />
        );

      case "help-center":
        return (
          <HelpCenterPage
            onBack={() => router.push(`${basePath}?view=settings`)}
            onNavigateContact={() => handleNavigate("contact-us")}
            onNavigateLearningTips={() => handleNavigate("learning-tips")}
          />
        );
      case "contact-us":
        return (
          <ContactUsPage
            onBack={() => router.push(`${basePath}?view=help-center`)}
          />
        );

      case "about-nakhlah":
        return (
          <AboutNakhlahPage
            onBack={() => router.push(`${basePath}?view=settings`)}
            onNavigate={handleNavigate}
          />
        );
      case "terms-and-conditions":
        return (
          <TermsAndConditionsPage
            onBack={() => router.push(`${basePath}?view=about-nakhlah`)}
          />
        );
      case "privacy-policy":
        return (
          <PrivacyPolicyPage
            onBack={() => router.push(`${basePath}?view=about-nakhlah`)}
          />
        );
      case "learning-tips":
        return (
          <LearningTipsGuidesPage
            onBack={() => router.push(`${basePath}?view=help-center`)}
          />
        );
      default:
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            currentUser={currentUser}
            profileData={profileData}
            achievementsData={achievementsData}
            isLoading={isProfileLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-4 lg:px-0"
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
