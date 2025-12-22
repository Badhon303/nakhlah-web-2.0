"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterChips } from "@/components/nakhlah/FilterChips";
import { DataTable } from "@/components/nakhlah/DataTable";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown } from "lucide-react";

const timeFilters = [
  { id: "weekly", label: "This Week" },
  { id: "monthly", label: "This Month" },
  { id: "alltime", label: "All Time" },
];

const leaderboardData = [
  { rank: 1, name: "Ahmed Al-Hassan", xp: 4520, streak: 45, country: "🇸🇦" },
  { rank: 2, name: "Sarah Chen", xp: 4280, streak: 32, country: "🇨🇳" },
  { rank: 3, name: "Muhammad Khan", xp: 3950, streak: 28, country: "🇵🇰" },
  { rank: 4, name: "Emily Johnson", xp: 3720, streak: 21, country: "🇺🇸" },
  { rank: 5, name: "Omar Farouk", xp: 3540, streak: 19, country: "🇪🇬" },
  { rank: 6, name: "Lisa Schmidt", xp: 3210, streak: 17, country: "🇩🇪" },
  { rank: 7, name: "Ali Reza", xp: 2980, streak: 15, country: "🇮🇷" },
  { rank: 8, name: "Maria Garcia", xp: 2750, streak: 14, country: "🇪🇸" },
  {
    rank: 9,
    name: "You",
    xp: 2340,
    streak: 7,
    country: "🌍",
    isCurrentUser: true,
  },
  { rank: 10, name: "Jean Dupont", xp: 2120, streak: 11, country: "🇫🇷" },
];

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState(["weekly"]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="font-semibold text-accent">Leaderboard</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Top Learners
          </h1>
          <p className="mt-2 text-muted-foreground">
            See how you rank against other Arabic learners
          </p>
        </motion.div>

        {/* Time Filter */}
        <div className="mb-8 flex justify-center">
          <FilterChips
            options={timeFilters}
            selected={timeFilter}
            onChange={setTimeFilter}
          />
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {/* Second Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 md:order-1"
          >
            <Card variant="elevated" className="text-center md:mt-8">
              <CardContent className="p-6">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <span className="text-2xl">{topThree[1]?.country}</span>
                </div>
                <Medal className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 font-bold text-foreground">
                  {topThree[1]?.name}
                </h3>
                <p className="text-2xl font-bold text-accent">
                  {topThree[1]?.xp} XP
                </p>
                <p className="text-sm text-muted-foreground">
                  🔥 {topThree[1]?.streak} day streak
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* First Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 md:order-2"
          >
            <Card variant="accent" className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="text-3xl">{topThree[0]?.country}</span>
                </div>
                <Crown className="mx-auto h-10 w-10 text-yellow-500" />
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  {topThree[0]?.name}
                </h3>
                <p className="text-3xl font-bold text-accent">
                  {topThree[0]?.xp} XP
                </p>
                <p className="text-sm text-muted-foreground">
                  🔥 {topThree[0]?.streak} day streak
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Third Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3"
          >
            <Card variant="elevated" className="text-center md:mt-8">
              <CardContent className="p-6">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <span className="text-2xl">{topThree[2]?.country}</span>
                </div>
                <Medal className="mx-auto h-8 w-8 text-amber-600" />
                <h3 className="mt-2 font-bold text-foreground">
                  {topThree[2]?.name}
                </h3>
                <p className="text-2xl font-bold text-accent">
                  {topThree[2]?.xp} XP
                </p>
                <p className="text-sm text-muted-foreground">
                  🔥 {topThree[2]?.streak} day streak
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Full Leaderboard */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            <DataTable
              data={leaderboardData}
              columns={[
                {
                  key: "rank",
                  header: "Rank",
                  render: (value) => getRankIcon(value),
                },
                {
                  key: "country",
                  header: "",
                  render: (value) => <span className="text-xl">{value}</span>,
                  className: "w-12",
                },
                {
                  key: "name",
                  header: "Name",
                  render: (value, row) => (
                    <span
                      className={
                        row.isCurrentUser ? "font-bold text-accent" : ""
                      }
                    >
                      {value}
                      {row.isCurrentUser && " (You)"}
                    </span>
                  ),
                  sortable: true,
                },
                {
                  key: "xp",
                  header: "XP",
                  render: (value) => (
                    <span className="font-bold text-accent">
                      {value.toLocaleString()}
                    </span>
                  ),
                  sortable: true,
                },
                {
                  key: "streak",
                  header: "Streak",
                  render: (value) => <span>🔥 {value}</span>,
                  sortable: true,
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
