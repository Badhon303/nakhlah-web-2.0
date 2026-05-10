"use client";

import { Trophy } from "@/components/icons/Trophy";
import { CardMenuOptions } from "@/components/nakhlah/CardMenuOptions";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { buildApiUrl } from "@/lib/api-config";
import { fetchLeaderboard } from "@/services/api";

const FALLBACK_LEADERS = [
  {
    rank: 1,
    id: "fallback-1",
    name: "Maryland Winkles",
    xp: 948,
    avatar: "MW",
    avatarUrl: "",
  },
  {
    rank: 2,
    id: "fallback-2",
    name: "Andrew Ainsley",
    xp: 872,
    avatar: "AA",
    avatarUrl: "",
  },
  {
    rank: 3,
    id: "fallback-3",
    name: "Charlotte Hanlin",
    xp: 769,
    avatar: "CH",
    avatarUrl: "",
  },
];

const toDisplayName = (fullName, email) => {
  const trimmedName = (fullName || "").trim();
  if (trimmedName) return trimmedName;
  const trimmedEmail = (email || "").trim();
  return trimmedEmail || "Unknown learner";
};

const toAvatarText = (nameOrEmail) => {
  const text = (nameOrEmail || "").trim();
  if (!text) return "NA";
  const localPart = text.includes("@") ? text.split("@")[0] : text;
  const parts = localPart
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }
  return localPart.slice(0, 2).toUpperCase();
};

const toMediaUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return buildApiUrl(url);
};

export function LeaderboardCard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [topLeaders, setTopLeaders] = useState(FALLBACK_LEADERS);

  useEffect(() => {
    const loadLeaders = async () => {
      if (status === "loading") return;
      if (!isSessionValid(session)) {
        setTopLeaders(FALLBACK_LEADERS);
        return;
      }

      const token = getSessionToken(session);
      const result = await fetchLeaderboard(token);

      if (!result.success) {
        setTopLeaders(FALLBACK_LEADERS);
        return;
      }

      const mapped = (result.leaderboard || [])
        .map((item, index) => {
          const rank = Number(item?.rank);
          const name = toDisplayName(item?.fullName, item?.email);
          return {
            rank: Number.isFinite(rank) ? rank : index + 1,
            id: item?.id || `leader-card-${index}`,
            name,
            xp: Number(item?.injazCount) || 0,
            avatar: toAvatarText(name),
            avatarUrl: toMediaUrl(item?.profilePictureUrl),
          };
        })
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 3);

      setTopLeaders(mapped.length ? mapped : FALLBACK_LEADERS);
    };

    loadLeaders();
  }, [session, status]);

  const menuOptions = [
    {
      label: "See Full Leaderboard",
      onClick: () => router.push("/leaderboard"),
    },
  ];

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
            key={leader.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between bg-muted/20 rounded-md p-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex items-center justify-center text-xs font-semibold">
                {leader.avatarUrl ? (
                  <img
                    src={leader.avatarUrl}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  leader.avatar
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{leader.name}</p>
                <p className="text-xs text-muted-foreground">
                  {leader.xp} Injaz
                </p>
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
