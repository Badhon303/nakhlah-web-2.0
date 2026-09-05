"use client";
import { motion } from "framer-motion";
import { Edit, Settings } from "lucide-react";
// import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!API_URL) return url;
  return `${API_URL}${url}`;
};

const getInitials = (fullName, email) => {
  const source = fullName || email || "User";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

const formatJoinedDate = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function HeaderSection({
  stats,
  onNavigateSettings,
  onNavigateEdit,
  // onShare,
  currentUser,
  profileData,
  isLoading,
}) {
  const fullName = profileData?.fullName || "No Name Set";
  const email =
    currentUser?.email || profileData?.user?.email || "No Email Set";
  const joined = formatJoinedDate(
    currentUser?.createdAt || profileData?.createdAt,
  );
  const avatarUrl = getMediaUrl(
    profileData?.profilePicture?.url || currentUser?.socialMediaPictureUrl,
  );
  const initials = getInitials(fullName, email);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-accent/20 lg:bg-card lg:shadow-sm"
    >
      <div className="relative overflow-hidden bg-gradient-accent px-5 py-7 text-accent-foreground sm:px-7 sm:py-8">
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[28px] border-white/10" />
        <div className="absolute -bottom-16 right-28 h-32 w-32 rounded-full bg-white/[0.06]" />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-28 w-28 rounded-3xl border-4 border-white/80 bg-white/20 p-0.5 shadow-xl sm:h-32 sm:w-32">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.25rem] bg-card/20 text-3xl font-extrabold text-white sm:text-4xl">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </div>
            {/* <div className="absolute -bottom-2 -right-2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-base lg:text-lg shadow-xl border-4 border-background lg:border-card">
              {profileData?.learnerStreak?.currentStreak ?? 0}
            </div> */}
          </div>

          {/* Profile Info */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h1 className="truncate text-3xl font-extrabold tracking-tight text-white">
              {isLoading ? "Loading..." : fullName}
            </h1>
            <p className="mt-1 truncate text-sm font-medium text-white/85 sm:text-base">
              {email}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {joined ? `Learning with Nakhlah since ${joined}` : ""}
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex justify-center gap-3 sm:justify-start">
              <Button
                onClick={onNavigateEdit}
                className="h-10 rounded-xl bg-white px-4 font-bold text-accent shadow-sm hover:bg-white/90"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
              {/*
              <Button onClick={onShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              */}
              <Button
                onClick={onNavigateSettings}
                className="h-10 rounded-xl border border-white/25 bg-white/10 px-4 font-bold text-white shadow-none hover:bg-white/20"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="flex justify-center gap-6 lg:gap-12 w-full lg:w-auto">
            {stats.map((stat, index) => (
              <button
                key={index}
                onClick={stat.onClick}
                className={`text-center ${stat.onClick ? 'hover:scale-105 transition-transform cursor-pointer' : 'cursor-default'}`}
              >
                <div className="text-xl lg:text-2xl font-bold text-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </button>
            ))}
          </div> */}
        </div>
      </div>
    </motion.section>
  );
}
