import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Trophy } from "@/components/icons/Trophy";

export default function Leaderboard({ onViewProfile }) {
  const [timeFilter, setTimeFilter] = useState("weekly");

  const timeFilters = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "alltime", label: "All Time" },
  ];

  const leaderboardData = [
    {
      rank: 1,
      name: "Maryland Winkles",
      xp: 948,
      avatar: "MW",
      color: "from-purple-500 to-pink-500",
    },
    {
      rank: 2,
      name: "Andrew Ainsley",
      xp: 872,
      avatar: "AA",
      color: "from-primary to-accent",
      isCurrentUser: true,
    },
    {
      rank: 3,
      name: "Charlotte Hanlin",
      xp: 769,
      avatar: "CH",
      color: "from-orange-500 to-red-500",
    },
    {
      rank: 4,
      name: "Florencio Dollore",
      xp: 723,
      avatar: "FD",
      color: "from-green-500 to-emerald-500",
    },
    {
      rank: 5,
      name: "Roselle Ehram",
      xp: 640,
      avatar: "RE",
      color: "from-violet-500 to-purple-500",
    },
    {
      rank: 6,
      name: "Darron Kulinowzi",
      xp: 596,
      avatar: "DK",
      color: "from-amber-500 to-orange-500",
    },
    {
      rank: 7,
      name: "Clinton Mcclure",
      xp: 537,
      avatar: "CM",
      color: "from-teal-500 to-cyan-500",
    },
    {
      rank: 8,
      name: "Darcell Ballentine",
      xp: 481,
      avatar: "DB",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const topThree = leaderboardData.slice(0, 3);
  const currentUser = leaderboardData.find((u) => u.isCurrentUser);

  return (
    <div className="min-h-screen">
      <div className=" container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Leaderboard
            </h1>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Trophy />
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Time Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 mx-auto justify-center lg:justify-start"
        >
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                timeFilter === filter.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8 flex items-end justify-center gap-4 lg:gap-8 mt-8"
        >
          {/* Second Place */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${topThree[1]?.color} flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-xl border-4 border-background`}
              >
                {topThree[1]?.avatar}
              </div>
            </motion.div>
            <div className="mt-2 bg-card rounded-2xl px-4 py-3 text-center shadow-lg border border-border min-w-[120px]">
              <p className="font-semibold text-foreground text-sm mb-1">
                {topThree[1]?.name}
              </p>
              <p className="text-accent font-bold text-lg">
                {topThree[1]?.xp} XP
              </p>
            </div>
            <div className="w-24 lg:w-32 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-2xl mt-2 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/80">2</span>
            </div>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center -mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div
                className={`w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br ${topThree[0]?.color} flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-2xl border-4 border-background`}
              >
                {topThree[0]?.avatar}
              </div>
            </motion.div>
            <div className="mt-2 bg-card rounded-2xl px-6 py-4 text-center shadow-xl border-2 border-primary/20 min-w-[140px]">
              <p className="font-bold text-foreground mb-1">
                {topThree[0]?.name}
              </p>
              <p className="text-accent font-bold text-2xl">
                {topThree[0]?.xp} XP
              </p>
            </div>
            <div className="w-28 lg:w-36 h-32 bg-gradient-to-b from-violet-400 to-violet-500 rounded-t-2xl mt-2 flex items-center justify-center shadow-lg">
              <span className="text-5xl font-bold text-white/90">1</span>
            </div>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${topThree[2]?.color} flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-xl border-4 border-background`}
              >
                {topThree[2]?.avatar}
              </div>
            </motion.div>
            <div className="mt-2 bg-card rounded-2xl px-4 py-3 text-center shadow-lg border border-border min-w-[120px]">
              <p className="font-semibold text-foreground text-sm mb-1">
                {topThree[2]?.name}
              </p>
              <p className="text-accent font-bold text-lg">
                {topThree[2]?.xp} XP
              </p>
            </div>
            <div className="w-24 lg:w-32 h-20 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-2xl mt-2 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/80">3</span>
            </div>
          </div>
        </motion.div>

        {/* Rest of Leaderboard List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:space-y-3"
        >
          {leaderboardData.slice(3).map((user, index) => (
            <motion.button
              key={user.rank}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              onClick={() => onViewProfile(user)}
              className={`w-full bg-transparent lg:bg-card flex items-center gap-4 px-2 py-4 lg:p-4 rounded-2xl transition-all hover:scale-[1.02] ${
                user.isCurrentUser
                  ? "bg-muted/30 border-2 border-primary lg:shadow-lg"
                  : "border border-border shadow-md"
              }`}
            >
              <div className="w-8 text-center">
                <span className="font-bold text-muted-foreground text-lg">
                  {user.rank}
                </span>
              </div>
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
              >
                {user.avatar}
              </div>
              <div className="flex-1 text-left">
                <p
                  className={`font-bold ${
                    user.isCurrentUser ? "text-primary" : "text-foreground"
                  }`}
                >
                  {user.name}
                </p>
                <p className="text-muted-foreground text-sm">{user.xp} XP</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
