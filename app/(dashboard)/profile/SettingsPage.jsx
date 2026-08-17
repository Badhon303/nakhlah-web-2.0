"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  HelpCircle,
  Info,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
} from "lucide-react";
import { ThemeToggle } from "@/components/nakhlah/ThemeToggle";
import { signOut, getSessionSync } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";
import { logoutUser } from "@/services/api/auth";
import { ConfirmPrompt } from "@/components/nakhlah/ConfirmPrompt";

export default function SettingsPage({ onBack, onNavigate }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const settingsItems = [
    {
      label: "Personal Info",
      icon: User,
      color:
        "bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400",
      action: "edit-profile",
    },
    {
      label: "Notification",
      icon: Bell,
      color: "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400",
      action: "notification",
    },
    {
      label: "Payment",
      icon: CreditCard,
      color:
        "bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400",
      action: "payment",
    },
    {
      label: "Help Center",
      icon: HelpCircle,
      color: "bg-teal-100 text-teal-500 dark:bg-teal-900/30 dark:text-teal-400",
      action: "help-center",
    },
    {
      label: "About Nakhlah",
      icon: Info,
      color:
        "bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400",
      action: "about-nakhlah",
    },
    {
      label: "Theme",
      icon: Moon,
      color:
        "bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-foreground",
      toggle: true,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const session = getSessionSync();
      const token = getSessionToken(session);
      await logoutUser(token);
    } catch {
      // ignore network errors, still proceed to clear local session
    }
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
      >
        <div className="space-y-1">
          {settingsItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 dark:hover:bg-muted/50 transition-all group rounded-xl cursor-pointer"
                onClick={() => {
                  if (!item.toggle && item.action) {
                    onNavigate(item.action);
                  }
                }}
              >
                {/* Left side */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center transition-colors`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">
                    {item.label}
                  </span>
                </div>

                {/* Right side - toggle or chevron */}
                {item.toggle ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center"
                  >
                    <ThemeToggle size="md" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-3 p-4 hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-all rounded-xl group"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-colors">
              <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
            <span className="font-medium text-red-500 dark:text-red-400">
              Logout
            </span>
          </button>
        </motion.div>
      </motion.div>

      <ConfirmPrompt
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        icon={LogOut}
        title="Log out of Nakhlah?"
        description="You'll need to sign in again to continue your learning streak."
        confirmLabel="Log Out"
        cancelLabel="Stay Signed In"
        onConfirm={handleLogout}
        isPending={isLoggingOut}
      />
    </div>
  );
}
