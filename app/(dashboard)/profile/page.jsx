"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSelector } from "@/components/nakhlah/LanguageSelector";
import { ComboBox } from "@/components/nakhlah/ComboBox";
import { ThemeToggle } from "@/components/nakhlah/ThemeToggle";
import { XPDisplay } from "@/components/nakhlah/XPDisplay";
import { Mascot } from "@/components/nakhlah/Mascot";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Bell,
  Globe,
  Clock,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const dailyGoalOptions = [
  { value: "5", label: "Casual", description: "5 minutes/day" },
  { value: "10", label: "Regular", description: "10 minutes/day" },
  { value: "15", label: "Serious", description: "15 minutes/day" },
  { value: "20", label: "Intense", description: "20 minutes/day" },
];

export default function Profile() {
  const [nativeLanguage, setNativeLanguage] = useState("english");
  const [learningLanguage, setLearningLanguage] = useState("arabic");
  const [dailyGoal, setDailyGoal] = useState("10");

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-4xl font-bold text-accent-foreground">
                    J
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-palm text-sm font-bold text-secondary-foreground">
                    5
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-foreground">
                    John Doe
                  </h1>
                  <p className="text-muted-foreground">john.doe@email.com</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Member since January 2024
                  </p>
                </div>

                {/* XP Progress */}
                <div className="w-full max-w-xs">
                  <XPDisplay current={340} nextLevel={500} level={5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Settings */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  Language Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LanguageSelector
                  value={nativeLanguage}
                  onChange={setNativeLanguage}
                  label="I speak"
                />
                <LanguageSelector
                  value={learningLanguage}
                  onChange={setLearningLanguage}
                  label="I'm learning"
                />
              </CardContent>
            </Card>

            {/* Learning Settings */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Learning Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Daily Goal
                  </label>
                  <ComboBox
                    options={dailyGoalOptions}
                    value={dailyGoal}
                    onChange={setDailyGoal}
                    placeholder="Select your daily goal"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-border p-4">
                  <div>
                    <p className="font-semibold text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark mode
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  Quick Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  {
                    icon: Bell,
                    label: "Notifications",
                    description: "Manage reminders",
                  },
                  {
                    icon: Shield,
                    label: "Privacy",
                    description: "Control your data",
                  },
                  {
                    icon: User,
                    label: "Account",
                    description: "Manage your account",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex w-full items-center justify-between rounded-xl p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Logout */}
            <Button variant="outline" className="w-full gap-2">
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>

          {/* Mascot Column */}
          <div className="space-y-6">
            <Card variant="accent">
              <CardContent className="flex flex-col items-center p-6">
                <Mascot
                  mood="happy"
                  size="lg"
                  message="Keep up the great work! 🌟"
                />
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Current Streak", value: "7 days" },
                  { label: "Longest Streak", value: "21 days" },
                  { label: "Total XP", value: "2,340" },
                  { label: "Words Learned", value: "156" },
                  { label: "Lessons Completed", value: "24" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
