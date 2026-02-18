"use client";

import { Trophy } from "@/components/icons/Trophy";
import { Medal } from "@/components/icons/Medal";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function LeaderboardCard() {
  const router = useRouter();

  const topLeaders = [
    {
      rank: 1,
      name: "Maryland Winkles",
      xp: 948,
      avatar: "MW",
    },
    {
      rank: 2,
      name: "Andrew Ainsley",
      xp: 872,
      avatar: "AA",
    },
    {
      rank: 3,
      name: "Charlotte Hanlin",
      xp: 769,
      avatar: "CH",
    },
  ];

  const menuOptions = [
    {
      label: "See Full Leaderboard",
      onClick: () => router.push("/leaderboard"),
    },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Medal size="md" className="text-yellow-500" />;
      case 2:
        return <Medal size="md" className="text-gray-400" />;
      case 3:
        return <Medal size="md" className="text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Trophy size="md" className="text-accent" />
            Top Leaders
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Weekly rankings</p>
        </div>
        <CardMenuOptions options={menuOptions} />
      </div>

      <ul className="space-y-2">
        {topLeaders.map((leader, index) => (
          <motion.li
            key={leader.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between bg-muted/20 rounded-md p-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center">
                {getRankIcon(leader.rank)}
              </div>
              <div>
                <p className="text-sm font-medium">{leader.name}</p>
                <p className="text-xs text-muted-foreground">{leader.xp} XP</p>
              </div>
            </div>
            <span className="text-xs font-bold text-accent">
              #{leader.rank}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
